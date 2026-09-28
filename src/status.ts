/**
 * Mapas de status do SGDM. São o valor padrão do StatusBadge e dos gráficos;
 * cada sistema pode passar o próprio mapa.
 *
 * O formato é sempre `bg-<cor>-100 text-<cor>-800`. As classes estão escritas
 * por extenso para o Tailwind do projeto encontrá-las em dist/.
 */
export type StatusColorMap = Record<string, string>;

export const STATUS_COLORS: StatusColorMap = {
  SOLICITACAO_ABERTA: 'bg-blue-100 text-blue-800',
  EM_ANALISE: 'bg-amber-100 text-amber-800',
  NUMERACAO_LIBERADA: 'bg-sky-100 text-sky-800',
  EM_ELABORACAO: 'bg-yellow-100 text-yellow-800',
  AGUARDANDO_ASSINATURA: 'bg-purple-100 text-purple-800',
  ASSINADO: 'bg-emerald-100 text-emerald-800',
  AGUARDANDO_PUBLICACAO: 'bg-orange-100 text-orange-800',
  PUBLICADO: 'bg-green-100 text-green-800',
  ARQUIVADO: 'bg-slate-100 text-slate-600',
  CANCELADO: 'bg-red-100 text-red-800',
  NAO_UTILIZADO: 'bg-orange-100 text-orange-800',
  ERRO_EMISSAO: 'bg-rose-200 text-rose-900',
};

/** Classe usada quando o status não está no mapa. */
export const STATUS_FALLBACK = 'bg-slate-100 text-slate-700';

/** As 12 cores de gráfico do SGDM, por status (mesmos valores de --sd-color-chart-1..12). */
export const CHART_COLORS: Record<string, string> = {
  SOLICITACAO_ABERTA: '#3B82F6',
  NUMERACAO_LIBERADA: '#06B6D4',
  EM_ELABORACAO: '#F59E0B',
  AGUARDANDO_ASSINATURA: '#8B5CF6',
  ASSINADO: '#22C55E',
  PUBLICADO: '#10B981',
  ARQUIVADO: '#64748B',
  CANCELADO: '#EF4444',
  NAO_UTILIZADO: '#F97316',
  EM_ANALISE: '#6366F1',
  AGUARDANDO_PUBLICACAO: '#EC4899',
  ERRO_EMISSAO: '#9F1239',
};

/** As mesmas 12 cores como variáveis CSS, para séries sem status. */
export const CHART_COLOR_VARS: readonly string[] = Array.from(
  { length: 12 },
  (_, i) => `rgb(var(--sd-color-chart-${i + 1}))`,
);
