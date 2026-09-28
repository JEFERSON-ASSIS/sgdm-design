import type { ComponentType, ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../cn';
import { TONE_ICON, type Tone } from './tones';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** Componente de ícone (padrão: Inbox). */
  icon?: ComponentType<{ className?: string }>;
  tone?: Tone;
  /** Ação sugerida (ex.: botão "Cadastrar o primeiro"). */
  action?: ReactNode;
}

/** Lista vazia: diz o que falta e, se couber, o que fazer. */
export function EmptyState({ title, description, icon: Icon = Inbox, tone = 'neutral', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-pill', TONE_ICON[tone])}>
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <p className="mt-4 text-sm font-semibold text-title">{title}</p>
      {description != null && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action != null && <div className="mt-5">{action}</div>}
    </div>
  );
}
