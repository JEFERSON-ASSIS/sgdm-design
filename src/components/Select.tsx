import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../cn';
import { FormField, useCampoAria } from './FormField';
import type { CampoProps } from './Input';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'style' | 'required' | 'size'>,
    CampoProps {
  /** Opções declarativas. Também aceita `<option>` como filhos. */
  options?: SelectOption[];
  /** Primeira opção, vazia (ex.: "Selecione…"). */
  placeholder?: string;
  /**
   * `md` (padrão): campo de formulário. `compact`: 12px e mais baixo, com seta
   * própria, para barras de cabeçalho (o seletor de prefeitura do SGDM).
   * Um número continua sendo o `size` nativo (linhas visíveis), como na v1.
   */
  size?: 'md' | 'compact' | number;
  /** Ícone já montado, à esquerda do campo (ex.: `<Building2 />`). */
  icon?: ReactNode;
}

const SelectControle = forwardRef<HTMLSelectElement, Omit<SelectProps, 'label' | 'hint' | 'error'>>(
  function SelectControle(
    {
      id,
      invalid,
      required,
      options,
      placeholder,
      children,
      size = 'md',
      icon,
      'aria-describedby': describedBy,
      ...rest
    },
    ref,
  ) {
    const { erro, ...aria } = useCampoAria(id, invalid, describedBy, required);
    const compacto = size === 'compact';
    const nativo = typeof size === 'number' ? size : undefined;
    const campo = (
      <select
        ref={ref}
        data-size={nativo === undefined ? size : undefined}
        size={nativo}
        className={cn(
          'input',
          compacto && 'w-auto max-w-full cursor-pointer appearance-none py-1.5 pl-2.5 pr-8 text-xs font-medium text-label',
          erro && 'input-error',
        )}
        {...aria}
        {...rest}
      >
        {placeholder != null && <option value="">{placeholder}</option>}
        {options?.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
    );

    if (!compacto && icon == null) return campo;

    return (
      <div className={cn('flex min-w-0 items-center gap-2', !compacto && 'w-full')}>
        {icon != null && (
          <span className="inline-flex shrink-0 text-subtle [&>svg]:h-4 [&>svg]:w-4" aria-hidden>
            {icon}
          </span>
        )}
        <div className={cn('relative min-w-0', !compacto && 'flex-1')}>
          {campo}
          {compacto && (
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle"
            />
          )}
        </div>
      </div>
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, onDark, ...rest },
  ref,
) {
  const invalid = rest.invalid ?? (error != null && error !== '' ? true : undefined);
  if (label == null) {
    return <SelectControle ref={ref} {...rest} invalid={invalid} />;
  }
  return (
    <FormField label={label} hint={hint} error={error} required={rest.required} htmlFor={rest.id} onDark={onDark}>
      <SelectControle ref={ref} {...rest} invalid={invalid} />
    </FormField>
  );
});
