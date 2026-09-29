import type { ReactNode } from 'react';
import { cn } from '../cn';

export type CounterBadgeTone = 'danger' | 'primary' | 'success' | 'warning' | 'neutral';

export interface CounterBadgeProps {
  count: number;
  /** Acima disto mostra "máx+" (padrão 9 → "9+", como o sino do SGDM). */
  max?: number;
  /** `danger` (vermelho, padrão), `primary`, `success`, `warning` ou `neutral`. */
  tone?: CounterBadgeTone;
  /** Mostra a bolinha também com zero. Padrão: some com zero. */
  showZero?: boolean;
  /**
   * O que a bolinha fica por cima (normalmente um ícone). Sem filhos, a
   * bolinha é inline — ou no canto do pai, com `placement="corner"`.
   */
  children?: ReactNode;
  /**
   * Sem filhos: `inline` (padrão, ao lado de um texto) ou `corner` (no
   * canto superior direito do elemento pai, que precisa ser `relative`).
   */
  placement?: 'inline' | 'corner';
  /**
   * Texto para leitores de tela no lugar do número (ex.: `(n) => `${n} não
   * lidas``). Sem ele, lê só o número.
   */
  label?: (count: number) => string;
  /** Anuncia as mudanças do número (`aria-live="polite"`). */
  live?: boolean;
}

/** "9+" quando passa do máximo. */
export function formatCount(count: number, max = 9): string {
  return count > max ? `${max}+` : String(count);
}

const TOM: Record<CounterBadgeTone, string> = {
  danger: 'bg-danger text-on-primary',
  primary: 'bg-accent text-on-primary',
  success: 'bg-success-strong text-on-primary',
  warning: 'bg-warning text-on-primary',
  neutral: 'bg-surface-muted text-label',
};

/** Bolinha com número: notificações não lidas, pendências de um item de menu. */
export function CounterBadge({
  count,
  max = 9,
  tone = 'danger',
  showZero = false,
  children,
  placement = 'inline',
  label,
  live = false,
}: CounterBadgeProps) {
  const visivel = count > 0 || showZero;
  const canto = children != null || placement === 'corner';
  const texto = formatCount(count, max);

  const bolinha = visivel ? (
    <span
      data-tone={tone}
      className={cn(
        'flex h-4 min-w-4 items-center justify-center rounded-pill px-1 text-2xs font-bold leading-none',
        TOM[tone],
        // Sobre o ícone o canto sai um pouco mais; no canto do botão (p-2), como o sino do SGDM.
        children != null ? 'absolute -right-2 -top-2' : canto ? 'absolute -right-0.5 -top-0.5' : 'inline-flex',
      )}
    >
      {label ? (
        <>
          <span aria-hidden>{texto}</span>
          <span className="sr-only">{label(count)}</span>
        </>
      ) : (
        texto
      )}
    </span>
  ) : null;

  const anunciado = live ? (
    <span aria-live="polite" aria-atomic="true" className={cn(!canto && 'inline-flex')}>
      {bolinha}
    </span>
  ) : (
    bolinha
  );

  if (children == null) return anunciado;
  return (
    <span className="relative inline-flex">
      {children}
      {anunciado}
    </span>
  );
}
