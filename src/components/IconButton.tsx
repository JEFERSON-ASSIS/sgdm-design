import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../cn';

export type IconButtonVariant = 'ghost' | 'secondary' | 'danger';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children' | 'aria-label'> {
  /** Ícone já montado. Ex.: `<Trash2 />`. */
  icon: ReactNode;
  /**
   * Nome do botão para leitores de tela — obrigatório, porque o botão não
   * tem texto. Vira também a dica ao passar o mouse (`title`), se não houver outra.
   */
  'aria-label': string;
  /**
   * `ghost` (padrão): só o ícone, cinza, com fundo no hover.
   * `secondary`: com borda e fundo branco.
   * `danger`: como o ghost, mas fica vermelho no hover (excluir, remover).
   */
  variant?: IconButtonVariant;
  /** `sm` 32px (linha de tabela, lista) ou `md` 36px (padrão, cabeçalho). */
  size?: IconButtonSize;
  loading?: boolean;
}

const VARIANTES: Record<IconButtonVariant, string> = {
  ghost: 'text-subtle hover:bg-surface-muted hover:text-body',
  secondary: 'border border-border bg-surface text-label hover:bg-surface-hover',
  danger: 'text-subtle hover:bg-danger-soft hover:text-danger-strong',
};

const TAMANHOS: Record<IconButtonSize, { caixa: string; icone: string }> = {
  sm: { caixa: 'h-8 w-8', icone: 'h-4 w-4' },
  md: { caixa: 'h-9 w-9', icone: 'h-5 w-5' },
};

/** Botão quadrado só com ícone (fechar, excluir, editar, menu). */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, variant = 'ghost', size = 'md', loading = false, disabled, type = 'button', title, ...rest },
  ref,
) {
  const t = TAMANHOS[size];
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      title={title ?? rest['aria-label']}
      data-variant={variant}
      className={cn(
        'focus-ring inline-flex shrink-0 items-center justify-center rounded-control transition',
        'disabled:cursor-not-allowed disabled:opacity-50',
        t.caixa,
        VARIANTES[variant],
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className={cn(t.icone, 'animate-spin')} aria-hidden />
      ) : (
        <span className={cn('inline-flex [&>svg]:h-full [&>svg]:w-full', t.icone)} aria-hidden>
          {icon}
        </span>
      )}
    </button>
  );
});
