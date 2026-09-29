import { useEffect, useState, type Key, type ReactNode } from 'react';
import {
  AlertTriangle,
  Archive,
  BarChart3,
  Bell,
  Building2,
  Paperclip,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  FileText,
  Hash,
  Layers,
  LogIn,
  Columns3,
  PieChart,
  PenLine,
  Printer,
  ListFilter,
  MoreHorizontal,
  LayoutDashboard,
  MousePointerClick,
  Newspaper,
  Palette,
  Plus,
  Save,
  Shield,
  Table2,
  Trash2,
  Type,
} from 'lucide-react';
import {
  Accordion,
  Button,
  Card,
  CollapsibleCard,
  ConfirmModal,
  EmptyState,
  ErrorInline,
  ErrorState,
  FormField,
  FormSection,
  Header,
  Input,
  Modal,
  PageHeader,
  Select,
  Sidebar,
  AppLayout,
  StatCard,
  StatusBadge,
  STATUS_COLORS,
  STATUS_LABELS,
  NUMERACAO_STATUS_COLORS,
  NUMERACAO_STATUS_LABELS,
  LICITACAO_STATUS_COLORS,
  LICITACAO_STATUS_LABELS,
  LICITACAO_SITUACAO_COLORS,
  LICITACAO_SITUACAO_LABELS,
  LICITACAO_FASE_COLORS,
  LICITACAO_FASE_LABELS,
  PECA_STATUS_COLORS,
  PECA_STATUS_LABELS,
  PECA_ESTADO_COLORS,
  PECA_ESTADO_LABELS,
  TONES,
  Table,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
  WizardStepper,
  type ButtonVariant,
  type StatusColorMap,
  type TooltipPlacement,
} from '../../src';
import { Tokens } from './Tokens';
import { AvisosECarregamento, BotoesNovos, FormulariosNovos, ListasDeDados, RotulosEIcones } from './CatalogoB';
import { Documento, LinhaDoTempoEPassos, MenusENotificacoes, NavegacaoEFiltros, SinoDeExemplo } from './CatalogoC';
import { Editor, Graficos, Impressao, Kanban, Paginas, Painel } from './CatalogoD';

const SECOES = [
  { id: 'tokens', rotulo: 'Tokens', icone: Palette },
  { id: 'botoes', rotulo: 'Botões', icone: MousePointerClick },
  { id: 'formularios', rotulo: 'Formulários', icone: Type },
  { id: 'cards', rotulo: 'Cards', icone: Layers },
  { id: 'rotulos', rotulo: 'Rótulos e ícones', icone: Hash },
  { id: 'dados', rotulo: 'Lista de dados', icone: ClipboardList },
  { id: 'status', rotulo: 'Status', icone: CheckCircle2 },
  { id: 'tabela', rotulo: 'Tabela e abas', icone: Table2 },
  { id: 'modais', rotulo: 'Modais', icone: FileSignature },
  { id: 'feedback', rotulo: 'Feedback', icone: Bell },
  { id: 'avisos', rotulo: 'Avisos e carregamento', icone: AlertTriangle },
  { id: 'passos', rotulo: 'Linha do tempo e passos', icone: ClipboardList },
  { id: 'navegacao', rotulo: 'Abas, filtros e listas', icone: ListFilter },
  { id: 'menus', rotulo: 'Menus e notificações', icone: MoreHorizontal },
  { id: 'documento', rotulo: 'PDF, código e painel fixo', icone: FileText },
  { id: 'paginas', rotulo: 'Páginas (login, pública, erro)', icone: LogIn },
  { id: 'kanban', rotulo: 'Kanban', icone: Columns3 },
  { id: 'painel', rotulo: 'Painel inicial', icone: LayoutDashboard },
  { id: 'graficos', rotulo: 'Gráficos', icone: PieChart },
  { id: 'editor', rotulo: 'Editor de texto', icone: PenLine },
  { id: 'impressao', rotulo: 'Impressão', icone: Printer },
];

/** Cores principais de exemplo: cada sistema troca só os tokens. */
const TEMAS: Record<string, Record<string, string>> = {
  sgdm: {},
  verde: {
    '--sd-color-primary': '22 101 52',
    '--sd-color-primary-hover': '20 83 45',
    '--sd-color-primary-light': '34 197 94',
    '--sd-color-primary-ring': '220 252 231',
    '--sd-color-primary-soft': '240 253 244',
    '--sd-color-accent': '22 163 74',
    '--sd-color-accent-text': '21 128 61',
    '--sd-color-sidebar-active': '22 163 74',
  },
  vinho: {
    '--sd-color-primary': '136 19 55',
    '--sd-color-primary-hover': '112 26 56',
    '--sd-color-primary-light': '244 63 94',
    '--sd-color-primary-ring': '255 228 230',
    '--sd-color-primary-soft': '255 241 242',
    '--sd-color-accent': '225 29 72',
    '--sd-color-accent-text': '190 18 60',
    '--sd-color-sidebar-active': '225 29 72',
  },
};

function aplicarTema(nome: string) {
  const raiz = document.documentElement.style;
  for (const vars of Object.values(TEMAS)) for (const k of Object.keys(vars)) raiz.removeProperty(k);
  for (const [k, v] of Object.entries(TEMAS[nome] ?? {})) raiz.setProperty(k, v);
}

function Secao({ id, titulo, descricao, children }: { id: string; titulo: string; descricao?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">{titulo}</h2>
        {descricao && <p className="text-sm text-muted">{descricao}</p>}
      </div>
      {children}
    </section>
  );
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-24 shrink-0 font-mono text-xs text-muted">{rotulo}</span>
      {children}
    </div>
  );
}

const VARIANTES: ButtonVariant[] = ['primary', 'secondary', 'danger', 'danger-outline', 'success', 'ghost', 'link', 'govbr'];

function Botoes() {
  return (
    <Card>
      <div className="space-y-4">
        {VARIANTES.filter((v) => v !== 'govbr').map((v) => (
          <Linha key={v} rotulo={v}>
            <Button variant={v}>Rótulo</Button>
            <Button variant={v} icon={<Save />}>
              Com ícone
            </Button>
            <Button variant={v} size="sm" icon={<Plus />}>
              Pequeno
            </Button>
            <Button variant={v} loading loadingLabel="Salvando…">
              Salvar
            </Button>
            <Button variant={v} disabled>
              Desabilitado
            </Button>
          </Linha>
        ))}
        <Linha rotulo="govbr">
          <div className="w-72">
            <Button variant="govbr">Entrar com gov.br</Button>
          </div>
        </Linha>
      </div>
    </Card>
  );
}

function Formularios() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Campos">
        <div className="space-y-4">
          <Input label="Nome" placeholder="Nome completo" hint="Como aparece nos documentos" />
          <Input label="E-mail" required defaultValue="maria@" error="Informe um e-mail válido" />
          <Input label="Desabilitado" disabled defaultValue="Não editável" />
          <Select
            label="Secretaria"
            placeholder="Selecione…"
            options={[
              { value: 'saude', label: 'Saúde' },
              { value: 'educacao', label: 'Educação' },
            ]}
          />
          <Select
            label="Com ícone à esquerda"
            icon={<Building2 />}
            options={[{ value: 'a', label: 'Prefeitura de Exemplo' }]}
          />
          <FormField label='Select size="compact" com ícone (seletor de prefeitura)'>
            <Select
              size="compact"
              icon={<Building2 />}
              options={[
                { value: '', label: 'Visão plataforma (geral)' },
                { value: 'a', label: 'Prefeitura de Exemplo' },
              ]}
            />
          </FormField>
          <Textarea label="Observação" placeholder="Texto livre" />
          <FormField label="Campo próprio dentro do FormField" hint="O rótulo liga sozinho ao campo">
            <Input placeholder="Input sem label, dentro do FormField" />
          </FormField>
        </div>
      </Card>
      <Card title="FormSection">
        <div className="space-y-8">
          <FormSection title="Dados do órgão" description="Identificação usada nos documentos">
            <Input label="Sigla" placeholder="SMS" />
          </FormSection>
          <FormSection title="Responsável">
            <div className="flex items-center gap-2 text-sm text-label">
              Com dica ao lado <Tooltip text="O responsável assina as peças da secretaria." />
            </div>
          </FormSection>
        </div>
      </Card>
    </div>
  );
}

function Cards() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TONES.map((t, i) => (
          <StatCard
            key={t}
            title={`tone="${t}"`}
            value={(i * 17) % 130}
            icon={[FileText, FileSignature, Newspaper, AlertTriangle, Trash2, Hash, Archive][i % 7]!}
            tone={t}
            href={i < 2 ? '#cards' : undefined}
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Card com cabeçalho" description="Descrição curta" action={<Button size="sm" variant="secondary">Ação</Button>} footer={<Button size="sm">Salvar</Button>}>
          <p className="text-sm text-body">Conteúdo do card com rodapé.</p>
        </Card>
        <div className="space-y-4">
          <CollapsibleCard title="Configuração recolhida" description="Clique para abrir" badge={<StatusBadge active />} icon={<Shield className="h-5 w-5 text-accent" />}>
            <Input label="Parâmetro" />
          </CollapsibleCard>
          <CollapsibleCard title="Configuração aberta" defaultOpen badge={<StatusBadge active={false} />}>
            <p className="text-sm text-body">Conteúdo visível.</p>
          </CollapsibleCard>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card padding="sm" title='padding="sm"'>
          <p className="text-sm text-body">p-4</p>
        </Card>
        <Card title='padding="md" (padrão)'>
          <p className="text-sm text-body">p-5</p>
        </Card>
        <Card padding="lg" title='padding="lg"'>
          <p className="text-sm text-body">p-6</p>
        </Card>
        <Card padding="none" title='padding="none"'>
          <p className="text-sm text-body">encosta na borda</p>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(['info', 'warning', 'success', 'danger', 'violet', 'indigo', 'teal', 'neutral'] as const).map((t) => (
          <Card key={t} tone={t} padding="sm">
            <p className="text-sm font-medium text-title">tone="{t}"</p>
            <p className="text-xs text-body">Card tingido</p>
          </Card>
        ))}
      </div>
      <Recolhiveis />
      <RolagemVisivel />
      <Card>
        <PageHeader title="PageHeader" description="Título da página com descrição e ação" action={<Button icon={<Plus />}>Novo</Button>} />
      </Card>
    </div>
  );
}

function RolagemVisivel() {
  const linhas = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Rolagem visível (padrão)" description="Barra fina, sem esconder — quem não tem roda do mouse consegue arrastar.">
        <div className="h-40 overflow-y-auto rounded-control border border-border p-3">
          {linhas.map((n) => (
            <p key={n} className="py-1 text-sm text-body">
              Linha {n}
            </p>
          ))}
        </div>
      </Card>
      <Card title='Sobre fundo escuro (className="scrollbar-on-dark")' description="Mesma barra, com o par de tons escuros do token.">
        <div className="scrollbar-on-dark h-40 overflow-y-auto rounded-control bg-sidebar p-3 text-sidebar-foreground">
          {linhas.map((n) => (
            <p key={n} className="py-1 text-sm">
              Linha {n}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}

type Secretaria = { id: number; nome: string; sigla: string; ativo: boolean };
const LINHAS: Secretaria[] = [
  { id: 1, nome: 'Secretaria de Saúde', sigla: 'SMS', ativo: true },
  { id: 2, nome: 'Secretaria de Educação', sigla: 'SEMED', ativo: true },
  { id: 3, nome: 'Secretaria de Obras', sigla: 'SEMOB', ativo: false },
];
const COLUNAS = [
  { key: 'nome', header: 'Nome', emphasis: true },
  { key: 'sigla', header: 'Sigla' },
  { key: 'ativo', header: 'Status', render: (l: Secretaria) => <StatusBadge active={l.ativo} /> },
  { key: 'acoes', header: 'Ações', align: 'right' as const, render: () => <Button size="sm" variant="ghost">Editar</Button> },
];

function TabelaEAbas() {
  return (
    <div className="space-y-6">
      <Table columns={COLUNAS} rows={LINHAS} caption="Secretarias" />
      <TabelaCompleta />
      <Tabs
        label="Estados da tabela"
        items={[
          {
            id: 'vazio',
            label: 'Vazia',
            content: (
              <Table
                columns={COLUNAS}
                rows={[]}
                empty={<EmptyState title="Nenhuma secretaria cadastrada" description="Cadastre a primeira para começar." action={<Button icon={<Plus />}>Nova secretaria</Button>} />}
              />
            ),
          },
          { id: 'carregando', label: 'Carregando', content: <Table columns={COLUNAS} rows={undefined} loading /> },
          { id: 'padrao', label: 'Mensagem padrão', content: <Table columns={COLUNAS} rows={[]} /> },
          { id: 'off', label: 'Desabilitada', disabled: true, content: null },
        ]}
      />
    </div>
  );
}

function Recolhiveis() {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <Button size="sm" variant="secondary" onClick={() => setAberto((v) => !v)}>
          {aberto ? 'Fechar' : 'Abrir'} de fora (open/onOpenChange)
        </Button>
        <CollapsibleCard title="CollapsibleCard controlado" open={aberto} onOpenChange={setAberto}>
          <p className="text-sm text-body">Estado mantido pela tela.</p>
        </CollapsibleCard>
      </div>
      <Accordion
        defaultOpen={['etp']}
        items={[
          {
            id: 'etp',
            title: 'Estudo técnico preliminar',
            description: 'Art. 18, § 1º',
            meta: '4 seções',
            badge: (
              <StatusBadge status="X" colors={{ X: 'bg-amber-100 text-amber-800' }}>
                2 personalizados
              </StatusBadge>
            ),
            content: <p className="text-sm text-body">Conteúdo da linha aberta.</p>,
          },
          {
            id: 'tr',
            title: 'Termo de referência',
            description: 'Art. 6º, XXIII',
            meta: '6 seções',
            content: <p className="text-sm text-body">Outra linha.</p>,
          },
          {
            id: 'dfd',
            title: 'Documento de formalização da demanda',
            meta: '3 seções',
            content: <p className="text-sm text-body">Mais uma.</p>,
          },
        ]}
      />
    </div>
  );
}

const MAPAS: { nome: string; cores: StatusColorMap; rotulos: Record<string, string>; licitacao?: boolean }[] = [
  { nome: 'STATUS_COLORS + STATUS_LABELS', cores: STATUS_COLORS, rotulos: STATUS_LABELS },
  { nome: 'NUMERACAO_STATUS_COLORS', cores: NUMERACAO_STATUS_COLORS, rotulos: NUMERACAO_STATUS_LABELS },
  { nome: 'LICITACAO_STATUS_COLORS (sm, normal)', cores: LICITACAO_STATUS_COLORS, rotulos: LICITACAO_STATUS_LABELS, licitacao: true },
  { nome: 'LICITACAO_SITUACAO_COLORS (sm, normal)', cores: LICITACAO_SITUACAO_COLORS, rotulos: LICITACAO_SITUACAO_LABELS, licitacao: true },
  { nome: 'PECA_STATUS_COLORS (sm, normal)', cores: PECA_STATUS_COLORS, rotulos: PECA_STATUS_LABELS, licitacao: true },
  { nome: 'PECA_ESTADO_COLORS (sm, normal)', cores: PECA_ESTADO_COLORS, rotulos: PECA_ESTADO_LABELS, licitacao: true },
];

function MapasDeStatus() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="size e case">
        <div className="space-y-3">
          {(['xs', 'sm'] as const).flatMap((size) =>
            (['upper', 'normal'] as const).map((caixa) => (
              <Linha key={size + caixa} rotulo={`${size} · ${caixa}`}>
                <StatusBadge status="EM_ANALISE" labels={STATUS_LABELS} size={size} case={caixa} />
                <StatusBadge status="ASSINADO" labels={STATUS_LABELS} size={size} case={caixa} />
              </Linha>
            )),
          )}
        </div>
      </Card>
      <Card title='variant="outline" (fase da licitação)'>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LICITACAO_FASE_LABELS).map(([fase, rotulo], i) => (
            <StatusBadge
              key={fase}
              variant="outline"
              size="sm"
              case="normal"
              status={i === 1 ? 'ATIVA' : 'INATIVA'}
              colors={LICITACAO_FASE_COLORS}
            >
              {rotulo}
            </StatusBadge>
          ))}
        </div>
      </Card>
      {MAPAS.map((m) => (
        <Card key={m.nome} title={m.nome}>
          <div className="flex flex-wrap gap-2">
            {Object.keys(m.cores).map((s) =>
              m.licitacao ? (
                <StatusBadge key={s} status={s} colors={m.cores} labels={m.rotulos} size="sm" case="normal" />
              ) : (
                <StatusBadge key={s} status={s} colors={m.cores} labels={m.rotulos} />
              ),
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

type Item = { id: number; numero: string; descricao: string; un: string; qtd: number; total: string };
const ITENS: Item[] = [
  { id: 1, numero: '1', descricao: 'Papel A4, resma com 500 folhas', un: 'CX', qtd: 40, total: 'R$ 1.200,00' },
  { id: 2, numero: '2', descricao: 'Toner para impressora laser', un: 'UN', qtd: 12, total: 'R$ 3.480,00' },
  { id: 3, numero: '3', descricao: 'Grampeador de mesa', un: 'UN', qtd: 8, total: 'R$ 256,00' },
];

function TabelaCompleta() {
  const [selecionados, setSelecionados] = useState<Key[]>([2]);
  return (
    <Card
      title="Itens do processo"
      description={`density="compact", headerCase="upper", bare, footer e selectable — ${selecionados.length} selecionado(s)`}
      padding="none"
    >
      <Table
        bare
        density="compact"
        headerCase="upper"
        selectable
        selected={selecionados}
        onSelectedChange={setSelecionados}
        selectRowLabel={(r) => `Selecionar item ${r.numero}`}
        rows={ITENS}
        columns={[
          { key: 'numero', header: 'Nº' },
          { key: 'descricao', header: 'Descrição', emphasis: true },
          { key: 'un', header: 'Un.' },
          { key: 'qtd', header: 'Qtd.', align: 'right' },
          { key: 'total', header: 'Total', align: 'right' },
        ]}
        footer={{ label: 'Valor estimado do processo', values: { total: 'R$ 4.936,00' } }}
      />
    </Card>
  );
}

function Modais() {
  const [aberto, setAberto] = useState<null | 'modal' | 'largo' | 'confirmar' | 'excluir' | 'motivo'>(null);
  const [motivo, setMotivo] = useState('');
  const fechar = () => setAberto(null);
  return (
    <Card>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setAberto('modal')}>Modal</Button>
        <Button variant="secondary" onClick={() => setAberto('largo')}>Modal largo</Button>
        <Button variant="secondary" onClick={() => setAberto('confirmar')}>ConfirmModal</Button>
        <Button variant="secondary" onClick={() => setAberto('excluir')}>ConfirmModal danger</Button>
        <Button variant="secondary" onClick={() => setAberto('motivo')}>Com motivo</Button>
      </div>
      <Modal open={aberto === 'modal' || aberto === 'largo'} size={aberto === 'largo' ? 'lg' : 'md'} title="Nova secretaria" subtitle="Preencha os dados básicos" onClose={fechar} footer={<><Button variant="secondary" onClick={fechar}>Cancelar</Button><Button onClick={fechar}>Salvar</Button></>}>
        <div className="space-y-4">
          <Input label="Nome" autoFocus />
          <Input label="Sigla" />
        </div>
      </Modal>
      <ConfirmModal open={aberto === 'confirmar'} title="Enviar para assinatura?" message="O documento seguirá para o prefeito." onConfirm={fechar} onClose={fechar} />
      <ConfirmModal open={aberto === 'excluir'} variant="danger" title="Excluir modelo?" message="Esta ação não pode ser desfeita." confirmLabel="Excluir" onConfirm={fechar} onClose={fechar} />
      <ConfirmModal open={aberto === 'motivo'} variant="danger" title="Devolver documento" subtitle="O autor verá o motivo." confirmLabel="Devolver" onConfirm={fechar} onClose={fechar} reason={{ value: motivo, onChange: setMotivo }} />
    </Card>
  );
}

function Feedback() {
  const toast = useToast();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast.success('Documento salvo', 'As alterações foram gravadas.')}>success</Button>
          <Button variant="secondary" onClick={() => toast.error('Falha ao salvar', 'Tente novamente.')}>error</Button>
          <Button variant="secondary" onClick={() => toast.toast({ title: 'Prazo perto do fim', variant: 'warning' })}>warning</Button>
          <Button variant="secondary" onClick={() => toast.toast({ title: 'Nova versão disponível' })}>info</Button>
        </div>
      </Card>
      <Card title="Dica (Tooltip)" description="placement top, bottom, left e right">
        <div className="flex flex-wrap items-center gap-8 py-10 text-sm text-label">
          {(['top', 'bottom', 'left', 'right'] as TooltipPlacement[]).map((p) => (
            <span key={p} className="flex items-center gap-2">
              {p} <Tooltip placement={p} text={`Balão em placement="${p}".`} />
            </span>
          ))}
        </div>
      </Card>
      <Card title="ErrorState">
        <div className="space-y-3">
          <ErrorState error={new Error('A API não respondeu em 30 segundos.')} action={<Button size="sm" variant="secondary">Tentar de novo</Button>} />
          <ErrorInline />
        </div>
      </Card>
      <Card title="EmptyState" padding="none">
        <EmptyState title="Nenhuma pendência" description="Tudo em dia por aqui." tone="success" icon={CheckCircle2} />
      </Card>
      <Card title='EmptyState variant="dashed"'>
        <EmptyState
          variant="dashed"
          icon={Paperclip}
          title="Nenhum documento externo juntado a este processo."
          action={<Button size="sm" variant="secondary">Juntar documento</Button>}
        />
      </Card>
    </div>
  );
}

function Conteudo() {
  return (
    <>
      <PageHeader title="Catálogo @sgdm/design" description="Todos os tokens e componentes do pacote, direto do código-fonte." />
      <Secao id="tokens" titulo="Tokens" descricao="Lidos de src/styles/tokens.css">
        <Tokens />
      </Secao>
      <Secao id="botoes" titulo="Button e IconButton" descricao="Variantes primary, secondary, danger, danger-outline, success, ghost, link e govbr; tamanhos sm, md e lg; loading, disabled, href e asChild.">
        <Botoes />
        <BotoesNovos />
      </Secao>
      <Secao id="formularios" titulo="Input, PasswordInput, Textarea, Select, Checkbox, FileUpload, FormField, FormSection" descricao="Campos com ícone, prefixo e sufixo; senha com mostrar/ocultar; caixas de marcar com indeterminado; envio de arquivo.">
        <Formularios />
        <FormulariosNovos />
      </Secao>
      <Secao id="cards" titulo="StatCard, Card, CollapsibleCard, Accordion, PageHeader" descricao="StatCard em todos os tons; Card com padding e tone; CollapsibleCard controlado; Accordion para linhas de lista; a barra de rolagem fina, visível por padrão, e a variante escura.">
        <Cards />
      </Secao>
      <Secao id="rotulos" titulo="Eyebrow, Chip e IconTile" descricao="Sobrelinha; chip em todos os tons (filled, soft, outline, mono); quadrado de ícone, também usado no StatCard e no EmptyState.">
        <RotulosEIcones />
      </Secao>
      <Secao id="dados" titulo="DescriptionList e KeyValue" descricao="Os quatro formatos de lista rótulo → valor do SGDM.">
        <ListasDeDados />
      </Secao>
      <Secao id="status" titulo="StatusBadge" descricao="Mapa padrão, atalho Ativo/Inativo, size, case, outline e os mapas de numeração, licitação e peça">
        <Card>
          <div className="flex flex-wrap gap-2">
            {Object.keys(STATUS_COLORS).map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
            <StatusBadge status="SEM_MAPA" />
            <StatusBadge active />
            <StatusBadge active={false} />
          </div>
        </Card>
        <MapasDeStatus />
      </Secao>
      <Secao id="tabela" titulo="Table e Tabs" descricao="Padrão; compacta, com cabeçalho em caixa-alta, seleção, total e bare dentro de Card.">
        <TabelaEAbas />
      </Secao>
      <Secao id="modais" titulo="Modal e ConfirmModal">
        <Modais />
      </Secao>
      <Secao id="feedback" titulo="Toast, Tooltip, ErrorState, EmptyState" descricao="Tooltip nos quatro lados; EmptyState padrão e tracejado.">
        <Feedback />
      </Secao>
      <Secao id="avisos" titulo="Alert, Spinner, LoadingState e Skeleton" descricao="Avisos em todos os tons, com ícone, título, ações, fechar e a variante stage; indicadores de carregamento.">
        <AvisosECarregamento />
      </Secao>
      <Secao id="passos" titulo="WizardStepper, Timeline, NumberedSteps, ProcessStepper e FlowChips" descricao="Wizard em círculos e em caixas com links; linha do tempo com ícone, pontos e fases; instruções numeradas; o quadro “onde você está”; a sequência A → B → C.">
        <WizardStepper
          current={2}
          steps={[
            { title: 'Dados', description: 'Identificação' },
            { title: 'Documentos', description: 'Anexos obrigatórios' },
            { title: 'Revisão', description: 'Conferência final' },
            { title: 'Envio' },
          ]}
        />
        <LinhaDoTempoEPassos />
      </Secao>
      <Secao id="navegacao" titulo="Tabs pill, SegmentedControl, FilterBar, SearchInput e SelectableList" descricao="Abas em pílula com cor por aba; filtro de botões lado a lado; card de filtros; campo de busca; lista mestre com item ativo.">
        <NavegacaoEFiltros />
      </Secao>
      <Secao id="menus" titulo="Dropdown, Popover, NotificationBell e CounterBadge" descricao="Fecham com Esc (devolvendo o foco) e com clique fora; o sino também está no cabeçalho do catálogo.">
        <MenusENotificacoes />
      </Secao>
      <Secao id="documento" titulo="PdfViewer, InlineCode, Mono e StickyAside" descricao="Prévia de PDF em painel e em página; código e texto mono; painel lateral que gruda ao rolar (role a página).">
        <Documento />
      </Secao>
      <Secao id="paginas" titulo="AuthLayout, AuthCard, AuthMessage, PublicLayout e ErrorPage" descricao="Páginas inteiras, mostradas aqui pela metade. No login e no cartão escuro, os campos, o link e o erro usam a variante onDark.">
        <Paginas />
      </Secao>
      <Secao id="kanban" titulo="KanbanBoard, KanbanColumn e KanbanCard" descricao="Quadro só de leitura, com rolagem horizontal (role com o teclado depois de focar o quadro), contagem por coluna e coluna vazia.">
        <Kanban />
      </Secao>
      <Secao id="painel" titulo="DashboardHero, MiniStat, QuickActions, QueueCard, CountList e MiniCalendar" descricao="Os widgets do painel inicial, com o tema de cada perfil.">
        <Painel />
      </Secao>
      <Secao id="graficos" titulo="ChartCard e ChartLegend" descricao="Rosca com legenda e total no meio, barras, vazio e carregando. Os gráficos daqui são SVG simples: o recharts é opcional e não está instalado no catálogo.">
        <Graficos />
      </Secao>
      <Secao id="editor" titulo="EditorFrame, EditorToolbar e DocumentContent" descricao="A moldura e a toolbar do editor (setas andam entre os botões), o modo leitura com .documento e o carregando.">
        <Editor />
      </Secao>
      <Secao id="impressao" titulo="PrintSheet, PrintCover, PrintSection e print.css" descricao="A folha do processo. Clique em Imprimir (ou Ctrl+P) para ver o A4: a moldura some e cada peça começa numa página nova.">
        <Impressao />
      </Secao>
    </>
  );
}

export function Catalogo() {
  const [hash, setHash] = useState(() => window.location.hash || '#tokens');
  const [tema, setTema] = useState('sgdm');
  const [navegando, setNavegando] = useState(false);

  useEffect(() => {
    const aoMudar = () => setHash(window.location.hash);
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  useEffect(() => aplicarTema(tema), [tema]);

  useEffect(() => {
    if (!navegando) return;
    const t = setTimeout(() => setNavegando(false), 1200);
    return () => clearTimeout(t);
  }, [navegando]);

  return (
    <ToastProvider>
      <AppLayout
        navigating={navegando}
        sidebar={
          <Sidebar
            brand={{ name: 'SGDM Design', subtitle: 'Catálogo de componentes', icon: <Shield /> }}
            currentPath={hash}
            onNavigate={() => setNavegando(true)}
            onLogout={() => alert('onLogout')}
            sections={[
              { label: 'Fundamentos', items: SECOES.slice(0, 1).map((s) => ({ href: `#${s.id}`, label: s.rotulo, icon: s.icone })) },
              { label: 'Componentes', items: SECOES.slice(1).map((s) => ({ href: `#${s.id}`, label: s.rotulo, icon: s.icone })) },
              {
                label: 'Exemplo de sistema',
                items: [
                  { href: '#dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { href: '#relatorios', label: 'Relatórios', icon: BarChart3 },
                ],
              },
            ]}
          />
        }
        header={
          <Header
            title="Catálogo"
            user={{ name: 'Maria da Silva', subtitle: 'Prefeitura de Exemplo' }}
            actions={
              <>
                <SinoDeExemplo />
                <div className="hidden sm:block">
                  <Select
                    size="compact"
                    icon={<Palette />}
                    aria-label="Cor principal"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    options={[
                      { value: 'sgdm', label: 'Cor principal: SGDM' },
                      { value: 'verde', label: 'Cor principal: verde' },
                      { value: 'vinho', label: 'Cor principal: vinho' },
                    ]}
                  />
                </div>
              </>
            }
          />
        }
      >
        <Conteudo />
      </AppLayout>
    </ToastProvider>
  );
}
