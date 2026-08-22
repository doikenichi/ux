/**
 * Simulador didático de leitor de tela.
 *
 * FALA em voz alta (Web Speech API, pt-BR) o que um leitor de tela anunciaria
 * ao passar o mouse sobre um elemento ou ao focá-lo com Tab — para experimentar
 * o app como alguém que não enxerga o experimentaria. Uma legenda acompanha a
 * fala, para que uma plateia também VEJA o que está sendo dito.
 *
 * NÃO é um leitor de tela e não substitui teste real — é instrumentação de
 * apresentação. Sempre conferir contra NVDA/Narrator.
 *
 * Ativação: adicione ?a11y=1 à URL. Sem o parâmetro nada é renderizado.
 * Atalhos: Ctrl+Alt+S liga/desliga a voz · Ctrl+Alt+A mostra/oculta a legenda
 *          · Ctrl+Alt+↓/↑ percorre a ordem de foco.
 *
 * O simulador observa o DOM (focusin + MutationObserver), não o React, então
 * não exige nenhuma alteração em App.tsx. Ele REPORTA os problemas do protótipo
 * em vez de corrigi-los — os defeitos são a aula.
 *
 * Limitações conhecidas (declarar na apresentação):
 *  - Não lê conteúdo gerado por CSS (::before/::after).
 *  - aria-labelledby resolvido só em profundidade 1; ignora aria-owns.
 *  - aria-atomic/aria-relevant ignorados: anuncia a região inteira.
 *  - Não implementa aria-describedby.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

const LIVE_SEL =
  '[aria-live="polite"],[aria-live="assertive"],[role="status"],[role="alert"],[role="log"]';

/**
 * Texto perceptível de um nó, como um leitor de tela o montaria:
 * ignora aria-hidden, [hidden] e SVG (ícones lucide não têm texto), e deixa
 * um aria-label aninhado substituir a subárvore.
 */
function textFromContents(node: Node, skip?: Node): string {
  const out: string[] = [];
  const walk = (n: Node) => {
    if (n === skip) return;
    if (n.nodeType === Node.TEXT_NODE) {
      out.push((n as Text).data);
      return;
    }
    if (n.nodeType !== Node.ELEMENT_NODE) return;
    const el = n as Element;
    if (el.getAttribute("aria-hidden") === "true") return;
    if (el.hasAttribute("hidden")) return;
    if (el.tagName.toLowerCase() === "svg") return;
    const al = el.getAttribute("aria-label");
    if (al && al.trim()) {
      out.push(al.trim());
      return;
    }
    el.childNodes.forEach(walk);
  };
  walk(node);
  return norm(out.join(" "));
}

/** Texto do <label> associado, sem o valor do próprio campo. */
function visibleLabelOf(el: HTMLElement): string | null {
  const labels =
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
      ? el.labels
      : null;
  const label = labels?.[0] ?? el.closest("label");
  if (!label) return null;
  return textFromContents(label, el) || null;
}

/** Normalização para a comparação da WCAG 2.5.3 (sem acento, sem pontuação). */
const cmp = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

type AccName = { name: string; source: string; conflict?: string };

/** Subconjunto pragmático da spec AccName, cobrindo o que este protótipo usa. */
function computeAccName(el: HTMLElement): AccName {
  const visible = visibleLabelOf(el);

  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const text = labelledby
      .split(/\s+/)
      .map((id) => {
        const ref = document.getElementById(id);
        return ref ? ref.getAttribute("aria-label") || textFromContents(ref) : "";
      })
      .join(" ");
    if (norm(text)) return { name: norm(text), source: "aria-labelledby" };
  }

  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel?.trim()) {
    const name = norm(ariaLabel);
    // WCAG 2.5.3 (Rótulo no Nome): o nome acessível deve conter o texto visível.
    const mismatch = visible && !cmp(name).includes(cmp(visible));
    return {
      name,
      source: "aria-label",
      conflict: mismatch
        ? `O rótulo visível "${visible}" não está contido no nome acessível. ` +
          `Quem usa comando de voz e diz «clicar em ${visible}» não ativa este campo. (WCAG 2.5.3)`
        : undefined,
    };
  }

  if (visible) return { name: visible, source: "<label>" };

  const alt = el.getAttribute("alt");
  if (alt) return { name: norm(alt), source: "alt" };

  const content = textFromContents(el);
  if (content) return { name: content, source: "conteúdo de texto" };

  const title = el.getAttribute("title");
  if (title) return { name: norm(title), source: "title" };

  if (el instanceof HTMLInputElement && el.placeholder) {
    return {
      name: el.placeholder,
      source: "placeholder",
      conflict: "Nome derivado do placeholder — desaparece assim que o usuário digita.",
    };
  }

  return { name: "", source: "— nenhum —" };
}

/** Papel explícito, senão papel implícito da tag. Em português. */
function computeRole(el: HTMLElement): string {
  const explicit = el.getAttribute("role");
  const byRole: Record<string, string> = {
    img: "imagem",
    progressbar: "barra de progresso",
    switch: "interruptor",
    radio: "botão de opção",
    radiogroup: "grupo de opções",
    status: "região de status",
    alert: "alerta",
    button: "botão",
    navigation: "navegação",
    region: "região",
  };
  if (explicit) return byRole[explicit] || explicit;

  const tag = el.tagName.toLowerCase();
  if (/^h[1-6]$/.test(tag)) return `cabeçalho nível ${tag[1]}`;

  const byTag: Record<string, string> = {
    button: "botão",
    select: "lista suspensa",
    textarea: "campo de edição",
    nav: "navegação",
    header: "banner",
    main: "conteúdo principal",
    footer: "rodapé",
  };
  if (byTag[tag]) return byTag[tag];

  if (tag === "a") return el.hasAttribute("href") ? "link" : "";
  if (tag === "section") {
    return el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby")
      ? "região"
      : "";
  }
  if (tag === "input") {
    const type = (el as HTMLInputElement).type;
    const byType: Record<string, string> = {
      checkbox: "caixa de seleção",
      radio: "botão de opção",
      password: "campo de senha",
      email: "campo de e-mail",
      number: "campo numérico",
      search: "campo de busca",
      range: "controle deslizante",
    };
    return byType[type] || "campo de edição";
  }
  return "";
}

/** Estados anunciados, na ordem em que um leitor de tela os falaria. */
function computeStates(el: HTMLElement): string[] {
  const out: string[] = [];
  const attr = (n: string) => el.getAttribute(n);

  const pressed = attr("aria-pressed");
  if (pressed) out.push(pressed === "true" ? "selecionado" : "não selecionado");

  const checked = attr("aria-checked");
  if (checked) {
    if (attr("role") === "switch") {
      out.push(checked === "true" ? "ligado" : "desligado");
    } else {
      out.push(checked === "true" ? "marcado" : "não marcado");
    }
  }

  const expanded = attr("aria-expanded");
  if (expanded) out.push(expanded === "true" ? "expandido" : "recolhido");

  if (attr("aria-current") === "page") out.push("página atual");

  if (el.hasAttribute("disabled") || attr("aria-disabled") === "true") {
    out.push("indisponível");
  }

  const now = attr("aria-valuenow");
  if (now) {
    const max = attr("aria-valuemax");
    out.push(max ? `${now} de ${max}` : now);
  }

  // Valor atual dos campos. Senha NUNCA é exibida — isto vai num projetor.
  if (el instanceof HTMLInputElement) {
    if (el.type === "password") {
      out.push(el.value ? `${el.value.length} caracteres` : "vazio");
    } else if (el.value) {
      out.push(`"${el.value}"`);
    } else {
      out.push("vazio");
    }
  } else if (el instanceof HTMLSelectElement && el.value) {
    out.push(el.value);
  }

  return out;
}

type Announcement = {
  id: number;
  phrase: string;
  name: string;
  role: string;
  states: string[];
  source: string;
  conflict?: string;
  kind?: "focus" | "live" | "warn";
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let seq = 0;

function describe(el: HTMLElement): Announcement {
  try {
    const { name, source, conflict } = computeAccName(el);
    const role = computeRole(el);
    const states = computeStates(el);
    // Emoji sem rótulo entra no nome e é lido pelo nome CLDR do caractere.
    const emoji = /\p{Extended_Pictographic}/u.test(name)
      ? "Emoji sem rótulo no nome — o leitor anuncia o nome oficial do caractere, fora de contexto."
      : undefined;
    return {
      id: ++seq,
      phrase: [name, role, ...states].filter(Boolean).join(", "),
      name,
      role,
      states,
      source,
      conflict: conflict || emoji,
      kind: "focus",
    };
  } catch {
    return {
      id: ++seq,
      phrase: "(erro no simulador)",
      name: "",
      role: "",
      states: [],
      source: "—",
      kind: "warn",
    };
  }
}

// ── Voz (Web Speech API) ──────────────────────────────────────────────────
let voices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  voices = window.speechSynthesis.getVoices();
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  return (
    voices.find((v) => /^pt[-_]BR/i.test(v.lang)) ||
    voices.find((v) => /^pt/i.test(v.lang))
  );
}

/** Fala em pt-BR, cancelando o que estiver sendo dito (como um leitor real). */
function speak(text: string) {
  if (!text || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  u.rate = 1.05;
  const pt = pickVoice();
  if (pt) u.voice = pt;
  synth.speak(u);
}

/**
 * Sobe do nó sob o cursor até algo que um leitor de tela trataria como um
 * item só — evita ler o <span> solto dentro de um botão.
 */
const MEANINGFUL =
  'button, a[href], input, select, textarea, label, [role], h1, h2, h3, h4, h5, h6';

function announceableFrom(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  // O próprio simulador nunca é anunciado.
  if (el.closest("[data-sr-sim]")) return null;
  const hit = el.closest<HTMLElement>(MEANINGFUL);
  if (hit) return hit;
  // Fora de controles: lê o bloco de texto mais próximo que tenha texto próprio.
  let n: HTMLElement | null = el;
  while (n && n !== document.body) {
    if (textFromContents(n) && n.children.length <= 3) return n;
    n = n.parentElement;
  }
  return null;
}

// ── Componente ────────────────────────────────────────────────────────────
export default function ScreenReaderSim() {
  if (typeof window === "undefined") return null;
  // Ligado por padrão (é uma demo de acessibilidade). ?a11y=0 desliga por completo.
  if (new URLSearchParams(window.location.search).get("a11y") === "0") {
    return null;
  }
  return <Sim />;
}

function Sim() {
  const [visible, setVisible] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [primed, setPrimed] = useState(false);
  const [voiceName, setVoiceName] = useState("");
  const [log, setLog] = useState<Announcement[]>([]);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const primedRef = useRef(false);
  const voiceOnRef = useRef(true);
  voiceOnRef.current = voiceOn;

  const push = (a: Announcement) => setLog((prev) => [a, ...prev].slice(0, 12));

  /** Único caminho de anúncio: legenda + voz. */
  const announce = (a: Announcement) => {
    push(a);
    if (voiceOnRef.current) speak(a.phrase);
  };

  // Vozes carregam de forma assíncrona no Chrome.
  useEffect(() => {
    const sync = () => {
      loadVoices();
      setVoiceName(pickVoice()?.name || "");
    };
    sync();
    window.speechSynthesis?.addEventListener("voiceschanged", sync);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", sync);
      window.speechSynthesis?.cancel();
    };
  }, []);

  // O Chrome só libera áudio após uma interação do usuário. Uma fala vazia
  // no primeiro clique/tecla destrava a política de autoplay.
  useEffect(() => {
    const prime = () => {
      if (primedRef.current) return;
      primedRef.current = true;
      setPrimed(true);
      try {
        window.speechSynthesis?.speak(new SpeechSynthesisUtterance(" "));
      } catch {
        /* sem suporte a fala */
      }
    };
    document.addEventListener("pointerdown", prime);
    document.addEventListener("keydown", prime);
    return () => {
      document.removeEventListener("pointerdown", prime);
      document.removeEventListener("keydown", prime);
    };
  }, []);

  // Mouse por cima → fala, imaginando a exploração de quem não enxerga.
  useEffect(() => {
    let lastEl: HTMLElement | null = null;
    let timer: number | undefined;

    const onMove = (e: MouseEvent) => {
      const el = announceableFrom(e.target as HTMLElement);
      if (!el || el === lastEl) return;
      lastEl = el;
      targetRef.current = el;
      setRect(el.getBoundingClientRect());
      // Pequeno atraso: passar o mouse por cima de vários itens não deve
      // disparar uma fala para cada um.
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => announce(describe(el)), 90);
    };

    document.addEventListener("mouseover", onMove);
    return () => {
      document.removeEventListener("mouseover", onMove);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Aviso de partida: idioma do documento.
  useEffect(() => {
    const lang = document.documentElement.lang || "(ausente)";
    if (!/^pt/i.test(lang)) {
      push({
        id: ++seq,
        phrase: `<html lang="${lang}"> — o leitor de tela leria este app em português com voz INGLESA.`,
        name: "",
        role: "",
        states: [],
        source: "verificação de idioma · WCAG 3.1.1",
        kind: "warn",
      });
    }
  }, []);

  // Foco → anúncio
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || el === document.body) return;
      if (el.closest("[data-sr-sim]")) return;
      targetRef.current = el;
      setRect(el.getBoundingClientRect());
      announce(describe(el));
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);

  // Perda de foco — dispara a cada troca de tela neste protótipo.
  useEffect(() => {
    const onOut = () => {
      setTimeout(() => {
        const a = document.activeElement;
        if (!a || a === document.body) {
          push({
            id: ++seq,
            phrase:
              "Foco perdido — voltou ao início do documento. Nada indica que a tela mudou.",
            name: "",
            role: "",
            states: [],
            source: "gerenciamento de foco · WCAG 2.4.3",
            kind: "warn",
          });
        }
      }, 0);
    };
    document.addEventListener("focusout", onOut);
    return () => document.removeEventListener("focusout", onOut);
  }, []);

  // Acompanha o elemento em foco (scroll, troca de tela, animação).
  // Só atualiza o estado quando o retângulo muda de fato — senão o
  // re-render a cada quadro derruba a fluidez durante a apresentação.
  useEffect(() => {
    let raf = 0;
    let last = "";
    const tick = () => {
      const el = targetRef.current;
      if (el) {
        if (el.isConnected) {
          const r = el.getBoundingClientRect();
          const key = `${r.left},${r.top},${r.width},${r.height}`;
          if (key !== last) {
            last = key;
            setRect(r);
          }
        } else {
          targetRef.current = null;
          last = "";
          setRect(null);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Live regions — distingue "conteúdo mudou" de "região inserida junto".
  useEffect(() => {
    const lastText = new WeakMap<Element, string>();
    const pending = new Map<Element, boolean>();
    let timer: number | undefined;

    const flush = () => {
      timer = undefined;
      for (const [region, inserted] of pending) {
        const text = textFromContents(region);
        if (!text || lastText.get(region) === text) continue;
        lastText.set(region, text);
        announce({
          id: ++seq,
          phrase: text,
          name: text,
          role:
            region.getAttribute("role") === "alert"
              ? "alerta"
              : "região de status",
          states: [],
          source: "região dinâmica (aria-live)",
          kind: "live",
          conflict: inserted
            ? "Região viva inserida no DOM JUNTO com seu conteúdo. NVDA/TalkBack " +
              "normalmente NÃO anunciam isso — a região precisa já existir antes da mudança. (WCAG 4.1.3)"
            : undefined,
        });
      }
      pending.clear();
    };

    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (!(n instanceof HTMLElement)) return;
            const found = [
              ...(n.matches(LIVE_SEL) ? [n] : []),
              ...n.querySelectorAll<HTMLElement>(LIVE_SEL),
            ];
            found.forEach((r) => pending.set(r, true));
          });
        }
        const start =
          m.target instanceof HTMLElement ? m.target : m.target.parentElement;
        const region = start?.closest(LIVE_SEL);
        if (region && !pending.has(region)) pending.set(region, false);
      }
      if (pending.size && timer === undefined) {
        timer = window.setTimeout(flush, 100);
      }
    });
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Atalhos — sem botões clicáveis, para não poluir a ordem de tabulação
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.altKey) return;
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        setVisible((v) => !v);
        return;
      }
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        setVoiceOn((v) => {
          if (v) window.speechSynthesis?.cancel();
          return !v;
        });
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const root = document.getElementById("root");
      if (!root) return;
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (n) => n.getClientRects().length > 0,
      );
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next =
        e.key === "ArrowDown"
          ? items[(i + 1 + items.length) % items.length]
          : items[(i - 1 + items.length) % items.length];
      next?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = log[0];
  const green = "#4ade80";
  const tone =
    current?.kind === "live"
      ? "#fcd34d"
      : current?.kind === "warn"
        ? "#fca5a5"
        : green;

  return createPortal(
    // aria-hidden: o instrumento não pode aparecer na árvore que ele mede.
    <div aria-hidden="true" data-sr-sim="" style={{ pointerEvents: "none" }}>
      {/*
        Botão de liga/desliga da voz.
        tabIndex={-1} mantém ele fora da ordem de tabulação do protótipo, e o
        preventDefault no mouseDown impede que o clique roube o foco do
        elemento que está sendo demonstrado.
      */}
      <button
        type="button"
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setVoiceOn((v) => {
            if (v) window.speechSynthesis?.cancel();
            return !v;
          });
        }}
        title="Liga/desliga a leitura em voz alta (Ctrl+Alt+S)"
        style={{
          position: "fixed",
          right: 16,
          bottom: visible ? "calc(45vh + 16px)" : 16,
          zIndex: 2147483002,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: voiceOn ? "#166534" : "#334155",
          color: voiceOn ? "#bbf7d0" : "#cbd5e1",
          font: "600 14px ui-monospace, Consolas, monospace",
          boxShadow: "0 4px 14px rgba(0,0,0,.45)",
        }}
      >
        {voiceOn ? "🔊 Leitor de tela LIGADO" : "🔇 Leitor de tela desligado"}
      </button>

      {visible && rect && (
        <div
          style={{
            position: "fixed",
            left: rect.left - 3,
            top: rect.top - 3,
            width: rect.width + 6,
            height: rect.height + 6,
            border: `3px solid ${green}`,
            outline: "2px solid rgba(0,0,0,.65)",
            borderRadius: 6,
            zIndex: 2147483000,
            transition: "all .12s ease-out",
          }}
        />
      )}

      {visible && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2147483001,
            background: "#0b0f14",
            color: "#e2e8f0",
            borderTop: `3px solid ${green}`,
            fontFamily: "ui-monospace, 'Cascadia Code', Consolas, monospace",
            padding: "10px 14px 12px",
            maxHeight: "45vh",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#94a3b8",
              marginBottom: 8,
            }}
          >
            <span>
              {!("speechSynthesis" in window) ? (
                <b style={{ color: "#f87171" }}>
                  ✖ este navegador não suporta fala
                </b>
              ) : !voiceOn ? (
                <b style={{ color: "#f87171" }}>🔇 voz desligada (Ctrl+Alt+S)</b>
              ) : !primed ? (
                <b style={{ color: "#fcd34d" }}>
                  ⚠ clique uma vez na página para o Chrome liberar o áudio
                </b>
              ) : (
                <b style={{ color: green }}>
                  🔊 voz ligada{voiceName ? ` · ${voiceName}` : " · voz padrão"}
                </b>
              )}
              {"  ·  "}
              Passe o mouse ou use Tab. Simulação didática — confira com
              NVDA/Narrator.
            </span>
            <span>Ctrl+Alt+S voz · Ctrl+Alt+A oculta · Ctrl+Alt+↓/↑ percorre</span>
          </div>

          {current ? (
            <>
              <div
                style={{
                  fontSize: 19,
                  lineHeight: 1.35,
                  color: tone,
                  fontWeight: 600,
                  wordBreak: "break-word",
                }}
              >
                {current.kind === "live" && "📢 "}
                {current.kind === "warn" && "⚠ "}
                {current.kind === "focus"
                  ? `“${current.phrase || "(nada seria anunciado)"}”`
                  : current.phrase}
              </div>

              {current.kind !== "warn" && (
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                  nome: <b style={{ color: "#e2e8f0" }}>{current.name || "—"}</b>
                  {"  ·  "}papel:{" "}
                  <b style={{ color: "#e2e8f0" }}>{current.role || "—"}</b>
                  {"  ·  "}origem do nome:{" "}
                  <b style={{ color: "#e2e8f0" }}>{current.source}</b>
                </div>
              )}

              {current.conflict && (
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    padding: "6px 10px",
                    borderRadius: 5,
                    background: "#7f1d1d",
                    color: "#fecaca",
                    lineHeight: 1.45,
                  }}
                >
                  ⚠ {current.conflict}
                </div>
              )}

              {log.length > 1 && (
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    marginTop: 8,
                    borderTop: "1px solid #1e293b",
                    paddingTop: 6,
                    lineHeight: 1.6,
                  }}
                >
                  {log.slice(1, 5).map((a) => (
                    <div
                      key={a.id}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {a.kind === "live" ? "📢 " : a.kind === "warn" ? "⚠ " : "↑ "}
                      {a.phrase}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 15, color: "#94a3b8" }}>
              Passe o <b style={{ color: green }}>mouse</b> sobre um botão para
              ouvi-lo, ou use <b style={{ color: green }}>Tab</b> para percorrer
              a interface.
            </div>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
