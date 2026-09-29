import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../cn';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** `xs` 14px, `sm` 16px (botão, texto), `md` 24px, `lg` 32px (página, tabela). */
  size?: SpinnerSize;
  /** `accent` (azul, padrão), `muted` (cinza) ou `current` (cor do texto em volta). */
  tone?: 'accent' | 'muted' | 'current';
  /**
   * Texto para leitores de tela. Com ele, o spinner vira `role="status"`;
   * sem ele, é decorativo (use dentro de algo que já anuncia o carregamento).
   */
  label?: string;
}

const TAMANHO: Record<SpinnerSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const COR = {
  accent: 'text-accent',
  muted: 'text-subtle',
  current: undefined,
} as const;

/** Indicador de carregamento girando (o Loader2 do SGDM). */
export function Spinner({ size = 'md', tone = 'accent', label }: SpinnerProps) {
  const icone = <Loader2 className={cn('animate-spin', TAMANHO[size], COR[tone])} aria-hidden />;
  if (!label) return icone;
  return (
    <span role="status" className="inline-flex">
      {icone}
      <span className="sr-only">{label}</span>
    </span>
  );
}

export interface LoadingStateProps {
  /** Texto do carregamento. Padrão: "Carregando…". */
  label?: ReactNode;
  /**
   * `block` (padrão): spinner grande no centro de uma área (`py-16`), no lugar
   * de uma lista ou página. `inline`: spinner pequeno ao lado do texto, numa
   * linha ("Carregando histórico…").
   */
  mode?: 'block' | 'inline';
  /**
   * Mostra o texto na tela. Padrão: sim no `inline`, não no `block` (lá o
   * texto vai só para leitores de tela, como no SGDM).
   */
  showLabel?: boolean;
}

/** Área de carregamento com spinner e texto, anunciada como `role="status"`. */
export function LoadingState({ label = 'Carregando…', mode = 'block', showLabel }: LoadingStateProps) {
  const visivel = showLabel ?? mode === 'inline';
  if (mode === 'inline') {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" tone="current" />
        <span className={cn(!visivel && 'sr-only')}>{label}</span>
      </p>
    );
  }
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner size="lg" />
      <span className={cn(visivel ? 'text-sm text-muted' : 'sr-only')}>{label}</span>
    </div>
  );
}
