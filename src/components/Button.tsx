import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../cn';
import { useOnDark } from './OnDark';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'govbr'
  | 'success'
  | 'danger-outline'
  | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  variant?: ButtonVariant;
  /** `sm` (12px, compacto), `md` (padrão) ou `lg` (mais alto, `py-3`, o botão do login). */
  size?: ButtonSize;
  /** Mostra o indicador de carregamento e bloqueia o clique. */
  loading?: boolean;
  /** Texto exibido enquanto `loading` (padrão: o próprio rótulo). */
  loadingLabel?: ReactNode;
  /** Ícone já montado, à esquerda do rótulo. Ex.: `<Plus />`. */
  icon?: ReactNode;
  /** Ocupa a largura toda do contêiner. */
  fullWidth?: boolean;
  /**
   * Renderiza um link (`<a href>`) com a cara do botão. Desabilitado ou
   * carregando, o link perde o `href` e ganha `aria-disabled`.
   */
  href?: string;
  /** Com `href`: componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
  /** Com `href`: alvo do link (ex.: `_blank`). */
  target?: string;
  /** Com `href`: relação do link (ex.: `noopener noreferrer`). */
  rel?: string;
  /** Com `href`: baixa o arquivo em vez de abrir. */
  download?: boolean | string;
  /**
   * Aplica o visual do botão ao único filho, em vez de criar um `<button>`
   * (ex.: `<Button asChild><Link href="/x">Abrir</Link></Button>`). O filho
   * mantém as próprias props; a classe é a do botão.
   */
  asChild?: boolean;
  /**
   * Sobre fundo escuro (login): o `link` fica azul-claro (`on-dark-link`),
   * como o "Esqueci minha senha". Dentro de `AuthLayout`/`AuthCard` já vem
   * ligado. As outras variantes não mudam.
   */
  onDark?: boolean;
}

const VARIANTES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  govbr: 'btn-govbr',
  success: 'btn-success',
  'danger-outline': 'btn-danger-outline',
  link: 'btn-link',
};

const TAMANHOS: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'py-3',
};

/** O `link` não tem caixa: o tamanho mexe só na fonte. */
const TAMANHOS_LINK: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: '',
  lg: 'text-base',
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
    href,
    linkComponent,
    target,
    rel,
    download,
    asChild = false,
    onDark,
    children,
    ...rest
  },
  ref,
) {
  const escuro = useOnDark(onDark) && variant === 'link';
  const tamanhoIcone = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const bloqueado = Boolean(disabled || loading);
  const classes = cn(
    VARIANTES[variant],
    'focus-ring disabled:cursor-not-allowed [&_svg]:shrink-0',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
    variant === 'link' ? TAMANHOS_LINK[size] : TAMANHOS[size],
    escuro && 'text-on-dark-link hover:text-on-dark-link-hover focus-visible:outline-on-dark-link',
    fullWidth && 'w-full justify-center',
  );

  const filho = asChild ? Children.only(children) : null;
  const rotulo = asChild && isValidElement<{ children?: ReactNode }>(filho) ? filho.props.children : children;

  const conteudo = (
    <>
      {loading ? (
        <Loader2 className={cn(tamanhoIcone, 'animate-spin')} aria-hidden />
      ) : (
        icon && (
          <span className={cn('inline-flex [&>svg]:h-full [&>svg]:w-full', tamanhoIcone)} aria-hidden>
            {icon}
          </span>
        )
      )}
      {loading && loadingLabel ? loadingLabel : rotulo}
    </>
  );

  if (asChild && isValidElement(filho)) {
    return cloneElement(filho as ReactElement<Record<string, unknown>>, {
      ...rest,
      // Sem ref própria, não apaga a do filho.
      ...(ref != null ? { ref } : {}),
      className: classes,
      'data-variant': variant,
      'aria-disabled': bloqueado || undefined,
      'aria-busy': loading || undefined,
      children: conteudo,
    });
  }

  if (href != null) {
    const Tag = linkComponent ?? 'a';
    return (
      <Tag
        ref={ref as Ref<HTMLAnchorElement>}
        href={bloqueado ? undefined : href}
        target={target}
        rel={rel}
        download={download}
        aria-disabled={bloqueado || undefined}
        aria-busy={loading || undefined}
        tabIndex={bloqueado ? -1 : undefined}
        data-variant={variant}
        className={classes}
        {...(rest as Record<string, unknown>)}
      >
        {conteudo}
      </Tag>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={bloqueado}
      aria-busy={loading || undefined}
      data-variant={variant}
      className={classes}
      {...rest}
    >
      {conteudo}
    </button>
  );
});
