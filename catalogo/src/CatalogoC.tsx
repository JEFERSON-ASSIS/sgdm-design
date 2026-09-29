/** Seções do catálogo para os itens B14–B21 e B25–B27 da versão 2. */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Archive,
  CheckCircle2,
  Copy,
  Download,
  FileSignature,
  Hash,
  History,
  Mail,
  MoreHorizontal,
  Newspaper,
  Pencil,
  Plus,
  Route,
  Scale,
  Shield,
  SlidersHorizontal,
  Trash2,
  Users,
} from 'lucide-react';
import {
  Button,
  Card,
  Chip,
  CounterBadge,
  Dropdown,
  FilterBar,
  FlowChips,
  IconButton,
  InlineCode,
  Input,
  Mono,
  NotificationBell,
  NumberedSteps,
  PdfViewer,
  Popover,
  ProcessStepper,
  SearchInput,
  SegmentedControl,
  Select,
  SelectableList,
  StickyAside,
  Tabs,
  Timeline,
  WizardStepper,
  type NotificationItem,
} from '../../src';

function Rotulo({ children }: { children: ReactNode }) {
  return <p className="mb-2 font-mono text-xs text-muted">{children}</p>;
}

/* ---------- B14, B17 e B26: linha do tempo, passos e fluxo ---------- */

export function LinhaDoTempoEPassos() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title='Timeline variant="icon"' description="Histórico do documento: ícone em círculo, autor, data e IP">
          <Timeline
            label="Movimentações do workflow"
            items={[
              {
                id: '1',
                title: 'Documento assinado',
                subtitle: 'Aguardando assinatura → Assinado',
                author: { name: 'Maria da Silva', role: 'Prefeita' },
                date: '12/09/2026 14:32',
                meta: 'IP 10.0.0.12',
                icon: CheckCircle2,
              },
              {
                id: '2',
                title: 'Enviado para assinatura',
                subtitle: 'Em elaboração → Aguardando assinatura',
                detail: 'Texto revisado pelo jurídico.',
                author: { name: 'João Souza', role: 'Secretário' },
                date: '11/09/2026 09:10',
                icon: FileSignature,
                tone: 'purple',
              },
              { id: '3', title: 'Documento criado', date: '10/09/2026 16:45', icon: Plus, tone: 'neutral' },
            ]}
          />
        </Card>
        <div className="space-y-6">
          <Card title='Timeline variant="dots"' description="A timeline curta do workflow">
            <Timeline
              variant="dots"
              items={[
                { id: '1', title: 'Numeração liberada pelo RH', date: 'Numeração liberada — 12/09/2026 10:00' },
                { id: '2', title: 'Solicitação enviada', date: 'Em análise — 11/09/2026 15:20' },
              ]}
            />
          </Card>
          <Card title='Timeline variant="phases"' description="Fases da licitação">
            <Timeline
              variant="phases"
              items={[
                { id: 'a', title: 'Planejamento', status: 'done', aside: 'SEMAD', date: 'Início: 01/09/2026 · Fim: 05/09/2026' },
                { id: 'b', title: 'Análise jurídica', status: 'returned', aside: 'PGM', detail: 'Devolvida para ajuste do ETP.' },
                { id: 'c', title: 'Cotação', status: 'current', aside: 'SEMAD', date: 'Início: 10/09/2026' },
                { id: 'd', title: 'Contratação' },
              ]}
            />
          </Card>
          <Card title="Vazia">
            <Timeline items={[]} empty="Nenhuma movimentação registrada." />
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="NumberedSteps" description="Instruções numeradas com ação em cada passo">
          <NumberedSteps
            label="Como assinar"
            steps={[
              {
                title: 'Baixe o PDF do documento',
                status: 'done',
                content: (
                  <Button size="sm" variant="secondary" icon={<Download />}>
                    Baixar para assinar
                  </Button>
                ),
              },
              {
                title: 'Assine o arquivo',
                description: 'Com a conta gov.br (prata ou ouro), com certificado ICP-Brasil ou à mão.',
                content: (
                  <Button size="sm" variant="secondary" href="#b17">
                    Abrir assinador.iti.br
                  </Button>
                ),
              },
              { title: 'Carregue o arquivo assinado', description: 'Só PDF.', content: <Button size="sm">Carregar assinado</Button> },
            ]}
          />
        </Card>
        <Card title="ProcessStepper" description="O quadro “Onde você está no processo”">
          <ProcessStepper
            current={3}
            steps={[
              { label: 'Solicitação da numeração' },
              { label: 'Análise do RH' },
              { label: 'Elaboração do texto' },
              { label: 'Assinatura do prefeito' },
              { label: 'Publicação no DO' },
            ]}
          />
        </Card>
      </div>

      <Card title="WizardStepper: tiles com links e circles sem card">
        <div className="space-y-6">
          <div>
            <Rotulo>variant="tiles" (PassosCadastro)</Rotulo>
            <WizardStepper
              variant="tiles"
              label="Ordem dos cadastros"
              current={2}
              steps={[
                { title: 'Secretarias', description: 'as unidades da prefeitura', href: '#passos' },
                { title: 'Usuários', description: 'as pessoas e o que cada uma pode fazer', href: '#passos' },
                { title: 'Setores', description: 'onde cada pessoa atua no fluxo', href: '#passos' },
              ]}
            />
          </div>
          <div>
            <Rotulo>bare · passos com href</Rotulo>
            <WizardStepper
              bare
              current={3}
              steps={[
                { title: 'Dados', href: '#passos' },
                { title: 'Documentos', href: '#passos' },
                { title: 'Revisão' },
                { title: 'Envio' },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card title="FlowChips" description="A sequência A → B → C do guia de perfis">
        <div className="space-y-4">
          <div>
            <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              <Route className="h-3.5 w-3.5" /> Fluxo PASSO
            </p>
            <FlowChips label="Fluxo PASSO" tone="info" steps={['Solicitar numeração', 'Redigir', 'Enviar para assinatura', 'Publicar']} />
          </div>
          <FlowChips tone="indigo" steps={['Liberar numeração', 'Conferir', 'Arquivar']} />
          <FlowChips steps={['Neutro', 'Sem cor', 'Padrão']} />
        </div>
      </Card>
    </div>
  );
}

/* ---------- B15, B16 e B18: abas, filtros e lista mestre ---------- */

const PERFIS = [
  { id: 'rh', title: 'RH', description: '3 usuários · 42 perm.' },
  { id: 'secretaria', title: 'Secretaria', description: '18 usuários · 27 perm.' },
  { id: 'prefeito', title: 'Prefeito', description: '1 usuário · 12 perm.' },
  {
    id: 'antigo',
    title: 'Perfil antigo',
    description: '0 usuários · 4 perm.',
    badge: (
      <Chip size="xs" uppercase>
        Inativo
      </Chip>
    ),
  },
];

export function NavegacaoEFiltros() {
  const [filtro, setFiltro] = useState('todos');
  const [tipo, setTipo] = useState('');
  const [busca, setBusca] = useState('');
  const [perfil, setPerfil] = useState('rh');

  return (
    <div className="space-y-6">
      <div>
        <Rotulo>Tabs variant="pill" — cor por aba (tone)</Rotulo>
        <Tabs
          variant="pill"
          label="Documento"
          items={[
            { id: 'dados', label: 'Dados', content: <p className="text-sm text-body">Dados do documento.</p> },
            { id: 'workflow', label: 'Workflow', content: <p className="text-sm text-body">Etapas e ações.</p> },
            { id: 'analise', label: 'Análise', tone: 'indigo', content: <p className="text-sm text-body">Aba do RH, em índigo.</p> },
            { id: 'correcao', label: 'Correção', tone: 'warning', content: <p className="text-sm text-body">Aba de correção, em âmbar.</p> },
            { id: 'historico', label: 'Histórico', content: <p className="text-sm text-body">Histórico e auditoria.</p> },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div>
          <Rotulo>SegmentedControl size="sm"</Rotulo>
          <SegmentedControl
            label="Filtrar numerações"
            value={filtro}
            onChange={setFiltro}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'pendentes', label: 'Pendentes' },
              { value: 'liberados', label: 'Liberados', tone: 'success' },
              { value: 'rejeitados', label: 'Rejeitados', tone: 'danger' },
              { value: 'off', label: 'Desabilitada', disabled: true },
            ]}
          />
        </div>
        <div>
          <Rotulo>size="md"</Rotulo>
          <SegmentedControl
            label="Período"
            size="md"
            options={[
              { value: 'mes', label: 'Mês' },
              { value: 'ano', label: 'Ano' },
            ]}
          />
        </div>
      </div>

      <FilterBar
        onClear={() => {
          setTipo('');
          setBusca('');
        }}
        clearDisabled={tipo === '' && busca === ''}
      >
        <SearchInput aria-label="Buscar por protocolo ou assunto" placeholder="Protocolo ou assunto…" value={busca} onValueChange={setBusca} />
        <Select
          aria-label="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          options={[
            { value: '', label: 'Todos os tipos' },
            { value: 'portaria', label: 'Portaria' },
            { value: 'decreto', label: 'Decreto' },
          ]}
        />
        <Select aria-label="Status" options={[{ value: '', label: 'Todos os status' }]} />
      </FilterBar>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Rotulo>SearchInput com rótulo (Enter busca, Esc limpa)</Rotulo>
          <SearchInput label="Buscar documento" defaultValue="portaria 12" onSearch={(v) => alert(`onSearch: ${v}`)} />
          <SearchInput aria-label="Busca desabilitada" disabled defaultValue="sem edição" />
        </div>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,16rem)_1fr]">
          <SelectableList label="Perfis" icon={Shield} items={PERFIS} value={perfil} onChange={setPerfil} />
          <Card title={PERFIS.find((p) => p.id === perfil)?.title} description="Detalhe do item escolhido">
            <p className="flex items-center gap-2 text-sm text-body">
              <Users className="h-4 w-4 text-subtle" /> {PERFIS.find((p) => p.id === perfil)?.description}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- B19 e B20: menus, popover, notificações e contador ---------- */

const NOTIFICACOES: NotificationItem[] = [
  {
    id: '1',
    title: 'Numeração liberada',
    message: 'O RH liberou a numeração da Portaria nº 12/2026. Você já pode redigir o texto.',
    meta: 'DOC-2026-0012',
    time: 'há 5 minutos',
    icon: Hash,
    href: '#menus',
  },
  { id: '2', title: 'Aguardando sua assinatura', message: 'Decreto nº 4/2026.', time: 'há 1 hora', icon: FileSignature },
  { id: '3', title: 'Publicado no DO', message: 'Portaria nº 9/2026.', time: 'ontem', icon: Newspaper, read: true },
  { id: '4', title: 'Arquivado', time: 'há 3 dias', icon: Archive, read: true },
];

/** Sino com dados de exemplo — também usado no cabeçalho do catálogo. */
export function SinoDeExemplo({ vazio = false }: { vazio?: boolean }) {
  const [itens, setItens] = useState(vazio ? [] : NOTIFICACOES);
  const [carregando, setCarregando] = useState(false);
  const naoLidas = itens.filter((n) => !n.read).length;
  return (
    <NotificationBell
      count={naoLidas}
      items={itens}
      loading={carregando}
      onOpenChange={(aberto) => {
        if (!aberto) return;
        setCarregando(true);
        setTimeout(() => setCarregando(false), 400);
      }}
      onItemClick={(n) => setItens((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
      onMarkAllRead={() => setItens((l) => l.map((x) => ({ ...x, read: true })))}
      footerHref="#menus"
    />
  );
}

export function MenusENotificacoes() {
  const [contagem, setContagem] = useState(3);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Dropdown" description="Menu de ações: setas, Home/End, Esc e clique fora fecham">
        <div className="flex flex-wrap items-center gap-4">
          <Dropdown
            label="Ações do documento"
            trigger={<IconButton icon={<MoreHorizontal />} aria-label="Ações do documento" variant="secondary" />}
            items={[
              { id: 'editar', label: 'Editar', icon: Pencil, onSelect: () => alert('Editar') },
              { id: 'duplicar', label: 'Duplicar', icon: Copy, description: 'Cria um rascunho igual' },
              { id: 'arquivar', label: 'Arquivar', icon: Archive, disabled: true },
              { id: 'sep', separator: true },
              { id: 'excluir', label: 'Excluir', icon: Trash2, tone: 'danger', onSelect: () => alert('Excluir') },
            ]}
          />
          <Dropdown
            align="start"
            trigger={<Button variant="secondary">Exportar</Button>}
            items={[
              { id: 'pdf', label: 'PDF', href: '#menus' },
              { id: 'csv', label: 'CSV', href: '#menus' },
            ]}
          />
        </div>
      </Card>

      <Card title="Popover" description="Painel genérico (diálogo não modal)">
        <Popover
          label="Filtros avançados"
          align="start"
          width="md"
          trigger={
            <Button variant="secondary" icon={<SlidersHorizontal />}>
              Mais filtros
            </Button>
          }
        >
          {({ close }) => (
            <div className="space-y-3 p-4">
              <p className="text-sm font-semibold text-title">Filtros avançados</p>
              <Input label="Criado a partir de" type="date" />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={close}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={close}>
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </Popover>
      </Card>

      <Card title="NotificationBell" description="Contador 9+, marcar todas, ponto de não lida e rodapé">
        <div className="flex items-center gap-6">
          <SinoDeExemplo />
          <NotificationBell count={0} icon={Mail} label="Mensagens" emptyMessage="Nenhuma mensagem não lida." />
          <NotificationBell count={27} error="Não foi possível carregar as notificações." onRetry={() => undefined} />
        </div>
      </Card>

      <Card title="CounterBadge" description="Bolinha com número sobre ícone ou ao lado de texto">
        <div className="flex flex-wrap items-center gap-6">
          <CounterBadge count={contagem} live label={(n) => `${n} pendências`}>
            <History className="h-5 w-5 text-body" />
          </CounterBadge>
          <CounterBadge count={42}>
            <Mail className="h-5 w-5 text-body" />
          </CounterBadge>
          <span className="flex items-center gap-2 text-sm text-body">
            Caixa de entrada <CounterBadge count={contagem} tone="primary" />
          </span>
          <span className="flex items-center gap-2 text-sm text-body">
            Pendências <CounterBadge count={0} showZero tone="neutral" />
          </span>
          <CounterBadge count={120} max={99} tone="success" />
          <Button size="sm" variant="secondary" onClick={() => setContagem((c) => c + 1)}>
            +1
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* ---------- B21, B25 e B27: PDF, código e painel fixo ---------- */

/** PDF mínimo gerado na hora, para o catálogo não depender de arquivo. */
function gerarPdf(texto: string): string {
  const conteudo = `BT /F1 18 Tf 72 720 Td (${texto}) Tj ET`;
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${conteudo.length} >>\nstream\n${conteudo}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>',
  ];
  let pdf = '%PDF-1.4\n';
  const posicoes: number[] = [];
  objetos.forEach((o, i) => {
    posicoes.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  for (const p of posicoes) pdf += `${String(p).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
}

export function Documento() {
  const url = useMemo(() => gerarPdf('PORTARIA N. 12/2026 - exemplo do catalogo'), []);
  const [versao, setVersao] = useState(0);
  const [carregando, setCarregando] = useState(false);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  function atualizar() {
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setVersao((v) => v + 1);
    }, 600);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Rotulo>PdfViewer variant="panel"</Rotulo>
              <PdfViewer key={versao} src={url} title="Prévia do documento" loading={carregando} onRefresh={atualizar} downloadName="portaria-12-2026.pdf" />
            </div>
            <div className="space-y-4">
              <div>
                <Rotulo>carregando</Rotulo>
                <PdfViewer title="Prévia carregando" />
              </div>
              <div>
                <Rotulo>erro</Rotulo>
                <PdfViewer title="Prévia com erro" error="Não foi possível gerar a prévia." onRetry={() => undefined} />
              </div>
            </div>
          </div>
          <div>
            <Rotulo>PdfViewer variant="page"</Rotulo>
            <PdfViewer variant="page" src={url} title="PDF do documento" downloadName="portaria-12-2026.pdf" />
          </div>
          <Card title="InlineCode e Mono">
            <div className="space-y-3 text-sm text-body">
              <p>
                Precisa da permissão <InlineCode size="xs">USUARIO_GERENCIAR</InlineCode> ou{' '}
                <InlineCode size="xs">PERFIL_GERENCIAR</InlineCode>.
              </p>
              <p>
                Código de validação: <InlineCode boxed>A1B2-C3D4</InlineCode>
              </p>
              <p>
                Processo <Mono size="sm" weight="semibold" tone="default">2026/000142</Mono> · protocolo{' '}
                <Mono size="sm" weight="bold" tone="accent">DOC-2026-0012</Mono>
              </p>
              <div className="max-w-sm">
                <p className="text-xs text-muted">Hash SHA-256</p>
                <InlineCode size="xs" breakAll>
                  9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
                </InlineCode>
              </div>
            </div>
          </Card>
        </div>
        <div>
          <StickyAside title="Conteúdo mínimo" description="Art. 18, § 1º da Lei 14.133/2021" tone="warning" icon={Scale}>
            <ul className="space-y-2 text-sm text-body">
              <li>Descrição da necessidade</li>
              <li>Estimativa do valor</li>
              <li>Justificativa do parcelamento</li>
            </ul>
          </StickyAside>
        </div>
      </div>
    </div>
  );
}
