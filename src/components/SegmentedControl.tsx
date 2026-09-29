import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { classePilula } from './Tabs';
import type { Tone } from './tones';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  /** Cor da opção quando escolhida. Padrão: `primary`. */
  tone?: Tone;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  /** Opção escolhida (modo controlado). */
  value?: string;
  /** Opção inicial (modo não controlado). Padrão: a primeira. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Nome do grupo para leitores de tela (ex.: "Filtrar numerações"). */
  label: string;
  /**
   * `sm` (padrão): botões compactos num card — o filtro da tela de numerações.
   * `md`: botões maiores, como a barra de abas em pílula.
   */
  size?: 'sm' | 'md';
  /** Ocupa a largura toda do contêiner. */
  fullWidth?: boolean;
}

/**
 * Escolha de uma opção entre poucas, em botões lado a lado (filtro "Todos /
 * Pendentes / Liberados"). Não troca painel — para isso use `Tabs variant="pill"`.
 * É um grupo de rádio para o leitor de tela: setas mudam a escolha.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  label,
  size = 'sm',
  fullWidth = false,
}: SegmentedControlProps) {
  const [interno, setInterno] = useState(defaultValue ?? options.find((o) => !o.disabled)?.value);
  const atual = value ?? interno;
  const botoes = useRef<Record<string, HTMLButtonElement | null>>({});

  function escolher(v: string) {
    if (value === undefined) setInterno(v);
    onChange?.(v);
  }

  function aoTeclar(e: KeyboardEvent<HTMLDivElement>) {
    const habilitadas = options.filter((o) => !o.disabled);
    const i = habilitadas.findIndex((o) => o.value === atual);
    let proxima: SegmentedOption | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') proxima = habilitadas[(i + 1) % habilitadas.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      proxima = habilitadas[(i - 1 + habilitadas.length) % habilitadas.length];
    else if (e.key === 'Home') proxima = habilitadas[0];
    else if (e.key === 'End') proxima = habilitadas[habilitadas.length - 1];
    if (!proxima) return;
    e.preventDefault();
    escolher(proxima.value);
    botoes.current[proxima.value]?.focus();
  }

  // Sem opção escolhida, a primeira habilitada recebe o foco do Tab.
  const focavel = options.some((o) => o.value === atual && !o.disabled)
    ? atual
    : options.find((o) => !o.disabled)?.value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-size={size}
      onKeyDown={aoTeclar}
      className={cn('card flex flex-wrap gap-1 p-1', fullWidth ? 'w-full' : 'w-fit max-w-full')}
    >
      {options.map((o) => {
        const escolhida = o.value === atual;
        return (
          <button
            key={o.value}
            ref={(el) => {
              botoes.current[o.value] = el;
            }}
            type="button"
            role="radio"
            aria-checked={escolhida}
            tabIndex={o.value === focavel ? 0 : -1}
            disabled={o.disabled}
            data-tone={o.tone ?? 'primary'}
            onClick={() => escolher(o.value)}
            className={cn(classePilula(escolhida, o.tone, size === 'sm'), fullWidth && 'flex-1')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
