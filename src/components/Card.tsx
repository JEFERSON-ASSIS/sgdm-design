import type { ReactNode } from 'react';
import { cn } from '../cn';
import { OnDark } from './OnDark';
import { TONE_SURFACE, type Tone } from './tones';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  /** Título no cabeçalho do card. Sem título e sem ação, não há cabeçalho. */
  title?: ReactNode;
  description?: ReactNode;
  /** Botão ou link à direita do cabeçalho. */
  action?: ReactNode;
  /**
   * Espaço interno do corpo: `sm` (16px), `md` (20px, padrão), `lg` (24px) ou
   * `none`, para conteúdo que encosta na borda (tabelas, listas).
   */
  padding?: CardPadding;
  /** Card tingido: fundo claro e borda no tom (ex.: `warning`, `violet`). */
  tone?: Tone;
  footer?: ReactNode;
  children?: ReactNode;
  /** Elemento HTML do card (padrão `div`). */
  as?: 'div' | 'section' | 'article';
}

const PADDING: Record<CardPadding, string | undefined> = {
  none: undefined,
  sm: 'p-4',
  md: 'card-body',
  lg: 'p-6',
};

export function Card({
  title,
  description,
  action,
  padding = 'md',
  tone,
  footer,
  children,
  as: Tag = 'div',
}: CardProps) {
  const temCabecalho = title != null || action != null;
  return (
    // O card é claro mesmo dentro de uma área escura.
    <OnDark value={false}>
      <Tag className={cn('card overflow-hidden', tone && TONE_SURFACE[tone])} data-tone={tone}>
        {temCabecalho && (
          <div className="card-header flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              {title != null && <h2 className="font-semibold text-title">{title}</h2>}
              {description != null && <p className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
            {action != null && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children != null && <div className={PADDING[padding]}>{children}</div>}
        {footer != null && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle bg-surface-hover/80 px-5 py-4">
            {footer}
          </div>
        )}
      </Tag>
    </OnDark>
  );
}
