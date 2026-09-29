import { createContext, useContext, useId, type ReactNode } from 'react';
import { cn } from '../cn';
import { OnDark, useOnDark } from './OnDark';

interface FormFieldContextValue {
  id: string;
  hintId: string;
  errorId: string;
  hasHint: boolean;
  hasError: boolean;
  required: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * Ligação entre o rótulo do FormField e o campo dentro dele. Input, Textarea e
 * Select usam isto para herdar `id`, `aria-invalid` e `aria-describedby`.
 */
export function useFormField(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}

export interface FormFieldProps {
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  /** id do campo. Sem ele, o FormField gera um e o repassa ao campo. */
  htmlFor?: string;
  /** Mostra o rótulo só para leitores de tela. */
  hideLabel?: boolean;
  /**
   * Sobre fundo escuro (login): rótulo, dica e erro nas cores `on-dark-*`.
   * Dentro de `AuthLayout`/`AuthCard` já vem ligado.
   */
  onDark?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  required = false,
  hint,
  error,
  htmlFor,
  hideLabel,
  onDark,
  children,
}: FormFieldProps) {
  const escuro = useOnDark(onDark);
  const gerado = useId();
  const id = htmlFor ?? `sd-campo-${gerado}`;
  const hasError = error != null && error !== false && error !== '';
  const hasHint = hint != null && hint !== '' && !hasError;
  const ctx: FormFieldContextValue = {
    id,
    hintId: `${id}-dica`,
    errorId: `${id}-erro`,
    hasHint,
    hasError,
    required,
  };

  return (
    <FormFieldContext.Provider value={ctx}>
      <div className="space-y-1.5" data-on-dark={escuro || undefined}>
        <label
          htmlFor={id}
          className={cn('block text-sm font-medium', escuro ? 'text-on-dark-label' : 'text-label', hideLabel && 'sr-only')}
        >
          {label}
          {required && (
            <span className={cn('ml-0.5', escuro ? 'text-on-dark-error' : 'text-danger')} aria-hidden>
              *
            </span>
          )}
        </label>
        {children}
        {hasHint && (
          <p id={ctx.hintId} className={cn('text-xs', escuro ? 'text-on-dark-muted' : 'text-subtle')}>
            {hint}
          </p>
        )}
        {hasError && (
          <p id={ctx.errorId} className={cn('text-xs', escuro ? 'text-on-dark-error' : 'text-danger-strong')}>
            {error}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  );
}

export interface FormSectionProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <h3 className="text-base font-semibold text-title">{title}</h3>
        {description != null && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** Props de acessibilidade que um campo herda do FormField em volta. */
export function useCampoAria(
  id: string | undefined,
  invalido: boolean | undefined,
  describedBy: string | undefined,
  required: boolean | undefined,
) {
  const ctx = useFormField();
  const descricoes = [
    describedBy,
    ctx?.hasHint ? ctx.hintId : undefined,
    ctx?.hasError ? ctx.errorId : undefined,
  ].filter(Boolean);
  const erro = invalido ?? ctx?.hasError ?? false;
  return {
    id: id ?? ctx?.id,
    'aria-invalid': erro || undefined,
    'aria-describedby': descricoes.length ? descricoes.join(' ') : undefined,
    // aria-required, e não required: o asterisco não deve ligar a validação
    // nativa do navegador, que o SGDM não usa.
    'aria-required': required || ctx?.required || undefined,
    erro,
  };
}
