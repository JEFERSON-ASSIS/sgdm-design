import { Fragment, useId, type ComponentType, type ElementType, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import { cn } from '../cn';
import {
  classePainel,
  montarGatilho,
  usePopoverCore,
  type PopoverAlign,
  type PopoverSide,
  type PopoverWidth,
} from './Popover';

export interface DropdownItem {
  id: string;
  label: ReactNode;
  /** Componente de ícone (ex.: `Pencil` do lucide-react). */
  icon?: ComponentType<{ className?: string }>;
  /** Linha de apoio abaixo do rótulo. */
  description?: ReactNode;
  /** Ação ao escolher. O menu fecha e o foco volta ao gatilho. */
  onSelect?: () => void;
  /** Com `href`, o item é um link. */
  href?: string;
  /** `danger` pinta o item de vermelho (excluir, remover). */
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

/** Linha divisória entre grupos de itens. */
export interface DropdownSeparator {
  id: string;
  separator: true;
}

export type DropdownEntry = DropdownItem | DropdownSeparator;

export interface DropdownProps {
  /** O botão que abre o menu (ex.: `<IconButton icon={<MoreHorizontal />} aria-label="Ações" />`). */
  trigger: ReactElement;
  items: DropdownEntry[];
  /** Nome do menu para leitores de tela. */
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Alinha pela borda direita (`end`, padrão) ou esquerda (`start`) do gatilho. */
  align?: PopoverAlign;
  side?: PopoverSide;
  /** `auto` (padrão, pelo conteúdo) ou `md` (384px). */
  width?: PopoverWidth;
  /** Componente de link do roteador para os itens com `href`. Padrão: `<a>`. */
  linkComponent?: ElementType;
}

function eSeparador(e: DropdownEntry): e is DropdownSeparator {
  return 'separator' in e;
}

/**
 * Menu de ações preso a um botão (`role="menu"`). Abre pelo clique ou pelas
 * setas; setas, Home e End andam entre os itens; Esc fecha e devolve o foco;
 * clique fora ou Tab fecham.
 */
export function Dropdown({
  trigger,
  items,
  label,
  open,
  defaultOpen,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  width = 'auto',
  linkComponent: LinkTag = 'a',
}: DropdownProps) {
  const nucleo = usePopoverCore({ open, defaultOpen, onOpenChange });
  const painelId = `sd-menu-${useId()}`;

  function itensDoMenu(): HTMLElement[] {
    return Array.from(
      nucleo.painel.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [],
    );
  }

  function aoTeclar(e: KeyboardEvent<HTMLDivElement>) {
    const lista = itensDoMenu();
    if (lista.length === 0) return;
    const i = lista.indexOf(document.activeElement as HTMLElement);
    let alvo: HTMLElement | undefined;
    if (e.key === 'ArrowDown') alvo = lista[(i + 1) % lista.length];
    else if (e.key === 'ArrowUp') alvo = lista[(i - 1 + lista.length) % lista.length];
    else if (e.key === 'Home') alvo = lista[0];
    else if (e.key === 'End') alvo = lista[lista.length - 1];
    else if (e.key === 'Tab') {
      nucleo.fechar(false);
      return;
    }
    if (!alvo) return;
    e.preventDefault();
    alvo.focus();
  }

  function escolher(item: DropdownItem) {
    if (item.disabled) return;
    item.onSelect?.();
    nucleo.fechar(true);
  }

  return (
    <div ref={nucleo.raiz} className="relative inline-block" onBlur={nucleo.aoPerderFoco}>
      <span ref={nucleo.ancora} className="inline-flex">
        {montarGatilho(trigger, nucleo, painelId, 'menu', 'first')}
      </span>
      {nucleo.aberto && (
        <div
          ref={nucleo.painel}
          id={painelId}
          role="menu"
          aria-label={label}
          aria-orientation="vertical"
          tabIndex={-1}
          onKeyDown={aoTeclar}
          className={cn(classePainel(align, side, width), 'py-1')}
        >
          {items.map((entrada) => {
            if (eSeparador(entrada)) {
              return <div key={entrada.id} role="separator" className="my-1 border-t border-border-subtle" />;
            }
            const item = entrada;
            const Icone = item.icon;
            const perigo = item.tone === 'danger';
            const classe = cn(
              'flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition outline-none',
              perigo
                ? 'text-danger-strong hover:bg-danger-soft focus:bg-danger-soft'
                : 'text-label hover:bg-surface-hover focus:bg-surface-hover',
              item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
            );
            const conteudo = (
              <>
                {Icone != null && (
                  <Icone className={cn('mt-0.5 h-4 w-4 shrink-0', perigo ? 'text-danger-strong' : 'text-subtle')} aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block">{item.label}</span>
                  {item.description != null && <span className="block text-xs text-muted">{item.description}</span>}
                </span>
              </>
            );
            const comuns = {
              role: 'menuitem',
              tabIndex: -1,
              'aria-disabled': item.disabled || undefined,
              'data-tone': item.tone ?? 'default',
              className: classe,
            };
            return (
              <Fragment key={item.id}>
                {item.href != null && !item.disabled ? (
                  <LinkTag {...comuns} href={item.href} onClick={() => escolher(item)}>
                    {conteudo}
                  </LinkTag>
                ) : (
                  <button {...comuns} type="button" onClick={() => escolher(item)}>
                    {conteudo}
                  </button>
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
