import type { ComponentType, ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { cn } from '../../cn';
import { OnDark } from '../OnDark';

interface MarcaProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** No login a marca alinha à esquerda a partir de `lg`; no cartão, sempre centrada. */
  alinhar: 'responsivo' | 'centro';
}

/** Logo em quadrado azul com sombra forte, nome e subtítulo, como no login do SGDM. */
function Marca({ icon, title, description, alinhar }: MarcaProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center',
        alinhar === 'responsivo' ? 'mb-10 lg:items-start lg:text-left' : 'mb-8',
      )}
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-card bg-accent text-on-primary shadow-brand-strong [&>svg]:h-8 [&>svg]:w-8"
        aria-hidden
      >
        {icon ?? <Shield />}
      </div>
      <h1 className="text-2xl font-bold text-sidebar-foreground">{title}</h1>
      {description != null && <p className="mt-1 text-sm text-on-dark-muted">{description}</p>}
    </div>
  );
}

export interface AuthLayoutProps {
  /** Nome do sistema, no topo do formulário (ex.: "SGDM"). */
  title: ReactNode;
  /** Linha abaixo do nome (ex.: "Sistema de Gestão Documental Municipal"). */
  description?: ReactNode;
  /** Ícone já montado do logo. Padrão: `<Shield />`. */
  icon?: ReactNode;
  /** O formulário. Os campos dentro dele já usam a variante `onDark`. */
  children: ReactNode;
  /**
   * Foto institucional do painel da direita (só a partir de `lg`). Recebe o
   * gradiente escuro por cima, para o texto ficar legível. Sem foto, o painel
   * fica no tom do menu.
   */
  image?: { src: string; alt?: string };
  /** Frase grande do painel da direita. Sem ela e sem `image`, não há painel. */
  headline?: ReactNode;
  /** Texto abaixo da frase. */
  tagline?: ReactNode;
  /** Abaixo do formulário (versão, aviso legal). */
  footer?: ReactNode;
}

/**
 * Tela de entrada dividida (`app/login/page.tsx` do SGDM): formulário sobre o
 * fundo escuro do menu à esquerda e, a partir de 1024px, painel com foto e
 * gradiente à direita. Tudo que está em `children` usa as cores `on-dark-*`.
 */
export function AuthLayout({ title, description, icon, children, image, headline, tagline, footer }: AuthLayoutProps) {
  const temPainel = image != null || headline != null;
  return (
    <div className="flex min-h-screen">
      <main
        className={cn(
          'flex w-full flex-col justify-center bg-sidebar px-8 py-12 lg:px-16 xl:px-20',
          temPainel && 'lg:w-1/2',
        )}
      >
        <div className="mx-auto w-full max-w-form">
          <Marca icon={icon} title={title} description={description} alinhar={temPainel ? 'responsivo' : 'centro'} />
          <OnDark>{children}</OnDark>
          {footer != null && <div className="mt-8 text-center text-xs text-on-dark-muted">{footer}</div>}
        </div>
      </main>

      {temPainel && (
        <div className="relative hidden overflow-hidden bg-sidebar-hover lg:flex lg:w-1/2 lg:flex-col lg:justify-end">
          {image != null && (
            <>
              <img src={image.src} alt={image.alt ?? ''} className="absolute inset-0 h-full w-full object-cover" />
              <div
                data-testid="auth-gradiente"
                className="absolute inset-0 bg-gradient-to-t from-overlay-strong/85 from-0% via-overlay-strong/30 via-60% to-overlay-strong/30"
                aria-hidden
              />
            </>
          )}
          {(headline != null || tagline != null) && (
            <div className="relative p-12 xl:p-16">
              {headline != null && (
                <h2 className="text-3xl font-bold leading-tight text-sidebar-foreground xl:text-4xl">{headline}</h2>
              )}
              {tagline != null && <p className="mt-4 max-w-form text-lg text-on-dark-label">{tagline}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export interface AuthCardProps {
  /** Título da tela (ex.: "Redefinir senha"). */
  title: ReactNode;
  description?: ReactNode;
  /** Ícone já montado do logo. Padrão: `<Shield />`. */
  icon?: ReactNode;
  /** Formulário ou mensagem (`AuthMessage`). Usa a variante `onDark`. */
  children: ReactNode;
}

/**
 * Tela escura centralizada, para os passos fora do login: redefinir senha,
 * link expirado, primeiro acesso (`app/redefinir-senha/page.tsx`).
 */
export function AuthCard({ title, description, icon, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar px-6 py-12">
      <div className="w-full max-w-form">
        <Marca icon={icon} title={title} description={description} alinhar="centro" />
        <OnDark>{children}</OnDark>
      </div>
    </main>
  );
}

export interface AuthMessageProps {
  title: ReactNode;
  description?: ReactNode;
  /** Ícone num círculo acima do título (ex.: `CheckCircle2`). */
  icon?: ComponentType<{ className?: string }>;
  /** `success` pinta o círculo de verde claro; `neutral` (padrão), de cinza. */
  tone?: 'success' | 'neutral';
  /** Botão abaixo do texto (ex.: "Voltar ao login"). */
  action?: ReactNode;
}

/** Resultado dentro do `AuthCard`: "Senha redefinida", "Link inválido". */
export function AuthMessage({ title, description, icon: Icone, tone = 'neutral', action }: AuthMessageProps) {
  return (
    <div role="status" className="text-center" data-tone={tone}>
      {Icone != null && (
        <div
          className={cn(
            'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill',
            tone === 'success' ? 'bg-on-dark-success/10 text-on-dark-success' : 'bg-sidebar-hover text-on-dark-muted',
          )}
          aria-hidden
        >
          <Icone className="h-7 w-7" />
        </div>
      )}
      <h2 className="text-lg font-bold text-sidebar-foreground">{title}</h2>
      {description != null && <p className="mt-2 text-sm text-on-dark-muted">{description}</p>}
      {action != null && <div className="mt-6">{action}</div>}
    </div>
  );
}
