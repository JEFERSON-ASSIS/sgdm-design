import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
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
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'required' | 'prefix'>,
    CampoProps {
  /** Ícone já montado, dentro do campo, à esquerda (ex.: `<Search />`, `<Mail />`). */
  leftIcon?: ReactNode;
  /** Ícone já montado, dentro do campo, à direita. */
  rightIcon?: ReactNode;
  /**
   * Texto curto antes do valor, dentro do campo (ex.: `R$`). Também é lido
   * pelos leitores de tela, como descrição. Se houver `leftIcon`, ele vence.
   */
  prefix?: ReactNode;
  /** Texto curto depois do valor (ex.: `%`, `kg`). Se houver `rightIcon`, ele vence. */
  suffix?: ReactNode;
}

/** Uso interno (PasswordInput): um botão dentro do campo, à direita. */
interface InputInternoProps extends InputProps {
  acessorio?: ReactNode;
}

const ENFEITE = 'pointer-events-none absolute top-1/2 inline-flex -translate-y-1/2 text-subtle [&>svg]:h-4 [&>svg]:w-4';
const TEXTO = 'text-sm text-muted';

const InputControle = forwardRef<HTMLInputElement, Omit<InputInternoProps, 'label' | 'hint' | 'error'>>(
  function InputControle(
    {
      id,
      invalid,
      required,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      acessorio,
      'aria-describedby': describedBy,
      ...rest
    },
    ref,
  ) {
    const gerado = useId();
    const esquerda = leftIcon ?? prefix;
    const direita = acessorio ?? rightIcon ?? suffix;
    const textoEsquerda = leftIcon == null && prefix != null;
    const textoDireita = acessorio == null && rightIcon == null && suffix != null;
    const idPrefixo = textoEsquerda ? `sd-prefixo-${gerado}` : undefined;
    const idSufixo = textoDireita ? `sd-sufixo-${gerado}` : undefined;
    const descricao = [describedBy, idPrefixo, idSufixo].filter(Boolean).join(' ') || undefined;

    const { erro, ...aria } = useCampoAria(id, invalid, descricao, required);
    const campo = (
      <input
        ref={ref}
        className={cn(
          'input',
          erro && 'input-error',
          esquerda != null && 'pl-10',
          acessorio != null ? 'pr-11' : direita != null && 'pr-10',
        )}
        {...aria}
        {...rest}
      />
    );
    if (esquerda == null && direita == null) return campo;

    return (
      <div className="relative w-full">
        {campo}
        {esquerda != null && (
          <span id={idPrefixo} className={cn(ENFEITE, 'left-3', textoEsquerda && TEXTO)} aria-hidden={textoEsquerda ? undefined : true}>
            {esquerda}
          </span>
        )}
        {acessorio != null ? (
          acessorio
        ) : (
          direita != null && (
            <span id={idSufixo} className={cn(ENFEITE, 'right-3', textoDireita && TEXTO)} aria-hidden={textoDireita ? undefined : true}>
              {direita}
            </span>
          )
        )}
      </div>
    );
  },
);

/** Campo interno completo (com FormField quando há rótulo). O PasswordInput usa este. */
export const InputBase = forwardRef<HTMLInputElement, InputInternoProps>(function InputBase(
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

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return <InputBase ref={ref} {...props} />;
});
