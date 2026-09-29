/**
 * Tons semânticos usados por StatCard, EmptyState, Card e Toast.
 *
 * - papéis: primary, secondary, success, warning, danger, info, neutral;
 * - famílias: cyan, indigo, rose, violet, purple, orange, teal, sky;
 * - apelidos pelo nome da cor que o SGDM usa: emerald (= success),
 *   amber (= warning), blue (= info) e red (= danger).
 */
export type ToneFamily = 'cyan' | 'indigo' | 'rose' | 'violet' | 'purple' | 'orange' | 'teal' | 'sky';
export type Tone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | ToneFamily
  | 'emerald'
  | 'amber'
  | 'blue'
  | 'red';

export const TONES: readonly Tone[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'cyan',
  'indigo',
  'rose',
  'violet',
  'purple',
  'orange',
  'teal',
  'sky',
  'emerald',
  'amber',
  'blue',
  'red',
];

/**
 * Fundo claro + cor do ícone (bg-<tom>-soft text-<tom>-strong, o padrão do
 * StatCard do SGDM). Classes por extenso para o Tailwind achá-las.
 */
export const TONE_ICON: Record<Tone, string> = {
  primary: 'bg-primary-soft text-accent',
  secondary: 'bg-secondary-soft text-secondary',
  success: 'bg-success-soft text-success-strong',
  warning: 'bg-warning-soft text-warning-strong',
  danger: 'bg-danger-soft text-danger-strong',
  info: 'bg-info-soft text-info-strong',
  neutral: 'bg-surface-muted text-muted',
  cyan: 'bg-cyan-soft text-cyan-strong',
  indigo: 'bg-indigo-soft text-indigo-strong',
  rose: 'bg-rose-soft text-rose-strong',
  violet: 'bg-violet-soft text-violet-strong',
  purple: 'bg-purple-soft text-purple-strong',
  orange: 'bg-orange-soft text-orange-strong',
  teal: 'bg-teal-soft text-teal-strong',
  sky: 'bg-sky-soft text-sky-strong',
  emerald: 'bg-success-soft text-success-strong',
  amber: 'bg-warning-soft text-warning-strong',
  blue: 'bg-info-soft text-info-strong',
  red: 'bg-danger-soft text-danger-strong',
};

/** Superfície tingida: fundo -soft e borda -border (card tingido, aviso). */
export const TONE_SURFACE: Record<Tone, string> = {
  primary: 'border-primary-ring bg-primary-soft',
  secondary: 'border-violet-border bg-secondary-soft',
  success: 'border-success-border bg-success-soft',
  warning: 'border-warning-border bg-warning-soft',
  danger: 'border-danger-border bg-danger-soft',
  info: 'border-info-border bg-info-soft',
  neutral: 'border-border bg-surface-hover',
  cyan: 'border-cyan-border bg-cyan-soft',
  indigo: 'border-indigo-border bg-indigo-soft',
  rose: 'border-rose-border bg-rose-soft',
  violet: 'border-violet-border bg-violet-soft',
  purple: 'border-purple-border bg-purple-soft',
  orange: 'border-orange-border bg-orange-soft',
  teal: 'border-teal-border bg-teal-soft',
  sky: 'border-sky-border bg-sky-soft',
  emerald: 'border-success-border bg-success-soft',
  amber: 'border-warning-border bg-warning-soft',
  blue: 'border-info-border bg-info-soft',
  red: 'border-danger-border bg-danger-soft',
};
