import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Home,
  Calculator,
  Trash2,
  X,
  Clock,
  UtensilsCrossed,
  UserRound,
  LockKeyhole,
} from "lucide-react";

// ── MD3 Color System ─────────────────────────────────────────────────────
// Tonal palette derived from green primary #1E7A45 (P-40)
const C = {
  primary: "var(--md-primary)",
  onPrimary: "var(--md-on-primary)",
  primaryContainer: "var(--md-primary-container)",
  onPrimaryContainer: "var(--md-on-primary-container)",
  secondary: "var(--md-secondary)",
  onSecondary: "var(--md-on-secondary)",
  secondaryContainer: "var(--md-secondary-container)",
  onSecondaryContainer: "var(--md-on-secondary-container)",
  tertiary: "var(--md-tertiary)",
  onTertiary: "var(--md-on-tertiary)",
  tertiaryContainer: "var(--md-tertiary-container)",
  onTertiaryContainer: "var(--md-on-tertiary-container)",
  error: "var(--md-error)",
  onError: "var(--md-on-error)",
  errorContainer: "var(--md-error-container)",
  onErrorContainer: "var(--md-on-error-container)",
  background: "var(--md-surface)",
  onBackground: "var(--md-on-surface)",
  surface: "var(--md-surface)",
  onSurface: "var(--md-on-surface)",
  surfaceVariant: "var(--md-surface-variant)",
  onSurfaceVariant: "var(--md-on-surface-variant)",
  surfaceLowest: "var(--md-surface-lowest)",
  surfaceContainerLow: "var(--md-surface-container-low)",
  surfaceContainer: "var(--md-surface-container)",
  surfaceContainerHigh: "var(--md-surface-container-high)",
  surfaceContainerHighest: "var(--md-surface-container-highest)",
  outline: "var(--md-outline)",
  outlineVariant: "var(--md-outline-variant)",
} as const;

// ── MD3 Elevation ─────────────────────────────────────────────────────────
const elev = {
  1: "0 1px 2px rgba(25,29,25,0.14), 0 1px 3px 1px rgba(25,29,25,0.08)",
  2: "0 2px 6px rgba(25,29,25,0.16), 0 1px 2px rgba(25,29,25,0.10)",
  3: "0 8px 20px rgba(25,29,25,0.18), 0 2px 6px rgba(25,29,25,0.10)",
} as const;

// ── MD3 Type Scale ────────────────────────────────────────────────────────
const T = {
  displayLarge: "text-[52px] leading-[58px] font-semibold tracking-[-0.5px]",
  headlineMedium: "text-[30px] leading-[38px] font-semibold tracking-[-0.25px]",
  headlineSmall: "text-[26px] leading-[34px] font-semibold",
  titleLarge: "text-[22px] leading-[28px] font-semibold",
  titleMedium: "text-[16px] leading-[24px] font-semibold tracking-[0.1px]",
  titleSmall: "text-[14px] leading-[20px] font-semibold tracking-[0.1px]",
  bodyLarge: "text-[16px] leading-[24px] font-normal tracking-[0.2px]",
  bodyMedium: "text-[14px] leading-[20px] font-normal tracking-[0.2px]",
  bodySmall: "text-[12px] leading-[16px] font-normal tracking-[0.3px]",
  labelLarge: "text-[14px] leading-[20px] font-semibold tracking-[0.1px]",
  labelMedium: "text-[12px] leading-[16px] font-semibold tracking-[0.4px]",
  labelSmall: "text-[12px] leading-[16px] font-semibold tracking-[0.4px]",
};

// ── Types / Data ──────────────────────────────────────────────────────────
type Screen =
  | "onboarding"
  | "dashboard"
  | "search"
  | "foodDetail"
  | "confirmation"
  | "progress"
  | "mealDetail";
type MealName = "Café da manhã" | "Almoço" | "Jantar" | "Lanche";
type NavTab = "home" | "register" | "progress";

interface Profile {
  name: string;
  height: number;
  weight: number;
  sex: "Feminino" | "Masculino" | "Outro";
}

interface Food {
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  emoji: string;
}
interface LogEntry {
  food: Food;
  grams: number;
  meal: MealName;
}

const FOOD_DB: Food[] = [
  {
    name: "Arroz cozido",
    kcal: 130,
    carbs: 28,
    protein: 2.7,
    fat: 0.3,
    emoji: "🍚",
  },
  {
    name: "Arroz integral",
    kcal: 110,
    carbs: 23,
    protein: 2.5,
    fat: 0.9,
    emoji: "🌾",
  },
  {
    name: "Frango grelhado",
    kcal: 165,
    carbs: 0,
    protein: 31,
    fat: 3.6,
    emoji: "🍗",
  },
  {
    name: "Feijão cozido",
    kcal: 77,
    carbs: 14,
    protein: 5,
    fat: 0.5,
    emoji: "🫘",
  },
  {
    name: "Batata doce cozida",
    kcal: 86,
    carbs: 20,
    protein: 1.6,
    fat: 0.1,
    emoji: "🍠",
  },
  {
    name: "Ovo cozido",
    kcal: 155,
    carbs: 1.1,
    protein: 13,
    fat: 11,
    emoji: "🥚",
  },
  {
    name: "Salada mista",
    kcal: 20,
    carbs: 3,
    protein: 1.5,
    fat: 0.3,
    emoji: "🥗",
  },
  { name: "Banana", kcal: 89, carbs: 23, protein: 1.1, fat: 0.3, emoji: "🍌" },
  { name: "Maçã", kcal: 52, carbs: 14, protein: 0.3, fat: 0.2, emoji: "🍎" },
  {
    name: "Iogurte natural",
    kcal: 59,
    carbs: 3.6,
    protein: 10,
    fat: 0.4,
    emoji: "🥛",
  },
];

const RECENT = [FOOD_DB[0], FOOD_DB[2], FOOD_DB[1]];
const MEALS: MealName[] = ["Café da manhã", "Almoço", "Jantar", "Lanche"];
const DEFAULT_GOAL_KCAL = 2000;
const INITIAL_LOG: LogEntry[] = [
  { food: FOOD_DB[0], grams: 100, meal: "Almoço" },
  { food: FOOD_DB[2], grams: 120, meal: "Almoço" },
  { food: FOOD_DB[6], grams: 80, meal: "Almoço" },
];

function calcEntry(e: LogEntry) {
  const r = e.grams / 100;
  return {
    kcal: Math.round(e.food.kcal * r),
    carbs: Math.round(e.food.carbs * r * 10) / 10,
    protein: Math.round(e.food.protein * r * 10) / 10,
    fat: Math.round(e.food.fat * r * 10) / 10,
  };
}
function sumKcal(log: LogEntry[]) {
  return log.reduce((s, e) => s + calcEntry(e).kcal, 0);
}

// ── MD3 Donut Ring ────────────────────────────────────────────────────────
function CalorieRing({
  current,
  goal,
  size = 180,
}: {
  current: number;
  goal: number;
  size?: number;
}) {
  const r = size * 0.37;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(current / goal, 1);
  const over = current > goal;
  const rem = goal - current;
  const sw = size * 0.072;
  const font = { family: "'Roboto Flex', Roboto, sans-serif" };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${current} de ${goal} quilocalorias; ${over ? `${Math.abs(rem)} excedidas` : `${rem} restantes`}`}
    >
      {/* Track — surface-variant */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={C.surfaceVariant}
        strokeWidth={sw}
      />
      {/* Fill — primary or error when over */}
      {pct > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={over ? C.error : C.primary}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${pct * circ} ${circ}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            transition: "stroke-dasharray 0.5s cubic-bezier(0.2,0,0,1)",
          }}
        />
      )}
      {/* Center: Display Large → kcal number */}
      <text
        x={cx}
        y={cy - size * 0.065}
        textAnchor="middle"
        fontSize={size * 0.165}
        fontWeight="400"
        fill={C.onSurface}
        fontFamily={font.family}
      >
        {current}
      </text>
      {/* Body Medium → label */}
      <text
        x={cx}
        y={cy + size * 0.075}
        textAnchor="middle"
        fontSize={size * 0.078}
        fill={C.onSurfaceVariant}
        fontFamily={font.family}
      >
        de {goal} kcal
      </text>
      {/* Label Small → remaining/exceeded */}
      <text
        x={cx}
        y={cy + size * 0.165}
        textAnchor="middle"
        fontSize={size * 0.068}
        fontWeight="500"
        fill={over ? C.error : C.primary}
        fontFamily={font.family}
      >
        {over ? `${Math.abs(rem)} excedidos` : `${rem} restantes`}
      </text>
    </svg>
  );
}

// ── MD3 Linear Progress (macro bar) ──────────────────────────────────────
function MacroBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(value / max, 1) * 100;
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span
          className={`${T.labelMedium}`}
          style={{ color: C.onSurfaceVariant }}
        >
          {label}
        </span>
        <span
          className={`${T.labelSmall}`}
          style={{ color: C.onSurfaceVariant }}
        >
          {value}g / {max}g
        </span>
      </div>
      {/* Updated M3 indicator: rounded tracks, gap, and stop marker. */}
      <div
        className="relative flex h-2 items-center"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div
          className="absolute inset-x-0 h-1.5 rounded-full"
          style={{ backgroundColor: C.surfaceVariant }}
        />
        <div
          className="relative h-1.5 rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.2,0,0,1)]"
          style={{
            width: `max(6px, calc(${pct}% - 4px))`,
            backgroundColor: color,
          }}
        />
        <span
          className="absolute right-0 size-1.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ── MD3 Navigation Bar ────────────────────────────────────────────────────
// Compact primary navigation with three real top-level destinations.
function NavigationBar({
  active,
  onNavigate,
}: {
  active: NavTab;
  onNavigate: (id: NavTab, screen: Screen) => void;
}) {
  const items: {
    id: NavTab;
    Icon: React.ElementType;
    label: string;
    screen: Screen;
  }[] = [
    { id: "home", Icon: Home, label: "Início", screen: "dashboard" },
    {
      id: "register",
      Icon: UtensilsCrossed,
      label: "Registrar",
      screen: "search",
    },
    { id: "progress", Icon: Calculator, label: "Cálculo", screen: "progress" },
  ];
  return (
    <nav
      className="flex items-start justify-around px-3 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] flex-shrink-0"
      style={{ backgroundColor: C.surfaceContainerHigh, minHeight: 80 }}
      aria-label="Navegação principal"
    >
      {items.map(({ id, Icon, label, screen }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            className="flex min-h-16 flex-col items-center justify-center gap-1 flex-1 rounded-2xl group"
            onClick={() => onNavigate(id, screen)}
          >
            {/* Indicator pill */}
            <div
              className="flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
              style={{
                width: isActive ? 64 : 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isActive ? C.primaryContainer : "transparent",
              }}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.2 : 1.6}
                color={isActive ? C.onPrimaryContainer : C.onSurfaceVariant}
              />
            </div>
            {/* Label Medium */}
            <span
              className={`${T.labelMedium} transition-colors duration-200`}
              style={{ color: isActive ? C.onSurface : C.onSurfaceVariant }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ── MD3 Filled Button ─────────────────────────────────────────────────────
function FilledButton({
  onClick,
  children,
  icon,
  fullWidth = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative overflow-hidden flex min-h-12 items-center justify-center gap-2 px-6 rounded-full ${fullWidth ? "w-full min-h-14" : ""} transition-all active:scale-[0.97] group`}
      style={{
        backgroundColor: C.primary,
        color: C.onPrimary,
        boxShadow: elev[1],
      }}
    >
      {/* State layer */}
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
        style={{ backgroundColor: C.onPrimary }}
      />
      {icon && <span className="relative z-10">{icon}</span>}
      <span className={`relative z-10 ${T.labelLarge}`}>{children}</span>
    </button>
  );
}

// ── MD3 Tonal Button ──────────────────────────────────────────────────────
function TonalButton({
  onClick,
  children,
  icon,
  fullWidth = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative overflow-hidden flex min-h-12 items-center justify-center gap-2 px-6 rounded-full ${fullWidth ? "w-full min-h-14" : ""} transition-all active:scale-[0.97] group`}
      style={{
        backgroundColor: C.secondaryContainer,
        color: C.onSecondaryContainer,
      }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
        style={{ backgroundColor: C.onSecondaryContainer }}
      />
      {icon && <span className="relative z-10">{icon}</span>}
      <span className={`relative z-10 ${T.labelLarge}`}>{children}</span>
    </button>
  );
}

// ── MD3 Text Button ───────────────────────────────────────────────────────
function TextButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative overflow-hidden flex min-h-12 items-center justify-center gap-2 px-4 rounded-full transition-all active:scale-[0.97] group"
      style={{ color: C.primary }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
        style={{ backgroundColor: C.primary }}
      />
      <span className={`relative z-10 ${T.labelLarge}`}>{children}</span>
    </button>
  );
}

// ── MD3 Extended FAB ──────────────────────────────────────────────────────
// Shape: Large (16dp), surface: primary-container, elevation: Level 3
function ExtendedFAB({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative overflow-hidden flex items-center justify-center gap-3 min-h-16 px-7 w-full transition-all active:scale-[0.98] group"
      style={{
        backgroundColor: C.primaryContainer,
        color: C.onPrimaryContainer,
        borderRadius: 20,
        boxShadow: elev[3],
      }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
        style={{ backgroundColor: C.onPrimaryContainer, borderRadius: 20 }}
      />
      <Plus size={24} strokeWidth={2} className="relative z-10 flex-shrink-0" />
      <span className={`relative z-10 ${T.labelLarge}`}>{children}</span>
    </button>
  );
}

// ── MD3 Assist Chip ───────────────────────────────────────────────────────
// The chip remains visually compact while preserving a 48px touch target.
function AssistChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative overflow-hidden flex items-center justify-center min-h-12 px-5 rounded-full border transition-all active:scale-95 group"
      style={{
        borderColor: C.outlineVariant,
        color: C.onSurfaceVariant,
        backgroundColor: C.surface,
      }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
        style={{ backgroundColor: C.onSurface }}
      />
      <span className={`relative z-10 ${T.labelMedium}`}>{label}</span>
    </button>
  );
}

// ── MD3 Elevated Card ─────────────────────────────────────────────────────
// Shape: Medium (12dp), surface-container-low, elevation Level 1
function ElevatedCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] ${className}`}
      style={{ backgroundColor: C.surfaceContainerLow, boxShadow: elev[1] }}
    >
      {children}
    </div>
  );
}

// ── MD3 Filled Card ───────────────────────────────────────────────────────
// Shape: Medium (12dp), surface-container-highest, no shadow
function FilledCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] ${className}`}
      style={{ backgroundColor: C.surfaceContainerHighest }}
    >
      {children}
    </div>
  );
}

// ── MD3 Outlined Card ─────────────────────────────────────────────────────
function OutlinedCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border ${className}`}
      style={{ backgroundColor: C.surface, borderColor: C.outlineVariant }}
    >
      {children}
    </div>
  );
}

// ── MD3 List Item ─────────────────────────────────────────────────────────
function ListItem({
  leading,
  headline,
  supporting,
  trailing,
  onClick,
  trailingAction,
}: {
  leading?: React.ReactNode;
  headline: string;
  supporting?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  trailingAction?: React.ReactNode;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      className={`relative overflow-hidden flex items-center gap-4 w-full px-4 py-3 rounded-[16px] group ${onClick ? "transition-all active:scale-[0.99]" : ""}`}
      style={{
        backgroundColor: C.surfaceContainerLow,
        minHeight: 64,
        ...(onClick ? {} : {}),
      }}
      onClick={onClick}
    >
      {onClick && (
        <span
          className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
          style={{ backgroundColor: C.onSurface }}
        />
      )}
      {leading && (
        <span className="flex-shrink-0 relative z-10">{leading}</span>
      )}
      <div className="flex-1 min-w-0 text-left relative z-10">
        <p className={`${T.bodyLarge} truncate`} style={{ color: C.onSurface }}>
          {headline}
        </p>
        {supporting && (
          <p
            className={`${T.bodyMedium} truncate`}
            style={{ color: C.onSurfaceVariant }}
          >
            {supporting}
          </p>
        )}
      </div>
      {trailing && (
        <span className="flex-shrink-0 relative z-10">{trailing}</span>
      )}
      {trailingAction && (
        <span className="flex-shrink-0 relative z-10">{trailingAction}</span>
      )}
    </Wrapper>
  );
}

// ── MD3 Segmented Button ──────────────────────────────────────────────────
// Full shape, outlined container, check icon + label when active
function SegmentedButton({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div
      className="flex rounded-full overflow-hidden border"
      style={{ borderColor: C.outline }}
    >
      {options.map((opt, i) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            className={`relative flex-1 flex items-center justify-center gap-1.5 min-h-12 transition-all ${i > 0 ? "border-l" : ""}`}
            style={{
              borderColor: C.outline,
              backgroundColor: active ? C.secondaryContainer : "transparent",
              color: active ? C.onSecondaryContainer : C.onSurface,
            }}
            onClick={() => onSelect(opt)}
          >
            {active && <Check size={18} strokeWidth={2.5} />}
            <span className={`${T.labelLarge} text-center`}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("nutri-profile");
    return saved ? JSON.parse(saved) : null;
  });
  const [screen, setScreen] = useState<Screen>(() =>
    profile ? "dashboard" : "onboarding",
  );
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [query, setQuery] = useState("");
  const [selFood, setSelFood] = useState<Food>(FOOD_DB[0]);
  const [grams, setGrams] = useState(100);
  const [selMeal, setSelMeal] = useState<MealName>("Almoço");
  const [dateOffset, setDateOffset] = useState(0);
  const [detailMeal, setDetailMeal] = useState<MealName>("Almoço");
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [selectedMeals, setSelectedMeals] = useState<MealName[]>(MEALS);
  const [draftProfile, setDraftProfile] = useState<Profile>({
    name: "",
    height: 170,
    weight: 70,
    sex: "Outro",
  });

  useEffect(() => {
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () =>
      document.documentElement.classList.toggle("dark", colorScheme.matches);
    syncTheme();
    colorScheme.addEventListener("change", syncTheme);
    return () => colorScheme.removeEventListener("change", syncTheme);
  }, []);

  useEffect(() => {
    if (profile) localStorage.setItem("nutri-profile", JSON.stringify(profile));
  }, [profile]);

  const today = new Date();
  today.setDate(today.getDate() + dateOffset);
  const dateStr = today.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const totalKcal = sumKcal(log);
  const totalProt = Math.round(
    log.reduce((s, e) => s + calcEntry(e).protein, 0),
  );
  const totalCarbs = Math.round(
    log.reduce((s, e) => s + calcEntry(e).carbs, 0),
  );
  const totalFat = Math.round(log.reduce((s, e) => s + calcEntry(e).fat, 0));
  const bmi = profile ? profile.weight / Math.pow(profile.height / 100, 2) : 0;
  const bmiLabel =
    bmi < 18.5
      ? "abaixo do peso"
      : bmi < 25
        ? "peso adequado"
        : bmi < 30
          ? "sobrepeso"
          : "acima do peso";
  const goalKcal = profile
    ? Math.round(
        profile.weight * 24 * (profile.sex === "Masculino" ? 1.47 : 1.4),
      )
    : DEFAULT_GOAL_KCAL;
  const selectedLog = log.filter((entry) => selectedMeals.includes(entry.meal));
  const selectedKcal = sumKcal(selectedLog);

  function finishOnboarding() {
    if (
      !draftProfile.name.trim() ||
      draftProfile.height <= 0 ||
      draftProfile.weight <= 0
    )
      return;
    setProfile({ ...draftProfile, name: draftProfile.name.trim() });
    setScreen("dashboard");
  }

  const filtered =
    query.length > 0
      ? FOOD_DB.filter((f) =>
          f.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const ratio = grams / 100;
  const preKcal = Math.round(selFood.kcal * ratio);
  const preCarbs = Math.round(selFood.carbs * ratio * 10) / 10;
  const preProtein = Math.round(selFood.protein * ratio * 10) / 10;
  const preFat = Math.round(selFood.fat * ratio * 10) / 10;

  function addFood() {
    setLog((prev) => [...prev, { food: selFood, grams, meal: selMeal }]);
    setScreen("confirmation");
  }

  function removeEntry(entry: LogEntry) {
    setLog((prev) => {
      const idx = [...prev].reverse().findIndex((e) => e === entry);
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return [...prev.slice(0, realIdx), ...prev.slice(realIdx + 1)];
    });
  }

  function navigate(tab: NavTab, target: Screen) {
    setActiveTab(tab);
    setScreen(target);
  }

  const mealEntries = log.filter((e) => e.meal === detailMeal);
  const mealKcal = mealEntries.reduce((s, e) => s + calcEntry(e).kcal, 0);

  // ── Date bar (shared) ────────────────────────────────────────────────
  function DateNav() {
    return (
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Dia anterior"
          onClick={() => setDateOffset((d) => d - 1)}
          className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full group transition-all"
          style={{ color: C.onSurface }}
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
            style={{ backgroundColor: C.onSurface }}
          />
          <ChevronLeft size={20} className="relative z-10" />
        </button>
        <span
          className={`${T.titleSmall} capitalize`}
          style={{ color: C.onSurface }}
        >
          {dateStr}
        </span>
        <button
          type="button"
          aria-label="Próximo dia"
          onClick={() => setDateOffset((d) => d + 1)}
          className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full group transition-all"
          style={{ color: C.onSurface }}
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
            style={{ backgroundColor: C.onSurface }}
          />
          <ChevronRight size={20} className="relative z-10" />
        </button>
      </div>
    );
  }

  // ── Screen: Access and questionnaire ────────────────────────────────
  const Onboarding = (
    <div className="flex h-full flex-col overflow-y-auto px-5 py-8">
      <div className="mb-6">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: C.primaryContainer }}
        >
          <UtensilsCrossed size={28} style={{ color: C.onPrimaryContainer }} />
        </div>
        <p className={`${T.bodyMedium}`} style={{ color: C.primary }}>
          Nutrição simples, todos os dias
        </p>
        <h1
          className={`${T.headlineMedium} mt-1`}
          style={{ color: C.onSurface }}
        >
          Comece pelo seu perfil
        </h1>
        <p
          className={`${T.bodyMedium} mt-2`}
          style={{ color: C.onSurfaceVariant }}
        >
          Entre e conte um pouco sobre você para personalizarmos seus cálculos.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span
            className={`${T.labelMedium} mb-1 block`}
            style={{ color: C.onSurfaceVariant }}
          >
            Seu nome
          </span>
          <div
            className="flex items-center gap-3 rounded-2xl px-4"
            style={{ backgroundColor: C.surfaceContainerHighest }}
          >
            <UserRound size={19} style={{ color: C.onSurfaceVariant }} />
            <input
              aria-label="Seu nome"
              value={draftProfile.name}
              onChange={(e) =>
                setDraftProfile((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Como podemos chamar você?"
              className={`h-14 flex-1 bg-transparent outline-none ${T.bodyLarge}`}
              style={{ color: C.onSurface }}
            />
          </div>
        </label>
        <label className="block">
          <span
            className={`${T.labelMedium} mb-1 block`}
            style={{ color: C.onSurfaceVariant }}
          >
            E-mail
          </span>
          <div
            className="flex items-center gap-3 rounded-2xl px-4"
            style={{ backgroundColor: C.surfaceContainerHighest }}
          >
            <span style={{ color: C.onSurfaceVariant }}>@</span>
            <input
              type="email"
              aria-label="E-mail"
              placeholder="voce@email.com"
              className={`h-14 flex-1 bg-transparent outline-none ${T.bodyLarge}`}
              style={{ color: C.onSurface }}
            />
          </div>
        </label>
        <label className="block">
          <span
            className={`${T.labelMedium} mb-1 block`}
            style={{ color: C.onSurfaceVariant }}
          >
            Senha
          </span>
          <div
            className="flex items-center gap-3 rounded-2xl px-4"
            style={{ backgroundColor: C.surfaceContainerHighest }}
          >
            <LockKeyhole size={19} style={{ color: C.onSurfaceVariant }} />
            <input
              type="password"
              aria-label="Senha"
              placeholder="Crie uma senha"
              className={`h-14 flex-1 bg-transparent outline-none ${T.bodyLarge}`}
              style={{ color: C.onSurface }}
            />
          </div>
        </label>
      </div>

      <div
        className="my-6 h-px"
        style={{ backgroundColor: C.outlineVariant }}
      />
      <p className={`${T.titleMedium} mb-3`} style={{ color: C.onSurface }}>
        Sobre você
      </p>
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span
            className={`${T.labelMedium} mb-1 block`}
            style={{ color: C.onSurfaceVariant }}
          >
            Altura (cm)
          </span>
          <input
            type="number"
            min="1"
            aria-label="Altura em centímetros"
            value={draftProfile.height}
            onChange={(e) =>
              setDraftProfile((p) => ({ ...p, height: Number(e.target.value) }))
            }
            className={`h-14 w-full rounded-2xl px-4 outline-none ${T.bodyLarge}`}
            style={{
              backgroundColor: C.surfaceContainerHighest,
              color: C.onSurface,
            }}
          />
        </label>
        <label>
          <span
            className={`${T.labelMedium} mb-1 block`}
            style={{ color: C.onSurfaceVariant }}
          >
            Peso (kg)
          </span>
          <input
            type="number"
            min="1"
            aria-label="Peso em quilos"
            value={draftProfile.weight}
            onChange={(e) =>
              setDraftProfile((p) => ({ ...p, weight: Number(e.target.value) }))
            }
            className={`h-14 w-full rounded-2xl px-4 outline-none ${T.bodyLarge}`}
            style={{
              backgroundColor: C.surfaceContainerHighest,
              color: C.onSurface,
            }}
          />
        </label>
      </div>
      <label className="mt-3 block">
        <span
          className={`${T.labelMedium} mb-1 block`}
          style={{ color: C.onSurfaceVariant }}
        >
          Sexo
        </span>
        <select
          aria-label="Sexo"
          value={draftProfile.sex}
          onChange={(e) =>
            setDraftProfile((p) => ({
              ...p,
              sex: e.target.value as Profile["sex"],
            }))
          }
          className={`h-14 w-full rounded-2xl px-4 outline-none ${T.bodyLarge}`}
          style={{
            backgroundColor: C.surfaceContainerHighest,
            color: C.onSurface,
          }}
        >
          <option>Feminino</option>
          <option>Masculino</option>
          <option>Outro</option>
        </select>
      </label>
      <div className="mt-auto pt-6">
        <FilledButton
          onClick={finishOnboarding}
          fullWidth
          icon={<Check size={20} />}
        >
          Entrar e continuar
        </FilledButton>
      </div>
    </div>
  );

  // ── Screen: Dashboard ────────────────────────────────────────────────
  const Dashboard = (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top app bar */}
      <header className="flex items-center justify-between px-5 pt-7 pb-3">
        <div>
          <p
            className={`${T.bodyMedium}`}
            style={{ color: C.onSurfaceVariant }}
          >
            Seu dia em equilíbrio
          </p>
          <h1 className={`${T.headlineMedium}`} style={{ color: C.onSurface }}>
            Olá, {profile?.name}
          </h1>
        </div>
      </header>

      {/* Date nav */}
      <div className="px-4 pb-3">
        <DateNav />
      </div>

      {/* Calorie ring — in surface-container card */}
      <div className="px-4 pb-4">
        <ElevatedCard className="relative flex justify-center overflow-hidden py-5">
          <CalorieRing current={totalKcal} goal={goalKcal} size={196} />
        </ElevatedCard>
      </div>

      <div className="px-4 pb-4">
        <FilledCard className="flex items-center justify-between p-4">
          <div>
            <p
              className={`${T.labelMedium} uppercase tracking-widest`}
              style={{ color: C.onSurfaceVariant }}
            >
              Consumo médio
            </p>
            <p
              className={`${T.bodyMedium} mt-1`}
              style={{ color: C.onSurfaceVariant }}
            >
              nos últimos 7 dias
            </p>
          </div>
          <p className={`${T.headlineSmall}`} style={{ color: C.primary }}>
            {totalKcal}{" "}
            <span
              className={`${T.bodySmall}`}
              style={{ color: C.onSurfaceVariant }}
            >
              kcal/dia
            </span>
          </p>
        </FilledCard>
      </div>

      {/* Extended FAB */}
      <div className="px-4 pb-4">
        <ExtendedFAB
          onClick={() => {
            setScreen("search");
            setActiveTab("register");
          }}
        >
          Registrar refeição
        </ExtendedFAB>
      </div>

      {/* Assist chips — meal shortcuts */}
      <div className="px-4 pb-5">
        <h2 className={`${T.titleSmall} mb-2`} style={{ color: C.onSurface }}>
          Escolha uma refeição
        </h2>
        <div className="flex gap-2 flex-wrap">
          {MEALS.map((m) => (
            <AssistChip
              key={m}
              label={m.split(" ")[0]}
              onClick={() => {
                setSelMeal(m);
                setActiveTab("register");
                setScreen("search");
              }}
            />
          ))}
        </div>
      </div>

      {/* Today's log — MD3 list items */}
      <div className="px-4 pb-6">
        <h2 className={`${T.titleLarge} mb-3`} style={{ color: C.onSurface }}>
          3 últimas refeições
        </h2>
        {log.length === 0 ? (
          <p
            className={`${T.bodyMedium} text-center py-6`}
            style={{ color: C.onSurfaceVariant }}
          >
            Nenhuma refeição ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {[...log]
              .reverse()
              .slice(0, 3)
              .map((entry, i) => {
                const c = calcEntry(entry);
                return (
                  <ListItem
                    key={i}
                    leading={
                      <span className="text-2xl">{entry.food.emoji}</span>
                    }
                    headline={entry.food.name}
                    supporting={`${entry.meal} · ${entry.grams}g`}
                    trailing={
                      <span
                        className={`${T.labelLarge} font-semibold`}
                        style={{ color: C.primary }}
                      >
                        {c.kcal} kcal
                      </span>
                    }
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );

  // ── Screen: Search ───────────────────────────────────────────────────
  const SearchScreen = (
    <div className="flex flex-col h-full">
      {/* MD3 Search bar */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            aria-label="Voltar ao início"
            onClick={() => {
              setScreen("dashboard");
              setActiveTab("home");
            }}
            className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full group"
            style={{ color: C.onSurface }}
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
              style={{ backgroundColor: C.onSurface }}
            />
            <ChevronLeft size={20} className="relative z-10" />
          </button>
          <h2 className={`${T.titleLarge}`} style={{ color: C.onSurface }}>
            Buscar alimento
          </h2>
        </div>
        {/* MD3 Search bar — filled style, shape Extra Large */}
        <div
          className="relative flex items-center rounded-[28px] h-14 px-4 gap-3 focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-[var(--md-primary)]"
          style={{ backgroundColor: C.surfaceContainerHighest }}
        >
          <Search
            size={24}
            style={{ color: C.onSurfaceVariant }}
            className="flex-shrink-0"
          />
          <input
            autoFocus
            type="text"
            aria-label="Buscar alimento"
            placeholder="Busque por nome"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 bg-transparent focus:outline-none ${T.bodyLarge}`}
            style={{ color: C.onSurface }}
          />
          {query && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => setQuery("")}
              className="w-12 h-12 flex items-center justify-center rounded-full"
              style={{ color: C.onSurfaceVariant }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {query ? (
          <>
            <h3
              className={`${T.titleSmall} mb-3`}
              style={{ color: C.onSurface }}
            >
              Resultados
            </h3>
            {filtered.length === 0 ? (
              <p
                className={`${T.bodyMedium} text-center py-8`}
                style={{ color: C.onSurfaceVariant }}
              >
                Nenhum alimento encontrado.
              </p>
            ) : (
              <div className="space-y-1">
                {filtered.map((food, i) => (
                  <FoodListItem
                    key={i}
                    food={food}
                    onSelect={() => {
                      setSelFood(food);
                      setGrams(100);
                      setScreen("foodDetail");
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h3
              className={`${T.titleSmall} mb-3`}
              style={{ color: C.onSurface }}
            >
              Recentes
            </h3>
            <div className="space-y-1 mb-5">
              {RECENT.map((food, i) => (
                <ListItem
                  key={i}
                  leading={
                    <Clock size={18} style={{ color: C.onSurfaceVariant }} />
                  }
                  headline={food.name}
                  supporting={`${food.kcal} kcal / 100g`}
                  onClick={() => {
                    setSelFood(food);
                    setGrams(100);
                    setScreen("foodDetail");
                  }}
                />
              ))}
            </div>
            <h3
              className={`${T.titleSmall} mb-3`}
              style={{ color: C.onSurface }}
            >
              Todos os alimentos
            </h3>
            <div className="space-y-1">
              {FOOD_DB.map((food, i) => (
                <FoodListItem
                  key={i}
                  food={food}
                  onSelect={() => {
                    setSelFood(food);
                    setGrams(100);
                    setScreen("foodDetail");
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ── Screen: Food detail ──────────────────────────────────────────────
  const FoodDetail = (
    <div className="flex flex-col h-full">
      {/* Top app bar */}
      <div className="flex items-center gap-2 px-4 pt-5 pb-4 flex-shrink-0">
        <button
          type="button"
          aria-label="Voltar à busca"
          onClick={() => setScreen("search")}
          className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full group"
          style={{ color: C.onSurface }}
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
            style={{ backgroundColor: C.onSurface }}
          />
          <ChevronLeft size={20} className="relative z-10" />
        </button>
        <div>
          <h2 className={`${T.titleLarge}`} style={{ color: C.onSurface }}>
            {selFood.name}
          </h2>
          <p className={`${T.bodySmall}`} style={{ color: C.onSurfaceVariant }}>
            por 100 g
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-5">
        {/* Quantity — MD3 numeric stepper */}
        <ElevatedCard className="p-4">
          <p
            className={`${T.labelMedium} uppercase tracking-widest mb-3`}
            style={{ color: C.onSurfaceVariant }}
          >
            Quantidade
          </p>
          <div className="flex items-center justify-between">
            {/* Outlined icon button */}
            <button
              type="button"
              aria-label="Diminuir quantidade em 10 gramas"
              onClick={() => setGrams((g) => Math.max(10, g - 10))}
              className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full border group transition-all active:scale-95"
              style={{ borderColor: C.outline, color: C.primary }}
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
                style={{ backgroundColor: C.primary }}
              />
              <Minus size={22} className="relative z-10" />
            </button>
            <div className="text-center">
              <span
                className={`${T.displayLarge} text-[48px]`}
                style={{ color: C.onSurface }}
              >
                {grams}
              </span>
              <span
                className={`${T.titleMedium} ml-1`}
                style={{ color: C.onSurfaceVariant }}
              >
                g
              </span>
            </div>
            {/* Filled icon button */}
            <button
              type="button"
              aria-label="Aumentar quantidade em 10 gramas"
              onClick={() => setGrams((g) => g + 10)}
              className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full group transition-all active:scale-95"
              style={{ backgroundColor: C.primary, color: C.onPrimary }}
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
                style={{ backgroundColor: C.onPrimary }}
              />
              <Plus size={22} className="relative z-10" />
            </button>
          </div>
        </ElevatedCard>

        {/* Meal selector — MD3 Segmented Button (2×2 grid) */}
        <div>
          <p
            className={`${T.labelMedium} uppercase tracking-widest mb-2`}
            style={{ color: C.onSurfaceVariant }}
          >
            Refeição
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MEALS.map((m) => {
              const active = selMeal === m;
              return (
                <button
                  type="button"
                  key={m}
                  aria-pressed={active}
                  onClick={() => setSelMeal(m)}
                  className="relative overflow-hidden flex items-center justify-center gap-2 min-h-12 rounded-full border group transition-all"
                  style={{
                    borderColor: C.outline,
                    backgroundColor: active
                      ? C.secondaryContainer
                      : "transparent",
                    color: active ? C.onSecondaryContainer : C.onSurface,
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
                    style={{ backgroundColor: C.onSurface }}
                  />
                  {active && (
                    <Check
                      size={18}
                      className="relative z-10"
                      strokeWidth={2.5}
                    />
                  )}
                  <span className={`relative z-10 ${T.labelLarge}`}>{m}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nutrition — MD3 Filled Card with tertiary container */}
        <div
          className="rounded-[24px] p-4"
          style={{ backgroundColor: C.tertiaryContainer }}
        >
          <p
            className={`${T.labelMedium} uppercase tracking-widest mb-3`}
            style={{ color: C.tertiary }}
          >
            Informação nutricional
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Kcal", value: preKcal, unit: "" },
              { label: "Carbo", value: preCarbs, unit: "g" },
              { label: "Prot.", value: preProtein, unit: "g" },
              { label: "Gord.", value: preFat, unit: "g" },
            ].map(({ label, value, unit }) => (
              <div
                key={label}
                className="rounded-[8px] py-2.5 px-1"
                style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
              >
                <p
                  className={`${T.labelSmall}`}
                  style={{ color: C.onTertiaryContainer }}
                >
                  {label}
                </p>
                <p
                  className={`${T.titleMedium}`}
                  style={{ color: C.onTertiaryContainer }}
                >
                  {value}
                  <span className={`${T.bodySmall}`}>{unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="px-4 py-4 flex-shrink-0">
        <FilledButton
          onClick={addFood}
          fullWidth
          icon={<Plus size={20} strokeWidth={2.5} />}
        >
          Adicionar à refeição
        </FilledButton>
      </div>
    </div>
  );

  // ── Screen: Confirmation ─────────────────────────────────────────────
  const Confirmation = (
    <div
      className="flex flex-col h-full items-center justify-center px-6 gap-6"
      role="status"
      aria-live="polite"
    >
      {/* Success icon — MD3 uses a filled container */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: C.primaryContainer }}
      >
        <Check
          size={48}
          strokeWidth={3}
          style={{ color: C.onPrimaryContainer }}
        />
      </div>

      <div className="text-center">
        <h2 className={`${T.headlineSmall}`} style={{ color: C.onSurface }}>
          Registrado!
        </h2>
        <p
          className={`${T.bodyMedium} mt-1`}
          style={{ color: C.onSurfaceVariant }}
        >
          <span style={{ color: C.onSurface }}>{selFood.name}</span> adicionado
          ao {selMeal.toLowerCase()}
        </p>
      </div>

      {/* Filled card — updated total */}
      <FilledCard className="w-full p-5 text-center">
        <p
          className={`${T.labelMedium} uppercase tracking-widest mb-1`}
          style={{ color: C.onSurfaceVariant }}
        >
          Total de hoje
        </p>
        <p className={`${T.headlineMedium}`} style={{ color: C.onSurface }}>
          {totalKcal}{" "}
          <span
            className={`${T.bodyLarge}`}
            style={{ color: C.onSurfaceVariant }}
          >
            / {goalKcal} kcal
          </span>
        </p>
        <div
          className="h-1.5 rounded-full mt-3 overflow-hidden"
          style={{ backgroundColor: C.surfaceVariant }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]"
            style={{
              width: `${Math.min(totalKcal / goalKcal, 1) * 100}%`,
              backgroundColor: totalKcal > goalKcal ? C.error : C.primary,
            }}
          />
        </div>
      </FilledCard>

      <div className="w-full space-y-3">
        <FilledButton
          onClick={() => {
            setQuery("");
            setScreen("search");
          }}
          fullWidth
        >
          Registrar outro alimento
        </FilledButton>
        <TonalButton
          onClick={() => {
            setScreen("dashboard");
            setActiveTab("home");
          }}
          fullWidth
        >
          Voltar ao início
        </TonalButton>
      </div>
    </div>
  );

  // ── Screen: Calculation ─────────────────────────────────────────────
  const Progress = (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-2">
        <h2
          className={`${T.headlineSmall} mb-1`}
          style={{ color: C.onSurface }}
        >
          Cálculo diário
        </h2>
        <p
          className={`${T.bodyMedium} mb-4`}
          style={{ color: C.onSurfaceVariant }}
        >
          Selecione as refeições feitas para estimar seu consumo.
        </p>
        <DateNav />
      </div>

      <div className="px-4 pb-4">
        <ElevatedCard className="p-4">
          <p className={`${T.titleSmall} mb-3`} style={{ color: C.onSurface }}>
            Refeições consideradas
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MEALS.map((meal) => {
              const checked = selectedMeals.includes(meal);
              return (
                <button
                  key={meal}
                  type="button"
                  aria-pressed={checked}
                  onClick={() =>
                    setSelectedMeals((current) =>
                      checked
                        ? current.filter((item) => item !== meal)
                        : [...current, meal],
                    )
                  }
                  className="flex min-h-12 items-center gap-2 rounded-2xl border px-3 text-left"
                  style={{
                    borderColor: checked ? C.primary : C.outlineVariant,
                    backgroundColor: checked ? C.secondaryContainer : C.surface,
                    color: checked ? C.onSecondaryContainer : C.onSurface,
                  }}
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-md border"
                    style={{
                      borderColor: checked ? C.primary : C.outline,
                      backgroundColor: checked ? C.primary : "transparent",
                    }}
                  >
                    {checked && (
                      <Check size={14} style={{ color: C.onPrimary }} />
                    )}
                  </span>
                  <span className={T.labelMedium}>{meal}</span>
                </button>
              );
            })}
          </div>
        </ElevatedCard>
      </div>

      <div className="flex justify-center py-3">
        <CalorieRing current={selectedKcal} goal={goalKcal} size={200} />
      </div>

      <div className="px-4 pb-4">
        <FilledCard className="p-4">
          <p
            className={`${T.labelMedium} uppercase tracking-widest`}
            style={{ color: C.onSurfaceVariant }}
          >
            Leitura do seu dia
          </p>
          <p className={`${T.titleLarge} mt-2`} style={{ color: C.onSurface }}>
            {selectedKcal <= goalKcal
              ? `${goalKcal - selectedKcal} kcal disponíveis`
              : `${selectedKcal - goalKcal} kcal acima da meta`}
          </p>
          <p
            className={`${T.bodyMedium} mt-1`}
            style={{ color: C.onSurfaceVariant }}
          >
            IMC {bmi.toFixed(1)} · {bmiLabel}. Para manter o equilíbrio,
            priorize água, frutas e legumes nas próximas escolhas.
          </p>
        </FilledCard>
      </div>

      <div className="px-4 pb-4">
        <ElevatedCard className="p-4">
          <p className={`${T.titleSmall} mb-3`} style={{ color: C.onSurface }}>
            {selectedKcal > goalKcal
              ? "Prefira escolhas mais leves"
              : "Boas opções para completar"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[FOOD_DB[8], FOOD_DB[6], FOOD_DB[7], FOOD_DB[9]].map((food) => (
              <div
                key={food.name}
                className="flex items-center gap-2 rounded-2xl p-2"
                style={{ backgroundColor: C.surfaceContainerHighest }}
              >
                <span className="text-xl">{food.emoji}</span>
                <div>
                  <p
                    className={`${T.labelSmall}`}
                    style={{ color: C.onSurface }}
                  >
                    {food.name}
                  </p>
                  <p className={`${T.bodySmall}`} style={{ color: C.primary }}>
                    {food.kcal} kcal / 100g
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ElevatedCard>
      </div>

      {/* Macros in elevated card */}
      <div className="px-4 mb-4">
        <ElevatedCard className="p-4 space-y-4">
          <p className={`${T.titleSmall}`} style={{ color: C.onSurface }}>
            Macronutrientes
          </p>
          <MacroBar
            label="Proteína"
            value={Math.round(
              selectedLog.reduce((s, e) => s + calcEntry(e).protein, 0),
            )}
            max={120}
            color={C.primary}
          />
          <MacroBar
            label="Carboidrato"
            value={Math.round(
              selectedLog.reduce((s, e) => s + calcEntry(e).carbs, 0),
            )}
            max={250}
            color="var(--chart-2)"
          />
          <MacroBar
            label="Gordura"
            value={Math.round(
              selectedLog.reduce((s, e) => s + calcEntry(e).fat, 0),
            )}
            max={65}
            color={C.tertiary}
          />
        </ElevatedCard>
      </div>

      {/* Meals list */}
      <div className="px-4 pb-6">
        <p
          className={`${T.labelSmall} uppercase tracking-widest mb-3`}
          style={{ color: C.onSurfaceVariant }}
        >
          Refeições do dia
        </p>
        <div className="space-y-2">
          {MEALS.map((m) => {
            const entries = log.filter((e) => e.meal === m);
            const kcal = entries.reduce((s, e) => s + calcEntry(e).kcal, 0);
            return (
              <ListItem
                key={m}
                headline={m}
                supporting={`${entries.length} ${entries.length === 1 ? "item" : "itens"}`}
                trailing={
                  <div className="flex items-center gap-1">
                    <span
                      className={`${T.labelLarge}`}
                      style={{ color: C.primary }}
                    >
                      {kcal > 0 ? `${kcal} kcal` : "–"}
                    </span>
                    <ChevronRight
                      size={18}
                      style={{ color: C.onSurfaceVariant }}
                    />
                  </div>
                }
                onClick={() => {
                  setDetailMeal(m);
                  setScreen("mealDetail");
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── Screen: Meal detail ──────────────────────────────────────────────
  const MealDetail = (
    <div className="flex flex-col h-full">
      {/* Top app bar */}
      <div className="flex items-center gap-2 px-4 pt-5 pb-4 flex-shrink-0">
        <button
          type="button"
          aria-label="Voltar ao progresso"
          onClick={() => setScreen("progress")}
          className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full group"
          style={{ color: C.onSurface }}
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
            style={{ backgroundColor: C.onSurface }}
          />
          <ChevronLeft size={20} className="relative z-10" />
        </button>
        <div>
          <p className={`${T.bodySmall}`} style={{ color: C.onSurfaceVariant }}>
            Progresso
          </p>
          <h2 className={`${T.titleLarge}`} style={{ color: C.onSurface }}>
            {detailMeal}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {mealEntries.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: C.surfaceContainerHighest }}
            >
              <UtensilsCrossed
                size={28}
                style={{ color: C.onSurfaceVariant }}
              />
            </div>
            <p
              className={`${T.bodyMedium}`}
              style={{ color: C.onSurfaceVariant }}
            >
              Nenhum alimento nesta refeição.
            </p>
            <TextButton
              onClick={() => {
                setSelMeal(detailMeal);
                setScreen("search");
              }}
            >
              + Adicionar alimento
            </TextButton>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {mealEntries.map((entry, i) => {
                const c = calcEntry(entry);
                return (
                  <ListItem
                    key={i}
                    leading={
                      <span className="text-2xl">{entry.food.emoji}</span>
                    }
                    headline={entry.food.name}
                    supporting={`${entry.grams}g · C${c.carbs}g P${c.protein}g G${c.fat}g`}
                    trailing={
                      <span
                        className={`${T.labelLarge} font-semibold`}
                        style={{ color: C.primary }}
                      >
                        {c.kcal}
                      </span>
                    }
                    trailingAction={
                      <button
                        type="button"
                        aria-label={`Remover ${entry.food.name}`}
                        onClick={() => removeEntry(entry)}
                        className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full group ml-1"
                        style={{ color: C.onSurfaceVariant }}
                      >
                        <span
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
                          style={{ backgroundColor: C.error }}
                        />
                        <Trash2 size={16} className="relative z-10" />
                      </button>
                    }
                  />
                );
              })}
            </div>

            {/* Divider + Total */}
            <div
              className="flex items-center justify-between px-4 py-3 mt-2 rounded-[16px]"
              style={{ backgroundColor: C.surfaceContainerHighest }}
            >
              <span
                className={`${T.titleSmall}`}
                style={{ color: C.onSurface }}
              >
                Total
              </span>
              <span
                className={`${T.titleMedium} font-semibold`}
                style={{ color: C.primary }}
              >
                {mealKcal} kcal
              </span>
            </div>

            <div className="mt-4">
              <FilledButton
                onClick={() => {
                  setSelMeal(detailMeal);
                  setScreen("search");
                }}
                fullWidth
                icon={<Plus size={18} strokeWidth={2.5} />}
              >
                Adicionar alimento
              </FilledButton>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ── Screens map ───────────────────────────────────────────────────────
  const screens: Record<Screen, React.ReactElement> = {
    onboarding: Onboarding,
    dashboard: Dashboard,
    search: SearchScreen,
    foodDetail: FoodDetail,
    confirmation: Confirmation,
    progress: Progress,
    mealDetail: MealDetail,
  };

  return (
    <div
      className="min-h-[100svh] flex items-center justify-center sm:p-4"
      style={{
        fontFamily: "'Roboto Flex', Roboto, sans-serif",
        backgroundColor: C.surfaceContainerHighest,
      }}
    >
      {/* Adaptive compact scaffold: edge-to-edge on phones, floating pane on wider viewports. */}
      <div
        className="relative flex flex-col overflow-hidden sm:rounded-[32px]"
        style={{
          width: "100%",
          maxWidth: 480,
          height: "min(900px, 100svh)",
          backgroundColor: C.surface,
          boxShadow: elev[3],
        }}
      >
        {/* Screen content */}
        <div
          className="flex-1 overflow-hidden flex flex-col"
          style={{ backgroundColor: C.surface }}
        >
          {screens[screen]}
        </div>

        {/* MD3 Navigation Bar */}
        {screen !== "onboarding" && (
          <NavigationBar active={activeTab} onNavigate={navigate} />
        )}
      </div>
    </div>
  );
}

// ── Food list item (search result) ────────────────────────────────────────
function FoodListItem({
  food,
  onSelect,
}: {
  food: Food;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative overflow-hidden flex items-center gap-4 w-full px-4 py-3 rounded-[16px] group text-left transition-all"
      style={{ backgroundColor: C.surfaceContainerLow, minHeight: 64 }}
    >
      <span
        className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] transition-opacity"
        style={{ backgroundColor: C.onSurface }}
      />
      <span className="text-2xl flex-shrink-0 relative z-10">{food.emoji}</span>
      <div className="flex-1 min-w-0 relative z-10">
        <p
          className="text-[16px] leading-6 font-normal tracking-[0.2px] truncate"
          style={{ color: C.onSurface }}
        >
          {food.name}
        </p>
        <p
          className="text-[12px] leading-4 tracking-[0.3px]"
          style={{ color: C.onSurfaceVariant }}
        >
          {food.kcal} kcal / 100g
        </p>
      </div>
      <ChevronRight
        size={18}
        style={{ color: C.onSurfaceVariant }}
        className="relative z-10"
      />
    </button>
  );
}
