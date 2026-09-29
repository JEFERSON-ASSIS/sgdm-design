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

/** Fundo -soft (50): aviso, chip suave, card tingido. */
export const TONE_BG_SOFT: Record<Tone, string> = {
  primary: 'bg-primary-soft',
  secondary: 'bg-secondary-soft',
  success: 'bg-success-soft',
  warning: 'bg-warning-soft',
  danger: 'bg-danger-soft',
  info: 'bg-info-soft',
  neutral: 'bg-surface-hover',
  cyan: 'bg-cyan-soft',
  indigo: 'bg-indigo-soft',
  rose: 'bg-rose-soft',
  violet: 'bg-violet-soft',
  purple: 'bg-purple-soft',
  orange: 'bg-orange-soft',
  teal: 'bg-teal-soft',
  sky: 'bg-sky-soft',
  emerald: 'bg-success-soft',
  amber: 'bg-warning-soft',
  blue: 'bg-info-soft',
  red: 'bg-danger-soft',
};

/** Fundo -tint (100): chip preenchido, quadrado de ícone. */
export const TONE_BG_TINT: Record<Tone, string> = {
  primary: 'bg-primary-ring',
  secondary: 'bg-violet-tint',
  success: 'bg-success-tint',
  warning: 'bg-warning-tint',
  danger: 'bg-danger-tint',
  info: 'bg-info-tint',
  neutral: 'bg-surface-muted',
  cyan: 'bg-cyan-tint',
  indigo: 'bg-indigo-tint',
  rose: 'bg-rose-tint',
  violet: 'bg-violet-tint',
  purple: 'bg-purple-tint',
  orange: 'bg-orange-tint',
  teal: 'bg-teal-tint',
  sky: 'bg-sky-tint',
  emerald: 'bg-success-tint',
  amber: 'bg-warning-tint',
  blue: 'bg-info-tint',
  red: 'bg-danger-tint',
};

/** Borda -border (200): aviso, chip com contorno. */
export const TONE_BORDER: Record<Tone, string> = {
  primary: 'border-primary-ring',
  secondary: 'border-violet-border',
  success: 'border-success-border',
  warning: 'border-warning-border',
  danger: 'border-danger-border',
  info: 'border-info-border',
  neutral: 'border-border',
  cyan: 'border-cyan-border',
  indigo: 'border-indigo-border',
  rose: 'border-rose-border',
  violet: 'border-violet-border',
  purple: 'border-purple-border',
  orange: 'border-orange-border',
  teal: 'border-teal-border',
  sky: 'border-sky-border',
  emerald: 'border-success-border',
  amber: 'border-warning-border',
  blue: 'border-info-border',
  red: 'border-danger-border',
};

/** Texto/ícone -strong (600). */
export const TONE_TEXT_STRONG: Record<Tone, string> = {
  primary: 'text-accent',
  secondary: 'text-secondary',
  success: 'text-success-strong',
  warning: 'text-warning-strong',
  danger: 'text-danger-strong',
  info: 'text-info-strong',
  neutral: 'text-muted',
  cyan: 'text-cyan-strong',
  indigo: 'text-indigo-strong',
  rose: 'text-rose-strong',
  violet: 'text-violet-strong',
  purple: 'text-purple-strong',
  orange: 'text-orange-strong',
  teal: 'text-teal-strong',
  sky: 'text-sky-strong',
  emerald: 'text-success-strong',
  amber: 'text-warning-strong',
  blue: 'text-info-strong',
  red: 'text-danger-strong',
};

/** Fundo -strong (600) com texto branco: quadrado de ícone cheio. */
export const TONE_SOLID: Record<Tone, string> = {
  primary: 'bg-accent text-on-primary',
  secondary: 'bg-secondary text-on-primary',
  success: 'bg-success-strong text-on-primary',
  warning: 'bg-warning-strong text-on-primary',
  danger: 'bg-danger-strong text-on-primary',
  info: 'bg-info-strong text-on-primary',
  neutral: 'bg-muted text-on-primary',
  cyan: 'bg-cyan-strong text-on-primary',
  indigo: 'bg-indigo-strong text-on-primary',
  rose: 'bg-rose-strong text-on-primary',
  violet: 'bg-violet-strong text-on-primary',
  purple: 'bg-purple-strong text-on-primary',
  orange: 'bg-orange-strong text-on-primary',
  teal: 'bg-teal-strong text-on-primary',
  sky: 'bg-sky-strong text-on-primary',
  emerald: 'bg-success-strong text-on-primary',
  amber: 'bg-warning-strong text-on-primary',
  blue: 'bg-info-strong text-on-primary',
  red: 'bg-danger-strong text-on-primary',
};

/** Texto -text (800): sobre -soft/-tint (chip, selo). */
export const TONE_TEXT: Record<Tone, string> = {
  primary: 'text-accent-text',
  secondary: 'text-violet-text',
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
  info: 'text-info-text',
  neutral: 'text-label',
  cyan: 'text-cyan-text',
  indigo: 'text-indigo-text',
  rose: 'text-rose-text',
  violet: 'text-violet-text',
  purple: 'text-purple-text',
  orange: 'text-orange-text',
  teal: 'text-teal-text',
  sky: 'text-sky-text',
  emerald: 'text-success-text',
  amber: 'text-warning-text',
  blue: 'text-info-text',
  red: 'text-danger-text',
};

/** Texto -deep (900): corpo de aviso (callout). */
export const TONE_TEXT_DEEP: Record<Tone, string> = {
  primary: 'text-primary',
  secondary: 'text-violet-deep',
  success: 'text-success-deep',
  warning: 'text-warning-deep',
  danger: 'text-danger-deep',
  info: 'text-info-deep',
  neutral: 'text-label',
  cyan: 'text-cyan-deep',
  indigo: 'text-indigo-deep',
  rose: 'text-rose-deep',
  violet: 'text-violet-deep',
  purple: 'text-purple-deep',
  orange: 'text-orange-deep',
  teal: 'text-teal-deep',
  sky: 'text-sky-deep',
  emerald: 'text-success-deep',
  amber: 'text-warning-deep',
  blue: 'text-info-deep',
  red: 'text-danger-deep',
};

