import type { ReactNode } from 'react';
import { cn } from '../cn';
import { STATUS_COLORS, STATUS_FALLBACK, type StatusColorMap } from '../status';

export interface StatusBadgeProps {
  /** Código do status (ex.: `EM_ANALISE`). Ignorado quando `active` é informado. */
  status?: string;
  /** Mapa status → classes `bg-<cor>-100 text-<cor>-800`. Padrão: STATUS_COLORS do SGDM. */
  colors?: StatusColorMap;
  /** Mapa status → rótulo. Sem rótulo, o código vira texto ("EM ANALISE"). */
  labels?: Record<string, string>;
  /** Atalho para o selo Ativo/Inativo dos cadastros. */
  active?: boolean;
  /** Rótulo explícito; tem precedência sobre `labels`. */
  children?: ReactNode;
}

export function StatusBadge({
  status,
  colors = STATUS_COLORS,
  labels,
  active,
  children,
}: StatusBadgeProps) {
  if (active !== undefined) {
    return (
      <span
        data-status={active ? 'ATIVO' : 'INATIVO'}
        className={cn(
          'inline-flex rounded-pill px-2 py-0.5 text-xs font-semibold',
          active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
        )}
      >
        {children ?? (active ? 'Ativo' : 'Inativo')}
      </span>
    );
  }

  const codigo = status ?? '';
  const rotulo = children ?? (labels?.[codigo] ?? codigo.replace(/_/g, ' ')).toUpperCase();
  return (
    <span
      data-status={codigo}
      className={cn(
        'inline-flex rounded-pill px-2.5 py-0.5 text-[10px] font-bold tracking-wide',
        colors[codigo] ?? STATUS_FALLBACK,
      )}
    >
      {rotulo}
    </span>
  );
}
