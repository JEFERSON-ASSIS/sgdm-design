import { useRef, useState, type ComponentType, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../cn';

export interface SelectableListItem {
  id: string;
  title: ReactNode;
  /** Linha de baixo, em cinza (ex.: "12 usuários · 30 perm."). */
  description?: ReactNode;
  /** Ícone do item. Padrão: o `icon` da lista. */
  icon?: ComponentType<{ className?: string }>;
  /** Selo à direita do título (ex.: `<Chip size="xs">Inativo</Chip>`). */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface SelectableListProps {
  items: SelectableListItem[];
  /** Item ativo (modo controlado). */
  value?: string;
  /** Item ativo inicial (modo não controlado). Padrão: o primeiro. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Nome da lista para leitores de tela (ex.: "Perfis"). */
  label: string;
  /** Ícone padrão dos itens. */
  icon?: ComponentType<{ className?: string }>;
  /** Sem o card em volta (a lista já está dentro de um card). */
  bare?: boolean;
  /** Mostrado quando não há itens. */
  empty?: ReactNode;
}

/**
 * Lista mestre de uma tela mestre/detalhe: escolher um item mostra o detalhe
 * ao lado (a lista de perfis). O item ativo leva `aria-current`, e as setas
 * para cima e para baixo andam entre os itens.
 */
export function SelectableList({
  items,
  value,
  defaultValue,
  onChange,
  label,
  icon: IconePadrao,
  bare = false,
  empty,
}: SelectableListProps) {
  const [interno, setInterno] = useState(defaultValue ?? items[0]?.id);
  const ativo = value ?? interno;
  const botoes = useRef<Record<string, HTMLButtonElement | null>>({});

  function escolher(id: string) {
    if (value === undefined) setInterno(id);
    onChange?.(id);
  }

  function aoTeclar(e: KeyboardEvent<HTMLUListElement>) {
    const habilitados = items.filter((i) => !i.disabled);
    const focado = habilitados.findIndex((i) => botoes.current[i.id] === document.activeElement);
    if (focado < 0) return;
    let proximo: SelectableListItem | undefined;
    if (e.key === 'ArrowDown') proximo = habilitados[Math.min(focado + 1, habilitados.length - 1)];
    else if (e.key === 'ArrowUp') proximo = habilitados[Math.max(focado - 1, 0)];
    else if (e.key === 'Home') proximo = habilitados[0];
    else if (e.key === 'End') proximo = habilitados[habilitados.length - 1];
    if (!proximo) return;
    e.preventDefault();
    botoes.current[proximo.id]?.focus();
  }

  if (items.length === 0) {
    return empty != null ? <p className="px-4 py-6 text-center text-sm text-subtle">{empty}</p> : null;
  }

  return (
    <ul
      aria-label={label}
      onKeyDown={aoTeclar}
      className={cn('divide-y divide-border-subtle', !bare && 'card overflow-hidden p-0')}
    >
      {items.map((item) => {
        const selecionado = item.id === ativo;
        const Icone = item.icon ?? IconePadrao;
        return (
          <li key={item.id}>
            <button
              ref={(el) => {
                botoes.current[item.id] = el;
              }}
              type="button"
              aria-current={selecionado ? 'true' : undefined}
              disabled={item.disabled}
              onClick={() => escolher(item.id)}
              className={cn(
                'flex w-full items-start gap-3 px-4 py-3 text-left transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light',
                'disabled:cursor-not-allowed disabled:opacity-50',
                selecionado ? 'bg-primary-soft' : 'hover:bg-surface-hover',
              )}
            >
              {Icone != null && (
                <Icone
                  className={cn('mt-0.5 h-4 w-4 shrink-0', selecionado ? 'text-accent-text' : 'text-subtle')}
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className={cn('block truncate text-sm font-medium', selecionado ? 'text-primary' : 'text-title')}>
                    {item.title}
                  </span>
                  {item.badge != null && <span className="shrink-0">{item.badge}</span>}
                </span>
                {item.description != null && (
                  <span className="flex items-center gap-2 text-xs text-muted">{item.description}</span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
