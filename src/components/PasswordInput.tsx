import { forwardRef, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { InputBase, type InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon' | 'suffix'> {
  /**
   * Segundos com a senha visível antes de voltar a ocultar sozinha (padrão
   * 10, como no CampoSenha do SGDM). `0` desliga.
   */
  autoHideSeconds?: number;
  /** Nome do botão com a senha oculta. Padrão: "Mostrar senha". */
  showLabel?: string;
  /** Nome do botão com a senha visível. Padrão: "Ocultar senha". */
  hideLabel?: string;
}

/**
 * Campo de senha com o botão de olho para mostrar/ocultar. A senha revelada
 * volta a ficar oculta sozinha, para não ficar aberta numa mesa de trabalho.
 * Encaminha a ref (funciona com o `register` do react-hook-form).
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { autoHideSeconds = 10, showLabel = 'Mostrar senha', hideLabel = 'Ocultar senha', disabled, ...rest },
  ref,
) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!visivel || autoHideSeconds <= 0) return;
    const t = setTimeout(() => setVisivel(false), autoHideSeconds * 1000);
    return () => clearTimeout(t);
  }, [visivel, autoHideSeconds]);

  const nome = visivel ? hideLabel : showLabel;
  const Icone = visivel ? EyeOff : Eye;

  return (
    <InputBase
      ref={ref}
      autoComplete="current-password"
      {...rest}
      disabled={disabled}
      type={visivel ? 'text' : 'password'}
      acessorio={
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          disabled={disabled}
          aria-label={nome}
          title={nome}
          className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-xs p-0.5 text-subtle transition hover:text-body disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icone className="h-4 w-4" aria-hidden />
        </button>
      }
    />
  );
});
