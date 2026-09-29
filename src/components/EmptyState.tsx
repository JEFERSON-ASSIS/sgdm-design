import type { ComponentType, ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { IconTile } from './IconTile';
import type { Tone } from './tones';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** Componente de ícone (padrão: Inbox). */
  icon?: ComponentType<{ className?: string }>;
  /** Cor do círculo do ícone (só na variante `default`). */
  tone?: Tone;
  /** Ação sugerida (ex.: botão "Cadastrar o primeiro"). */
  action?: ReactNode;
  /**
   * `default`: ícone em círculo, para o lugar de uma tabela ou página.
   * `dashed`: caixa de contorno tracejado, para uma lista vazia dentro de um
   * card (anexos, itens, cotações).
   */
  variant?: 'default' | 'dashed';
}

/** Lista vazia: diz o que falta e, se couber, o que fazer. */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  tone = 'neutral',
  action,
  variant = 'default',
}: EmptyStateProps) {
  if (variant === 'dashed') {
    return (
      <div
        data-variant="dashed"
        className="rounded-panel border border-dashed border-border-strong px-4 py-8 text-center"
      >
        <Icon className="mx-auto h-8 w-8 text-border-strong" aria-hidden />
        <p className="mt-2 text-sm text-muted">{title}</p>
        {description != null && <p className="mt-1 text-xs text-subtle">{description}</p>}
        {action != null && <div className="mt-4">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <IconTile icon={Icon} tone={tone} size="xl" shape="circle" />
      <p className="mt-4 text-sm font-semibold text-title">{title}</p>
      {description != null && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action != null && <div className="mt-5">{action}</div>}
    </div>
  );
}
