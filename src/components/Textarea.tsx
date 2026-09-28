import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../cn';
import { FormField, useCampoAria } from './FormField';
import type { CampoProps } from './Input';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style' | 'required'>,
    CampoProps {}

const TextareaControle = forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaProps, 'label' | 'hint' | 'error'>
>(function TextareaControle({ id, invalid, required, 'aria-describedby': describedBy, ...rest }, ref) {
  const { erro, ...aria } = useCampoAria(id, invalid, describedBy, required);
  return (
    <textarea
      ref={ref}
      className={cn('input min-h-[100px] resize-y', erro && 'input-error')}
      {...aria}
      {...rest}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, ...rest },
  ref,
) {
  const invalid = rest.invalid ?? (error != null && error !== '' ? true : undefined);
  if (label == null) {
    return <TextareaControle ref={ref} {...rest} invalid={invalid} />;
  }
  return (
    <FormField label={label} hint={hint} error={error} required={rest.required} htmlFor={rest.id}>
      <TextareaControle ref={ref} {...rest} invalid={invalid} />
    </FormField>
  );
});
