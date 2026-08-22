# Simulador de leitor de tela — documentação técnica

## 1. Identificação

- **Aplicação:** ComiTora — protótipo de registro e acompanhamento nutricional.
- **Recurso:** simulador didático de leitor de tela com leitura em voz alta.
- **Objetivo:** permitir que uma pessoa que enxerga experimente o app como alguém cego o experimentaria, e que uma plateia **veja** o que um usuário cego **ouve**.
- **Data:** 22 de agosto de 2026.

> Este recurso **não é um leitor de tela** e não substitui teste com tecnologia assistiva real. É uma aproximação didática, feita para apresentação. A validação de conformidade continua exigindo NVDA, Narrator, TalkBack ou VoiceOver — como registrado em [`relatorio-mudancas-wcag.md`](./relatorio-mudancas-wcag.md).

## 2. Tecnologia utilizada

| Item | Escolha | Observação |
| --- | --- | --- |
| Síntese de voz | **Web Speech API** (`window.speechSynthesis`) | Nativa do navegador. Não requer extensão, plugin, servidor ou chave de API. |
| Origem das vozes | Sistema operacional do usuário | O navegador apenas expõe as vozes já instaladas na máquina. |
| Observação do DOM | `focusin`, `mouseover`, `MutationObserver` | O simulador lê o DOM, não o estado do React. |
| Posicionamento | `createPortal` para `document.body` | Mantém o overlay fora da árvore do protótipo. |
| Persistência | `localStorage` (chave `sr-sim-voice-settings`) | Guarda voz, velocidade, tom e volume. |
| Dependências novas | **Nenhuma** | Nada foi adicionado ao `package.json`. |

O custo total no *bundle* é de aproximadamente 6 KB comprimidos.

## 3. Arquivos alterados

### 3.1 Arquivo criado

**`src/app/devtools/ScreenReaderSim.tsx`** (~940 linhas) — todo o simulador, autocontido.

Organização interna:

| Trecho | Responsabilidade |
| --- | --- |
| `textFromContents()` | Extrai o texto perceptível de um nó, ignorando `aria-hidden`, `[hidden]` e `<svg>` (ícones lucide não têm texto). Um `aria-label` aninhado substitui a subárvore. |
| `visibleLabelOf()` | Recupera o `<label>` associado via `HTMLInputElement.labels` (cobre `for=` e rótulo envolvente). |
| `computeAccName()` | Nome acessível: `aria-labelledby` → `aria-label` → `<label>` → `alt` → conteúdo → `title` → `placeholder`. Devolve também **a origem** do nome. |
| `computeRole()` | Papel explícito (`role`) ou implícito da tag, traduzido para português. |
| `computeStates()` | `aria-pressed`, `aria-checked`, `aria-expanded`, `aria-current`, `disabled`, `aria-valuenow`/`valuemax` e valor dos campos. |
| `describe()` | Monta a frase final na ordem **nome, papel, estado**. |
| `speak()` / `pickVoice()` | Síntese de voz em `pt-BR`, cancelando a fala anterior. |
| `announceableFrom()` | Sobe do nó sob o cursor até o elemento que um leitor trataria como um item só. |
| `Sim()` | Componente React: escuta eventos, aplica a voz e desenha o overlay. |

### 3.2 Arquivo modificado

**`src/main.tsx`** — único ponto de montagem. Passou de 6 para 12 linhas:

```tsx
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import ScreenReaderSim from "./app/devtools/ScreenReaderSim.tsx";
import "./styles/index.css";

// ScreenReaderSim fica ativo por padrão; ?a11y=0 na URL o desliga.
createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <ScreenReaderSim />
  </>,
);
```

### 3.3 Arquivo NÃO modificado

**`src/app/App.tsx` não foi alterado em nenhuma linha.**

Essa foi a decisão de arquitetura central. O simulador observa o DOM (`document.activeElement`, `focusin`, `mouseover`, `MutationObserver`) em vez de se integrar ao React, então funciona sem conhecer `Screen`, `NavTab` ou o mapa `screens`. Consequências práticas:

- o arquivo de 2 379 linhas do protótipo permanece intacto;
- não há risco de o simulador introduzir regressão no app;
- o mesmo componente funcionaria em qualquer outra página, sem adaptação.

## 4. Como usar

O simulador fica **ativo por padrão**. Basta abrir a aplicação.

| Ação | Resultado |
| --- | --- |
| Passar o **mouse** sobre um elemento | Fala o que um leitor de tela anunciaria |
| Navegar com **Tab** | Idem — é como uma pessoa cega realmente navega |
| Botão flutuante 🔊 | Liga/desliga a leitura em voz alta |
| Barra de controles no painel | Ajusta voz, velocidade, tom e volume (seção 5) |
| `Ctrl+Alt+S` | Liga/desliga a voz |
| `Ctrl+Alt+A` | Mostra/oculta a legenda |
| `Ctrl+Alt+↓` / `↑` | Percorre a ordem de foco elemento a elemento |
| `?a11y=0` na URL | Desliga o simulador por completo |

### 4.1 Formato do anúncio

A fala segue a ordem usada por leitores reais — **nome, papel, estado**:

```
"Início, botão, página atual"
"Alto contraste, interruptor, ligado"
"Proteína, barra de progresso, 42 de 250"
```

Isso costuma ser o ponto que mais surpreende: um botão **não anuncia apenas o texto escrito nele**. Papel e estado fazem parte da informação, e é justamente o que se perde quando a marcação semântica está ausente.

### 4.2 Diagnósticos exibidos

Além de legendar, o simulador aponta problemas em vermelho:

| Situação detectada | Critério |
| --- | --- |
| `<html lang>` não é português | WCAG 3.1.1 |
| `aria-label` não contém o rótulo visível | WCAG 2.5.3 |
| Foco perdido após troca de tela | WCAG 2.4.3 |
| Região `aria-live` inserida junto com o conteúdo | WCAG 4.1.3 |
| Emoji sem rótulo dentro do nome acessível | WCAG 1.1.1 |
| Nome derivado de `placeholder` | Boa prática |

O caso da região `aria-live` merece nota: leitores de tela só anunciam mudanças em regiões que **já existiam** no DOM. Se o elemento e o texto surgem no mesmo instante, o anúncio se perde de forma intermitente. É um defeito que auditoria automatizada não detecta.

## 5. Controles de voz

A barra de controles fica no topo do painel, com quatro ajustes. Cada alteração é falada imediatamente, para conferência, e guardada em `localStorage` (chave `sr-sim-voice-settings`), sobrevivendo a recarregamentos.

| Controle | Faixa | Padrão |
| --- | --- | --- |
| **Voz** | vozes instaladas na máquina | melhor pt-BR local |
| **Velocidade** | 0,5× a 3× | 1,05× |
| **Tom** | 0 a 2 | 1 |
| **Volume** | 0% a 100% | 100% |

Usuários experientes de leitor de tela costumam operar entre **1,5× e 2×** — bem mais rápido do que parece confortável para quem nunca usou. Demonstrar essa velocidade real costuma ser esclarecedor numa apresentação.

### 5.1 Vozes locais e vozes de rede

O seletor marca cada voz como **local** ou **rede**, e o padrão prefere uma voz pt-BR **local**.

Isso resolve dois problemas. O Chrome expõe vozes próprias do Google **além** das do Windows, e a primeira voz pt-BR da lista costuma ser uma voz masculina do Google — não a `Microsoft Maria` que o NVDA usa. Além disso, vozes do Google são sintetizadas em servidor: **sem internet, elas não falam**. Voz local continua funcionando, o que importa quando a rede da sala falha.

### 5.2 Alterando o padrão no código

A escolha automática está em `pickVoice()`. Para fixar uma voz específica:

```ts
return voices.find((v) => v.name === "Microsoft Maria - Portuguese (Brazil)");
```

### 5.3 De onde vêm as vozes

**As vozes pertencem ao sistema operacional, não ao navegador nem à aplicação.** O navegador apenas expõe o que já está instalado. Consequências:

- a lista muda de máquina para máquina;
- publicar na Vercel **não** distribui vozes — quem abrir a página usa as vozes do próprio computador;
- se a máquina não tiver voz em português, o navegador recorre a uma voz em inglês lendo texto português, com pronúncia incorreta.

Para instalar vozes no Windows: **Configurações → Hora e idioma → Fala → Gerenciar vozes**. Esta máquina de desenvolvimento tem `Microsoft Maria` e `Microsoft Daniel` (pt-BR).

> **Antes da apresentação:** abra o link na máquina que será usada e confirme que aparece uma voz em português no seletor.

### 5.4 De onde vêm as vozes

**As vozes pertencem ao sistema operacional, não ao navegador nem à aplicação.** O navegador apenas expõe o que já está instalado. Consequências:

- a lista muda de máquina para máquina;
- publicar na Vercel **não** distribui vozes — quem abrir a página usa as vozes do próprio computador;
- se a máquina não tiver voz em português, o navegador recorre a uma voz em inglês lendo texto português, com pronúncia incorreta.

Para instalar vozes no Windows: **Configurações → Hora e idioma → Fala → Gerenciar vozes**. Esta máquina de desenvolvimento tem `Microsoft Maria` e `Microsoft Daniel` (pt-BR).

> **Antes da apresentação:** abra o link na máquina que será usada e confirme que aparece uma voz em português no seletor.

## 6. Relação com o NVDA — sistemas independentes

Este é o ponto que mais gera confusão. **O simulador e um leitor de tela real não conversam entre si.** São dois programas distintos, que nem sabem da existência um do outro.

| | Leitor de tela real (NVDA) | Simulador |
| --- | --- | --- |
| O que é | Programa do sistema operacional | JavaScript dentro da página |
| O que lê | A árvore de acessibilidade real do navegador | Uma aproximação própria, calculada do DOM |
| Quem ouve | O usuário cego | A plateia |
| Legenda na tela | Não produz | Produz |

### 6.1 Por que o NVDA não mexe na legenda

A legenda é acionada por dois eventos do DOM: `focusin` e `mouseover`.

O NVDA opera em dois modos. No **modo de foco** (formulários), ele move o foco real do DOM — e aí a legenda **acompanha**. No **modo de navegação**, que é o padrão ao explorar uma página, o NVDA usa um **cursor virtual próprio**: percorre uma cópia do conteúdo sem mover o foco real do navegador. Nesse modo o evento `focusin` nunca dispara, e a legenda fica parada.

Não é defeito de nenhum dos dois. É a arquitetura de leitores de tela: o cursor virtual existe justamente para permitir ler conteúdo que não é focável — como o anel de calorias, que tem `role="img"` e descrição textual, mas não recebe foco.

### 6.2 Use um de cada vez

**Rodar NVDA e simulador juntos produz fala duplicada** — os dois falando coisas diferentes ao mesmo tempo.

| Objetivo | Ferramenta |
| --- | --- |
| Avaliar conformidade, gerar evidência | **NVDA sozinho** (desligue a voz do simulador com `Ctrl+Alt+S`) |
| Apresentar para uma plateia | **Simulador sozinho** (feche o NVDA) |

### 6.3 Então para que serve a legenda

Para a **plateia**, não para o usuário cego. Numa apresentação projetada, áudio sozinho é difícil de acompanhar: a fala passa e ninguém consegue reler. A legenda:

- deixa a turma **ler** o que foi anunciado, no ritmo dela;
- mostra a **decomposição** — nome, papel, origem do nome — que a fala não transmite;
- destaca **os defeitos** em vermelho (seção 4.2), tornando visível um problema que seria abstrato.

Com o NVDA instalado, o simulador perde valor como ferramenta de **avaliação** — o NVDA é a referência verdadeira. O que resta é o valor de **comunicação**: mostrar a outras pessoas o que está acontecendo. Se a legenda não servir ao seu formato de apresentação, `Ctrl+Alt+A` a oculta e a voz continua funcionando.

## 7. Compatibilidade entre navegadores

A Web Speech API (`SpeechSynthesis`) tem suporte amplo, mas com diferenças relevantes.

| Navegador | Síntese de voz | Observações |
| --- | --- | --- |
| **Chrome** (desktop) | ✅ Completo | Recomendado para a apresentação. Exige interação do usuário antes do primeiro áudio. |
| **Edge** (desktop) | ✅ Completo | Mesma base do Chrome; vozes *neurais* do Windows costumam soar melhor. |
| **Safari** (macOS) | ✅ Completo | Vozes da Apple, de boa qualidade. |
| **Firefox** (desktop) | ⚠️ Parcial | Funciona no Windows e macOS. No Linux depende do `speech-dispatcher` instalado. |
| **Chrome / Safari** (Android e iOS) | ⚠️ Limitado | A voz funciona, mas **não existe `hover` em tela sensível ao toque** — veja abaixo. |

### 6.1 Restrições que valem para todos

**Interação prévia obrigatória.** Navegadores bloqueiam áudio automático. O simulador contorna isso emitindo uma fala vazia no primeiro clique ou tecla; até lá, a legenda exibe o aviso correspondente.

**`getVoices()` é assíncrono.** No Chrome a lista costuma vir vazia na primeira chamada, por isso o simulador também escuta o evento `voiceschanged`.

**Sem `hover` no celular.** Em dispositivos de toque não há "passar o mouse", então a leitura por hover não funciona — só a navegação por `Tab` (com teclado externo). Como o ComiTora é um protótipo de app móvel, vale registrar a ironia: **para testar acessibilidade móvel de verdade, o caminho é o TalkBack no Android ou o VoiceOver no iOS**, que implementam exploração por toque de verdade. O simulador é uma ferramenta de apresentação em desktop.

### 6.2 Recomendação

Para a apresentação: **Chrome ou Edge no desktop**, com verificação prévia da voz em português na máquina que será usada.

## 8. Decisões de implementação

**O overlay não pode contaminar o que ele mede.** Um instrumento de acessibilidade que altera a árvore de acessibilidade invalida a própria medição. Por isso:

- o contêiner tem `aria-hidden="true"` e o atributo `data-sr-sim`;
- os controles (botão e seletor) usam `tabIndex={-1}`, ficando fora da ordem de tabulação do protótipo;
- o botão cancela o `mouseDown` — sem isso, clicar nele roubaria o foco do elemento em demonstração e quebraria a apresentação;
- os manipuladores de `focusin` e `mouseover` ignoram qualquer nó dentro de `[data-sr-sim]`, para o simulador não anunciar a si mesmo.

**Estilo propositalmente fora do sistema MD3.** O overlay usa cores e tipografia próprias, sem reaproveitar os tokens `C`/`T` do `App.tsx`. Dois motivos: a plateia precisa distinguir instrumento de produto, e a legenda deve permanecer legível quando o tema claro/escuro/alto contraste for demonstrado ao vivo.

**Atraso de 90 ms no hover.** Arrastar o cursor pela tela não deve disparar uma fala por elemento atravessado.

## 9. Limitações conhecidas

Devem ser declaradas ao apresentar:

- não lê conteúdo gerado por CSS (`::before` / `::after`);
- resolve `aria-labelledby` apenas em profundidade 1; ignora `aria-owns`;
- ignora `aria-atomic` e `aria-relevant` — anuncia a região inteira;
- não implementa `aria-describedby`;
- não reproduz a navegação por gestos do TalkBack nem os modos de navegação do NVDA;
- a aproximação da fala foi conferida contra o Narrator, mas cada leitor real tem verbosidade e vocabulário próprios.

## 10. Verificação

```bash
npm run dev     # abre em http://localhost:5173
npm run build   # compilação de produção
npx vitest run  # suíte de acessibilidade com axe
```

Roteiro manual sugerido:

1. Passar o mouse sobre a barra de navegação inferior e confirmar que o item ativo anuncia `página atual`.
2. Abrir **Configurações** e percorrer o seletor de tema — deve anunciar `botão de opção` com `marcado` / `não marcado`.
3. Registrar uma refeição e observar o anúncio automático da região `aria-live`.
4. Conferir, no painel `Accessibility` do DevTools, que nenhum nó do simulador aparece na árvore.
5. Repetir um trecho com o Narrator ligado (`Ctrl + Win + Enter`) e comparar com a legenda — divergências são limitações do simulador, e devem ser registradas.
