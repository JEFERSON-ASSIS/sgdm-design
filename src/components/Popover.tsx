import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../cn';
import { OnDark } from './OnDark';

export type PopoverAlign = 'start' | 'end';
export type PopoverSide = 'bottom' | 'top';
/** `auto`: pelo conteúdo (mín. 192px). `md`: a largura do dropdown (384px, token). */
export type PopoverWidth = 'auto' | 'md';

/** Elementos que podem receber foco pelo teclado. */
export const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface OpcoesNucleo {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Estado e comportamento comuns a Popover, Dropdown e NotificationBell:
 * abre/fecha (controlado ou não), fecha com clique fora, com Esc e quando o
 * foco sai, e devolve o foco ao gatilho ao fechar pelo teclado.
 */
export function usePopoverCore({ open, defaultOpen = false, onOpenChange }: OpcoesNucleo) {
  const [interno, setInterno] = useState(defaultOpen);
  const aberto = open ?? interno;
  const controlado = open !== undefined;
  const raiz = useRef<HTMLDivElement>(null);
  const ancora = useRef<HTMLSpanElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const aoMudar = useRef(onOpenChange);
  aoMudar.current = onOpenChange;
  /** Para onde vai o foco quando o painel abrir por ação do usuário. */
  const focoPendente = useRef<'first' | 'last' | 'panel' | null>(null);

  const definir = useCallback(
    (v: boolean) => {
      if (!controlado) setInterno(v);
      aoMudar.current?.(v);
    },
    [controlado],
  );

  const focarGatilho = useCallback(() => {
    ancora.current?.querySelector<HTMLElement>(FOCAVEIS)?.focus();
  }, []);

  const fechar = useCallback(
    (devolverFoco = true) => {
      definir(false);
      if (devolverFoco) focarGatilho();
    },
    [definir, focarGatilho],
  );

  useEffect(() => {
    if (!aberto) return;
    function fora(e: Event) {
      if (raiz.current && !raiz.current.contains(e.target as Node)) definir(false);
    }
    function tecla(e: globalThis.KeyboardEvent) {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      fechar(true);
    }
    document.addEventListener('mousedown', fora);
    document.addEventListener('touchstart', fora);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('mousedown', fora);
      document.removeEventListener('touchstart', fora);
      document.removeEventListener('keydown', tecla);
    };
  }, [aberto, definir, fechar]);

  // Foco inicial: só quando quem abriu foi o usuário pelo gatilho.
  useEffect(() => {
    const destino = focoPendente.current;
    if (!aberto || !destino || !painel.current) return;
    focoPendente.current = null;
    const seletor =
      painel.current.getAttribute('role') === 'menu' ? '[role="menuitem"]:not([aria-disabled="true"])' : FOCAVEIS;
    const focaveis = Array.from(painel.current.querySelectorAll<HTMLElement>(seletor));
    const alvo = destino === 'panel' ? painel.current : destino === 'last' ? focaveis[focaveis.length - 1] : focaveis[0];
    (alvo ?? painel.current).focus();
  }, [aberto]);

  /** Fecha quando o foco sai do conjunto gatilho + painel (Tab para fora). */
  function aoPerderFoco(e: FocusEvent<HTMLDivElement>) {
    const destino = e.relatedTarget as Node | null;
    if (aberto && destino && raiz.current && !raiz.current.contains(destino)) definir(false);
  }

  return { aberto, definir, fechar, raiz, ancora, painel, focoPendente, aoPerderFoco };
}

export type PopoverCore = ReturnType<typeof usePopoverCore>;

interface PropsGatilho {
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
}

/** Veste o gatilho com o clique de abrir/fechar e os atributos ARIA. */
export function montarGatilho(
  trigger: ReactElement,
  nucleo: PopoverCore,
  painelId: string,
  papel: 'dialog' | 'menu',
  focoAoClicar: 'first' | 'panel',
): ReactElement {
  const original = (trigger.props ?? {}) as PropsGatilho;
  return cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    onClick: (e: MouseEvent<HTMLElement>) => {
      original.onClick?.(e);
      if (e.defaultPrevented) return;
      if (!nucleo.aberto) nucleo.focoPendente.current = focoAoClicar;
      nucleo.definir(!nucleo.aberto);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      original.onKeyDown?.(e);
      if (e.defaultPrevented || papel !== 'menu') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        nucleo.focoPendente.current = e.key === 'ArrowUp' ? 'last' : 'first';
        nucleo.definir(true);
      }
    },
    'aria-haspopup': papel,
    'aria-expanded': nucleo.aberto,
    'aria-controls': nucleo.aberto ? painelId : undefined,
  } as Record<string, unknown>);
}

const ALINHAMENTO: Record<PopoverAlign, string> = { start: 'left-0', end: 'right-0' };
const LADO: Record<PopoverSide, string> = { bottom: 'top-full mt-2', top: 'bottom-full mb-2' };
const LARGURA: Record<PopoverWidth, string> = {
  auto: 'min-w-48',
  md: 'w-dropdown max-w-[calc(100vw-2rem)]',
};

/** Classes do painel flutuante (usadas também pelo Dropdown e pelo NotificationBell). */
export function classePainel(align: PopoverAlign, side: PopoverSide, width: PopoverWidth): string {
  return cn(
    'absolute z-dropdown overflow-hidden rounded-panel border border-border bg-surface shadow-dropdown outline-none',
    ALINHAMENTO[align],
    LADO[side],
    LARGURA[width],
  );
}

export interface PopoverProps {
  /**
   * O botão que abre o painel (ex.: `<Button>`, `<IconButton>`). Recebe o
   * clique, `aria-expanded`, `aria-haspopup` e `aria-controls`.
   */
  trigger: ReactElement;
  /** Conteúdo do painel. Como função, recebe `close` para fechar de dentro. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
  /** Aberto (modo controlado). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Alinha o painel pela borda esquerda (`start`) ou direita (`end`, padrão) do gatilho. */
  align?: PopoverAlign;
  /** Abre abaixo (`bottom`, padrão) ou acima (`top`) do gatilho. */
  side?: PopoverSide;
  /** `auto` (padrão) ou `md` (384px). */
  width?: PopoverWidth;
  /** Nome do painel para leitores de tela (ex.: "Filtros avançados"). */
  label: string;
  /**
   * Onde o foco cai ao abrir pelo gatilho: `panel` (padrão, o próprio painel;
   * Tab vai ao primeiro controle) ou `first` (o primeiro controle).
   */
  initialFocus?: 'panel' | 'first';
}

/**
 * Painel flutuante genérico (diálogo não modal) preso a um botão. Fecha com
 * clique fora, com Esc (devolvendo o foco ao botão) e quando o foco sai dele.
 */
export function Popover({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  width = 'auto',
  label,
  initialFocus = 'panel',
}: PopoverProps) {
  const nucleo = usePopoverCore({ open, defaultOpen, onOpenChange });
  const painelId = `sd-popover-${useId()}`;
  const close = () => nucleo.fechar(true);

  return (
    <div ref={nucleo.raiz} className="relative inline-block" onBlur={nucleo.aoPerderFoco}>
      <span ref={nucleo.ancora} className="inline-flex">
        {montarGatilho(trigger, nucleo, painelId, 'dialog', initialFocus)}
      </span>
      {nucleo.aberto && (
        <div
          ref={nucleo.painel}
          id={painelId}
          role="dialog"
          aria-label={label}
          tabIndex={-1}
          className={classePainel(align, side, width)}
        >
          <OnDark value={false}>{typeof children === 'function' ? children({ close }) : children}</OnDark>
        </div>
      )}
    </div>
  );
}
