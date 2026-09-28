import { useEffect, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  Archive,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  FileText,
  Hash,
  Layers,
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
  Table,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
  WizardStepper,
  type ButtonVariant,
  type Tone,
} from '../../src';
import { Tokens } from './Tokens';

const SECOES = [
  { id: 'tokens', rotulo: 'Tokens', icone: Palette },
  { id: 'botoes', rotulo: 'Botões', icone: MousePointerClick },
  { id: 'formularios', rotulo: 'Formulários', icone: Type },
  { id: 'cards', rotulo: 'Cards', icone: Layers },
  { id: 'status', rotulo: 'Status', icone: CheckCircle2 },
  { id: 'tabela', rotulo: 'Tabela e abas', icone: Table2 },
  { id: 'modais', rotulo: 'Modais', icone: FileSignature },
  { id: 'feedback', rotulo: 'Feedback', icone: Bell },
  { id: 'wizard', rotulo: 'Wizard', icone: ClipboardList },
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

const VARIANTES: ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost', 'govbr'];
const TONS: Tone[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'];

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
        {TONS.map((t, i) => (
          <StatCard
            key={t}
            title={`tone="${t}"`}
            value={[12, 7, 128, 3, 1, 45, 0][i]}
            icon={[FileText, FileSignature, Newspaper, AlertTriangle, Trash2, Hash, Archive][i]!}
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
      <Card>
        <PageHeader title="PageHeader" description="Título da página com descrição e ação" action={<Button icon={<Plus />}>Novo</Button>} />
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
      <Card title="Dica (Tooltip)">
        <div className="flex items-center gap-2 text-sm text-label">
          Passe o mouse ou foque o ícone <Tooltip text="Explicação curta que aparece no balão." />
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
      <Secao id="botoes" titulo="Button" descricao="Variantes primary, secondary, danger, ghost e govbr; tamanhos md e sm; loading e disabled.">
        <Botoes />
      </Secao>
      <Secao id="formularios" titulo="Input, Textarea, Select, FormField, FormSection">
        <Formularios />
      </Secao>
      <Secao id="cards" titulo="StatCard, Card, CollapsibleCard, PageHeader">
        <Cards />
      </Secao>
      <Secao id="status" titulo="StatusBadge" descricao="Mapa padrão STATUS_COLORS do SGDM e o atalho Ativo/Inativo">
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
      </Secao>
      <Secao id="tabela" titulo="Table e Tabs">
        <TabelaEAbas />
      </Secao>
      <Secao id="modais" titulo="Modal e ConfirmModal">
        <Modais />
      </Secao>
      <Secao id="feedback" titulo="Toast, Tooltip, ErrorState, EmptyState">
        <Feedback />
      </Secao>
      <Secao id="wizard" titulo="WizardStepper">
        <WizardStepper
          current={2}
          steps={[
            { title: 'Dados', description: 'Identificação' },
            { title: 'Documentos', description: 'Anexos obrigatórios' },
            { title: 'Revisão', description: 'Conferência final' },
            { title: 'Envio' },
          ]}
        />
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
              <div className="w-56">
                <Select
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
            }
          />
        }
      >
        <Conteudo />
      </AppLayout>
    </ToastProvider>
  );
}
