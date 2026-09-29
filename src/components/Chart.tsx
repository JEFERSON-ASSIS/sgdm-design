import { useId, type ReactNode } from 'react';
import { cn } from '../cn';
import { CHART_COLOR_VARS } from '../status';
import { LoadingState } from './Spinner';

export interface ChartLegendItem {
  key: string;
  label: ReactNode;
  value: number;
  /**
   * Cor da amostra, em qualquer formato CSS (ex.: `chartColor(status)`).
   * Padrão: a cor de série pela posição (`--sd-color-chart-N`).
   */
  color?: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  /** Base do percentual. Padrão: a soma dos valores. */
  total?: number;
  /** Mostra o valor absoluto (padrão: sim). */
  showValue?: boolean;
  /** Mostra o percentual (padrão: sim). */
  showPercent?: boolean;
  /** Nome da lista para leitores de tela (ex.: "Documentos por status"). */
  label?: string;
}

/**
 * Legenda do gráfico em HTML (a do "Documentos por status"): amostra de cor,
 * rótulo, valor e percentual. Não depende do recharts e é o que o leitor de
 * tela lê, já que o SVG do gráfico não diz nada.
 */
export function ChartLegend({ items, total, showValue = true, showPercent = true, label }: ChartLegendProps) {
  const soma = total ?? items.reduce((s, i) => s + i.value, 0);
  return (
    <ul role="list" aria-label={label} className="w-full space-y-2">
      {items.map((item, i) => {
        const pct = soma > 0 ? Math.round((item.value / soma) * 100) : 0;
        return (
          <li key={item.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                data-testid="amostra"
                className="h-2.5 w-2.5 shrink-0 rounded-pill"
                // A cor é dado (vem do mapa de status), por isso vai em style.
                style={{ backgroundColor: item.color ?? CHART_COLOR_VARS[i % CHART_COLOR_VARS.length] }}
                aria-hidden
              />
              <span className="truncate text-body">{item.label}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              {showValue && <span className="font-semibold tabular-nums text-title">{item.value}</span>}
              {showPercent && <span className="w-8 text-right text-xs tabular-nums text-subtle">{pct}%</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export interface ChartCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Botões ou filtros à direita do título. */
  actions?: ReactNode;
  /** O gráfico (ex.: `<ResponsiveContainer>` do recharts). Ocupa a área toda. */
  children?: ReactNode;
  /**
   * Legenda ao lado (ex.: `<ChartLegend />`). Com legenda, o gráfico fica num
   * quadrado de 208px e a legenda ao lado (embaixo no celular); sem ela, o
   * gráfico ocupa a largura toda com 256px de altura.
   */
  legend?: ReactNode;
  /** Texto no meio da rosca (ex.: `{ label: 'Total', value: 42 }`). */
  center?: { label: ReactNode; value: ReactNode };
  /** Descrição do gráfico para leitores de tela (o SVG vira uma imagem com este nome). */
  chartLabel?: string;
  /** Sem dados: mostra `emptyLabel` no lugar do gráfico. */
  empty?: boolean;
  /** Padrão: "Sem dados para o período.". */
  emptyLabel?: ReactNode;
  loading?: boolean;
}

/** Card de gráfico dos painéis e relatórios: título, ações e a área do gráfico. */
export function ChartCard({
  title,
  description,
  actions,
  children,
  legend,
  center,
  chartLabel,
  empty = false,
  emptyLabel = 'Sem dados para o período.',
  loading = false,
}: ChartCardProps) {
  const idTitulo = useId();
  const comLegenda = legend != null;

  let corpo: ReactNode;
  if (loading) corpo = <LoadingState mode="block" label="Carregando gráfico…" />;
  else if (empty) corpo = <p className="py-12 text-center text-sm text-muted">{emptyLabel}</p>;
  else {
    const area = (
      <div
        role={chartLabel ? 'img' : undefined}
        aria-label={chartLabel}
        className={cn('relative', comLegenda ? 'h-52 w-52 shrink-0' : 'h-64 w-full')}
      >
        {children}
        {center != null && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-subtle">{center.label}</span>
            <span className="text-2xl font-bold tabular-nums text-title">{center.value}</span>
          </div>
        )}
      </div>
    );
    corpo = comLegenda ? (
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        {area}
        <div className="w-full flex-1">{legend}</div>
      </div>
    ) : (
      area
    );
  }

  return (
    <section aria-labelledby={idTitulo} aria-busy={loading || undefined} className="card">
      <div className="card-header flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id={idTitulo} className="font-semibold text-title">
            {title}
          </h2>
          {description != null && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {actions != null && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="card-body">{corpo}</div>
    </section>
  );
}
