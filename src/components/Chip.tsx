import type { ReactNode } from 'react';
import { cn } from '../cn';
import { TONE_BG_SOFT, TONE_BG_TINT, TONE_BORDER, TONE_TEXT, type Tone } from './tones';

export type ChipVariant = 'filled' | 'soft' | 'outline';
export type ChipSize = 'xs' | 'sm';

export interface ChipProps {
  children: ReactNode;
  /** Qualquer tom do pacote. Padrão: `neutral`. */
  tone?: Tone;
  /**
   * `filled` (padrão): fundo 100 e texto 800.
   * `soft`: fundo 50 e texto 800, mais discreto.
   * `outline`: fundo 50 com borda 200, em retângulo — o chip de "tag".
   */
  variant?: ChipVariant;
  /** `xs`: 10px (ao lado de título). `sm` (padrão): 12px. */
  size?: ChipSize;
  /** Ícone já montado, antes do texto. */
  icon?: ReactNode;
  /** Fonte monoespaçada e cantos retos, para códigos (protocolo, permissão). */
  mono?: boolean;
  /** Caixa-alta e negrito, para marcadores curtos ("NOVO", "IA"). */
  uppercase?: boolean;
}

const TAMANHO: Record<ChipSize, string> = {
  xs: 'px-2 py-0.5 text-2xs',
  sm: 'px-2.5 py-0.5 text-xs',
};

/** Etiqueta pequena: categoria, contagem, código ou marcador. Não é status (use StatusBadge). */
export function Chip({
  children,
  tone = 'neutral',
  variant = 'filled',
  size = 'sm',
  icon,
  mono = false,
  uppercase = false,
}: ChipProps) {
  const cores =
    variant === 'filled'
      ? cn(TONE_BG_TINT[tone], TONE_TEXT[tone])
      : variant === 'soft'
        ? cn(TONE_BG_SOFT[tone], TONE_TEXT[tone])
        : cn('border', TONE_BORDER[tone], TONE_BG_SOFT[tone], TONE_TEXT[tone]);
  const retangular = mono || variant === 'outline';
  return (
    <span
      data-tone={tone}
      data-variant={variant}
      className={cn(
        'inline-flex max-w-full items-center gap-1 whitespace-nowrap',
        TAMANHO[size],
        cores,
        retangular ? (size === 'xs' ? 'rounded-xs' : 'rounded-tag') : 'rounded-pill',
        mono ? 'font-mono' : 'font-medium',
        mono && size === 'sm' && 'px-1.5',
        uppercase && 'font-bold uppercase tracking-wide',
      )}
    >
      {icon != null && (
        <span
          className={cn('inline-flex shrink-0', size === 'xs' ? '[&>svg]:h-3 [&>svg]:w-3' : '[&>svg]:h-3.5 [&>svg]:w-3.5')}
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Mesmo componente, com o outro nome comum. */
export const Tag = Chip;
export type TagProps = ChipProps;
