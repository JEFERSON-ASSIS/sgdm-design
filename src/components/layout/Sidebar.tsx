import type { ComponentType, ElementType, ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { cn } from '../../cn';
import { useSidebar } from './AppLayout';

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Força o estado ativo (senão é calculado por `currentPath`). */
  active?: boolean;
  /** Só fica ativo com o caminho exato (não em subpáginas). */
  exact?: boolean;
}

export interface NavSection {
  /** Rótulo da seção ("Principal", "Cadastros"). Some com o menu recolhido. */
  label?: string;
  items: NavItem[];
}

export interface SidebarBrand {
  name: string;
  subtitle?: string;
  /** Ícone já montado, dentro do quadrado do logotipo. */
  icon?: ReactNode;
}

export interface SidebarProps {
  brand: SidebarBrand;
  sections: NavSection[];
  /** Caminho atual (ex.: `usePathname()` do Next), para marcar o item ativo. */
  currentPath?: string;
  /** Componente de link do roteador (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
  /** Chamado ao clicar num item — ex.: ligar a barra de carregamento. */
  onNavigate?: (href: string) => void;
  /** Com `onLogout`, aparece o botão "Sair" no rodapé. */
  onLogout?: () => void;
  logoutLabel?: string;
  /** Conteúdo extra no rodapé, acima do "Sair". */
  footer?: ReactNode;
  /** Nome do menu para leitores de tela. */
  label?: string;
  /** Sobrescrevem o estado vindo do AppLayout. */
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function isNavItemActive(item: NavItem, currentPath: string | undefined): boolean {
  if (item.active !== undefined) return item.active;
  if (currentPath == null) return false;
  if (currentPath === item.href) return true;
  if (item.exact || item.href === '/') return false;
  return currentPath.startsWith(`${item.href.replace(/\/$/, '')}/`);
}

export function Sidebar({
  brand,
  sections,
  currentPath,
  linkComponent: LinkTag = 'a',
  onNavigate,
  onLogout,
  logoutLabel = 'Sair',
  footer,
  label = 'Menu principal',
  collapsed: collapsedProp,
  mobileOpen: mobileOpenProp,
  onMobileOpenChange,
}: SidebarProps) {
  const ctx = useSidebar();
  const collapsed = collapsedProp ?? ctx?.collapsed ?? false;
  const mobileOpen = mobileOpenProp ?? ctx?.mobileOpen ?? false;
  const setMobileOpen = (v: boolean) => {
    onMobileOpenChange?.(v);
    ctx?.setMobileOpen(v);
  };

  // O mesmo conteúdo serve ao menu fixo (desktop) e à gaveta (celular). A gaveta
  // nunca aparece recolhida.
  const conteudo = (recolhido: boolean) => (
    <>
      <div
        className={cn(
          'flex items-center gap-3 border-b border-sidebar-border/60 px-4 py-5',
          recolhido && 'justify-center px-2',
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile bg-sidebar-active text-sidebar-foreground shadow-brand [&>svg]:h-5 [&>svg]:w-5">
          {brand.icon ?? <span className="text-sm font-bold">{brand.name.slice(0, 1)}</span>}
        </div>
        {!recolhido && (
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight">{brand.name}</p>
            {brand.subtitle && <p className="truncate text-[11px] text-sidebar-muted">{brand.subtitle}</p>}
          </div>
        )}
      </div>

      <nav aria-label={label} className="scrollbar-none flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sections.map((secao, i) => (
          <div key={secao.label ?? i} className="space-y-1">
            {secao.label && !recolhido && (
              <p className={cn('section-label', i > 0 && 'mt-4')}>{secao.label}</p>
            )}
            {i > 0 && (recolhido || !secao.label) && (
              <div className="my-2 border-t border-sidebar-border/60" role="separator" />
            )}
            {secao.items.map((item) => {
              const ativo = isNavItemActive(item, currentPath);
              const Icone = item.icon;
              return (
                <LinkTag
                  key={item.href}
                  href={item.href}
                  title={recolhido ? item.label : undefined}
                  aria-current={ativo ? 'page' : undefined}
                  onClick={() => {
                    onNavigate?.(item.href);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    'nav-item focus-ring',
                    ativo ? 'nav-item-active' : 'nav-item-inactive',
                    recolhido && 'justify-center px-2',
                  )}
                >
                  <Icone className="h-[18px] w-[18px] shrink-0" aria-hidden />
                  {recolhido ? <span className="sr-only">{item.label}</span> : <span>{item.label}</span>}
                </LinkTag>
              );
            })}
          </div>
        ))}
      </nav>

      {(footer != null || onLogout) && (
        <div className="space-y-1 border-t border-sidebar-border/60 p-3">
          {footer}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title={recolhido ? logoutLabel : undefined}
              className={cn('nav-item nav-item-inactive focus-ring w-full', recolhido && 'justify-center px-2')}
            >
              <LogOut className="h-[18px] w-[18px]" aria-hidden />
              {recolhido ? <span className="sr-only">{logoutLabel}</span> : <span>{logoutLabel}</span>}
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        data-collapsed={collapsed}
        className={cn(
          'hidden h-full shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out lg:flex',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {conteudo(collapsed)}
      </aside>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-[transform,visibility] lg:hidden',
          // invisible tira a gaveta fechada da ordem do Tab e dos leitores de tela.
          mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        {conteudo(false)}
      </aside>
    </>
  );
}
