import type { ComponentType, Key, ReactNode } from 'react';
import { cn } from '../cn';

export interface DescriptionItem {
  label: ReactNode;
  /** Valor. Vazio (`null`, `undefined` ou `''`) vira o texto de `empty`. */
  value?: ReactNode;
  /** Ícone ao lado do rótulo (só no formato `tiles`). */
  icon?: ComponentType<{ className?: string }>;
  /** Ocupa a linha inteira da grade (texto longo, como o objeto). */
  fullWidth?: boolean;
  /** Valor em fonte monoespaçada (protocolo, hash, código). */
  mono?: boolean;
  key?: Key;
}

export type DescriptionListVariant = 'rows' | 'grid' | 'tiles' | 'compact';

export interface DescriptionListProps {
  items: DescriptionItem[];
  /**
   * `rows`: uma linha por dado, rótulo de 160px à esquerda e divisória — a
   * página pública de validação.
   * `grid` (padrão): rótulo pequeno em cima do valor, em colunas — o
   * detalhe da licitação.
   * `tiles`: cada dado numa caixa clara com rótulo em caixa-alta — o painel
   * de dados do documento.
   * `compact`: "Rótulo: valor", uma linha por dado, sem espaço extra.
   */
  variant?: DescriptionListVariant;
  /** Colunas da grade (`grid` e `tiles`) a partir de telas médias. Padrão: 2 no grid, 3 nos tiles. */
  columns?: 1 | 2 | 3;
  /** Texto para valor vazio. Padrão: "—". */
  empty?: ReactNode;
}

const COLUNAS = {
  grid: { 1: undefined, 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 xl:grid-cols-3' },
  tiles: { 1: undefined, 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3' },
} as const;

const COLUNA_INTEIRA = {
  grid: { 1: undefined, 2: 'sm:col-span-2', 3: 'sm:col-span-2 xl:col-span-3' },
  tiles: { 1: undefined, 2: 'sm:col-span-2', 3: 'sm:col-span-2 lg:col-span-3' },
} as const;

function vazio(v: ReactNode): boolean {
  return v == null || v === '' || v === false;
}

/** Lista de dados rótulo → valor (`<dl>`) nos formatos do SGDM. */
export function DescriptionList({ items, variant = 'grid', columns, empty = '—' }: DescriptionListProps) {
  const valor = (item: DescriptionItem) => (vazio(item.value) ? empty : item.value);

  if (variant === 'rows') {
    return (
      <dl className="divide-y divide-border-subtle text-sm">
        {items.map((item, i) => (
          <div key={item.key ?? i} className="grid gap-1 px-5 py-3 sm:grid-cols-label-value">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</dt>
            <dd className={cn('min-w-0 break-words text-title', item.mono && 'font-mono text-xs')}>{valor(item)}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (variant === 'compact') {
    return (
      <dl className="space-y-1.5 text-sm text-body">
        {items.map((item, i) => (
          <div key={item.key ?? i} className="flex gap-2">
            <dt className="shrink-0 font-semibold text-label">{item.label}:</dt>
            <dd className={cn('min-w-0 break-words', item.mono && 'font-mono')}>{valor(item)}</dd>
          </div>
        ))}
      </dl>
    );
  }

  const n = columns ?? (variant === 'tiles' ? 3 : 2);

  if (variant === 'tiles') {
    return (
      <dl className={cn('grid gap-3', COLUNAS.tiles[n])}>
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key ?? i}
              className={cn(
                'rounded-panel border border-border-subtle bg-surface-hover/60 px-4 py-3.5',
                item.fullWidth && COLUNA_INTEIRA.tiles[n],
              )}
            >
              <div className="flex items-center gap-1.5">
                {Icon != null && <Icon className="h-3.5 w-3.5 text-subtle" aria-hidden />}
                <dt className="text-xs2 font-semibold uppercase tracking-wide text-subtle">{item.label}</dt>
              </div>
              <dd
                className={cn(
                  'mt-1.5 break-words text-sm font-medium text-title',
                  item.mono && 'font-mono text-xs',
                )}
              >
                {valor(item)}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  }

  return (
    <dl className={cn('grid gap-4', COLUNAS.grid[n])}>
      {items.map((item, i) => (
        <div key={item.key ?? i} className={cn('min-w-0', item.fullWidth && COLUNA_INTEIRA.grid[n])}>
          <dt className="text-xs font-medium text-muted">{item.label}</dt>
          <dd className={cn('mt-0.5 break-words text-sm text-title', item.mono && 'font-mono text-xs')}>
            {valor(item)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export interface KeyValueProps {
  label: ReactNode;
  value?: ReactNode;
  /** `stacked` (padrão): rótulo em cima. `inline`: "Rótulo: valor" na mesma linha. */
  layout?: 'stacked' | 'inline';
  mono?: boolean;
  empty?: ReactNode;
}

/** Um único par rótulo → valor, fora de uma lista (ex.: no cabeçalho de um card). */
export function KeyValue({ label, value, layout = 'stacked', mono = false, empty = '—' }: KeyValueProps) {
  return (
    <DescriptionList
      variant={layout === 'inline' ? 'compact' : 'grid'}
      columns={1}
      empty={empty}
      items={[{ label, value, mono }]}
    />
  );
}
