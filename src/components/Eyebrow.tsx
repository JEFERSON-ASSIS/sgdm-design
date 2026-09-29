import type { ReactNode } from 'react';
import { cn } from '../cn';

export interface EyebrowProps {
  children: ReactNode;
  /** `sm` (padrão): 11px. `md`: 12px, o rótulo de grupo das listas. */
  size?: 'sm' | 'md';
  /** Peso: `normal` (padrão), `medium` ou `semibold`. */
  weight?: 'normal' | 'medium' | 'semibold';
  /**
   * `muted` (padrão, cinza 500), `subtle` (cinza 400, rótulo de dado),
   * `accent` (azul) ou `warning` (âmbar).
   */
  tone?: 'muted' | 'subtle' | 'accent' | 'warning';
  /** Ícone já montado, antes do texto. */
  icon?: ReactNode;
  /** Elemento HTML (padrão `p`). Use `h2`/`h3` quando for título de seção. */
  as?: 'p' | 'span' | 'div' | 'dt' | 'h2' | 'h3' | 'h4';
}

const COR = {
  muted: 'text-muted',
  subtle: 'text-subtle',
  accent: 'text-accent',
  warning: 'text-warning-hover',
} as const;

const PESO = { normal: undefined, medium: 'font-medium', semibold: 'font-semibold' } as const;

/** Sobrelinha: rótulo pequeno em caixa-alta acima de um título ou valor. */
export function Eyebrow({
  children,
  size = 'sm',
  weight = 'normal',
  tone = 'muted',
  icon,
  as: Tag = 'p',
}: EyebrowProps) {
  return (
    <Tag
      className={cn(
        'uppercase tracking-wide',
        size === 'sm' ? 'text-xs2' : 'text-xs',
        PESO[weight],
        COR[tone],
        icon != null && 'flex items-center gap-2',
      )}
    >
      {icon != null && (
        <span className="inline-flex shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden>
          {icon}
        </span>
      )}
      {children}
    </Tag>
  );
}

/** Mesmo componente, com o outro nome comum. */
export const Overline = Eyebrow;
export type OverlineProps = EyebrowProps;
