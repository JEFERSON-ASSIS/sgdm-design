/** Seções do catálogo para os itens B22–B24 e B28–B30 da versão 2. */
import { useState, type ReactNode } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  ArrowLeft,
  Bold,
  Building2,
  CheckCircle2,
  FilePlus,
  FileSearch,
  FileSignature,
  FileStack,
  Hash,
  Italic,
  Landmark,
  List,
  ListOrdered,
  Lock,
  Mail,
  Newspaper,
  Printer,
  Redo,
  RotateCcw,
  ServerCrash,
  Shield,
  Strikethrough,
  Underline,
  Undo,
  UserCog,
  Users,
} from 'lucide-react';
import {
  AuthCard,
  AuthLayout,
  AuthMessage,
  Button,
  Card,
  ChartCard,
  ChartLegend,
  Checkbox,
  Chip,
  CountList,
  DashboardHero,
  DocumentContent,
  EditorFontSizeSelect,
  EditorFrame,
  EditorToolbar,
  EditorToolbarButton,
  EditorToolbarSeparator,
  ErrorInline,
  ErrorPage,
  Input,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  LICITACAO_STATUS_COLORS,
  LICITACAO_STATUS_LABELS,
  MiniCalendar,
  MiniStat,
  PasswordInput,
  PrintCover,
  PrintSection,
  PrintSheet,
  PROFILES,
  PublicLayout,
  QueueCard,
  QuickActions,
  STATUS_LABELS,
  StatusBadge,
  chartProps,
  toChartData,
} from '../../src';

function Rotulo({ children }: { children: ReactNode }) {
  return <p className="mb-2 font-mono text-xs text-muted">{children}</p>;
}

/**
 * Mostra uma página inteira (min-h-screen) reduzida à metade, numa moldura.
 * As faixas de tela (lg:) seguem a janela do navegador, não a moldura.
 */
function Miniatura({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div>
      <Rotulo>{rotulo}</Rotulo>
      <div className="h-[460px] overflow-hidden rounded-card border border-border bg-background shadow-card">
        <div className="w-[200%] origin-top-left scale-50">{children}</div>
      </div>
    </div>
  );
}

/** "Foto" institucional de exemplo, sem depender de arquivo ou CDN. */
const FOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900"><defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient></defs><rect width="800" height="900" fill="url(#c)"/><circle cx="620" cy="180" r="70" fill="#fde68a"/><path d="M0 620 L180 460 L330 580 L520 400 L800 640 L800 900 L0 900Z" fill="#15803d"/><path d="M0 700 L260 560 L470 690 L800 560 L800 900 L0 900Z" fill="#166534"/><rect x="300" y="520" width="200" height="220" fill="#f8fafc"/><polygon points="280,520 400,440 520,520" fill="#b91c1c"/><rect x="380" y="640" width="40" height="100" fill="#475569"/></svg>`,
  );

/* ---------- B22: páginas ---------- */

function FormularioLogin() {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <Input label="Usuário ou e-mail" leftIcon={<Mail />} placeholder="seu@email.gov.br" type="email" />
      <PasswordInput label="Senha" leftIcon={<Lock />} placeholder="••••••••" error="Senha obrigatória" />
      <div className="flex items-center justify-between text-sm">
        <Checkbox label="Lembrar de mim" />
        <Button variant="link">Esqueci minha senha</Button>
      </div>
      <ErrorInline size="sm" message="Usuário ou senha inválidos." />
      <Button type="submit" size="lg" fullWidth>
        Entrar
      </Button>
    </form>
  );
}

export function Paginas() {
  return (
    <div className="space-y-6">
      <Miniatura rotulo="AuthLayout — login dividido (formulário onDark + foto com gradiente)">
        <AuthLayout
          title="SGDM"
          description="Sistema de Gestão Documental Municipal"
          image={{ src: FOTO }}
          headline="Gestão, controle e transparência em um só lugar."
          tagline="Rastreabilidade, auditoria e workflow oficial para a administração municipal."
        >
          <FormularioLogin />
        </AuthLayout>
      </Miniatura>
      <div className="grid gap-6 xl:grid-cols-2">
        <Miniatura rotulo="AuthCard — formulário no escuro">
          <AuthCard title="Redefinir senha" description="Escolha uma nova senha para a sua conta no SGDM.">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <PasswordInput label="Nova senha" leftIcon={<Lock />} hint="Pelo menos 6 caracteres" />
              <PasswordInput label="Confirme a nova senha" leftIcon={<Lock />} error="As senhas não conferem" />
              <Button type="submit" size="lg" fullWidth>
                Redefinir senha
              </Button>
              <Button variant="link" fullWidth>
                Voltar ao login
              </Button>
            </form>
          </AuthCard>
        </Miniatura>
        <Miniatura rotulo="AuthCard + AuthMessage tone=success">
          <AuthCard title="Redefinir senha">
            <AuthMessage
              tone="success"
              icon={CheckCircle2}
              title="Senha redefinida"
              description="Faça login com a nova senha."
              action={
                <Button size="lg" fullWidth>
                  Ir para o login
                </Button>
              }
            />
          </AuthCard>
        </Miniatura>
        <Miniatura rotulo='PublicLayout width="sm" — entrada do código'>
          <PublicLayout
            title="Verificação de assinatura"
            description="Informe o código impresso no documento"
            footer="Assinatura eletrônica nos termos da Lei nº 14.063/2020."
          >
            <Card>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input label="Código de validação" placeholder="TR-2026-A8F9-7C32" hint="O código aparece no carimbo de assinatura." />
                <Button type="submit" fullWidth>
                  Verificar
                </Button>
              </form>
            </Card>
          </PublicLayout>
        </Miniatura>
        <Miniatura rotulo="ErrorPage — o app/error.tsx">
          <ErrorPage error={new Error('Não foi possível falar com o servidor.')} icon={ServerCrash} onRetry={() => undefined} />
        </Miniatura>
      </div>
      <Card title="ErrorPage fullScreen={false}" description="Dentro da área de conteúdo do AppLayout">
        <ErrorPage fullScreen={false} onRetry={() => undefined} actions={<Button variant="secondary">Voltar ao início</Button>} />
      </Card>
    </div>
  );
}

/* ---------- B23: kanban ---------- */

export function Kanban() {
  const badge = (s: string) => (
    <StatusBadge status={s} colors={LICITACAO_STATUS_COLORS} labels={LICITACAO_STATUS_LABELS} size="sm" case="normal" />
  );
  return (
    <KanbanBoard label="Processos por fase">
      <KanbanColumn title="Instrução da demanda" subtitle="Secretaria">
        <KanbanCard
          href="#kanban"
          code="PROC-2026-0012"
          title="Aquisição de gêneros alimentícios para a merenda escolar do segundo semestre"
          badge={badge('EM_INSTRUCAO')}
          meta="R$ 184.500,00"
          extra={<Chip size="xs" tone="neutral">DFDs 2/3</Chip>}
          footer="Em: SEMED"
        />
        <KanbanCard href="#kanban" code="PROC-2026-0015" title="Reforma da UBS Centro" badge={badge('RASCUNHO')} meta="R$ 96.000,00" />
      </KanbanColumn>
      <KanbanColumn title="Planejamento" subtitle="Compras">
        <KanbanCard
          href="#kanban"
          code="PE 04/2026"
          title="Locação de veículos para a Secretaria de Saúde"
          badge={badge('EM_PLANEJAMENTO')}
          meta="R$ 420.000,00"
          footer="Em: SECAD"
        />
      </KanbanColumn>
      <KanbanColumn title="Análise jurídica" subtitle="Procuradoria" />
      <KanbanColumn title="Contratação" subtitle="Contratos">
        <KanbanCard onClick={() => alert('onClick')} code="DL 11/2026" title="Serviço de dedetização" badge={badge('AUTORIZADO')} meta="R$ 8.900,00" />
      </KanbanColumn>
    </KanbanBoard>
  );
}

/* ---------- B24: painel inicial ---------- */

const TITULOS_PERFIL: Record<(typeof PROFILES)[number], [string, string]> = {
  rh: ['Painel do RH', 'Analise as solicitações de numeração e acompanhe o arquivamento.'],
  secretaria: ['Painel da Secretaria', 'Solicite numerações, redija documentos e publique no DO.'],
  prefeito: ['Painel do Prefeito', 'Documentos aguardando a sua assinatura.'],
  gabinete: ['Painel do Gabinete', 'Acompanhe o fluxo dos atos do gabinete.'],
  plataforma: ['Painel da Plataforma', 'Prefeituras, cadastros e configurações.'],
};

export function Painel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-2">
        {PROFILES.map((p) => (
          <div key={p}>
            <Rotulo>{`DashboardHero profile="${p}"`}</Rotulo>
            <DashboardHero profile={p} headingLevel="h2" title={TITULOS_PERFIL[p][0]} description={TITULOS_PERFIL[p][1]} icon={Landmark} />
          </div>
        ))}
        <div>
          <Rotulo>DashboardHero variant=&quot;solid&quot;</Rotulo>
          <DashboardHero
            profile="plataforma"
            variant="solid"
            headingLevel="h2"
            icon={Shield}
            title="Dashboard — Dono da Plataforma"
            description="Você administra o SGDM multi-tenant. Selecione uma prefeitura para cadastrar secretarias, usuários, tipos e modelos."
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Prefeituras ativas" value={12} icon={Building2} tone="rose" href="#painel" />
        <MiniStat label="Usuários" value={348} icon={Users} tone="indigo" />
        <MiniStat label="Carregando" value={0} icon={Hash} tone="teal" loading />
        <MiniStat label="Cadastros por prefeitura" description="Usuários, secretarias, modelos…" icon={UserCog} variant="dashed" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <QuickActions
          title="Ações rápidas — Secretaria"
          actions={[
            { href: '#painel', label: 'Nova solicitação', icon: Hash },
            { href: '#painel', label: 'Corrigir devolvidas', icon: RotateCcw },
            { href: '#painel', label: 'Meus documentos', icon: FileSearch },
            { href: '#painel', label: 'Publicar no DO', icon: Newspaper },
          ]}
        />
        <QuickActions
          title="Ações rápidas — Prefeito"
          profile="prefeito"
          actions={[
            { href: '#painel', label: 'Assinar documentos', icon: FileSignature },
            { href: '#painel', label: 'Ver fila completa', icon: FileSearch },
            { href: '#painel', label: 'Controladoria', icon: FileStack },
            { href: '#painel', label: 'Relatórios', icon: FilePlus },
          ]}
        />
        <QuickActions
          title="Ações rápidas — RH"
          profile="rh"
          actions={[
            { href: '#painel', label: 'Analisar numerações', icon: Hash },
            { href: '#painel', label: 'Solicitações em análise', icon: FileSearch },
            { href: '#painel', label: 'Arquivamento', icon: FileStack },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <QueueCard
            title="Fila de assinatura"
            subtitle="Documentos aguardando sua revisão e assinatura"
            icon={FileSignature}
            tone="violet"
            href="#painel"
            hrefLabel="Ver fila completa"
          >
            <ul className="divide-y divide-border-subtle text-sm">
              {['Portaria 112/2026 — Nomeação', 'Decreto 45/2026 — Ponto facultativo', 'Portaria 113/2026 — Férias'].map((t) => (
                <li key={t} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-label">{t}</span>
                  <Button size="sm" variant="secondary">
                    Revisar e assinar
                  </Button>
                </li>
              ))}
            </ul>
          </QueueCard>
          <QueueCard title="Solicitações devolvidas" subtitle="Corrija e reenvie ao RH" icon={RotateCcw} tone="amber" href="#painel" empty="Nenhuma solicitação devolvida." />
        </div>
        <div className="space-y-6 xl:col-span-4">
          <MiniCalendar />
          <CountList
            title="Pendências"
            href="#painel"
            items={[
              { id: 'a', label: STATUS_LABELS.SOLICITACAO_ABERTA ?? 'Solicitação aberta', count: 3, tone: 'amber', href: '#painel' },
              { id: 'b', label: STATUS_LABELS.EM_ANALISE ?? 'Em análise', count: 5, tone: 'orange', href: '#painel' },
              { id: 'c', label: STATUS_LABELS.AGUARDANDO_ASSINATURA ?? 'Aguardando assinatura', count: 12, tone: 'purple', href: '#painel' },
              { id: 'd', label: STATUS_LABELS.ASSINADO ?? 'Assinado', count: 4, tone: 'emerald', href: '#painel' },
            ]}
          />
          <CountList title="Sua fila" items={[]} />
        </div>
      </div>
    </div>
  );
}

/* ---------- B28: gráficos ---------- */

const POR_STATUS = {
  SOLICITACAO_ABERTA: 4,
  EM_ANALISE: 7,
  EM_ELABORACAO: 9,
  AGUARDANDO_ASSINATURA: 5,
  ASSINADO: 3,
  PUBLICADO: 14,
  CANCELADO: 0,
};

/** Rosca em SVG puro: o catálogo não instala o recharts (é opcional). */
function RoscaDeExemplo({ dados }: { dados: { key: string; value: number; color: string }[] }) {
  const total = dados.reduce((s, d) => s + d.value, 0);
  const r = 70;
  const volta = 2 * Math.PI * r;
  let acumulado = 0;
  return (
    <svg viewBox="0 0 208 208" className="h-full w-full -rotate-90">
      {dados.map((d) => {
        const trecho = (d.value / total) * volta;
        const arco = (
          <circle
            key={d.key}
            cx="104"
            cy="104"
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="30"
            strokeDasharray={`${Math.max(trecho - 3, 0)} ${volta}`}
            strokeDashoffset={-acumulado}
          />
        );
        acumulado += trecho;
        return arco;
      })}
    </svg>
  );
}

function BarrasDeExemplo() {
  const c = chartProps();
  const dados = [
    ['Educação', 42],
    ['Saúde', 35],
    ['Administração', 28],
    ['Obras', 17],
    ['Assistência Social', 9],
  ] as const;
  const max = 42;
  return (
    <svg viewBox="0 0 520 256" className="h-full w-full" role="presentation">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={120 + i * 95} x2={120 + i * 95} y1="10" y2="236" stroke={c.grid.stroke} strokeDasharray={c.grid.strokeDasharray} />
      ))}
      {dados.map(([nome, v], i) => (
        <g key={nome}>
          <text x="112" y={34 + i * 45} textAnchor="end" fontSize={c.axis.tick.fontSize} fill={c.axis.tick.fill}>
            {nome}
          </text>
          <rect x="120" y={20 + i * 45} width={(v / max) * 380} height="24" rx="4" fill={c.barHorizontal.fill} />
        </g>
      ))}
    </svg>
  );
}

export function Graficos() {
  const dados = toChartData(POR_STATUS, { labels: STATUS_LABELS });
  const total = dados.reduce((s, d) => s + d.value, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Documentos por status"
          center={{ label: 'Total', value: total }}
          chartLabel={`Rosca com ${dados.length} status`}
          legend={<ChartLegend label="Documentos por status" items={dados} total={total} />}
        >
          <RoscaDeExemplo dados={dados} />
        </ChartCard>
        <ChartCard title="Documentos por secretaria" description="Os 5 maiores do período" actions={<Button size="sm" variant="secondary">Exportar</Button>}>
          <BarrasDeExemplo />
        </ChartCard>
        <ChartCard title="Publicações por mês" empty />
        <ChartCard title="Tempo médio por fase" loading />
      </div>
      <Card title="Os helpers de config para o recharts" description="chartProps() — o recharts é opcional, e o pacote nunca o importa">
        <pre className="overflow-x-auto rounded-control bg-surface-muted p-4 font-mono text-xs text-label">
          {JSON.stringify(chartProps(), null, 2)}
        </pre>
      </Card>
    </div>
  );
}

/* ---------- B29: editor ---------- */

const TEXTO = `<h1>PORTARIA Nº 112, DE 12 DE SETEMBRO DE 2026</h1>
<p style="text-align: justify">O <strong>PREFEITO MUNICIPAL</strong>, no uso das atribuições que lhe confere a Lei Orgânica do Município, <em>resolve</em>:</p>
<h2>Art. 1º</h2>
<p>Nomear <u>MARIA DA SILVA</u> para o cargo de provimento em comissão de Diretora de Compras, com lotação na:</p>
<ul><li><p>Secretaria Municipal de Administração;</p></li><li><p>Departamento de Licitações.</p></li></ul>
<h3>Parágrafo único</h3>
<ol><li><p>A nomeação produz efeitos a partir da publicação.</p></li><li><p>Revogam-se as disposições em contrário.</p></li></ol>
<blockquote><p>Registre-se, publique-se e cumpra-se.</p></blockquote>
<table><thead><tr><th>Cargo</th><th>Símbolo</th><th>Lotação</th></tr></thead><tbody><tr><td>Diretora de Compras</td><td>CC-3</td><td>SEMAD</td></tr></tbody></table>`;

export function Editor() {
  const [ativos, setAtivos] = useState<Record<string, boolean>>({ negrito: true });
  const [tamanho, setTamanho] = useState('12pt');
  const alternar = (k: string) => setAtivos((a) => ({ ...a, [k]: !a[k] }));
  return (
    <div className="space-y-6">
      <div>
        <Rotulo>EditorFrame + EditorToolbar (a área editável aqui é um contentEditable; no sistema, o Tiptap)</Rotulo>
        <EditorFrame
          label="Texto da portaria"
          toolbar={
            <EditorToolbar>
              <EditorFontSizeSelect value={tamanho} onChange={setTamanho} />
              <EditorToolbarSeparator />
              <EditorToolbarButton label="Negrito" icon={<Bold />} active={!!ativos.negrito} onClick={() => alternar('negrito')} />
              <EditorToolbarButton label="Itálico" icon={<Italic />} active={!!ativos.italico} onClick={() => alternar('italico')} />
              <EditorToolbarButton label="Sublinhado" icon={<Underline />} active={!!ativos.sub} onClick={() => alternar('sub')} />
              <EditorToolbarButton label="Tachado" icon={<Strikethrough />} active={!!ativos.tachado} onClick={() => alternar('tachado')} />
              <EditorToolbarSeparator />
              <EditorToolbarButton label="Título 1" active={!!ativos.h1} onClick={() => alternar('h1')}>
                H1
              </EditorToolbarButton>
              <EditorToolbarButton label="Título 2" active={!!ativos.h2} onClick={() => alternar('h2')}>
                H2
              </EditorToolbarButton>
              <EditorToolbarButton label="Texto normal" active={!ativos.h1 && !ativos.h2} onClick={() => setAtivos((a) => ({ ...a, h1: false, h2: false }))}>
                P
              </EditorToolbarButton>
              <EditorToolbarSeparator />
              <EditorToolbarButton label="Lista com marcadores" icon={<List />} active={false} onClick={() => undefined} />
              <EditorToolbarButton label="Lista numerada" icon={<ListOrdered />} active={false} onClick={() => undefined} />
              <EditorToolbarSeparator />
              <EditorToolbarButton label="Alinhar à esquerda" icon={<AlignLeft />} active onClick={() => undefined} />
              <EditorToolbarButton label="Centralizar" icon={<AlignCenter />} active={false} onClick={() => undefined} />
              <EditorToolbarButton label="Justificar" icon={<AlignJustify />} active={false} onClick={() => undefined} />
              <EditorToolbarSeparator />
              <EditorToolbarButton label="Desfazer" icon={<Undo />} onClick={() => undefined} />
              <EditorToolbarButton label="Refazer" icon={<Redo />} disabled onClick={() => undefined} />
            </EditorToolbar>
          }
        >
          <div
            className="ProseMirror"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{
              __html: TEXTO.replace('MARIA DA SILVA', '<span class="marcador-preencher">[NOME DO SERVIDOR]</span>'),
            }}
          />
        </EditorFrame>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <Rotulo>EditorFrame html=… (modo leitura, com .documento)</Rotulo>
          <EditorFrame html={TEXTO} />
        </div>
        <div className="space-y-6">
          <div>
            <Rotulo>EditorFrame loading</Rotulo>
            <EditorFrame loading />
          </div>
          <Card title="DocumentContent justify" description="O texto de uma peça fora do editor">
            <DocumentContent justify html="<p>Considerando a necessidade de contratação de empresa especializada para o fornecimento de gêneros alimentícios destinados à merenda escolar, conforme o Estudo Técnico Preliminar anexo, e em observância ao art. 18 da Lei nº 14.133/2021, <strong>justifica-se</strong> a presente contratação.</p>" />
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- B30: impressão ---------- */

export function Impressao() {
  return (
    <PrintSheet
      label="Processo PROC-2026-0012"
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" icon={<ArrowLeft />} href="#impressao">
            Voltar ao processo
          </Button>
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted">Use a impressão do navegador e escolha “Salvar como PDF”</p>
            <Button icon={<Printer />} onClick={() => window.print()}>
              Imprimir
            </Button>
          </div>
        </div>
      }
    >
      <PrintCover
        organization="Prefeitura Municipal de Exemplo"
        location="Exemplo — RS"
        title="Processo de Contratação"
        code="PROC-2026-0012 · PE 04/2026"
      />
      <PrintSection title="Identificação">
        <dl className="space-y-1.5 text-sm">
          <div className="flex gap-2">
            <dt className="font-semibold">Objeto:</dt>
            <dd>Aquisição de gêneros alimentícios para a merenda escolar</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">Valor estimado:</dt>
            <dd>R$ 184.500,00</dd>
          </div>
        </dl>
      </PrintSection>
      <PrintSection title="Itens">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-strong text-left">
              <th className="py-1.5 pr-2">Nº</th>
              <th className="py-1.5 pr-2">Descrição</th>
              <th className="py-1.5">Valor total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-1.5 pr-2">1</td>
              <td className="py-1.5 pr-2">Arroz tipo 1, pacote de 5 kg</td>
              <td className="py-1.5">R$ 42.000,00</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-1.5 pr-2">2</td>
              <td className="py-1.5 pr-2">Feijão carioca, pacote de 1 kg</td>
              <td className="py-1.5">R$ 18.300,00</td>
            </tr>
          </tbody>
        </table>
      </PrintSection>
      <PrintSection piece title="Estudo Técnico Preliminar" subtitle="Art. 18, § 1º, da Lei nº 14.133/2021" code="ETP-2026-0031" aside="Fls. 2">
        <DocumentContent
          justify
          html="<p>A contratação visa atender à demanda de alimentação escolar da rede municipal, com cerca de 4.200 alunos atendidos diariamente.</p><ol><li><p>Descrição da necessidade;</p></li><li><p>Estimativa das quantidades;</p></li><li><p>Levantamento de mercado.</p></li></ol>"
        />
        <p className="mt-6 border-t border-border pt-2 text-2xs text-muted">Aprovada em 12 de setembro de 2026 · Hash da versão: 9f2c1a7b4e8d0c63…</p>
      </PrintSection>
      <PrintSection title="Documentos anexados" breakBefore>
        <ol className="space-y-1 text-sm">
          <li>
            1. Pesquisa de preços <span className="text-muted">— Planejamento</span>
          </li>
          <li>
            2. Parecer jurídico <span className="text-muted">— Análise jurídica</span>
          </li>
        </ol>
      </PrintSection>
    </PrintSheet>
  );
}

