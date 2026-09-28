import type { ReactNode } from 'react';
import { cn } from '../cn';

export interface CardProps {
  /** Título no cabeçalho do card. Sem título e sem ação, não há cabeçalho. */
  title?: ReactNode;
  description?: ReactNode;
  /** Botão ou link à direita do cabeçalho. */
  action?: ReactNode;
  /** `none` para conteúdo que encosta na borda (tabelas, listas). */
  padding?: 'md' | 'none';
  footer?: ReactNode;
  children?: ReactNode;
  /** Elemento HTML do card (padrão `div`). */
  as?: 'div' | 'section' | 'article';
}

export function Card({
  title,
  description,
  action,
  padding = 'md',
  footer,
  children,
  as: Tag = 'div',
}: CardProps) {
  const temCabecalho = title != null || action != null;
  return (
    <Tag className="card overflow-hidden">
      {temCabecalho && (
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {title != null && <h2 className="font-semibold text-title">{title}</h2>}
            {description != null && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          {action != null && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children != null && <div className={cn(padding === 'md' && 'card-body')}>{children}</div>}
      {footer != null && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle bg-surface-hover/80 px-5 py-4">
          {footer}
        </div>
      )}
    </Tag>
  );
}
