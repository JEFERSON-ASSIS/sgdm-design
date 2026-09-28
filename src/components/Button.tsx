import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'govbr';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Mostra o indicador de carregamento e bloqueia o clique. */
  loading?: boolean;
  /** Texto exibido enquanto `loading` (padrão: o próprio rótulo). */
  loadingLabel?: ReactNode;
  /** Ícone já montado, à esquerda do rótulo. Ex.: `<Plus />`. */
  icon?: ReactNode;
  /** Ocupa a largura toda do contêiner. */
  fullWidth?: boolean;
}

const VARIANTES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  govbr: 'btn-govbr',
};

const TAMANHOS: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingLabel,
    icon,
    fullWidth,
    disabled,
    type = 'button',
    children,
    ...rest
  },
  ref,
) {
  const tamanhoIcone = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      className={cn(
        VARIANTES[variant],
        'focus-ring disabled:cursor-not-allowed [&_svg]:shrink-0',
        TAMANHOS[size],
        fullWidth && 'w-full',
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className={cn(tamanhoIcone, 'animate-spin')} aria-hidden />
      ) : (
        icon && (
          <span className={cn('inline-flex [&>svg]:h-full [&>svg]:w-full', tamanhoIcone)} aria-hidden>
            {icon}
          </span>
        )
      )}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
});
