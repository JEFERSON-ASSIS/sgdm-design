import type { ComponentType } from 'react';
import { cn } from '../cn';
import { TONE_BG_TINT, TONE_ICON, TONE_SOLID, TONE_TEXT_STRONG, type Tone } from './tones';

export type IconTileSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconTileShape = 'square' | 'rounded' | 'circle';
export type IconTileVariant = 'soft' | 'tint' | 'solid';

export interface IconTileProps {
  /** Componente de ícone (ex.: `FileText` do lucide-react). */
  icon: ComponentType<{ className?: string }>;
  tone?: Tone;
  /**
   * `sm` 32px, `md` 40px, `lg` 44px (StatCard), `xl` 48px (EmptyState),
   * `2xl` 56px (tela de resultado).
   */
  size?: IconTileSize;
  /** `square` (padrão, raio de 12px), `rounded` (raio de 8px) ou `circle`. */
  shape?: IconTileShape;
  /**
   * `soft` (padrão): fundo 50 e ícone 600 — o StatCard.
   * `tint`: fundo 100 e ícone 600 — o quadrado de ícone das listas.
   * `solid`: fundo 600 e ícone branco — o destaque do perfil.
   */
  variant?: IconTileVariant;
  /** Texto para leitores de tela. Sem ele, o quadrado é decorativo. */
  label?: string;
}

const CAIXA: Record<IconTileSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
  xl: 'h-12 w-12',
  '2xl': 'h-14 w-14',
};

const ICONE: Record<IconTileSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
  '2xl': 'h-7 w-7',
};

const FORMA: Record<IconTileShape, string> = {
  square: 'rounded-tile',
  rounded: 'rounded-control',
  circle: 'rounded-pill',
};

/** Ícone dentro de um quadrado ou círculo com fundo no tom. */
export function IconTile({
  icon: Icon,
  tone = 'primary',
  size = 'md',
  shape = 'square',
  variant = 'soft',
  label,
}: IconTileProps) {
  const cores =
    variant === 'solid'
      ? TONE_SOLID[tone]
      : variant === 'tint'
        ? cn(TONE_BG_TINT[tone], TONE_TEXT_STRONG[tone])
        : TONE_ICON[tone];
  return (
    <div
      data-tone={tone}
      data-variant={variant}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('flex shrink-0 items-center justify-center', CAIXA[size], FORMA[shape], cores)}
    >
      <Icon className={ICONE[size]} aria-hidden />
    </div>
  );
}
