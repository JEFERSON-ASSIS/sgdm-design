/**
 * Padrões de gráfico para o recharts, SEM importar o recharts.
 *
 * O recharts é peer dependency opcional: o pacote não o importa em lugar
 * nenhum (um teste garante). Estes helpers só montam objetos de props que a
 * tela espalha nos componentes dela:
 *
 *   const c = chartProps();
 *   <CartesianGrid {...c.grid} horizontal={false} />
 *   <XAxis type="number" {...c.axis} />
 *   <Bar dataKey="total" {...c.barHorizontal} />
 *   <Pie data={d} dataKey="value" {...c.pie}>…</Pie>
 *
 * O recharts escreve a cor num atributo SVG (fill/stroke), onde var() não
 * funciona. Por isso as cores saem em hex (iguais aos tokens) ou lidas dos
 * tokens em tempo de execução por `getChartTheme()`, que respeita um sistema
 * que sobrescreveu as variáveis.
 */
import {
  CHART_BAR_COLOR,
  CHART_COLORS,
  CHART_EXTRA_COLOR,
  CHART_FALLBACK_COLOR,
  CHART_GRID_COLOR,
} from './status';

/** Cor do texto dos eixos (= --sd-color-text-muted). */
export const CHART_AXIS_COLOR = '#64748B';
/** Fundo do cursor do tooltip em barras (= --sd-color-surface-muted). */
export const CHART_CURSOR_COLOR = '#F1F5F9';

/** As 13 cores de série em hex, na ordem de --sd-color-chart-1..13. */
export const CHART_SERIES_COLORS: readonly string[] = [...Object.values(CHART_COLORS), CHART_EXTRA_COLOR];

/** Cor de um status no mapa (padrão: CHART_COLORS do SGDM), ou a cinza de reserva. */
export function chartColor(key: string, map: Record<string, string> = CHART_COLORS): string {
  return map[key] ?? CHART_FALLBACK_COLOR;
}

/** Cor da n-ésima série sem status (volta ao início depois da 13ª). */
export function chartSeriesColor(index: number, colors: readonly string[] = CHART_SERIES_COLORS): string {
  const n = colors.length;
  return colors[((index % n) + n) % n] ?? CHART_FALLBACK_COLOR;
}

/**
 * Lê uma cor `--sd-color-<nome>` do CSS carregado, como `rgb(r g b)`. No
 * servidor, ou sem o tokens.css, devolve o `fallback`.
 */
export function readColorToken(name: string, fallback: string, element?: Element): string {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return fallback;
  const alvo = element ?? document.documentElement;
  const valor = window.getComputedStyle(alvo).getPropertyValue(`--sd-color-${name}`).trim();
  return /^\d+\s+\d+\s+\d+$/.test(valor) ? `rgb(${valor})` : fallback;
}

export interface ChartTheme {
  /** As 13 cores de série. */
  series: string[];
  fallback: string;
  grid: string;
  bar: string;
  axis: string;
  cursor: string;
}

/** Cores de gráfico em hex, sem ler o CSS (o mesmo valor dos tokens do SGDM). */
export const CHART_THEME: ChartTheme = {
  series: [...CHART_SERIES_COLORS],
  fallback: CHART_FALLBACK_COLOR,
  grid: CHART_GRID_COLOR,
  bar: CHART_BAR_COLOR,
  axis: CHART_AXIS_COLOR,
  cursor: CHART_CURSOR_COLOR,
};

/**
 * Cores de gráfico lidas dos tokens em tempo de execução. Use num efeito ou
 * `useMemo` de cliente se o sistema troca as cores; no servidor dá `CHART_THEME`.
 */
export function getChartTheme(element?: Element): ChartTheme {
  const ler = (nome: string, reserva: string) => readColorToken(nome, reserva, element);
  return {
    series: CHART_SERIES_COLORS.map((hex, i) => ler(`chart-${i + 1}`, hex)),
    fallback: ler('chart-fallback', CHART_FALLBACK_COLOR),
    grid: ler('chart-grid', CHART_GRID_COLOR),
    bar: ler('chart-bar', CHART_BAR_COLOR),
    axis: ler('text-muted', CHART_AXIS_COLOR),
    cursor: ler('surface-muted', CHART_CURSOR_COLOR),
  };
}

/** Props prontas para os componentes do recharts, com as cores do tema. */
export function chartProps(theme: ChartTheme = CHART_THEME) {
  return {
    /** `<CartesianGrid {...grid} />`: tracejada, na cor da borda. */
    grid: { stroke: theme.grid, strokeDasharray: '3 3' },
    /** `<XAxis {...axis} />` e `<YAxis {...axis} />`: texto de 11px em cinza, sem tracinhos. */
    axis: {
      tick: { fontSize: 11, fill: theme.axis },
      stroke: theme.grid,
      tickLine: false,
    },
    /** `<Bar {...barHorizontal} />` com `layout="vertical"`: cantos arredondados à direita. */
    barHorizontal: { fill: theme.bar, radius: [0, 4, 4, 0] as [number, number, number, number] },
    /** `<Bar {...bar} />` em colunas: cantos arredondados em cima. */
    bar: { fill: theme.bar, radius: [4, 4, 0, 0] as [number, number, number, number] },
    /** `<Pie {...pie} />`: a rosca do "Documentos por status". */
    pie: {
      cx: '50%',
      cy: '50%',
      innerRadius: 55,
      outerRadius: 85,
      paddingAngle: 2,
      strokeWidth: 0,
    },
    /** `<Tooltip {...tooltip} />`: caixa branca com borda e raio do pacote. */
    tooltip: {
      cursor: { fill: theme.cursor },
      contentStyle: {
        borderRadius: 8,
        border: `1px solid ${theme.grid}`,
        fontSize: 12,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
  };
}

export interface ChartDatum {
  key: string;
  label: string;
  value: number;
  /** Percentual inteiro do total. */
  pct: number;
  color: string;
}

/**
 * Transforma uma contagem por chave (`{ EM_ANALISE: 4, … }`) nos dados da
 * rosca e da legenda: tira os zeros, põe rótulo, cor e percentual.
 */
export function toChartData(
  counts: Record<string, number>,
  options: { labels?: Record<string, string>; colors?: Record<string, string>; total?: number } = {},
): ChartDatum[] {
  const entradas = Object.entries(counts).filter(([, v]) => v > 0);
  const total = options.total ?? entradas.reduce((s, [, v]) => s + v, 0);
  return entradas.map(([key, value]) => ({
    key,
    label: options.labels?.[key] ?? key,
    value,
    pct: total > 0 ? Math.round((value / total) * 100) : 0,
    color: chartColor(key, options.colors),
  }));
}
