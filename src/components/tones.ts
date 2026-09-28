/** Tons semânticos usados por StatCard, EmptyState e Toast. */
export type Tone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Fundo claro + cor do ícone. Classes por extenso para o Tailwind achá-las. */
export const TONE_ICON: Record<Tone, string> = {
  primary: 'bg-primary-soft text-accent',
  secondary: 'bg-secondary-soft text-secondary',
  success: 'bg-success-soft text-success-strong',
  warning: 'bg-warning-soft text-warning-strong',
  danger: 'bg-danger-soft text-danger-strong',
  info: 'bg-info-soft text-info-strong',
  neutral: 'bg-surface-muted text-muted',
};
