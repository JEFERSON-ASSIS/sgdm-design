import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { FormField, useCampoAria } from './FormField';

/** Props de rótulo/dica/erro comuns a Input, Textarea e Select. */
export interface CampoProps {
  /** Com rótulo, o campo já vem dentro de um FormField. */
  label?: ReactNode;
  hint?: ReactNode;
  /** Mensagem de erro. Marca o campo como inválido. */
  error?: ReactNode;
  /** Marca como inválido sem mensagem (a mensagem está em outro lugar). */
  invalid?: boolean;
  /** Mostra o asterisco no rótulo e anuncia o campo como obrigatório. */
  required?: boolean;
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'required'>,
    CampoProps {}

const InputControle = forwardRef<HTMLInputElement, Omit<InputProps, 'label' | 'hint' | 'error'>>(
  function InputControle({ id, invalid, required, 'aria-describedby': describedBy, ...rest }, ref) {
    const { erro, ...aria } = useCampoAria(id, invalid, describedBy, required);
    return <input ref={ref} className={cn('input', erro && 'input-error')} {...aria} {...rest} />;
  },
);

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, ...rest },
  ref,
) {
  const invalid = rest.invalid ?? (error != null && error !== '' ? true : undefined);
  if (label == null) {
    return <InputControle ref={ref} {...rest} invalid={invalid} />;
  }
  return (
    <FormField label={label} hint={hint} error={error} required={rest.required} htmlFor={rest.id}>
      <InputControle ref={ref} {...rest} invalid={invalid} />
    </FormField>
  );
});
