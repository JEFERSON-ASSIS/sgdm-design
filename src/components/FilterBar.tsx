import { useId, type ComponentType, type ReactNode } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '../cn';
import { Button } from './Button';

export interface FilterBarProps {
  /** Os campos de filtro (Select, SearchInput, Input). Cada filho ocupa uma célula da grade. */
  children: ReactNode;
  /** Título do card. Padrão: "Filtros". */
  title?: ReactNode;
  /** Ícone do título. Padrão: o funil (`Filter`). */
  icon?: ComponentType<{ className?: string }>;
  /** Com esta função, aparece o botão "Limpar filtros" na última célula. */
  onClear?: () => void;
  clearLabel?: string;
  /** Desabilita o botão de limpar (ex.: nenhum filtro preenchido). */
  clearDisabled?: boolean;
  /**
   * Colunas da grade a partir de 1024px (padrão 4). Abaixo disso são 2 a
   * partir de 640px e 1 no celular, como no SGDM.
   */
  columns?: 2 | 3 | 4;
  /** Ações extras à direita do título (ex.: "Exportar"). */
  actions?: ReactNode;
}

const COLUNAS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

/**
 * Card de filtros de lista: título "Filtros", grade de campos e botão para
 * limpar. É um marco de busca (`role="search"`) para o leitor de tela.
 */
export function FilterBar({
  children,
  title = 'Filtros',
  icon: Icone = Filter,
  onClear,
  clearLabel = 'Limpar filtros',
  clearDisabled = false,
  columns = 4,
  actions,
}: FilterBarProps) {
  const idTitulo = useId();
  return (
    <div role="search" aria-labelledby={idTitulo} className="card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p id={idTitulo} className="flex items-center gap-2 text-sm font-medium text-body">
          <Icone className="h-4 w-4" aria-hidden />
          {title}
        </p>
        {actions != null && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <div className={cn('grid gap-3', COLUNAS[columns])}>
        {children}
        {onClear != null && (
          <Button variant="secondary" onClick={onClear} disabled={clearDisabled}>
            {clearLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
