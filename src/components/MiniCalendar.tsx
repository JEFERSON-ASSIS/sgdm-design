import { useId, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../cn';
import { IconButton } from './IconButton';

/** Dias da semana, de domingo a sábado: [abreviado, por extenso]. */
export const WEEKDAYS_PT: readonly (readonly [string, string])[] = [
  ['Dom', 'Domingo'],
  ['Seg', 'Segunda-feira'],
  ['Ter', 'Terça-feira'],
  ['Qua', 'Quarta-feira'],
  ['Qui', 'Quinta-feira'],
  ['Sex', 'Sexta-feira'],
  ['Sáb', 'Sábado'],
];

export const MONTHS_PT: readonly string[] = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export interface MiniCalendarProps {
  /** Título do card. Padrão: "Calendário". */
  title?: ReactNode;
  /** Mês exibido (qualquer dia dele), para controlar de fora. */
  month?: Date;
  /** Mês inicial sem controle de fora. Padrão: o mês de `today`. */
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** O dia de hoje, destacado. Padrão: a data do navegador. */
  today?: Date;
  /** Torna os dias clicáveis. */
  onDayClick?: (day: Date) => void;
  prevLabel?: string;
  nextLabel?: string;
}

const mesmoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Semanas do mês: linhas de 7 dias, com `null` antes do dia 1 e depois do último. */
export function monthWeeks(year: number, month: number): (number | null)[][] {
  const primeiro = new Date(year, month, 1).getDay();
  const dias = new Date(year, month + 1, 0).getDate();
  const celulas: (number | null)[] = [
    ...Array<null>(primeiro).fill(null),
    ...Array.from({ length: dias }, (_, i) => i + 1),
  ];
  while (celulas.length % 7 !== 0) celulas.push(null);
  const semanas: (number | null)[][] = [];
  for (let i = 0; i < celulas.length; i += 7) semanas.push(celulas.slice(i, i + 7));
  return semanas;
}

/**
 * Calendário de mês do painel (`CalendarWidget` do SGDM): setas para trocar de
 * mês e o dia de hoje destacado. É uma tabela (dias da semana nas colunas),
 * com o hoje marcado por `aria-current="date"`.
 */
export function MiniCalendar({
  title = 'Calendário',
  month,
  defaultMonth,
  onMonthChange,
  today: hojeProp,
  onDayClick,
  prevLabel = 'Mês anterior',
  nextLabel = 'Próximo mês',
}: MiniCalendarProps) {
  const hoje = hojeProp ?? new Date();
  const [interno, setInterno] = useState(() => {
    const base = defaultMonth ?? hoje;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const atual = month ?? interno;
  const ano = atual.getFullYear();
  const mes = atual.getMonth();
  const idTitulo = useId();
  const nomeMes = `${MONTHS_PT[mes]} de ${ano}`;

  function mudar(delta: number) {
    const novo = new Date(ano, mes + delta, 1);
    if (month == null) setInterno(novo);
    onMonthChange?.(novo);
  }

  return (
    <section aria-labelledby={idTitulo} className="card">
      <div className="card-header flex items-center justify-between gap-2">
        <h2 id={idTitulo} className="font-semibold text-title">
          {title}
        </h2>
        <div className="flex items-center gap-1">
          <IconButton icon={<ChevronLeft />} aria-label={prevLabel} size="xs" onClick={() => mudar(-1)} />
          <span className="min-w-28 text-center text-sm font-medium text-title" aria-live="polite">
            {MONTHS_PT[mes]} / {ano}
          </span>
          <IconButton icon={<ChevronRight />} aria-label={nextLabel} size="xs" onClick={() => mudar(1)} />
        </div>
      </div>
      <div className="card-body pt-2">
        <table className="w-full table-fixed border-separate border-spacing-1 text-center">
          <caption className="sr-only">{nomeMes}</caption>
          <thead>
            <tr>
              {WEEKDAYS_PT.map(([curto, longo]) => (
                <th key={curto} scope="col" className="py-1 text-2xs font-semibold text-subtle">
                  <span aria-hidden>{curto}</span>
                  <span className="sr-only">{longo}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthWeeks(ano, mes).map((semana, i) => (
              <tr key={i}>
                {semana.map((dia, j) => {
                  if (dia == null) return <td key={j} />;
                  const data = new Date(ano, mes, dia);
                  const ehHoje = mesmoDia(data, hoje);
                  const classe = cn(
                    'flex h-8 w-full items-center justify-center rounded-control text-xs',
                    ehHoje ? 'bg-accent font-bold text-on-primary' : 'text-body hover:bg-surface-muted',
                  );
                  return (
                    <td key={j} className="p-0">
                      {onDayClick != null ? (
                        <button
                          type="button"
                          className={cn(classe, 'focus-ring transition')}
                          aria-current={ehHoje ? 'date' : undefined}
                          aria-label={`${dia} de ${MONTHS_PT[mes]}`}
                          onClick={() => onDayClick(data)}
                        >
                          {dia}
                        </button>
                      ) : (
                        <span className={classe} aria-current={ehHoje ? 'date' : undefined}>
                          {dia}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
