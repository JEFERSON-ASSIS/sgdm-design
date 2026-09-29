import { forwardRef, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
import { InputBase, type InputProps } from './Input';

export interface SearchInputProps
  extends Omit<InputProps, 'type' | 'leftIcon' | 'rightIcon' | 'prefix' | 'suffix' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  /** Chamado com o texto a cada digitação (além do `onChange` normal). */
  onValueChange?: (value: string) => void;
  /** Chamado com o texto ao apertar Enter. */
  onSearch?: (value: string) => void;
  /**
   * Chamado ao limpar (botão "x" ou Esc). O botão só aparece com texto no
   * campo. No modo não controlado o campo se limpa sozinho.
   */
  onClear?: () => void;
  /** Nome do botão de limpar. Padrão: "Limpar busca". */
  clearLabel?: string;
}

/**
 * Campo de busca: lupa à esquerda, botão para limpar à direita, Enter busca e
 * Esc limpa. Sem `label`, o nome acessível é o `aria-label` ou "Buscar".
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    defaultValue,
    onChange,
    onValueChange,
    onSearch,
    onClear,
    onKeyDown,
    clearLabel = 'Limpar busca',
    placeholder = 'Buscar…',
    disabled,
    label,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const [interno, setInterno] = useState(defaultValue ?? '');
  const texto = value ?? interno;
  const campo = useRef<HTMLInputElement | null>(null);

  function definirRef(el: HTMLInputElement | null) {
    campo.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  }

  function aoMudar(e: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) setInterno(e.target.value);
    onChange?.(e);
    onValueChange?.(e.target.value);
  }

  function limpar() {
    if (value === undefined) setInterno('');
    onValueChange?.('');
    onClear?.();
    campo.current?.focus();
  }

  function aoTeclar(e: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(texto);
    } else if (e.key === 'Escape' && texto !== '') {
      e.preventDefault();
      limpar();
    }
  }

  return (
    <InputBase
      ref={definirRef}
      // text + searchbox (e não type="search"): evita o "x" nativo do navegador
      // ao lado do nosso botão de limpar.
      type="text"
      role="searchbox"
      enterKeyHint="search"
      autoComplete="off"
      {...rest}
      label={label}
      aria-label={label == null ? (ariaLabel ?? 'Buscar') : ariaLabel}
      placeholder={placeholder}
      disabled={disabled}
      value={texto}
      onChange={aoMudar}
      onKeyDown={aoTeclar}
      leftIcon={<Search />}
      acessorio={
        texto !== '' && !disabled ? (
          <button
            type="button"
            onClick={limpar}
            aria-label={clearLabel}
            title={clearLabel}
            className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-xs p-0.5 text-subtle transition hover:text-body"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : undefined
      }
    />
  );
});
