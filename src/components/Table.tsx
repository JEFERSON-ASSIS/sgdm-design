import type { Key, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../cn';

export interface TableColumn<T> {
  /** Identificador da coluna; também é a chave lida de `row` quando não há `render`. */
  key: string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Largura fixa (valor CSS, ex.: `'8rem'`). */
  width?: string;
  /** Destaca a célula (nome, protocolo). */
  emphasis?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[] | undefined;
  /** Chave de cada linha. Padrão: `row.id` ou o índice. */
  rowKey?: (row: T, index: number) => Key;
  loading?: boolean;
  loadingLabel?: string;
  /** Mensagem (ou componente, ex.: EmptyState) quando não há linhas. */
  empty?: ReactNode;
  /** Legenda da tabela para leitores de tela. */
  caption?: string;
  onRowClick?: (row: T) => void;
}

const ALINHAMENTO = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;

function valorPadrao<T>(row: T, key: string): ReactNode {
  const v = (row as Record<string, unknown>)[key];
  if (v == null || v === '') return '—';
  return v as ReactNode;
}

function chavePadrao<T>(row: T, index: number): Key {
  const id = (row as { id?: unknown }).id;
  return typeof id === 'string' || typeof id === 'number' ? id : index;
}

/** Tabela dentro de card, no padrão das listagens do SGDM. */
export function Table<T>({
  columns,
  rows,
  rowKey = chavePadrao,
  loading = false,
  loadingLabel = 'Carregando…',
  empty = 'Nenhum registro encontrado.',
  caption,
  onRowClick,
}: TableProps<T>) {
  const lista = rows ?? [];
  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-busy={loading || undefined}>
          {caption != null && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-border bg-surface-hover">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={cn('px-4 py-3 font-semibold text-label', ALINHAMENTO[c.align ?? 'left'])}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16">
                  <div className="flex justify-center" role="status">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
                    <span className="sr-only">{loadingLabel}</span>
                  </div>
                </td>
              </tr>
            ) : lista.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">
                  {empty}
                </td>
              </tr>
            ) : (
              lista.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-border last:border-0',
                    onRowClick && 'cursor-pointer transition hover:bg-surface-hover',
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        'px-4 py-3',
                        ALINHAMENTO[c.align ?? 'left'],
                        c.emphasis && 'font-medium text-title',
                      )}
                    >
                      {c.render ? c.render(row, i) : valorPadrao(row, c.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
