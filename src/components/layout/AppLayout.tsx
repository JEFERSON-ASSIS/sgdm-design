import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { NavigationProgress } from './NavigationProgress';

export interface SidebarState {
  /** Menu recolhido (só ícones) no desktop. */
  collapsed: boolean;
  /** Menu aberto por cima da tela no celular. */
  mobileOpen: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarState | null>(null);

/** Estado do menu lateral, para Sidebar e Header conversarem sem store externa. */
export function useSidebar(): SidebarState | null {
  return useContext(SidebarContext);
}

/** Cria o estado do menu. Use fora do AppLayout só se precisar controlá-lo. */
export function useSidebarState(defaultCollapsed = false): SidebarState {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = useCallback(() => setCollapsed((v) => !v), []);
  return useMemo(
    () => ({ collapsed, mobileOpen, toggle, setCollapsed, setMobileOpen }),
    [collapsed, mobileOpen, toggle],
  );
}

export interface AppLayoutProps {
  /** Normalmente um `<Sidebar>`. */
  sidebar: ReactNode;
  /** Normalmente um `<Header>`. */
  header: ReactNode;
  children: ReactNode;
  /** Mostra a barra fina de carregamento no topo (troca de página). */
  navigating?: boolean;
  /** Menu começa recolhido no desktop. */
  defaultCollapsed?: boolean;
  /** Estado do menu vindo de fora (ex.: lembrar a preferência do usuário). */
  sidebarState?: SidebarState;
}

/** Moldura das telas logadas: menu à esquerda, cabeçalho e área de conteúdo. */
export function AppLayout({
  sidebar,
  header,
  children,
  navigating = false,
  defaultCollapsed = false,
  sidebarState,
}: AppLayoutProps) {
  const interno = useSidebarState(defaultCollapsed);
  const estado = sidebarState ?? interno;

  return (
    <SidebarContext.Provider value={estado}>
      {/* Na impressão a moldura some e o conteúdo flui por várias páginas
          (sem a altura fixa da tela nem a rolagem interna). */}
      <div className="flex h-screen overflow-hidden bg-background print:block print:h-auto print:overflow-visible print:bg-print-paper">
        <NavigationProgress active={navigating} />
        {sidebar}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:block print:overflow-visible">
          {header}
          <main className="scrollbar-none flex-1 overflow-y-auto overflow-x-hidden p-page-sm lg:p-page-md xl:p-page-lg print:overflow-visible print:p-0">
            <div className="w-full min-w-0 space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
