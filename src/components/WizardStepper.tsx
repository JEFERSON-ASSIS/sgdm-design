import { Check } from 'lucide-react';
import { cn } from '../cn';

export interface WizardStep {
  title: string;
  description?: string;
}

export interface WizardStepperProps {
  steps: WizardStep[];
  /** Passo atual, começando em 1. */
  current: number;
  /** Nome do indicador para leitores de tela. */
  label?: string;
}

export function WizardStepper({ steps, current, label = 'Progresso' }: WizardStepperProps) {
  return (
    <nav aria-label={label} className="card p-6">
      <ol className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const done = stepNum < current;
          const active = stepNum === current;

          return (
            <li
              key={step.title}
              aria-current={active ? 'step' : undefined}
              data-state={done ? 'done' : active ? 'active' : 'pending'}
              className={cn(
                'relative flex flex-1 flex-col items-center text-center',
                index < steps.length - 1 &&
                  "after:absolute after:left-[calc(50%+20px)] after:top-5 after:h-0.5 after:w-[calc(100%-40px)] after:content-['']",
                index < steps.length - 1 && (done ? 'after:bg-accent' : 'after:bg-border'),
              )}
            >
              <div
                className={cn(
                  'relative z-10 flex h-10 w-10 items-center justify-center rounded-pill border-2 text-sm font-bold transition-all',
                  done && 'border-accent bg-accent text-on-primary',
                  active && 'border-accent bg-surface text-accent shadow-step',
                  !done && !active && 'border-border bg-surface text-subtle',
                )}
              >
                {done ? <Check className="h-5 w-5" aria-label="concluído" /> : stepNum}
              </div>
              <p
                className={cn(
                  'mt-2 text-sm font-semibold',
                  active ? 'text-accent-text' : done ? 'text-label' : 'text-subtle',
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="mt-0.5 hidden text-xs text-subtle sm:block">{step.description}</p>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
