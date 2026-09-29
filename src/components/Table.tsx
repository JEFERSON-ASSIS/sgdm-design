import { useEffect, useRef, useState, type Key, type ReactNode } from 'react';
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

/**
 * Linha de total no rodapé (`tfoot`). O rótulo ocupa as colunas até a
 * primeira que tem valor, alinhado à direita — como o "Valor estimado do
 * processo" da lista de itens do SGDM.
 */
export interface TableFooter {
  label?: ReactNode;
  /** Valor por `key` de coluna. Colunas sem valor ficam vazias. */
  values: Partial<Record<string, ReactNode>>;
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
  /** `compact`: células `px-3 py-2`, para tabelas dentro de card ou painel. */
  density?: 'normal' | 'compact';
  /** `upper`: cabeçalho em caixa-alta, 12px, cinza — o das tabelas de relatório e itens. */
  headerCase?: 'normal' | 'upper';
  /** Sem o card em volta, para usar dentro de um Card que já existe. */
  bare?: boolean;
  /** Linha de total. */
  footer?: TableFooter;
  /** Liga a coluna de checkbox com "selecionar todas". */
  selectable?: boolean;
  /** Chaves selecionadas (modo controlado). */
  selected?: Key[];
  /** Seleção inicial (modo não controlado). */
  defaultSelected?: Key[];
  onSelectedChange?: (keys: Key[]) => void;
  /** Rótulo do checkbox de cada linha, para leitores de tela. */
  selectRowLabel?: (row: T, index: number) => string;
  selectAllLabel?: string;
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

const CHECKBOX = 'h-4 w-4 cursor-pointer rounded-xs border-border-strong accent-accent focus-ring';

function CheckboxTodos({
  estado,
  label,
  onChange,
}: {
  estado: 'todos' | 'alguns' | 'nenhum';
  label: string;
  onChange: (marcar: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = estado === 'alguns';
  }, [estado]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className={CHECKBOX}
      checked={estado === 'todos'}
      onChange={() => onChange(estado !== 'todos')}
      aria-label={label}
    />
  );
}

/** Tabela no padrão das listagens do SGDM: dentro de card, com vazio, carregando, total e seleção. */
export function Table<T>({
  columns,
  rows,
  rowKey = chavePadrao,
  loading = false,
  loadingLabel = 'Carregando…',
  empty = 'Nenhum registro encontrado.',
  caption,
  onRowClick,
  density = 'normal',
  headerCase = 'normal',
  bare = false,
  footer,
  selectable = false,
  selected,
  defaultSelected = [],
  onSelectedChange,
  selectRowLabel = (_row, i) => `Selecionar linha ${i + 1}`,
  selectAllLabel = 'Selecionar todas',
}: TableProps<T>) {
  const lista = rows ?? [];
  const [interno, setInterno] = useState<Key[]>(defaultSelected);
  const marcados = selected ?? interno;
  const chaves = lista.map((r, i) => rowKey(r, i));
  const qtdMarcados = chaves.filter((k) => marcados.includes(k)).length;
  const estadoTodos = qtdMarcados === 0 ? 'nenhum' : qtdMarcados === chaves.length ? 'todos' : 'alguns';

  function mudarSelecao(proximo: Key[]) {
    if (selected === undefined) setInterno(proximo);
    onSelectedChange?.(proximo);
  }

  const celula = density === 'compact' ? 'px-3 py-2' : 'px-4 py-3';
  const totalColunas = columns.length + (selectable ? 1 : 0);

  const tabela = (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-busy={loading || undefined}>
        {caption != null && <caption className="sr-only">{caption}</caption>}
        <thead className="border-b border-border bg-surface-hover">
          <tr
            className={cn(
              headerCase === 'upper' ? 'text-xs font-medium uppercase tracking-wide text-muted' : 'font-semibold text-label',
            )}
          >
            {selectable && (
              <th scope="col" className={cn(celula, 'w-10')}>
                {chaves.length > 0 && (
                  <CheckboxTodos
                    estado={estadoTodos}
                    label={selectAllLabel}
                    onChange={(marcar) =>
                      mudarSelecao(
                        marcar
                          ? [...marcados, ...chaves.filter((k) => !marcados.includes(k))]
                          : marcados.filter((k) => !chaves.includes(k)),
                      )
                    }
                  />
                )}
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                style={c.width ? { width: c.width } : undefined}
                className={cn(celula, ALINHAMENTO[c.align ?? 'left'])}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={totalColunas} className="px-4 py-16">
                <div className="flex justify-center" role="status">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
                  <span className="sr-only">{loadingLabel}</span>
                </div>
              </td>
            </tr>
          ) : lista.length === 0 ? (
            <tr>
              <td colSpan={totalColunas} className="px-4 py-10 text-center text-muted">
                {empty}
              </td>
            </tr>
          ) : (
            lista.map((row, i) => {
              const chave = chaves[i]!;
              const marcado = selectable && marcados.includes(chave);
              return (
                <tr
                  key={chave}
                  aria-selected={selectable ? marcado : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-border last:border-0',
                    onRowClick && 'cursor-pointer transition hover:bg-surface-hover',
                    marcado && 'bg-primary-soft',
                  )}
                >
                  {selectable && (
                    <td className={celula} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className={CHECKBOX}
                        checked={marcado}
                        onChange={() =>
                          mudarSelecao(marcado ? marcados.filter((k) => k !== chave) : [...marcados, chave])
                        }
                        aria-label={selectRowLabel(row, i)}
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(celula, ALINHAMENTO[c.align ?? 'left'], c.emphasis && 'font-medium text-title')}
                    >
                      {c.render ? c.render(row, i) : valorPadrao(row, c.key)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
        {footer != null && !loading && lista.length > 0 && <Rodape footer={footer} columns={columns} celula={celula} selectable={selectable} />}
      </table>
    </div>
  );

  if (bare) return tabela;
  return <div className="card overflow-hidden p-0">{tabela}</div>;
}

function Rodape<T>({
  footer,
  columns,
  celula,
  selectable,
}: {
  footer: TableFooter;
  columns: TableColumn<T>[];
  celula: string;
  selectable: boolean;
}) {
  const primeira = columns.findIndex((c) => footer.values[c.key] !== undefined);
  const inicio = primeira === -1 ? columns.length : primeira;
  const span = inicio + (selectable ? 1 : 0);
  return (
    <tfoot className="border-t border-border bg-surface-hover">
      <tr>
        {span > 0 && (
          <td colSpan={span} className={cn(celula, 'text-right text-xs font-medium uppercase tracking-wide text-muted')}>
            {footer.label}
          </td>
        )}
        {columns.slice(inicio).map((c) => (
          <td key={c.key} className={cn(celula, ALINHAMENTO[c.align ?? 'left'], 'font-semibold text-foreground')}>
            {footer.values[c.key]}
          </td>
        ))}
      </tr>
    </tfoot>
  );
}
