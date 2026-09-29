import { useId, type ComponentType, type ReactNode } from 'react';
import { cn } from '../cn';
import { TONE_BG_SOFT, TONE_TEXT_DEEP, TONE_TEXT_HOVER, type Tone } from './tones';

export type StickyAsideOffset = 'sm' | 'md' | 'lg';

export interface StickyAsideProps {
  children: ReactNode;
  /** Título do cabeçalho. Sem título, não há cabeçalho. */
  title?: ReactNode;
  /** Linha pequena abaixo do título (ex.: o fundamento legal). */
  description?: ReactNode;
  /** Ícone do cabeçalho. */
  icon?: ComponentType<{ className?: string }>;
  /**
   * Cor do cabeçalho (ex.: `warning` enquanto falta algo, `success` quando
   * está completo). Padrão: sem cor, fundo branco.
   */
  tone?: Tone;
  /** Distância do topo ao grudar: `sm` 16px, `md` 24px (padrão), `lg` 32px. */
  offset?: StickyAsideOffset;
  /** Espaço interno do corpo: `md` 20px (padrão) ou `none`. */
  padding?: 'md' | 'none';
  /** Nome da área para leitores de tela, se não houver título. */
  label?: string;
}

const TOPO: Record<StickyAsideOffset, string> = { sm: 'top-4', md: 'top-6', lg: 'top-8' };

/**
 * Painel lateral que acompanha a rolagem (`position: sticky`): o checklist
 * de conteúdo mínimo ao lado da redação da peça. Ponha dentro de uma coluna
 * de grade; ele gruda enquanto a coluna ao lado rola.
 */
export function StickyAside({
  children,
  title,
  description,
  icon: Icone,
  tone,
  offset = 'md',
  padding = 'md',
  label,
}: StickyAsideProps) {
  const temCabecalho = title != null;
  const idTitulo = useId();
  return (
    <aside
      aria-label={temCabecalho ? undefined : label}
      aria-labelledby={temCabecalho ? idTitulo : undefined}
      data-tone={tone}
      className={cn('card sticky overflow-hidden', TOPO[offset])}
    >
      {temCabecalho && (
        <header className={cn('px-5 py-4', tone ? TONE_BG_SOFT[tone] : 'border-b border-border-subtle')}>
          <div className="flex items-start gap-2.5">
            {Icone != null && (
              <Icone className={cn('mt-0.5 h-4 w-4 shrink-0', tone ? TONE_TEXT_HOVER[tone] : 'text-subtle')} aria-hidden />
            )}
            <div className="min-w-0">
              <h3 id={idTitulo} className={cn('text-sm font-semibold', tone ? TONE_TEXT_DEEP[tone] : 'text-title')}>{title}</h3>
              {description != null && (
                <p className={cn('mt-0.5 text-xs2', tone ? TONE_TEXT_HOVER[tone] : 'text-muted')}>{description}</p>
              )}
            </div>
          </div>
        </header>
      )}
      <div className={cn(padding === 'md' && 'p-5')}>{children}</div>
    </aside>
  );
}
