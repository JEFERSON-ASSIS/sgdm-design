import type { ReactNode } from 'react';
import { cn } from '../cn';

export type InlineCodeSize = 'inherit' | '2xs' | 'xs' | 'sm';
export type InlineCodeTone = 'inherit' | 'default' | 'muted' | 'accent' | 'success';

export interface InlineCodeProps {
  children: ReactNode;
  /** Tamanho da fonte. Padrão: `inherit` (o do texto em volta). */
  size?: InlineCodeSize;
  /** Cor do texto. Padrão: `inherit`. `accent` é o protocolo em destaque. */
  tone?: InlineCodeTone;
  /** Peso. Padrão: `normal`. O número do processo usa `semibold`. */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Fundo cinza e cantos arredondados, para destacar o código dentro de um parágrafo. */
  boxed?: boolean;
  /** Quebra em qualquer ponto: para hash e códigos longos sem espaço. */
  breakAll?: boolean;
}

const TAMANHO: Record<InlineCodeSize, string | undefined> = {
  inherit: undefined,
  '2xs': 'text-2xs',
  xs: 'text-xs',
  sm: 'text-sm',
};

const COR: Record<InlineCodeTone, string | undefined> = {
  inherit: undefined,
  default: 'text-title',
  muted: 'text-muted',
  accent: 'text-accent-text',
  success: 'text-success-strong',
};

const PESO = {
  normal: undefined,
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

function classes({ size = 'inherit', tone = 'inherit', weight = 'normal', boxed = false, breakAll = false }: Omit<InlineCodeProps, 'children'>) {
  return cn(
    'font-mono',
    TAMANHO[size],
    COR[tone],
    PESO[weight],
    boxed && 'rounded-xs bg-surface-muted px-1.5 py-0.5',
    breakAll && 'break-all',
  );
}

/** Código em linha (`<code>`): permissão, código de validação, hash. */
export function InlineCode({ children, ...rest }: InlineCodeProps) {
  return <code className={classes(rest)}>{children}</code>;
}

/**
 * Texto em fonte mono que não é código (`<span>`): protocolo, número do
 * processo, CPF. Mesmas props do InlineCode.
 */
export function Mono({ children, ...rest }: InlineCodeProps) {
  return <span className={classes(rest)}>{children}</span>;
}

export type MonoProps = InlineCodeProps;
