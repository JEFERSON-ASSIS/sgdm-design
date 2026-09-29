import type { ReactNode } from 'react';
import { cn } from '../cn';
import { STATUS_COLORS, STATUS_FALLBACK, type StatusColorMap } from '../status';

export interface StatusBadgeProps {
  /** Código do status (ex.: `EM_ANALISE`). Ignorado quando `active` é informado. */
  status?: string;
  /** Mapa status → classes `bg-<cor>-100 text-<cor>-800`. Padrão: STATUS_COLORS do SGDM. */
  colors?: StatusColorMap;
  /** Mapa status → rótulo. Sem rótulo, o código vira texto ("EM ANALISE" / "Em Analise"). */
  labels?: Record<string, string>;
  /** Atalho para o selo Ativo/Inativo dos cadastros. */
  active?: boolean;
  /**
   * `xs` (padrão): 10px, negrito, espaçado — o selo de documento.
   * `sm`: 12px, peso médio — o selo de licitação, numeração e peça.
   */
  size?: 'xs' | 'sm';
  /** `upper` (padrão) põe o rótulo em caixa-alta; `normal` mostra como veio. */
  case?: 'upper' | 'normal';
  /**
   * `pill` (padrão): pílula preenchida. `outline`: retângulo com borda, para a
   * fase da licitação (a cor da borda vem do mapa, ex.: LICITACAO_FASE_COLORS).
   */
  variant?: 'pill' | 'outline';
  /** Rótulo explícito; tem precedência sobre `labels`. */
  children?: ReactNode;
}

const TAMANHO = {
  xs: 'px-2.5 py-0.5 text-2xs font-bold tracking-wide',
  sm: 'px-2 py-0.5 text-xs font-medium',
} as const;

/** "EM_ANDAMENTO" → "Em Andamento" (o formatStatusLabel do SGDM). */
function rotuloDoCodigo(codigo: string): string {
  return codigo
    .split('_')
    .filter(Boolean)
    .map((p) => p.charAt(0) + p.slice(1).toLowerCase())
    .join(' ');
}

export function StatusBadge({
  status,
  colors = STATUS_COLORS,
  labels,
  active,
  size = 'xs',
  case: caixa = 'upper',
  variant = 'pill',
  children,
}: StatusBadgeProps) {
  if (active !== undefined) {
    return (
      <span
        data-status={active ? 'ATIVO' : 'INATIVO'}
        className={cn(
          'inline-flex rounded-pill px-2 py-0.5 text-xs font-semibold',
          active ? 'bg-success-soft text-success-hover' : 'bg-surface-muted text-body',
        )}
      >
        {children ?? (active ? 'Ativo' : 'Inativo')}
      </span>
    );
  }

  const codigo = status ?? '';
  const texto = labels?.[codigo] ?? (caixa === 'upper' ? codigo.replace(/_/g, ' ') : rotuloDoCodigo(codigo));
  const rotulo = children ?? (caixa === 'upper' ? texto.toUpperCase() : texto);
  return (
    <span
      data-status={codigo}
      data-variant={variant}
      className={cn(
        'inline-flex',
        variant === 'outline' ? 'rounded-tag border' : 'rounded-pill',
        TAMANHO[size],
        colors[codigo] ?? STATUS_FALLBACK,
      )}
    >
      {rotulo}
    </span>
  );
}
