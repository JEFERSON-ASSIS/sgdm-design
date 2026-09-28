import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '../cn';
import { FormField, useCampoAria } from './FormField';
import type { CampoProps } from './Input';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'style' | 'required'>,
    CampoProps {
  /** Opções declarativas. Também aceita `<option>` como filhos. */
  options?: SelectOption[];
  /** Primeira opção, vazia (ex.: "Selecione…"). */
  placeholder?: string;
}

const SelectControle = forwardRef<HTMLSelectElement, Omit<SelectProps, 'label' | 'hint' | 'error'>>(
  function SelectControle(
    { id, invalid, required, options, placeholder, children, 'aria-describedby': describedBy, ...rest },
    ref,
  ) {
    const { erro, ...aria } = useCampoAria(id, invalid, describedBy, required);
    return (
      <select ref={ref} className={cn('input', erro && 'input-error')} {...aria} {...rest}>
        {placeholder != null && <option value="">{placeholder}</option>}
        {options?.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, ...rest },
  ref,
) {
  const invalid = rest.invalid ?? (error != null && error !== '' ? true : undefined);
  if (label == null) {
    return <SelectControle ref={ref} {...rest} invalid={invalid} />;
  }
  return (
    <FormField label={label} hint={hint} error={error} required={rest.required} htmlFor={rest.id}>
      <SelectControle ref={ref} {...rest} invalid={invalid} />
    </FormField>
  );
});
