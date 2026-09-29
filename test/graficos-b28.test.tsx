import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CHART_BAR_COLOR,
  CHART_FALLBACK_COLOR,
  CHART_GRID_COLOR,
  CHART_SERIES_COLORS,
  CHART_THEME,
  ChartCard,
  ChartLegend,
  STATUS_LABELS,
  chartColor,
  chartProps,
  chartSeriesColor,
  getChartTheme,
  readColorToken,
  toChartData,
} from '../src';

const raiz = join(__dirname, '..');

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });
}

describe('B28. recharts é opcional', () => {
  it('nenhum arquivo do pacote importa o recharts', () => {
    for (const arquivo of arquivos(join(raiz, 'src'))) {
      const fonte = readFileSync(arquivo, 'utf8');
      expect(fonte, arquivo).not.toMatch(/(?:from\s+|require\(|import\()\s*['"]recharts/);
    }
  });

  it('é peer dependency opcional, e não dependência nem devDependency', () => {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
    expect(pkg.peerDependencies.recharts).toBeDefined();
    expect(pkg.peerDependenciesMeta.recharts.optional).toBe(true);
    expect(pkg.dependencies.recharts).toBeUndefined();
    expect(pkg.devDependencies.recharts).toBeUndefined();
  });
});

describe('B28. helpers de configuração', () => {
  afterEach(() => document.documentElement.style.removeProperty('--sd-color-chart-grid'));

  it('cor por status, com a cinza de reserva, e cor por série', () => {
    expect(chartColor('EM_ANALISE')).toBe('#6366F1');
    expect(chartColor('NAO_EXISTE')).toBe(CHART_FALLBACK_COLOR);
    expect(chartColor('PAGO', { PAGO: '#000000' })).toBe('#000000');
    expect(CHART_SERIES_COLORS).toHaveLength(13);
    expect(chartSeriesColor(12)).toBe('#0EA5E9');
    expect(chartSeriesColor(13)).toBe(CHART_SERIES_COLORS[0]);
    expect(chartSeriesColor(-1)).toBe('#0EA5E9');
  });

  it('props prontas: grade, eixo, barra, rosca e tooltip', () => {
    const c = chartProps();
    expect(c.grid).toEqual({ stroke: CHART_GRID_COLOR, strokeDasharray: '3 3' });
    expect(c.axis.tick).toEqual({ fontSize: 11, fill: '#64748B' });
    expect(c.axis.tickLine).toBe(false);
    expect(c.barHorizontal).toEqual({ fill: CHART_BAR_COLOR, radius: [0, 4, 4, 0] });
    expect(c.bar.radius).toEqual([4, 4, 0, 0]);
    expect(c.pie).toMatchObject({ innerRadius: 55, outerRadius: 85, paddingAngle: 2, strokeWidth: 0 });
    expect(c.tooltip.contentStyle.border).toContain(CHART_GRID_COLOR);
  });

  it('lê os tokens em tempo de execução, com o hex de reserva', () => {
    expect(readColorToken('chart-grid', '#ABCDEF')).toBe('#ABCDEF');
    expect(getChartTheme()).toEqual(CHART_THEME);
    document.documentElement.style.setProperty('--sd-color-chart-grid', '1 2 3');
    expect(readColorToken('chart-grid', '#ABCDEF')).toBe('rgb(1 2 3)');
    expect(getChartTheme().grid).toBe('rgb(1 2 3)');
    expect(chartProps(getChartTheme()).grid.stroke).toBe('rgb(1 2 3)');
  });

  it('toChartData tira os zeros e calcula rótulo, cor e percentual', () => {
    const dados = toChartData({ EM_ANALISE: 3, ASSINADO: 1, CANCELADO: 0 }, { labels: STATUS_LABELS });
    expect(dados).toEqual([
      { key: 'EM_ANALISE', label: STATUS_LABELS.EM_ANALISE, value: 3, pct: 75, color: '#6366F1' },
      { key: 'ASSINADO', label: STATUS_LABELS.ASSINADO, value: 1, pct: 25, color: '#22C55E' },
    ]);
    expect(toChartData({ X: 1 }, { total: 4 })[0]).toMatchObject({ label: 'X', pct: 25, color: CHART_FALLBACK_COLOR });
  });
});

describe('B28. ChartLegend', () => {
  it('amostra, rótulo, valor e percentual', () => {
    render(
      <ChartLegend
        label="Documentos por status"
        items={[
          { key: 'a', label: 'Em análise', value: 3, color: '#6366F1' },
          { key: 'b', label: 'Sem cor', value: 1 },
        ]}
      />,
    );
    const lista = screen.getByRole('list', { name: 'Documentos por status' });
    const [a, b] = within(lista).getAllByRole('listitem');
    expect(within(a!).getByText('Em análise')).toHaveClass('text-body');
    expect(within(a!).getByText('3')).toHaveClass('font-semibold', 'text-title');
    expect(within(a!).getByText('75%')).toHaveClass('w-8', 'text-right', 'text-xs', 'text-subtle');
    const [amostraA, amostraB] = screen.getAllByTestId('amostra');
    expect(amostraA).toHaveClass('h-2.5', 'w-2.5', 'rounded-pill');
    expect(amostraA!.style.backgroundColor).not.toBe('');
    // Sem cor: a da série pela posição, por token.
    expect(amostraB!.getAttribute('style')).toContain('var(--sd-color-chart-2)');
    expect(within(b!).getByText('25%')).toBeInTheDocument();
  });

  it('sem valor e sem percentual', () => {
    render(<ChartLegend items={[{ key: 'a', label: 'A', value: 2 }]} showValue={false} showPercent={false} total={10} />);
    expect(screen.queryByText('2')).toBeNull();
    expect(screen.queryByText('20%')).toBeNull();
  });
});

describe('B28. ChartCard', () => {
  it('com legenda: quadrado de 208px, texto no meio e legenda ao lado', () => {
    render(
      <ChartCard
        title="Documentos por status"
        actions={<button type="button">Exportar</button>}
        center={{ label: 'Total', value: 42 }}
        chartLabel="Rosca com 3 status"
        legend={<ChartLegend items={[{ key: 'a', label: 'A', value: 1 }]} />}
      >
        <svg data-testid="grafico" />
      </ChartCard>,
    );
    const secao = screen.getByRole('region', { name: 'Documentos por status' });
    expect(within(secao).getByRole('button', { name: 'Exportar' })).toBeInTheDocument();
    const area = within(secao).getByRole('img', { name: 'Rosca com 3 status' });
    expect(area).toHaveClass('relative', 'h-52', 'w-52', 'shrink-0');
    expect(area.parentElement).toHaveClass('flex', 'flex-col', 'items-center', 'gap-6', 'sm:flex-row');
    expect(within(area).getByText('Total')).toHaveClass('text-xs', 'text-subtle');
    expect(within(area).getByText('42')).toHaveClass('text-2xl', 'font-bold', 'text-title');
  });

  it('sem legenda ocupa a largura; vazio e carregando', () => {
    const { rerender } = render(
      <ChartCard title="Por secretaria">
        <svg data-testid="grafico" />
      </ChartCard>,
    );
    expect(screen.getByTestId('grafico').parentElement).toHaveClass('h-64', 'w-full');
    rerender(<ChartCard title="Por secretaria" empty />);
    expect(screen.getByText('Sem dados para o período.')).toHaveClass('py-12', 'text-center', 'text-muted');
    rerender(<ChartCard title="Por secretaria" loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando gráfico…');
    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true');
  });
});
