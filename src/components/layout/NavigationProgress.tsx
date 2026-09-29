export interface NavigationProgressProps {
  active: boolean;
  label?: string;
}

/** Barra fina no topo enquanto a próxima página carrega. */
export function NavigationProgress({ active, label = 'Carregando página' }: NavigationProgressProps) {
  if (!active) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-progress h-0.5 overflow-hidden bg-primary-ring"
      role="progressbar"
      aria-label={label}
    >
      <div className="h-full w-1/3 animate-nav-progress rounded-pill bg-accent" />
    </div>
  );
}
