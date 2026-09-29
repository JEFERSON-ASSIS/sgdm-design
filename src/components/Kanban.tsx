import { Children, useId, type ElementType, type ReactNode } from 'react';
import { cn } from '../cn';

export interface KanbanBoardProps {
  /** Nome do quadro para leitores de tela (ex.: "Processos por fase"). */
  label: string;
  /** As colunas (`KanbanColumn`). */
  children: ReactNode;
}

/**
 * Quadro kanban só de leitura (`LicitacaoKanban` do SGDM): colunas lado a
 * lado com rolagem horizontal. Não arrasta cartões: mudar de coluna é uma
 * ação do processo, feita na tela dele. O quadro recebe foco para rolar
 * pelo teclado.
 */
export function KanbanBoard({ label, children }: KanbanBoardProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="focus-ring flex gap-4 overflow-x-auto rounded-panel pb-4"
    >
      {children}
    </div>
  );
}

export interface KanbanColumnProps {
  title: ReactNode;
  /** Complemento antes da contagem (ex.: o setor responsável pela fase). */
  subtitle?: ReactNode;
  /** Quantidade exibida. Padrão: o número de cartões filhos. */
  count?: number;
  /** Texto da contagem. Padrão: "N processo(s)". */
  countLabel?: (count: number) => ReactNode;
  /** Texto da coluna sem cartões. Padrão: "Vazio". */
  emptyLabel?: ReactNode;
  /** Os cartões (`KanbanCard`). */
  children?: ReactNode;
}

const contagemPadrao = (n: number) => `${n} processo(s)`;

/** Coluna do quadro: cabeçalho com título e contagem, e a pilha de cartões. */
export function KanbanColumn({
  title,
  subtitle,
  count,
  countLabel = contagemPadrao,
  emptyLabel = 'Vazio',
  children,
}: KanbanColumnProps) {
  const idTitulo = useId();
  const cartoes = Children.toArray(children);
  const total = count ?? cartoes.length;
  return (
    <section
      aria-labelledby={idTitulo}
      className="w-kanban-column shrink-0 rounded-panel border border-border bg-surface-hover/80"
    >
      <header className="border-b border-border px-3 py-2.5">
        <h3 id={idTitulo} className="text-sm font-semibold text-title">
          {title}
        </h3>
        <p className="text-xs text-muted">
          {subtitle != null && <>{subtitle} · </>}
          {countLabel(total)}
        </p>
      </header>
      {cartoes.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-subtle">{emptyLabel}</p>
      ) : (
        <ul role="list" className="space-y-2 p-2">
          {cartoes}
        </ul>
      )}
    </section>
  );
}

export interface KanbanCardProps {
  /** Título do cartão (o objeto do processo). Corta em duas linhas. */
  title: ReactNode;
  /** Código em fonte mono no topo (número do processo). */
  code?: ReactNode;
  /** Selo à esquerda do rodapé (ex.: `<StatusBadge />`). */
  badge?: ReactNode;
  /** Valor à direita do rodapé (ex.: "R$ 12.400,00"). */
  meta?: ReactNode;
  /** Linha extra, como a contagem de DFDs (ex.: `<Chip>`). */
  extra?: ReactNode;
  /** Rodapé miúdo (ex.: "Em: SECAD"). */
  footer?: ReactNode;
  /** Destino do cartão. Sem `href` nem `onClick`, o cartão não é clicável. */
  href?: string;
  /** Componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
  onClick?: () => void;
}

/** Cartão compacto do kanban (`LicitacaoCardCompact` do SGDM). */
export function KanbanCard({ title, code, badge, meta, extra, footer, href, linkComponent, onClick }: KanbanCardProps) {
  const clicavel = href != null || onClick != null;
  const Tag: ElementType = href != null ? (linkComponent ?? 'a') : onClick != null ? 'button' : 'div';
  // Só elementos de frase: o cartão pode ser um <button>.
  const conteudo = (
    <>
      {code != null && <span className="block font-mono text-xs font-medium text-muted">{code}</span>}
      <span className={cn('line-clamp-2 text-sm font-medium text-title', code != null && 'mt-1')}>{title}</span>
      {(badge != null || meta != null) && (
        <span className="mt-2 flex items-center justify-between gap-2">
          {badge}
          {meta != null && <span className="whitespace-nowrap text-xs text-muted">{meta}</span>}
        </span>
      )}
      {extra != null && <span className="mt-1.5 block">{extra}</span>}
      {footer != null && <span className="mt-1.5 block text-xs2 text-subtle">{footer}</span>}
    </>
  );
  return (
    <li>
      <Tag
        href={href}
        onClick={onClick}
        type={Tag === 'button' ? 'button' : undefined}
        className={cn(
          'block w-full rounded-control border border-border bg-surface p-3 text-left shadow-card',
          clicavel && 'focus-ring transition hover:border-primary-light/60 hover:shadow-card-hover',
        )}
      >
        {conteudo}
      </Tag>
    </li>
  );
}
