import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { isDesktopViewport } from '../../tokens';
import { useSidebar } from './AppLayout';

export interface HeaderUser {
  name: string;
  /** Segunda linha (cargo, secretaria, prefeitura). */
  subtitle?: string;
  /** Iniciais do avatar. Padrão: primeira letra das duas primeiras palavras. */
  initials?: string;
}

export interface HeaderProps {
  /** Título da página atual. */
  title: ReactNode;
  /**
   * Controles à direita, antes do usuário: seletor de prefeitura, sinos de
   * notificação, etc. O pacote não sabe o que são — só os posiciona.
   */
  actions?: ReactNode;
  user?: HeaderUser;
  /** Substitui o comportamento padrão do botão de menu. */
  onMenuClick?: () => void;
  menuLabel?: string;
}

function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

export function Header({ title, actions, user, onMenuClick, menuLabel = 'Alternar menu' }: HeaderProps) {
  const ctx = useSidebar();

  function alternar() {
    if (onMenuClick) return onMenuClick();
    if (!ctx) return;
    if (!isDesktopViewport()) ctx.setMobileOpen(true);
    else ctx.toggle();
  }

  return (
    <header className="flex h-header shrink-0 print:hidden items-center justify-between border-b border-border bg-surface px-page-sm lg:px-page-md">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={alternar}
          className="focus-ring rounded-control p-2 text-body transition hover:bg-surface-muted"
          aria-label={menuLabel}
          aria-expanded={ctx ? !ctx.collapsed : undefined}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <h1 className="truncate text-lg font-semibold text-title">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {actions}
        {user && (
          <div className="hidden items-center gap-2 border-l border-border pl-4 sm:flex">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-accent text-xs2 font-bold text-on-primary"
              aria-hidden
            >
              {user.initials ?? iniciais(user.name)}
            </div>
            <div className="hidden max-w-[12rem] text-right md:block">
              <p className="truncate text-xs font-semibold text-title">{user.name}</p>
              {user.subtitle && <p className="truncate text-2xs text-muted">{user.subtitle}</p>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
