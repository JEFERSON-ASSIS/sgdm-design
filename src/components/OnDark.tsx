import { createContext, useContext, type ReactNode } from 'react';

const OnDarkContext = createContext(false);

/**
 * O conteúdo está sobre fundo escuro (a tela de login)? Um `onDark` explícito
 * vence o contexto. Campos, rótulos, erros e links leem isto para trocar as
 * cores de texto pelas `on-dark-*`.
 */
export function useOnDark(explicito?: boolean): boolean {
  const doContexto = useContext(OnDarkContext);
  return explicito ?? doContexto;
}

export interface OnDarkProps {
  /** Padrão `true`. Use `false` para voltar ao fundo claro (Card, Modal e Popover já fazem isso). */
  value?: boolean;
  children: ReactNode;
}

/**
 * Marca uma área de fundo escuro: os componentes de formulário dentro dela
 * usam a variante `onDark`. `AuthLayout` e `AuthCard` já a aplicam.
 */
export function OnDark({ value = true, children }: OnDarkProps) {
  return <OnDarkContext.Provider value={value}>{children}</OnDarkContext.Provider>;
}
