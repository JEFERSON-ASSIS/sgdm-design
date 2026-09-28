import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Ação principal da página (ex.: botão "Novo"). */
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-5">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground xl:text-3xl">{title}</h1>
        {description != null && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      </div>
      {action != null && <div className="shrink-0">{action}</div>}
    </div>
  );
}
