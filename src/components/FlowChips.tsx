import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../cn';
import { TONE_BG_SOFT, TONE_RING_TINT, TONE_TEXT_DEEP, type Tone } from './tones';

export interface FlowChipsProps {
  /** As etapas, em ordem (ex.: `['Solicitar', 'Analisar', 'Assinar']`). */
  steps: ReactNode[];
  /** Cor das etapas. Padrão: `neutral`. */
  tone?: Tone;
  /** Nome da sequência para leitores de tela (ex.: "Fluxo PASSO"). */
  label?: string;
}

/**
 * Sequência A → B → C em etiquetas: o fluxo recomendado de um perfil. É uma
 * lista ordenada; as setas são só visuais.
 */
export function FlowChips({ steps, tone = 'neutral', label }: FlowChipsProps) {
  return (
    <ol aria-label={label} data-tone={tone} className="flex flex-wrap items-center gap-1.5">
      {steps.map((passo, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex rounded-control px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
              TONE_BG_SOFT[tone],
              TONE_TEXT_DEEP[tone],
              TONE_RING_TINT[tone],
            )}
          >
            {passo}
          </span>
          {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-border-strong" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}
