# @sgdm/design

O visual do SGDM empacotado para os sistemas novos nascerem com a mesma aparência: tokens em variáveis CSS, um preset do Tailwind e componentes React.

- **Tokens** (`tokens.css`): cores, famílias de tom, tema por perfil, fontes, tamanhos, raios, sombras, camadas (z-index), tempo e medidas de layout, com nomes de papel (`--sd-color-primary`, `--sd-radius-control`, `--sd-z-modal`). A fonte Inter vem dentro do pacote, sem CDN. Veja [Tokens](#tokens).
- **Preset do Tailwind** (`tailwind-preset`): expõe os tokens como `bg-primary`, `text-muted`, `rounded-control` e `shadow-card`, e injeta as classes `.card`, `.btn-*`, `.input`, `.nav-item`… do SGDM.
- **Componentes**: Button, IconButton, Card, Input, PasswordInput, Textarea, Select, Checkbox, CheckboxCard, CheckboxGroup, FileUpload, FileButton, FormField, FormSection, Modal, ConfirmModal, PageHeader, StatusBadge, StatCard, Table, Tabs, Toast (`ToastProvider` + `useToast`), Alert (Callout), Spinner, LoadingState, Skeleton, PageSkeleton, EmptyState, ErrorState, Eyebrow (Overline), Chip (Tag), IconTile, DescriptionList, KeyValue, WizardStepper, NumberedSteps, ProcessStepper, Timeline, FlowChips, SegmentedControl, FilterBar, SearchInput, SelectableList, Popover, Dropdown, NotificationBell, CounterBadge, PdfViewer, InlineCode (Mono), StickyAside, Tooltip (DicaInfo), CollapsibleCard, Accordion, KanbanBoard, KanbanColumn, KanbanCard, DashboardHero, QuickActions, QueueCard, CountList, MiniStat, MiniCalendar, ChartCard, ChartLegend, EditorFrame, EditorToolbar (com EditorToolbarButton, EditorToolbarSeparator e EditorFontSizeSelect), DocumentContent, PrintSheet, PrintCover, PrintSection, NoPrint, AppLayout, Sidebar, Header, NavigationProgress, AuthLayout, AuthCard, AuthMessage, PublicLayout e ErrorPage.
- **Impressão** (`print.css`): a folha A4 do processo administrativo, com as classes `.nao-imprimir`, `.quebra-pagina`, `.folha-processo` e `.peca-impressa` do SGDM.
- **Gráficos**: padrões de cor, grade e eixo para o recharts (`chartProps`), sem depender dele.

A tabela [Padrão do SGDM → componente do pacote](#padrão-do-sgdm--componente-do-pacote) diz o que usar no lugar de cada coisa que o SGDM repetia à mão.

Para ver tudo funcionando, rode `npm run catalogo` neste repositório.

## Instalação (pelo git)

O pacote não é publicado no npm. Ele é instalado direto do repositório:

```bash
npm install github:<usuario>/sgdm-design
# ou uma versão fixa (tag ou commit)
npm install github:<usuario>/sgdm-design#v0.2.0
```

Na instalação, o npm roda o script `prepare`, que gera o `dist/`. Precisa de Node 18 ou mais novo.

Dependências que o sistema já deve ter (peer dependencies):

| Pacote | Versão |
| --- | --- |
| `react` / `react-dom` | 18 ou 19 |
| `tailwindcss` | 3.4 |
| `lucide-react` | qualquer versão recente |
| `recharts` | 2 ou mais novo — **opcional**, só para quem desenha gráficos |

O pacote nunca importa o `recharts`: `ChartCard`, `ChartLegend` e os helpers de `chartProps` funcionam sem ele instalado. Quem quer o gráfico instala o recharts no próprio sistema e espalha as props prontas nos componentes dele.

## Configurar o Tailwind

Em `tailwind.config.ts` (ou `.js`), use o preset e inclua o `dist` do pacote em `content`. Sem isso, o Tailwind não gera as classes que os componentes usam.

```ts
import type { Config } from 'tailwindcss';
import sgdm from '@sgdm/design/tailwind-preset';

export default {
  presets: [sgdm],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@sgdm/design/dist/**/*.{js,cjs}',
  ],
} satisfies Config;
```

Com CommonJS, use `presets: [require('@sgdm/design/tailwind-preset')]`.

O preset coloca as classes de componente (`.card`, `.btn-primary`…) na camada `components` do Tailwind, na mesma ordem do `globals.css` do SGDM. Por isso não é preciso importar o `components.css`. Um utilitário sempre vence a classe de componente, então `className="btn-primary px-6"` continua funcionando nas telas antigas.

## Importar o CSS

Importe os tokens **uma vez**, antes do CSS do Tailwind.

Next.js (`app/layout.tsx`):

```tsx
import '@sgdm/design/tokens.css';
import './globals.css'; // o arquivo com @tailwind base/components/utilities
```

Vite (`main.tsx`) funciona do mesmo jeito. Outra forma é colocar no topo do CSS de entrada:

```css
@import '@sgdm/design/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Com isso, o `globals.css` do sistema não precisa mais do `@import` do Google Fonts nem do bloco `:root` com as cores.

Para imprimir (a folha do processo, com Ctrl+P ou "Salvar como PDF"), importe também o `print.css`, **depois** dos tokens:

```tsx
import '@sgdm/design/tokens.css';
import '@sgdm/design/print.css';
import './globals.css';
```

Ele só age no papel (`@media print`): página A4 com margens de 20mm × 18mm, some com o menu, o cabeçalho e o que tiver `.nao-imprimir`, e põe as tabelas com borda `#999` e 10pt (tudo por token). As regras que disputam com utilitários do Tailwind levam `!important`, então a ordem dos imports não importa. O SGDM tinha isso no fim do `globals.css`; quem migrar tira de lá.

`@sgdm/design/components.css` é o fonte das classes de componente, em sintaxe do Tailwind (`@layer`/`@apply`). Ele vai no pacote para consulta. Quem usa o preset não precisa dele.

## Uso

```tsx
import { Plus } from 'lucide-react';
import {
  Button, Input, Select, Modal, ConfirmModal, PageHeader, Table, StatusBadge,
  EmptyState, ErrorState, ToastProvider, useToast,
} from '@sgdm/design';

export function Secretarias({ dados, isLoading, error }) {
  const toast = useToast();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <PageHeader
        title="Secretarias"
        description="Órgãos da prefeitura"
        action={<Button icon={<Plus />} onClick={() => setAberto(true)}>Nova</Button>}
      />

      <ErrorState error={error} />

      <Table
        caption="Secretarias"
        loading={isLoading}
        rows={dados}
        columns={[
          { key: 'nome', header: 'Nome', emphasis: true },
          { key: 'sigla', header: 'Sigla' },
          { key: 'ativo', header: 'Status', render: (s) => <StatusBadge active={s.ativo} /> },
        ]}
        empty={<EmptyState title="Nenhuma secretaria cadastrada" />}
      />

      <Modal
        open={aberto}
        title="Nova secretaria"
        onClose={() => setAberto(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
            <Button onClick={() => toast.success('Secretaria salva')}>Salvar</Button>
          </>
        }
      >
        <Input label="Nome" required error={erros.nome} />
        <Select label="Tipo" placeholder="Selecione…" options={[{ value: 'adm', label: 'Administração' }]} />
      </Modal>
    </>
  );
}

// Uma vez, na raiz da aplicação:
<ToastProvider><App /></ToastProvider>
```

Os outros componentes:

```tsx
<Button variant="danger" size="sm" loading={salvando}>Excluir</Button>
<Button variant="govbr">Entrar com gov.br</Button>

<ConfirmModal open title="Excluir modelo?" message="Não pode ser desfeito."
  variant="danger" confirmLabel="Excluir" onConfirm={excluir} onClose={fechar} />

{/* Pede um motivo (o antigo MotivoModal) */}
<ConfirmModal open title="Devolver" confirmLabel="Devolver" onConfirm={devolver} onClose={fechar}
  reason={{ value: motivo, onChange: setMotivo, label: 'Motivo da devolução' }} />

<StatCard title="Publicados" value={42} icon={Newspaper} tone="success" href="/publicados" linkComponent={Link} />
<StatusBadge status="EM_ANALISE" />                 {/* mapa padrão: STATUS_COLORS do SGDM */}
<StatusBadge status="PAGO" colors={MEU_MAPA} labels={{ PAGO: 'Pago' }} />
<Tabs items={[{ id: 'a', label: 'Abertos', content: <Lista /> }, { id: 'b', label: 'Fechados', content: <Lista2 /> }]} />
<WizardStepper current={2} steps={[{ title: 'Dados' }, { title: 'Anexos' }, { title: 'Revisão' }]} />
<Tooltip text="Explicação curta" />
<CollapsibleCard title="Assinatura" badge={<StatusBadge active />}>…</CollapsibleCard>
```

Variantes que completam os componentes (v0.2):

```tsx
{/* Table: total no rodapé, seleção, compacta, cabeçalho em caixa-alta, sem card */}
<Card title="Itens" padding="none">
  <Table bare density="compact" headerCase="upper"
    selectable selected={sel} onSelectedChange={setSel}
    selectRowLabel={(i) => `Selecionar item ${i.numero}`}
    columns={colunas} rows={itens}
    footer={{ label: 'Valor estimado do processo', values: { total: 'R$ 4.936,00' } }} />
</Card>

<Card tone="warning" padding="sm">…</Card>          {/* padding: none | sm | md | lg */}
<StatCard title="Portarias" value={8} icon={FileText} tone="violet" />  {/* + emerald, teal, sky, amber, purple, orange, indigo, rose, cyan */}

{/* StatusBadge: size xs|sm, case upper|normal, variant pill|outline, e os mapas do SGDM */}
<StatusBadge status={l.status} colors={LICITACAO_STATUS_COLORS} labels={LICITACAO_STATUS_LABELS} size="sm" case="normal" />
<StatusBadge variant="outline" size="sm" case="normal" status={ativa ? 'ATIVA' : 'INATIVA'} colors={LICITACAO_FASE_COLORS}>
  {LICITACAO_FASE_LABELS[fase]}
</StatusBadge>
{/* Também: NUMERACAO_STATUS_COLORS, LICITACAO_SITUACAO_COLORS, PECA_STATUS_COLORS, PECA_ESTADO_COLORS e os *_LABELS */}

<CollapsibleCard title="IA" open={aberto} onOpenChange={setAberto}>…</CollapsibleCard>
<Accordion items={[{ id: 'etp', title: 'ETP', description: 'Art. 18', meta: '4 seções', content: <Form /> }]} />

<Tooltip text="Dica" placement="right" />          {/* top | bottom | left | right */}
<EmptyState variant="dashed" icon={Paperclip} title="Nenhum anexo." />
<Select size="compact" icon={<Building2 />} aria-label="Prefeitura em gestão" options={prefeituras} />
```

Componentes novos da v0.2 (padrões que o SGDM repetia à mão):

```tsx
{/* Aviso (callout): info | warning | success | danger | violet | purple | neutral.
    danger vira role="alert"; os demais, role="note" (ou role="status" por prop). */}
<Alert tone="warning" icon={AlertTriangle} title="Sem temporalidade"
  actions={<Button size="sm" variant="secondary">Cadastrar</Button>} onClose={fechar}>
  Documentos desses tipos não ficam elegíveis a destinação.
</Alert>
<Alert variant="stage" title="Etapa 3 — Elaboração.">Preencha os campos e salve.</Alert>
<Alert tone="danger" size="sm">{erro}</Alert>

{/* Carregamento */}
<Spinner size="sm" />                          {/* xs | sm | md | lg; com label vira role="status" */}
<LoadingState />                               {/* bloco py-16; o texto vai ao leitor de tela */}
<LoadingState mode="inline" label="Carregando histórico…" />
<Skeleton shape="title" /> <Skeleton lines={3} /> <Skeleton shape="card" />
<PageSkeleton />                               {/* o loading.tsx do painel */}

{/* Rótulos e ícones */}
<Eyebrow>Identificação</Eyebrow>               {/* 11px, caixa-alta; size, weight, tone, as */}
<Chip tone="indigo">RH</Chip>                   {/* variant filled | soft | outline; size xs | sm */}
<Chip mono size="xs">licitacao.editar</Chip>
<IconTile icon={Users} tone="teal" shape="circle" variant="tint" />

{/* Botões */}
<Button variant="link">Ver todas</Button>       {/* + success e danger-outline; size="lg" (py-3) */}
<Button href="/novo" linkComponent={Link} icon={<Plus />}>Novo</Button>
<Button asChild variant="secondary"><Link href="/lista">Lista</Link></Button>
<IconButton icon={<Trash2 />} aria-label="Excluir" variant="danger" size="sm" />  {/* aria-label obrigatório; size xs | sm | md */}

{/* Lista de dados (<dl>): rows | grid | tiles | compact */}
<DescriptionList variant="rows" items={[{ label: 'Protocolo', value: p, mono: true }, { label: 'Órgão', value: o }]} />
<KeyValue label="Servidor" value={nome} />

{/* Formulário */}
<Input label="E-mail" leftIcon={<Mail />} />
<Input label="Valor" prefix="R$" />  <Input label="Desconto" suffix="%" />
<PasswordInput label="Senha" {...register('senha')} />   {/* volta a ocultar em 10 s */}
<Checkbox label="Perfil ativo" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
<Checkbox aria-label="Todos" indeterminate />   {/* aria-checked="mixed" */}
<CheckboxCard label="Editar" meta="licitacao.editar" description="Altera dados do processo" />
<CheckboxGroup title="Licitações" selectAllLabel="Selecionar módulo" options={perms} value={sel} onChange={setSel} />
<FileUpload files={arquivos} onChange={setArquivos} maxFiles={5} />
<FileButton accept="application/pdf,.pdf" onFiles={([f]) => enviar(f)} variant="primary">Carregar assinado</FileButton>
```

Navegação, histórico, menus e documento (v0.2):

```tsx
{/* Linha do tempo: icon (histórico) | dots (workflow curto) | phases (fases da licitação) */}
<Timeline label="Movimentações" tone="info" empty="Nenhuma movimentação registrada."
  items={[{ id, title: 'Documento assinado', subtitle: 'Aguardando → Assinado',
    author: { name: 'Maria', role: 'Prefeita' }, date: '12/09/2026 14:32', meta: 'IP 10.0.0.1', icon: CheckCircle2 }]} />
<Timeline variant="phases" items={fases.map((f) => ({ id: f.id, title: f.nome, status: 'done', aside: f.setor }))} />
{/* status: done | current | returned | pending */}

{/* Passos */}
<NumberedSteps steps={[{ title: 'Baixe o PDF', content: <Button size="sm">Baixar</Button> }, { title: 'Assine', description: '…' }]} />
<ProcessStepper current={3} steps={[{ label: 'Solicitação' }, { label: 'Análise' }, { label: 'Elaboração' }]} />
<WizardStepper variant="tiles" current={2} linkComponent={Link}
  steps={[{ title: 'Secretarias', description: 'as unidades', href: '/cadastros/secretarias' }, …]} />
<WizardStepper bare current={2} steps={passos} />      {/* sem o card */}
<FlowChips tone="indigo" label="Fluxo" steps={['Solicitar', 'Analisar', 'Assinar']} />

{/* Abas em pílula (cor por aba) e escolha entre poucas opções */}
<Tabs variant="pill" items={[{ id: 'dados', label: 'Dados' }, { id: 'analise', label: 'Análise', tone: 'indigo' }]} />
<SegmentedControl label="Filtrar" value={f} onChange={setF} options={[{ value: 'todos', label: 'Todos' }, …]} />

{/* Filtros e busca */}
<FilterBar onClear={limpar} columns={4}>
  <SearchInput aria-label="Buscar" value={q} onValueChange={setQ} onSearch={buscar} />   {/* Enter busca, Esc limpa */}
  <Select aria-label="Tipo" options={tipos} />
</FilterBar>

{/* Lista mestre (tela mestre/detalhe): item ativo com aria-current, setas andam */}
<SelectableList label="Perfis" icon={Shield} items={perfis} value={id} onChange={setId} />

{/* Menus e painéis: fecham com Esc (devolvendo o foco), clique fora e Tab */}
<Dropdown label="Ações" trigger={<IconButton icon={<MoreHorizontal />} aria-label="Ações" />}
  items={[{ id: 'editar', label: 'Editar', icon: Pencil, onSelect: editar }, { id: 's', separator: true },
    { id: 'excluir', label: 'Excluir', tone: 'danger', onSelect: excluir }]} />
<Popover label="Filtros avançados" trigger={<Button variant="secondary">Mais filtros</Button>}>
  {({ close }) => <Form onDone={close} />}
</Popover>
<NotificationBell count={naoLidas} items={itens} loading={isLoading} onOpenChange={setAberto}
  onItemClick={marcarLida} onMarkAllRead={marcarTodas} footerHref="/notificacoes" linkComponent={Link} />
<CounterBadge count={3}><Bell /></CounterBadge>          {/* "9+" acima de max; formatCount(n, max) */}

{/* Documento */}
<PdfViewer src={blobUrl} title="Prévia do documento" onRefresh={recarregar} downloadName="portaria.pdf" />
<PdfViewer variant="page" src={url} title="PDF do documento" />   {/* object + link de download */}
<InlineCode size="xs">USUARIO_GERENCIAR</InlineCode>  <InlineCode size="xs" breakAll>{hash}</InlineCode>
<Mono size="sm" weight="semibold">{numeroProcesso}</Mono>
<StickyAside title="Conteúdo mínimo" description="Art. 18" tone="warning" icon={Scale}>…</StickyAside>
```

Páginas, painel, gráficos, editor e impressão (v0.2):

```tsx
{/* Login dividido: formulário no fundo escuro e foto com gradiente. Os campos,
    o link e o erro dentro dele usam a variante onDark sozinhos. */}
<AuthLayout title="SGDM" description="Sistema de Gestão Documental Municipal"
  image={{ src: '/imgVera.png' }} headline="Gestão, controle e transparência em um só lugar."
  tagline="Rastreabilidade, auditoria e workflow oficial.">
  <form onSubmit={entrar} className="space-y-5">
    <Input label="Usuário ou e-mail" leftIcon={<User />} {...register('email')} error={erros.email} />
    <PasswordInput label="Senha" leftIcon={<Lock />} {...register('senha')} />
    <Button variant="link" onClick={esqueci}>Esqueci minha senha</Button>
    <ErrorInline size="sm" message={erroGeral} />
    <Button type="submit" size="lg" fullWidth loading={enviando}>Entrar</Button>
  </form>
</AuthLayout>
<AuthCard title="Redefinir senha" description="Escolha uma nova senha.">
  <AuthMessage tone="success" icon={CheckCircle2} title="Senha redefinida"
    action={<Button size="lg" fullWidth href="/login" linkComponent={Link}>Ir para o login</Button>} />
</AuthCard>
<Input label="Nome" onDark />   {/* onDark por prop fora do AuthLayout, ou <OnDark>…</OnDark>; Card, Modal e Popover voltam ao claro */}
<PublicLayout title="Verificação de assinatura" description="Informe o código" width="sm" footer="Lei nº 14.063/2020.">…</PublicLayout>
<ErrorPage error={error} onRetry={reset} />     {/* o app/error.tsx inteiro; fullScreen={false} dentro do AppLayout */}

{/* Kanban só de leitura */}
<KanbanBoard label="Processos por fase">
  <KanbanColumn title="Planejamento" subtitle="Compras">
    <KanbanCard code={l.numeroProcesso} title={l.objeto} badge={<StatusBadge … />}
      meta={formatMoeda(l.valor)} footer={`Em: ${l.setor}`} href={`/licitacoes/${l.id}`} linkComponent={Link} />
  </KanbanColumn>
</KanbanBoard>

{/* Painel inicial */}
<DashboardHero profile="prefeito" title="Painel do Prefeito" description="…" icon={Landmark} />
<DashboardHero profile="plataforma" variant="solid" title="Dono da plataforma" icon={Shield} />
<QuickActions title="Ações rápidas — RH" profile="rh" linkComponent={Link}
  actions={[{ href: '/numeracoes', label: 'Analisar numerações', icon: Hash }]} />
<QueueCard title="Fila de assinatura" subtitle="…" icon={FileSignature} tone="violet" href="/assinaturas"
  empty="Nenhum documento aguardando assinatura."><DocumentoLista … /></QueueCard>
<CountList title="Pendências" href="/pendencias"
  items={[{ id: 'EM_ANALISE', label: 'Em análise', count: 5, tone: 'orange', href: '/numeracoes' }]} />
<MiniStat label="Prefeituras ativas" value={12} icon={Building2} tone="rose" />
<MiniCalendar />

{/* Gráficos: o recharts é da tela; o pacote dá o card, a legenda e as props */}
const dados = toChartData(porStatus, { labels: STATUS_LABELS });   // tira os zeros, põe cor e %
const c = chartProps();                                           // ou chartProps(getChartTheme()), que lê o tema
<ChartCard title="Documentos por status" center={{ label: 'Total', value: total }}
  legend={<ChartLegend items={dados} total={total} />}>
  <ResponsiveContainer><PieChart><Pie data={dados} dataKey="value" {...c.pie}>
    {dados.map((d) => <Cell key={d.key} fill={d.color} />)}
  </Pie></PieChart></ResponsiveContainer>
</ChartCard>
<BarChart …><CartesianGrid {...c.grid} /><XAxis {...c.axis} /><Bar dataKey="total" {...c.barHorizontal} /></BarChart>

{/* Editor: a moldura e a toolbar; o Tiptap fica com a tela */}
<EditorFrame loading={!editor} toolbar={
  <EditorToolbar>
    <EditorFontSizeSelect value={editor.getAttributes('textStyle').fontSize ?? ''} onChange={mudarTamanho} />
    <EditorToolbarSeparator />
    <EditorToolbarButton label="Negrito" icon={<Bold />} active={editor.isActive('bold')}
      onClick={() => editor.chain().focus().toggleBold().run()} />
  </EditorToolbar>}>
  <EditorContent editor={editor} />
</EditorFrame>
<EditorFrame html={conteudo} />                        {/* modo leitura */}
<DocumentContent html={peca.conteudoHtml} justify />   {/* no lugar do "prose prose-sm" */}

{/* Folha de impressão (com @sgdm/design/print.css importado) */}
<PrintSheet toolbar={<Button icon={<Printer />} onClick={() => window.print()}>Imprimir</Button>}>
  <PrintCover organization={prefeitura.nome} title="Processo de Contratação" code={p.numeroProcesso} />
  <PrintSection title="Identificação">…</PrintSection>
  <PrintSection piece title={peca.nome} subtitle={peca.fundamentoLegal} code={peca.protocolo} aside={`Fls. ${n}`}>
    <DocumentContent html={peca.conteudoHtml} justify />
  </PrintSection>
</PrintSheet>
```

`StatCard` e `EmptyState` desenham o ícone com o `IconTile`. As cores de chip, aviso e ícone saem dos mapas de `tones.ts`, um por degrau, escritos por extenso para o Tailwind achá-los no `dist`.

### Layout

Tudo que é específico do SGDM chega por prop: nome, ícone, itens de menu, seletor de prefeitura e notificações. O menu e o cabeçalho conversam pelo `AppLayout`, sem store externa.

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LayoutDashboard, Shield } from 'lucide-react';
import { AppLayout, Header, Sidebar } from '@sgdm/design';

export function Moldura({ children }) {
  const pathname = usePathname();
  return (
    <AppLayout
      navigating={carregando}
      sidebar={
        <Sidebar
          brand={{ name: 'SGDM', subtitle: 'Gestão Documental Municipal', icon: <Shield /> }}
          currentPath={pathname}
          linkComponent={Link}
          sections={[
            { label: 'Principal', items: [
              { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
              { href: '/documentos', label: 'Documentos', icon: FileText },
            ] },
          ]}
          onLogout={sair}
        />
      }
      header={
        <Header
          title={tituloDaPagina}
          actions={<><TenantSelector /><Notificacoes /></>}
          user={{ name: usuario.nome, subtitle: usuario.cargo }}
        />
      }
    >
      {children}
    </AppLayout>
  );
}
```

Um item do menu fica ativo quando o caminho é igual ao `href` ou é uma subpágina dele. Use `exact` para exigir o caminho exato, ou `active` para decidir por conta própria.

## Padrão do SGDM → componente do pacote

Tudo que o levantamento de 28/09/2026 achou repetido à mão nas telas do SGDM (`apps/web`, com `(d)` = `app/(dashboard)`), e o que usar no lugar. Os números são os itens de `docs/checklist-v2.md`.

| Item | Padrão no SGDM (onde) | No pacote |
| --- | --- | --- |
| A1 | `emerald-*` para sucesso (112×, contra 7× `green`) | `--sd-color-success*` em esmeralda; `bg-success-soft`, `text-success-text`; `StatusBadge active` |
| A2 | avisos `blue-50/200/900` (`(d)/publicacoes/page.tsx:32`) | `--sd-color-info*` em azul; o ciano virou a família `cyan` |
| A3 | texto de aviso em `amber-900` (35×) e afins | degrau `-deep` (900): `text-warning-deep`, `text-info-deep`… |
| A4 | `indigo`, `rose`, `violet`, `purple`, `orange`, `teal`, `sky` soltos | famílias `--sd-color-<família>-*` e o tipo `Tone` |
| A5 | cores por perfil (`DashboardRoleHero.tsx:14-36`, `PerfilGuiaCard.tsx:42-109`) | `--sd-color-profile-*`, `shadow-profile-*`, `PROFILES` |
| A6 | `slate-300` em borda, `slate-200` no carregamento, `slate-900/50` e `/70`, textos do login | `border-border-strong`, `bg-skeleton`, `bg-overlay-strong/70`, `text-on-dark-*` |
| A7 | `#0EA5E9`, `#94A3B8`, `#E2E8F0` e `#3B82F6` nos gráficos | `--sd-color-chart-13`, `-fallback`, `-grid`, `-bar` e `CHART_*_COLOR` |
| A8 | `text-[10px]`, `text-[11px]`, 10pt a 18pt no editor, 12pt e 10pt na impressão | `text-2xs`, `text-xs2`, `text-doc-10..18`, `text-print-*`, `EDITOR_FONT_SIZES` |
| A9 | `rounded` (4px) em toolbar e chip, marcador de 2px, `rounded-xl` para tudo | `rounded-xs`, `rounded-marker`, `rounded-panel`/`-callout`/`-tile` |
| A10 | `shadow-xl shadow-blue-900/50` no logo, `shadow-inner`, sombra colorida por perfil | `shadow-brand-strong`, `shadow-inner`, `shadow-dropdown`, `shadow-profile-*` |
| A11 | `z-50`, `z-[60]`, `z-[100]`… | `z-dropdown` (20) a `z-progress` (110) e `Z_INDEX` |
| A12 | `duration-150/200/300` | `duration-fast/normal/slow`, `ease-standard` e `DURATION_MS` |
| A13 | `w-64`, `w-[72px]`, `h-14`, `max-w-[820px]`, `min-w-[280px]`, `innerWidth < 1024` no JS | `w-sidebar`, `w-sidebar-collapsed`, `h-header`, `max-w-print-sheet`, `w-kanban-column`, `BREAKPOINT_LG`… |
| B1 | avisos `rounded-xl border bg-*-50 text-*-900` (~120×), "Etapa 3 — Elaboração" (`DocumentoEditorPanel.tsx:766`) | `Alert` / `Callout`, com `variant="stage"` |
| B2 | `Loader2 animate-spin` e "Carregando…" (~88×) | `Spinner`, `LoadingState` |
| B3 | blocos cinza do `(d)/loading.tsx` | `Skeleton`, `PageSkeleton` |
| B4 | `text-[11px] uppercase tracking-wide text-slate-500` (50×) | `Eyebrow` / `Overline` |
| B5 | chips `rounded-full bg-*-100 px-2 text-xs` (~37×) | `Chip` / `Tag` |
| B6 | quadrado de ícone `h-10 w-10 rounded-xl bg-*-50` (~35×) | `IconTile` (também dentro de `StatCard` e `EmptyState`) |
| B7 | links `text-blue-600 hover:underline`, botões verdes, `py-3` do login, `<Link className="btn-*">` | `Button variant="link"/"success"/"danger-outline"`, `size="lg"`, `href`, `asChild` |
| B8 | botões só com ícone (~25×) | `IconButton` (`aria-label` obrigatório) |
| B9 | `dl` em `grid-cols-[160px_1fr]` (`DocumentoDadosPanel.tsx:48-58`, `validar/[codigo]/page.tsx:227`) | `DescriptionList` (rows, grid, tiles, compact), `KeyValue` |
| B10 | checkboxes e a matriz de permissões (`PerfilPermissoesEditor.tsx:274-320`) | `Checkbox` (com indeterminado), `CheckboxCard`, `CheckboxGroup` |
| B11 | `components/forms/CampoSenha.tsx` | `PasswordInput` |
| B12 | ícone absoluto dentro do campo, `R$` e `%` | `Input leftIcon/rightIcon/prefix/suffix` |
| B13 | `components/forms/FileUpload.tsx:96-153`, o `label` do `AssinaturaDigitalPanel.tsx:171` | `FileUpload`, `FileButton` |
| B14 | `DocumentoHistorico.tsx:153-186`, `LicitacaoTimeline.tsx:99-129` | `Timeline` (icon, dots, phases) |
| B15 | abas coloridas de `(d)/documentos/[id]/page.tsx:690-708`, filtro das numerações | `Tabs variant="pill"`, `SegmentedControl` |
| B16 | card "Filtros" com grade de campos, campo de busca com lupa | `FilterBar`, `SearchInput` |
| B17 | passos do `AssinaturaDigitalPanel.tsx:113-193`, "Onde você está" (`DocumentoEditorPanel.tsx:61-102`), PassosCadastro | `NumberedSteps`, `ProcessStepper`, `WizardStepper variant="tiles"`, `bare` e `href` |
| B18 | lista mestre de `(d)/cadastros/perfis/page.tsx:204-235` | `SelectableList` |
| B19 | `NotificacoesDropdown.tsx:128-297` e menus de ações | `Popover`, `Dropdown`, `NotificationBell` |
| B20 | bolinha com número sobre o sino | `CounterBadge`, `formatCount` |
| B21 | `DocumentoPreviaPanel.tsx:94-135` | `PdfViewer` (panel, page) |
| B22 | `app/login/page.tsx:66-176`, `app/redefinir-senha/page.tsx:171-190`, `app/validar/*`, `app/error.tsx` | `AuthLayout`, `AuthCard`, `AuthMessage`, `PublicLayout`, `ErrorPage`; `onDark` nos campos, no `Button link` e no `ErrorInline`, ou a área `<OnDark>` |
| B23 | `LicitacaoKanban.tsx` e `LicitacaoCardCompact` | `KanbanBoard`, `KanbanColumn`, `KanbanCard` |
| B24 | `components/dashboard/*`: `DashboardRoleHero`, `QuickActions`, `DashboardFilaCard`, `PendingList`, `CalendarWidget` e o indicador do `PlatformDashboard` | `DashboardHero`, `QuickActions`, `QueueCard`, `CountList`, `MiniCalendar`, `MiniStat` |
| B25 | protocolo e hash em `font-mono` | `InlineCode`, `Mono` |
| B26 | fluxo A → B → C (`PerfilGuiaCard.tsx:164-176`) | `FlowChips` |
| B27 | painel lateral fixo (`ChecklistConteudoMinimo.tsx:24`) | `StickyAside` |
| B28 | `StatusChart.tsx` e `RelatorioBarChart.tsx` (recharts, cores em hex) | `ChartCard`, `ChartLegend`, `chartProps`, `toChartData`, `chartColor`, `getChartTheme` |
| B29 | `RichTextEditor.tsx` (toolbar, `min-h-[420px]`) e o `prose prose-sm`, que não funciona sem o plugin | `EditorFrame`, `EditorToolbar`, `EditorToolbarButton`, `EditorToolbarSeparator`, `EditorFontSizeSelect`, `DocumentContent` e a classe `.documento` |
| B30 | `@media print` do `globals.css` e `licitacoes/[id]/processo/page.tsx` | `@sgdm/design/print.css`, `PrintSheet`, `PrintCover`, `PrintSection`, `NoPrint` |
| C1 | tabelas com total, seleção, compactas, dentro de card | `Table` com `footer`, `selectable`, `density`, `headerCase` e `bare` |
| C2 | cards tingidos e com `p-4`, `p-5` ou `p-6` | `Card tone padding` |
| C3 | selos da licitação (`lib/licitacoes.ts:311-362`), da fase e da peça (`lib/pecas.ts:129`) | `StatusBadge size/case/variant` e os mapas `LICITACAO_*`, `PECA_*`, `NUMERACAO_*` |
| C4 | `StatCard` com `iconBg`/`iconColor` soltos | `StatCard tone` |
| C5 | `CardRecolhivel` controlado, linhas que abrem | `CollapsibleCard open/onOpenChange`, `Accordion` |
| C6 | `DicaInfo` abrindo para os lados | `Tooltip placement` |
| C7 | vazio com borda tracejada | `EmptyState variant="dashed"` |
| C8 | seletor de prefeitura do cabeçalho | `Select size="compact" icon` |

## A regra: as telas não passam visual

As telas conhecem **só a API** dos componentes, nunca a aparência.

- Os componentes recebem props semânticas: `variant="danger"`, `tone="success"`, `size="sm"`, `error="…"`.
- Eles **não aceitam `className` nem `style`**. Os tipos já barram, de propósito.
- Para posicionar um componente (grade, margem), a tela o envolve numa `div` própria.
- Dentro do pacote, nenhuma cor é fixa. Tudo sai do preset (`bg-primary`, `text-muted`), que aponta para as variáveis `--sd-*`. Há um teste que falha se aparecer um hex num componente.
- A única exceção é o mapa de status (`bg-<cor>-100 text-<cor>-800`), que é um dado passado por prop (`colors`).

## Tokens

Todo token segue `--sd-<categoria>-<papel>[-<variante>]`. O esquema completo está no topo de `src/styles/tokens.css`, e o catálogo mostra todos.

| Categoria | Exemplos de token | Classe do preset |
| --- | --- | --- |
| Cor de papel | `--sd-color-surface`, `--sd-color-text-muted`, `--sd-color-border-strong`, `--sd-color-skeleton`, `--sd-color-overlay-strong` | `bg-surface`, `text-muted`, `border-border-strong`, `bg-overlay-strong/70` |
| Texto sobre fundo escuro | `--sd-color-on-dark-label`, `-muted`, `-error`, `-link`, `-link-hover`, `-success` | `text-on-dark-label`, `text-on-dark-error` |
| Impressão | `--sd-color-print-ink`, `-paper`, `-border` (#999) | usados pelo `print.css`; `border-print-border` |
| Tons de feedback | `--sd-color-success`, `warning`, `danger`, `info` (+ degraus) | `bg-success-soft`, `text-warning-deep` |
| Famílias | `--sd-color-cyan`, `indigo`, `rose`, `violet`, `purple`, `orange`, `teal`, `sky` (+ degraus) | `bg-indigo-tint`, `text-rose-text` |
| Perfil | `--sd-color-profile-<perfil>[-soft\|-tint\|-border\|-icon\|-text\|-title]`, `--sd-shadow-profile-<perfil>` | `bg-profile-rh-soft`, `shadow-profile-prefeito` |
| Gráfico | `--sd-color-chart-1..13`, `-fallback`, `-grid`, `-bar` | `bg-chart-13`, `stroke-chart-grid` |
| Tamanho de fonte | `--sd-font-size-2xs` (10px), `-xs2` (11px), `-doc-10..18`, `-print-body`, `-print-table` | `text-2xs`, `text-xs2`, `text-doc-12` |
| Raio | `card` 16, `panel`/`callout`/`tile` 12, `control` 8, `popover`/`tag` 6, `xs` 4, `marker` 2, `pill` | `rounded-callout`, `rounded-xs` |
| Sombra | `card`, `card-hover`, `popover`, `dropdown`, `modal`, `inner`, `nav-active`, `brand`, `brand-strong`, `step` | `shadow-dropdown`, `shadow-brand-strong` |
| Camada | `raised` 10, `dropdown` 20, `sticky` 30, `overlay` 40, `modal` 50, `toast` 60, `tooltip` 100, `progress` 110 | `z-modal`, `z-tooltip` |
| Tempo | `--sd-duration-fast` 150ms, `-normal` 200ms, `-slow` 300ms, `--sd-ease-standard`, `--sd-ease-out` | `duration-normal`, `ease-standard` (o `transition` puro já usa fast + standard) |
| Medida | `--sd-size-sidebar` 256, `-sidebar-collapsed` 72, `-header` 56, `-modal-md` 512, `-modal-lg` 768, `-tooltip` 288, `-dropdown` 384, `-editor-min` 420, `-editor-frame-min` 480, `-print-sheet` 820, `-kanban-column-min/max` 280–320, `-dl-label` 160, `-form` 448, `-public-sm` 512, `-public-md` 768 | `w-sidebar`, `h-header`, `max-w-modal-lg`, `min-h-editor`, `w-kanban-column`, `grid-cols-label-value`, `max-w-form`, `max-w-public-sm` |
| Espaço da página | `--sd-space-page-sm` 16, `-md` 24, `-lg` 32 | `p-page-sm lg:p-page-md xl:p-page-lg` |
| Breakpoint | `--sd-breakpoint-lg` 1024px (informativo) | `lg:` |

**Degraus de tom.** Feedback e famílias têm os mesmos oito: base (500), `-soft` (50, fundo de aviso), `-tint` (100, fundo de selo e de ícone), `-border` (200), `-strong` (600, ícone e botão), `-hover` (700), `-text` (800, texto de selo) e `-deep` (900, texto de aviso). Success é esmeralda e info é azul, como no SGDM; o ciano é a família `cyan`.

**Perfis.** `rh` (índigo), `secretaria` (azul), `prefeito` (violeta), `gabinete` (laranja) e `plataforma` (rosa), como no `DashboardRoleHero` e no guia de perfis do SGDM. Os tokens de perfil apontam para as famílias por `var()`: mudar `--sd-color-indigo-*` muda o RH junto.

**No JavaScript.** Media query não lê variável CSS, e bibliotecas externas pedem número. Por isso o pacote exporta os mesmos valores (um teste confere que batem com o `tokens.css`):

```ts
import { BREAKPOINT_LG, MEDIA_QUERY_LG, isDesktopViewport, Z_INDEX, DURATION_MS,
  EDITOR_FONT_SIZES, PRINT_FONT_SIZES, PROFILES, CHART_FALLBACK_COLOR, CHART_GRID_COLOR,
  CHART_BAR_COLOR, CHART_EXTRA_COLOR } from '@sgdm/design';

window.matchMedia(MEDIA_QUERY_LG);           // '(min-width: 1024px)'
<Dropdown zIndex={Z_INDEX.dropdown} />       // 20
<CartesianGrid stroke={CHART_GRID_COLOR} />  // o recharts escreve a cor num atributo SVG, onde var() não funciona
```

O Header e o Sidebar usam `isDesktopViewport()`: abaixo de `BREAKPOINT_LG` o botão de menu abre a gaveta, e a gaveta fecha sozinha se a tela crescer além dele.

**`cn` conhece as escalas.** O `cn` do pacote sabe que `text-xs2` e `text-doc-12` são tamanho (e não cor), e que `shadow-card` disputa com `shadow-modal`. Use-o nas suas `div`s de layout se misturar classes do preset.

## Trocar a cor principal de um sistema

Sobrescreva as variáveis **depois** do `tokens.css`. As cores vão em canais RGB separados por espaço, e não em hex, para o Tailwind aplicar opacidade (`bg-primary/50`).

```css
/* globals.css do sistema, depois de importar @sgdm/design/tokens.css */
:root {
  --sd-color-primary: 22 101 52;        /* #166534 */
  --sd-color-primary-hover: 20 83 45;   /* #14532d */
  --sd-color-primary-light: 34 197 94;  /* borda do campo em foco */
  --sd-color-primary-ring: 220 252 231; /* anel do campo em foco */
  --sd-color-primary-soft: 240 253 244; /* fundos claros */
  --sd-color-accent: 22 163 74;         /* links, passo atual, aba ativa */
  --sd-color-accent-text: 21 128 61;
  --sd-color-sidebar-active: 22 163 74; /* item ativo do menu */
}
```

No SGDM, `--sd-color-primary-hover` é igual à cor principal. No original, `hover:bg-blue-800` repetia o próprio `#1e40af`. Num sistema com outra cor, defina um tom mais escuro.

Para converter hex em canais: `#166534` → `0x16 0x65 0x34` → `22 101 52`.

Para usar um token em CSS próprio: `color: rgb(var(--sd-color-primary));`.

O catálogo tem um seletor "Cor principal" que mostra a troca ao vivo.

## Migrar para outro visual (ex.: Material Design)

O pacote foi dividido para essa troca **não tocar nas telas dos sistemas**. São três camadas, e só as duas de baixo mudam:

| Camada | Arquivo | Muda na migração? |
| --- | --- | --- |
| API dos componentes (props, nomes, comportamento) | `src/components/*.tsx`, tipos exportados | **Não.** É o contrato com as telas. |
| Estilo interno dos componentes | classes dentro dos `.tsx`, `src/styles/components.css` | Sim |
| Valores visuais | `src/styles/tokens.css` (e o mapeamento em `tailwind-preset.cjs`) | Sim |

O caminho:

1. **Tokens novos.** Reescreva o `tokens.css` com os valores do Material: cor primária, superfícies, raio de 4px, sombras de elevação e a fonte Roboto em `--sd-font-sans`. Os nomes das variáveis continuam os mesmos, porque são de papel (`primary`, `surface`, `radius-control`), não de marca. Só isso já muda boa parte da aparência.
2. **Estilo interno.** O que o Material faz diferente e não é só valor fica dentro de cada componente: botão em caixa-alta, campo com rótulo flutuante, *ripple*, abas com indicador animado. Ajuste as classes em `components.css` e nos `.tsx`. Se precisar de estrutura nova (o rótulo flutuante muda o HTML do `Input`), mude o HTML **sem mudar as props**.
3. **Tokens novos, se precisar.** Se o Material pedir um papel que ainda não existe (`--sd-color-surface-container`, `--sd-shadow-elevation-2`), acrescente a variável no `tokens.css`, o nome no preset e use no componente. Não apague os papéis existentes antes de conferir quem os usa.
4. **Conferir.** Rode `npm test`, porque os testes verificam comportamento e acessibilidade, que não podem mudar. Depois abra `npm run catalogo` e revise cada variante.
5. **Versionar.** Publique como versão maior (tag `v1.0.0`). Cada sistema atualiza a dependência quando quiser, e nenhuma tela precisa ser editada.

O que **quebra** essa garantia, e por isso é proibido nas telas:
- passar `className` ou `style` para um componente do pacote (os tipos já impedem);
- usar as classes de token (`bg-primary`, `rounded-card`) para imitar um componente em vez de usá-lo;
- depender da estrutura HTML interna de um componente (seletor CSS do tipo `.card > div`).

Classes utilitárias de layout nas próprias `div`s da tela (`grid`, `gap-4`, `mt-6`) continuam livres.

## Desenvolvimento

```bash
npm install
npm run build          # dist/ (ESM + CJS + .d.ts) e CSS/fontes copiados
npm test               # Vitest + Testing Library
npm run typecheck      # tsc --noEmit
npm run catalogo       # catálogo em http://localhost:5173
npm run catalogo:build # catálogo estático em catalogo/dist
```

Estrutura:

```
src/styles/tokens.css      variáveis --sd-* e a fonte Inter
src/styles/components.css  .card, .btn-*, .input, .nav-item… (sintaxe Tailwind)
tailwind-preset.cjs        tokens → nomes do Tailwind; injeta components.css
src/cn.ts                  clsx + tailwind-merge
src/status.ts              mapas de status (documento, numeração, licitação, peça) e cores de gráfico
src/charts.ts              padrões para o recharts (sem importá-lo): chartProps, toChartData, getChartTheme
src/styles/print.css       a folha A4 do processo (@media print)
src/tokens.ts              os tokens que o JS lê: BREAKPOINT_LG, Z_INDEX, DURATION_MS…
src/components/            componentes
catalogo/                  app Vite do catálogo
test/                      testes
```

Fora do escopo deste pacote:
- tema escuro, porque o SGDM não tem (o `onDark` é só para as telas de login, que já são escuras);
- arrastar cartões no kanban: mudar de fase é uma ação do processo, feita na tela dele;
- o editor em si (Tiptap) e os gráficos em si (recharts): o pacote dá a moldura, a toolbar, o CSS e as props, e o sistema traz a biblioteca.

A fonte Inter é distribuída sob a SIL Open Font License, em `src/styles/fonts/LICENSE-Inter-OFL.txt`.
