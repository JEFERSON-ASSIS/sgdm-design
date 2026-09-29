import type { ElementType, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../cn';

export interface WizardStep {
  title: string;
  description?: string;
  /** Com `href`, o passo vira link (trilha de páginas, como a dos cadastros). */
  href?: string;
}

export type WizardStepperVariant = 'circles' | 'tiles';

export interface WizardStepperProps {
  steps: WizardStep[];
  /** Passo atual, começando em 1. */
  current: number;
  /** Nome do indicador para leitores de tela. */
  label?: string;
  /**
   * `circles` (padrão): bolinhas numeradas ligadas por uma linha — o wizard.
   * `tiles`: caixas lado a lado com número, título e resumo — a trilha
   * "Secretarias → Usuários → Setores" dos cadastros (PassosCadastro).
   */
  variant?: WizardStepperVariant;
  /**
   * Sem o card em volta, para usar dentro de outro card ou de um modal.
   * Padrão: `false` em `circles` e `true` em `tiles` (as caixas já têm borda).
   */
  bare?: boolean;
  /** Componente de link do roteador para os passos com `href` (ex.: `Link` do Next). Padrão: `<a>`. */
  linkComponent?: ElementType;
}

function estado(stepNum: number, current: number) {
  return stepNum < current ? 'done' : stepNum === current ? 'active' : 'pending';
}

/** Passos de um processo em várias telas, com o passo atual em destaque. */
export function WizardStepper({
  steps,
  current,
  label = 'Progresso',
  variant = 'circles',
  bare,
  linkComponent: LinkTag = 'a',
}: WizardStepperProps) {
  const semCard = bare ?? variant === 'tiles';

  if (variant === 'tiles') {
    return (
      <nav aria-label={label} className={cn(!semCard && 'card p-4')}>
        <ol className="flex flex-wrap items-stretch gap-2">
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const st = estado(stepNum, current);
            const active = st === 'active';
            const done = st === 'done';
            const conteudo: ReactNode = (
              <>
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-pill text-xs font-semibold',
                    active && 'bg-accent text-on-primary',
                    done && 'bg-success-tint text-success-hover',
                    st === 'pending' && 'bg-surface-muted text-muted',
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" aria-label="concluído" /> : stepNum}
                </span>
                <span className="min-w-0">
                  <span className={cn('block text-sm font-medium', active ? 'text-primary' : 'text-label')}>
                    {step.title}
                  </span>
                  {step.description && <span className="block truncate text-xs text-muted">{step.description}</span>}
                </span>
              </>
            );
            const caixa = cn(
              'flex h-full w-full items-center gap-3 rounded-control border px-3 py-2.5 transition',
              active ? 'border-primary-light/50 bg-primary-soft' : 'border-border bg-surface',
              step.href != null && !active && 'hover:border-border-strong',
              step.href != null && 'focus-ring',
            );
            return (
              <li key={step.title} data-state={st} className="flex min-w-44 flex-1">
                {step.href != null ? (
                  <LinkTag href={step.href} aria-current={active ? 'step' : undefined} className={caixa}>
                    {conteudo}
                  </LinkTag>
                ) : (
                  <div aria-current={active ? 'step' : undefined} className={caixa}>
                    {conteudo}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label={label} className={cn(!semCard && 'card p-6')}>
      <ol className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const st = estado(stepNum, current);
          const done = st === 'done';
          const active = st === 'active';
          const link = step.href != null;

          const conteudo = (
            <>
              <div
                className={cn(
                  'relative z-raised flex h-10 w-10 items-center justify-center rounded-pill border-2 text-sm font-bold transition-all',
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
                  link && 'group-hover:underline',
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="mt-0.5 hidden text-xs text-subtle sm:block">{step.description}</p>
              )}
            </>
          );

          return (
            <li
              key={step.title}
              // Com link, quem recebe o aria-current é o próprio link.
              aria-current={active && !link ? 'step' : undefined}
              data-state={st}
              className={cn(
                'relative flex flex-1 flex-col items-center text-center',
                index < steps.length - 1 &&
                  "after:absolute after:left-[calc(50%+20px)] after:top-5 after:h-0.5 after:w-[calc(100%-40px)] after:content-['']",
                index < steps.length - 1 && (done ? 'after:bg-accent' : 'after:bg-border'),
              )}
            >
              {link ? (
                <LinkTag
                  href={step.href}
                  aria-current={active ? 'step' : undefined}
                  className="focus-ring group flex flex-col items-center rounded-control"
                >
                  {conteudo}
                </LinkTag>
              ) : (
                conteudo
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
