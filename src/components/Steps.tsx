import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../cn';

export type StepStatus = 'done' | 'current' | 'pending';

export interface NumberedStep {
  title: ReactNode;
  /** Explicação curta abaixo do título. */
  description?: ReactNode;
  /** Ações ou conteúdo do passo (botão "Baixar", link, aviso). */
  content?: ReactNode;
  /** `done` troca o número pelo visto verde. Padrão: sem marcação. */
  status?: StepStatus;
}

export interface NumberedStepsProps {
  steps: NumberedStep[];
  /** Número do primeiro passo. Padrão: 1. */
  start?: number;
  /** Nome da lista para leitores de tela. */
  label?: string;
}

/**
 * Instruções numeradas em que cada passo pode trazer a própria ação — o
 * "1. Baixe o PDF · 2. Assine · 3. Carregue o assinado" da assinatura.
 */
export function NumberedSteps({ steps, start = 1, label }: NumberedStepsProps) {
  return (
    <ol aria-label={label} start={start} className="space-y-3">
      {steps.map((passo, i) => {
        const feito = passo.status === 'done';
        const atual = passo.status === 'current';
        return (
          <li
            key={i}
            data-status={passo.status}
            aria-current={atual ? 'step' : undefined}
            className="flex gap-3"
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-pill text-xs font-semibold',
                feito
                  ? 'bg-success-tint text-success-hover'
                  : atual
                    ? 'bg-accent text-on-primary'
                    : 'bg-surface-muted text-label',
              )}
              aria-hidden
            >
              {feito ? <Check className="h-3.5 w-3.5" /> : start + i}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-title">
                {passo.title}
                {feito && <span className="sr-only"> (concluído)</span>}
              </p>
              {passo.description != null && <div className="mt-0.5 text-xs text-muted">{passo.description}</div>}
              {passo.content != null && <div className="mt-2">{passo.content}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export interface ProcessStep {
  label: ReactNode;
  /** Situação do passo. Sem ela, vale o `current` do ProcessStepper. */
  status?: StepStatus;
}

export interface ProcessStepperProps {
  steps: ProcessStep[];
  /**
   * Passo atual, começando em 1: os anteriores ficam concluídos e os
   * seguintes pendentes. Um `status` no passo vence esta regra.
   */
  current?: number;
  /** Título do quadro. Padrão: "Onde você está no processo". */
  title?: ReactNode;
  /** Marca ao lado do passo atual. Padrão: "← etapa atual". `null` tira. */
  currentHint?: ReactNode;
  /** Texto lido pelo leitor de tela nos passos concluídos. */
  doneLabel?: string;
}

/**
 * Trilha vertical compacta do processo — o quadro "Onde você está no
 * processo" do editor de documento: concluídos em verde, atual em azul.
 */
export function ProcessStepper({
  steps,
  current = 0,
  title = 'Onde você está no processo',
  currentHint = '← etapa atual',
  doneLabel = 'concluído',
}: ProcessStepperProps) {
  return (
    <div className="rounded-control border border-border-subtle bg-surface-hover p-3 text-xs text-body">
      {title != null && <p className="font-semibold text-label">{title}</p>}
      <ol className={cn('space-y-1.5', title != null && 'mt-2')}>
        {steps.map((passo, i) => {
          const n = i + 1;
          const status: StepStatus = passo.status ?? (n < current ? 'done' : n === current ? 'current' : 'pending');
          const ativo = status === 'current';
          const feito = status === 'done';
          return (
            <li
              key={i}
              data-status={status}
              aria-current={ativo ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2',
                ativo && 'font-semibold text-accent-text',
                feito && 'text-success-hover',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-pill text-2xs font-bold',
                  ativo && 'bg-accent text-on-primary',
                  feito && 'bg-success-tint text-success-hover',
                  status === 'pending' && 'bg-border text-muted',
                )}
                aria-hidden
              >
                {feito ? <Check className="h-3 w-3" /> : n}
              </span>
              <span>
                {passo.label}
                {feito && <span className="sr-only"> ({doneLabel})</span>}
                {ativo && currentHint != null && <span> {currentHint}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
