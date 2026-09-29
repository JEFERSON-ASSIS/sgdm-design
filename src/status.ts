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

/**
 * Cores de gráfico como variáveis CSS, para séries sem status: as 12 de
 * CHART_COLORS e, em 13º, o sky (#0EA5E9) dos relatórios.
 */
export const CHART_COLOR_VARS: readonly string[] = Array.from(
  { length: 13 },
  (_, i) => `rgb(var(--sd-color-chart-${i + 1}))`,
);

/**
 * Cores auxiliares de gráfico em hex, porque o recharts escreve a cor num
 * atributo SVG (fill/stroke), onde var() não funciona. Mesmos valores de
 * --sd-color-chart-13, -fallback, -grid e -bar.
 */
export const CHART_EXTRA_COLOR = '#0EA5E9';
export const CHART_FALLBACK_COLOR = '#94A3B8';
export const CHART_GRID_COLOR = '#E2E8F0';
export const CHART_BAR_COLOR = '#3B82F6';

/** Rótulos dos status de documento (STATUS_LABELS do SGDM, lib/constants.ts). */
export const STATUS_LABELS: Record<string, string> = {
  SOLICITACAO_ABERTA: 'Devolvida / em correção',
  EM_ANALISE: 'Em análise',
  NUMERACAO_LIBERADA: 'Numeração liberada',
  EM_ELABORACAO: 'Em elaboração',
  AGUARDANDO_ASSINATURA: 'Aguardando assinatura',
  ASSINADO: 'Assinado',
  AGUARDANDO_PUBLICACAO: 'Aguardando publicação',
  PUBLICADO: 'Publicado',
  ARQUIVADO: 'Arquivado',
  CANCELADO: 'Cancelado',
  NAO_UTILIZADO: 'Não utilizado',
  ERRO_EMISSAO: 'Erro de emissão',
};

/** Status de numeração (NUMERACAO_STATUS_COLORS do SGDM, lib/constants.ts). */
export const NUMERACAO_STATUS_COLORS: StatusColorMap = {
  PROVISIONADO: 'bg-indigo-100 text-indigo-800',
  SOLICITADO: 'bg-blue-100 text-blue-800',
  EM_ANALISE: 'bg-amber-100 text-amber-800',
  LIBERADO: 'bg-emerald-100 text-emerald-800',
  VINCULADO_DOCUMENTO: 'bg-sky-100 text-sky-800',
  UTILIZADO: 'bg-slate-200 text-slate-700',
  PUBLICADO: 'bg-green-100 text-green-800',
  ARQUIVADO: 'bg-teal-100 text-teal-800',
  NAO_UTILIZADO: 'bg-orange-100 text-orange-800',
  CANCELADO: 'bg-red-100 text-red-800',
  ERRO_EMISSAO: 'bg-rose-200 text-rose-900',
};

export const NUMERACAO_STATUS_LABELS: Record<string, string> = {
  PROVISIONADO: 'Provisionado',
  SOLICITADO: 'Solicitado',
  EM_ANALISE: 'Em análise',
  LIBERADO: 'Liberado',
  VINCULADO_DOCUMENTO: 'Vinculado',
  UTILIZADO: 'Utilizado',
  PUBLICADO: 'Publicado',
  ARQUIVADO: 'Arquivado',
  NAO_UTILIZADO: 'Não utilizado',
  CANCELADO: 'Cancelado',
  ERRO_EMISSAO: 'Erro de emissão',
};

/**
 * Status da licitação (statusBadgeClass, lib/licitacoes.ts). No SGDM o selo
 * é `size="sm" case="normal"`.
 */
export const LICITACAO_STATUS_COLORS: StatusColorMap = {
  RASCUNHO: 'bg-slate-100 text-slate-700',
  EM_INSTRUCAO: 'bg-blue-100 text-blue-800',
  EM_PLANEJAMENTO: 'bg-indigo-100 text-indigo-800',
  AGUARDANDO_ORCAMENTO: 'bg-amber-100 text-amber-800',
  EM_ANALISE_JURIDICA: 'bg-violet-100 text-violet-800',
  AGUARDANDO_AUTORIZACAO: 'bg-orange-100 text-orange-800',
  AUTORIZADO: 'bg-emerald-100 text-emerald-800',
  EDITAL_PUBLICADO: 'bg-cyan-100 text-cyan-800',
  EM_ACOMPANHAMENTO: 'bg-cyan-100 text-cyan-800',
  CONCLUIDO: 'bg-emerald-100 text-emerald-800',
  ARQUIVADO: 'bg-slate-100 text-slate-600',
  CANCELADO: 'bg-red-100 text-red-800',
};

export const LICITACAO_STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  EM_INSTRUCAO: 'Em instrução',
  EM_PLANEJAMENTO: 'Em planejamento',
  AGUARDANDO_ORCAMENTO: 'Aguardando orçamento',
  EM_ANALISE_JURIDICA: 'Em análise jurídica',
  AGUARDANDO_AUTORIZACAO: 'Aguardando autorização',
  AUTORIZADO: 'Autorizado',
  EDITAL_PUBLICADO: 'Edital publicado',
  EM_ACOMPANHAMENTO: 'Em acompanhamento',
  CONCLUIDO: 'Concluído',
  ARQUIVADO: 'Arquivado',
  CANCELADO: 'Cancelado',
};

/** Situação da licitação (situacaoBadgeClass, lib/licitacoes.ts). */
export const LICITACAO_SITUACAO_COLORS: StatusColorMap = {
  EM_ANDAMENTO: 'bg-blue-100 text-blue-800',
  SUSPENSA: 'bg-amber-100 text-amber-800',
  CONCLUIDA: 'bg-emerald-100 text-emerald-800',
  CANCELADA: 'bg-red-100 text-red-800',
  REVOGADA: 'bg-red-100 text-red-800',
  ANULADA: 'bg-red-100 text-red-800',
  ARQUIVADA: 'bg-slate-100 text-slate-600',
};

export const LICITACAO_SITUACAO_LABELS: Record<string, string> = {
  EM_ANDAMENTO: 'Em andamento',
  SUSPENSA: 'Suspensa',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
  REVOGADA: 'Revogada',
  ANULADA: 'Anulada',
  ARQUIVADA: 'Arquivada',
};

/**
 * Fase da licitação (faseBadgeClass, lib/licitacoes.ts). A cor depende de a
 * fase estar ativa, não do código da fase:
 * `<StatusBadge variant="outline" size="sm" case="normal" status={ativa ? 'ATIVA' : 'INATIVA'}
 *   colors={LICITACAO_FASE_COLORS}>{LICITACAO_FASE_LABELS[fase]}</StatusBadge>`.
 */
export const LICITACAO_FASE_COLORS: StatusColorMap = {
  ATIVA: 'bg-blue-50 text-blue-800 border-blue-200',
  INATIVA: 'bg-slate-50 text-slate-600 border-slate-200',
};

export const LICITACAO_FASE_LABELS: Record<string, string> = {
  INSTRUCAO_DEMANDA: 'Instrução da demanda',
  PLANEJAMENTO: 'Planejamento da contratação',
  ORCAMENTO: 'Adequação orçamentária',
  ANALISE_JURIDICA: 'Análise jurídica',
  AUTORIZACAO: 'Autorização',
  ACOMPANHAMENTO: 'Acompanhamento',
};

/** Status da peça de contratação (pecaStatusClass, lib/pecas.ts). */
export const PECA_STATUS_COLORS: StatusColorMap = {
  EM_ELABORACAO: 'bg-blue-100 text-blue-800',
  APROVADA: 'bg-emerald-100 text-emerald-800',
  DEVOLVIDA: 'bg-amber-100 text-amber-800',
};

export const PECA_STATUS_LABELS: Record<string, string> = {
  EM_ELABORACAO: 'Em elaboração',
  APROVADA: 'Aprovada',
  DEVOLVIDA: 'Devolvida',
};

/**
 * Estado da peça no painel do processo (pecaBadgeClass, lib/licitacoes.ts).
 * O SGDM calcula o estado a partir da peça; aqui ficam as cores por estado.
 */
export const PECA_ESTADO_COLORS: StatusColorMap = {
  DISPENSADA: 'bg-slate-100 text-slate-600',
  NAO_INICIADA: 'bg-slate-50 text-slate-500 border border-dashed border-slate-300',
  APROVADA: 'bg-emerald-100 text-emerald-800',
  DEVOLVIDA: 'bg-red-100 text-red-800',
  EM_ELABORACAO: 'bg-blue-100 text-blue-800',
};

export const PECA_ESTADO_LABELS: Record<string, string> = {
  DISPENSADA: 'Dispensada',
  NAO_INICIADA: 'Não iniciada',
  APROVADA: 'Aprovada',
  DEVOLVIDA: 'Devolvida',
  EM_ELABORACAO: 'Em elaboração',
};
