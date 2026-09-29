import { cn } from '../cn';

export type SkeletonShape = 'line' | 'title' | 'block' | 'card';

export interface SkeletonProps {
  /**
   * `line`: linha de texto (16px). `title`: título de página (32px).
   * `block`: área grande (gráfico, tabela). `card`: um card de indicador (128px).
   */
  shape?: SkeletonShape;
  /**
   * Largura: `full` (padrão de line, block e card), `lg` 320px, `md` 192px
   * (padrão de title), `sm` 96px. Nunca passa da largura do contêiner.
   */
  width?: 'full' | 'lg' | 'md' | 'sm';
  /** Altura do `block`: `sm` 64px, `md` 128px, `lg` 256px (padrão). */
  height?: 'sm' | 'md' | 'lg';
  /** Quantas linhas, no `shape="line"`. A última fica mais curta. */
  lines?: number;
}

const LARGURA = { full: 'w-full', lg: 'w-80', md: 'w-48', sm: 'w-24' } as const;
const ALTURA = { sm: 'h-16', md: 'h-32', lg: 'h-64' } as const;

/** Bloco cinza pulsando no lugar do conteúdo que ainda vai chegar. */
export function Skeleton({ shape = 'line', width, height = 'lg', lines = 1 }: SkeletonProps) {
  const largura = LARGURA[width ?? (shape === 'title' ? 'md' : 'full')];
  const base = 'max-w-full animate-pulse';

  if (shape === 'line') {
    const n = Math.max(1, Math.floor(lines));
    if (n === 1) {
      return <div aria-hidden data-shape="line" className={cn(base, 'h-4 rounded-xs bg-surface-muted', largura)} />;
    }
    return (
      <div aria-hidden data-shape="line" className="space-y-2">
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            className={cn(base, 'h-4 rounded-xs bg-surface-muted', i === n - 1 ? 'w-2/3' : largura)}
          />
        ))}
      </div>
    );
  }

  const forma =
    shape === 'title'
      ? 'h-8 rounded-control'
      : shape === 'card'
        ? 'h-32 rounded-card'
        : cn(ALTURA[height], 'rounded-card');

  return <div aria-hidden data-shape={shape} className={cn(base, 'bg-skeleton', forma, largura)} />;
}

export interface PageSkeletonProps {
  /** Quantos cards de indicador (padrão 4). 0 esconde a fileira. */
  cards?: number;
  /** Texto para leitores de tela. */
  label?: string;
}

/** O carregamento de página do SGDM (`(dashboard)/loading.tsx`): título, subtítulo, cards e um bloco. */
export function PageSkeleton({ cards = 4, label = 'Carregando…' }: PageSkeletonProps) {
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">{label}</span>
      <Skeleton shape="title" />
      <Skeleton shape="line" width="lg" />
      {cards > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: cards }, (_, i) => (
            <Skeleton key={i} shape="card" />
          ))}
        </div>
      )}
      <Skeleton shape="block" />
    </div>
  );
}
