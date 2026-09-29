import type { ComponentType, ElementType, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { IconTile } from './IconTile';
import type { Tone } from './tones';

export interface StatCardProps {
  title: ReactNode;
  value: ReactNode;
  /** Componente de ícone (ex.: `FileText` do lucide-react). */
  icon: ComponentType<{ className?: string }>;
  /** Cor do quadrado do ícone. */
  tone?: Tone;
  /** Destino do link "Ver todas". */
  href?: string;
  linkLabel?: ReactNode;
  /** Componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  tone = 'primary',
  href,
  linkLabel = 'Ver todas',
  linkComponent: LinkTag = 'a',
}: StatCardProps) {
  return (
    <div className="stat-card" data-tone={tone}>
      <div className="flex items-start justify-between">
        <IconTile icon={Icon} tone={tone} size="lg" />
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted">{title}</p>
      </div>
      {href != null && (
        <LinkTag
          href={href}
          className="focus-ring mt-auto flex items-center gap-1 rounded-sm text-xs font-medium text-accent hover:text-primary"
        >
          {linkLabel} <ChevronRight className="h-3 w-3" aria-hidden />
        </LinkTag>
      )}
    </div>
  );
}
