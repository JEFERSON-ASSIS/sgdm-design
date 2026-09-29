# Checklist da versão 2 — cobrir o SGDM inteiro

Origem: levantamento de 28/09/2026 que comparou todas as telas de `SGDM/apps/web` com o pacote. Os caminhos do app são relativos a `C:\xampp\htdocs\producao\prefeitura\SGDM\apps\web`, onde `(d)` = `app/(dashboard)`. Cada item só está pronto quando tem as cinco coisas:
1. o componente ou token;
2. o teste;
3. a entrada no catálogo;
4. a entrada no `index.ts`;
5. a menção no README.

A regra do pacote continua a mesma: o componente só recebe props semânticas, e toda cor, medida ou tempo sai de um token `--sd-*`.

## A. Tokens e preset (correções)

- [x] **A1. Sucesso passa a ser esmeralda.** O app usa emerald 112× contra green 7×. Trocar `--sd-color-success*` por emerald 50/100/200/500/600/700/800/900 e ajustar o `StatusBadge active`, que tem emerald fixo, para usar o token.
- [x] **A2. Informação passa a ser azul.** Os avisos do app usam blue 50/200/900 (`(d)/publicacoes/page.tsx:32`), e o token é ciano.
  - Criar `--sd-color-info*` em azul.
  - Manter o ciano como família `cyan`, que o gráfico usa.
- [x] **A3. Texto de aviso em tom 900.** Criar o tom 900 para warning (amber), success, info (blue), danger e violet. Os avisos do app usam 900 (amber-900 35×).
- [x] **A4. Famílias que faltam.** Cada uma com os tons soft, border, strong e text:
  - indigo (RH, controladoria);
  - rose (plataforma);
  - violet e purple (prefeito, aguardando assinatura);
  - orange;
  - teal;
  - sky.
- [x] **A5. Tema por perfil.** Tokens para os perfis rh, secretaria, prefeito, gabinete e plataforma: cor de destaque, fundo e sombra colorida. Referência: `components/dashboard/DashboardRoleHero.tsx:14-36` e `components/perfis/PerfilGuiaCard.tsx:42-109`.
- [x] **A6. Neutros.**
  - border-strong: slate-300.
  - skeleton: slate-200.
  - overlay escuro: slate-900/50 e /70, além do black/40 atual.
  - Texto sobre fundo escuro, usado no login: label slate-300, erro red-400 e link blue-400.
- [x] **A7. Gráficos.**
  - Incluir `#0EA5E9` (sky) nas cores de gráfico.
  - Criar tokens para o fallback `#94A3B8`, a grade `#E2E8F0` e a barra padrão `#3B82F6`.
- [x] **A8. Tamanhos de fonte.**
  - Nomear 10px (`text-2xs`) e 11px (`text-xs2` ou `text-label`).
  - Criar a escala do editor, de 10pt a 18pt, e a de impressão, 12pt e 10pt.
- [x] **A9. Raios.**
  - `xs`: 4px, usado 33× em botões de toolbar e chips.
  - `marker`: 2px.
  - Revisar o `rounded-xl` de 12px: separar `panel`/`callout` de `tile`.
- [x] **A10. Sombras.**
  - Sombras coloridas por perfil.
  - `brand-strong`, com 0,5 de opacidade, para o logo do login.
  - `inner`.
  - `dropdown`: xl.
- [x] **A11. Camadas (z-index).** Escala única: dropdown 20, sticky 30, overlay 40, modal 50, toast 60, tooltip 100 e progress 110. Substituir os valores fixos do pacote.
- [x] **A12. Tempo.** Duração fast 150ms, normal 200ms e slow 300ms, com easing padrão.
- [x] **A13. Medidas de layout.**
  - Menu: 256px aberto, 72px recolhido.
  - Topo: 56px.
  - Padding da página: 16, 24 e 32.
  - Modal: md 512px e lg 768px.
  - Tooltip: 288px. Dropdown: 384px.
  - Altura mínima do editor: 420 e 480px.
  - Folha de impressão: 820px.
  - Coluna do kanban: 280 a 320px.
  - O breakpoint de 1024px vira token/`screens`, e o JS do Header/Sidebar passa a lê-lo de uma constante exportada.

> **Notas da seção A (feita em 28/09/2026).**
> - Degraus de tom: base 500, `soft` 50, `tint` 100, `border` 200, `strong` 600, `hover` 700, `text` 800, `deep` 900 — iguais para feedback e famílias. O esquema está no topo do `tokens.css`.
> - Perfis: rh = índigo, secretaria = azul, prefeito = violeta e plataforma = rosa, como no `DashboardRoleHero`; gabinete = laranja, do guia de perfis. O guia pinta o RH de esmeralda, e o painel de índigo; ficou o do painel.
> - 11px virou `text-xs2`, porque `text-label` já é a cor do rótulo.
> - Os valores que o JS precisa (breakpoint, z-index, durações, fontes do editor, perfis) estão em `src/tokens.ts`, e um teste confere que batem com o CSS.

## B. Componentes novos (ordem = quanto aparecem no SGDM)

- [x] **B1. `Alert` / `Callout`** (~120×, 56 arquivos).
  - Tons: info, warning, success, danger, violet, neutral.
  - Aceita ícone, título opcional, ações e botão de fechar opcional.
  - Variante `stage` para o aviso "Etapa 3 — Elaboração", como em `DocumentoEditorPanel.tsx:766,774`.
- [x] **B2. Carregamento** (~88×).
  - `Spinner` nos tamanhos sm, md e lg.
  - `LoadingState`, com spinner e texto "Carregando…" configurável, nos modos inline e bloco.
- [x] **B3. `Skeleton`**, nas formas linha, bloco e card. Referência: `(d)/loading.tsx`.
- [x] **B4. `Eyebrow` / `Overline`** (50×). Rótulo `text-[11px] uppercase tracking-wide text-muted`.
- [x] **B5. `Chip` / `Tag`** (~37×).
  - Tamanhos xs e sm.
  - Tons de todas as famílias, com versão preenchida ou com contorno.
  - Ícone opcional e modo mono, para códigos.
- [x] **B6. `IconTile`** (~35×). Ícone num quadrado ou círculo com fundo de tom. Exportar e reusar dentro de `StatCard` e `EmptyState`.
- [x] **B7. Mais variantes de `Button`.**
  - `link`, só texto, `text-primary hover:underline`.
  - `success`, em esmeralda.
  - `danger-outline`.
  - Tamanho `lg`, com `py-3`.
  - Prop `href`, para renderizar como `<a>`, e prop `asChild`, ou um render prop simples, para aceitar o `<Link>` do Next sem depender do Next.
- [x] **B8. `IconButton`** (~25×). Quadrado nos tamanhos sm e md, com `aria-label` obrigatório e as variantes ghost, secondary e danger.
- [x] **B9. `DescriptionList` / `KeyValue`** (~36×).
  - Formatos `dl` em linhas `[160px_1fr]`, grade de blocos rótulo/valor e modo compacto.
  - Referências: `DocumentoDadosPanel.tsx:48-58` e `validar/[codigo]/page.tsx:227`.
- [x] **B10. `Checkbox`** (24×).
  - Checkbox simples.
  - `CheckboxCard`, com borda e descrição.
  - `CheckboxGroup`, com cabeçalho "marcar todos", matriz de permissões e estado indeterminado. Referência: `components/perfis/PerfilPermissoesEditor.tsx:274-320`.
  - O app não tem radio nem switch, então não criar.
- [x] **B11. `PasswordInput`**, com mostrar/ocultar. Referência: `components/forms/CampoSenha.tsx`.
- [x] **B12. `Input` com ícone à esquerda e à direita**, e prefixo/sufixo de texto, como `R$` e `%`.
- [x] **B13. Envio de arquivo.**
  - `FileUpload` com área de arrastar e soltar, lista de arquivos e remoção. Referência: `components/forms/FileUpload.tsx:96-153`.
  - `FileButton`: um `label` com cara de botão sobre um input escondido. Referência: `AssinaturaDigitalPanel.tsx:171`.

> **Notas de B1–B13 (feitas em 28/09/2026).**
> - `Alert`: o texto do corpo é o tom 900 (`-deep`), menos no `danger`, que fica em red-800 (`-text`), como no SGDM. O papel ARIA padrão é `alert` no danger e `note` nos demais; `role="status"` fica por prop. Além dos seis tons pedidos entrou `purple`, que é o do aviso "Etapa 4 — Aguardando assinatura". A variante `stage` põe o título em negrito na mesma linha do texto e usa a borda do tom (a Etapa 3 do SGDM usa blue-100, a Etapa 4 purple-200; ficou uma regra só).
> - `Spinner` ganhou também o `xs` (14px), que o app usa em botões pequenos. O `LoadingState` em bloco não mostra o texto na tela (o SGDM mostra só o spinner), mas o anuncia; `showLabel` muda isso.
> - `Skeleton`: a linha usa `bg-surface-muted` (slate-100) e os blocos `bg-skeleton` (slate-200), como o `loading.tsx`. A largura `lg` é 320px (`w-80`), porque `w-72` é barrado pelo teste de medidas soltas. Entrou também o `PageSkeleton`, o `loading.tsx` inteiro.
> - `Chip`: `filled` (fundo 100), `soft` (fundo 50) e `outline` (fundo 50 com borda 200, retangular). O `tones.ts` ganhou um mapa por degrau (`TONE_BG_SOFT`, `TONE_BG_TINT`, `TONE_BORDER`, `TONE_TEXT_STRONG`, `TONE_SOLID`, `TONE_TEXT`, `TONE_TEXT_DEEP`), escritos por extenso.
> - `Button variant="link"` usa `text-accent` (blue-600) com hover em `accent-text` (blue-700), que é o que as telas usam; `text-primary` (blue-800) não aparece em link no SGDM. `href` renderiza `<a>` ou o `linkComponent` (mesmo padrão do `StatCard` e do `Sidebar`), e `asChild` veste o filho. O ref do `Button` continua tipado como `HTMLButtonElement`, para não quebrar quem já o usa.
> - `DescriptionList`: a coluna de 160px virou o token `--sd-size-dl-label` e a classe `grid-cols-label-value` do preset. Os formatos são `rows`, `grid`, `tiles` e `compact`.
> - `Checkbox`: indeterminado no DOM e `aria-checked="mixed"`. No `CheckboxCard` e nos itens do `CheckboxGroup`, o nome acessível é só o título e a descrição entra por `aria-describedby`.
> - `FileButton` é um `<button>` que aciona o input escondido, e não um `label`. É o que o `AssinaturaDigitalPanel` faz de fato, e funciona pelo teclado sem truque; o `label` com input `hidden` do `FileUpload` do SGDM não recebe foco.
> - `FileUpload` filtra os arquivos soltos pelo `accept` (o SGDM não filtra) e avisa os recusados em `onReject`.
- [x] **B14. `Timeline`.**
  - Variantes: ícone em círculo com linha, lista de pontos com `border-l` e linha do tempo de fases.
  - Referências: `DocumentoHistorico.tsx:153-186` e `LicitacaoTimeline.tsx:99-129`.
- [x] **B15. `Tabs variant="pill"` / `SegmentedControl`**, com cor por aba. Referência: `(d)/documentos/[id]/page.tsx:690-708`.
- [x] **B16. `FilterBar`.** Card com título "Filtros", grade de campos e botão limpar. Criar também o `SearchInput`.
- [x] **B17. Passos.**
  - `NumberedSteps`, uma lista de instruções numeradas (`AssinaturaDigitalPanel.tsx:113-193`).
  - `ProcessStepper` vertical compacto, o "Onde você está no processo" (`DocumentoEditorPanel.tsx:61-102`).
  - `WizardStepper` ganha um modo com links (PassosCadastro) e um modo sem card.
- [x] **B18. `SelectableList`.** Lista mestre com item ativo destacado. Referência: `(d)/cadastros/perfis/page.tsx:204-235`.
- [x] **B19. `Dropdown` / `Popover`** genérico, que fecha ao clicar fora e com Esc.
  - `NotificationBell`, com contador (9+), cabeçalho, "marcar todas", lista com ponto de não lido e link no rodapé.
  - Referência: `components/layout/NotificacoesDropdown.tsx:128-297`.
- [x] **B20. `CounterBadge`**, a bolinha com número sobre um ícone.
- [x] **B21. `PdfViewer`.** Card com `object`/`iframe`, fallback de download e toolbar. Referência: `DocumentoPreviaPanel.tsx:94-135`.

> **Notas de B14–B21 (feitas em 28/09/2026).**
> - `Timeline`: três variantes, `icon`, `dots` e `phases`, numa `<ol>`. Na `phases`, a fase atual leva `aria-current="step"` e cada situação é lida em texto escondido ("concluída", "devolvida"…), configurável por `statusLabels`. O ponto da variante `dots` fica centrado na borda com `-left-px -translate-x-1/2`, sem o `-left-[5px]` do SGDM. A linha da fase concluída usa `success-border` (emerald-200); o SGDM usa emerald-300, que não é degrau do pacote.
> - `Tabs variant="pill"` com `tone` por aba (preenchido no degrau 600, `TONE_SOLID`). O `SegmentedControl` é o filtro da tela de numerações (card com botões compactos) e, para o leitor de tela, um grupo de rádio (`radiogroup`/`radio`, setas mudam a escolha). Não troca painel; para isso existe o `Tabs variant="pill"`.
> - `FilterBar` é um marco `role="search"` nomeado pelo título. O botão de limpar ocupa a última célula da grade, como no SGDM. `SearchInput` é `type="text"` com `role="searchbox"`: o `type="search"` põe o "x" do navegador ao lado do nosso. Enter chama `onSearch`, Esc limpa.
> - Passos: `NumberedSteps` e `ProcessStepper` em `Steps.tsx`. O "✓" em texto do SGDM virou o ícone `Check`, com "concluído" para o leitor de tela. O `WizardStepper` ganhou `variant="tiles"` (a trilha dos cadastros), `href` por passo com `linkComponent`, e `bare` (sem card; padrão em `tiles`). Com link, o `aria-current` sai do `li` e vai para o link. A largura mínima da caixa é `min-w-44` (176px), porque `min-w-[180px]` é barrado pelo teste de medidas soltas.
> - Cores de seleção seguem a cor principal, e não o azul fixo: `SelectableList`, a caixa atual do `WizardStepper tiles` e o sino usam `primary-soft`/`accent`. Por isso o título ativo fica em `text-primary` (blue-800), e não em blue-900.
> - `SelectableList` é uma lista de botões com `aria-current="true"` no ativo, e não um `listbox`: os itens têm descrição e selo, e o padrão do SGDM é navegação mestre/detalhe. As setas andam entre os itens, sem escolher.
> - `Popover` (diálogo não modal) e `Dropdown` (`role="menu"`) dividem o mesmo núcleo (`usePopoverCore`). Fecham com clique fora, com Esc (devolvendo o foco ao gatilho) e quando o foco sai. O gatilho é um elemento passado em `trigger` (`Button`, `IconButton`), que recebe o clique e `aria-expanded`/`aria-haspopup`/`aria-controls`. O foco só entra no painel quando quem abriu foi o usuário, e não quando o `open` vem de fora. O painel usa `z-dropdown` (20) e `shadow-dropdown`; o SGDM usa `z-50`.
> - `NotificationBell` não busca nada: lista, carregando, erro e ações chegam por prop, e o `onOpenChange` serve para buscar só ao abrir. O nome do botão traz a contagem ("Notificações (12 não lidas)") e uma região `aria-live` anuncia a mudança do número.
> - `CounterBadge`: sobre um ícone (filhos), inline, ou no canto do pai (`placement="corner"`). `label` troca o número lido e `live` anuncia a mudança. `formatCount` é exportado.
> - `PdfViewer`: `panel` é a prévia do editor (iframe, `min-h-editor` = 420px, sem a barra do leitor do navegador); `page` é a tela do PDF (`object`, `min-h-editor-frame` = 480px, alternativa de download). O `IconButton` ganhou o tamanho `xs` (24px, raio de 4px) para a toolbar do painel.
- [x] **B22. Layouts de página.**
  - `AuthLayout` dividido: formulário em fundo escuro e painel de imagem com gradiente (`app/login/page.tsx:66-176`). Os componentes de formulário ganham a variante `onDark`.
  - `AuthCard`, o cartão escuro centralizado (`app/redefinir-senha/page.tsx:171-190`).
  - `PublicLayout`, a página pública estreita com cabeçalho de escudo e rodapé (`app/validar/*`).
  - `ErrorPage`, a página inteira de erro (`app/error.tsx`).
- [x] **B23. `KanbanBoard`**, `KanbanColumn` (cabeçalho com contagem) e `KanbanCard` compacto, sem arrastar. Referência: `components/licitacoes/LicitacaoKanban.tsx`.
- [x] **B24. Widgets do painel inicial.**
  - `DashboardHero`, por perfil.
  - `QuickActions`.
  - `QueueCard`, com cabeçalho de destaque e "ver todas".
  - `CountList`, com rótulo e contador.
  - `MiniStat`.
  - `MiniCalendar`.
  - Referência: `components/dashboard/*`.

> **Notas de B22–B24 (feitas em 28/09/2026).**
> - `onDark`: prop em `FormField`, `Input`, `PasswordInput`, `Textarea`, `Select`, `Checkbox`, `Button` (só muda o `link`) e `ErrorInline`, e o contexto `<OnDark>`, que o `AuthLayout` e o `AuthCard` aplicam sozinhos. Muda só as cores de texto (rótulo, dica, erro, link) para as `on-dark-*`; o campo continua branco, como no login do SGDM. `Card`, `Modal` e `Popover` voltam ao claro dentro da área escura (o "Esqueci a senha" abre um modal por cima do login).
> - `AuthLayout`: a foto é um `<img>` com uma camada de gradiente por cima (`from-overlay-strong/85 via-overlay-strong/30 via-60%`), e não o `style={{ backgroundImage }}` do SGDM, para não ter cor nem medida fora de token. Sem foto e sem frase, não há painel. O logo usa `rounded-card` (16px = `rounded-2xl`) e `shadow-brand-strong`. O `AuthCard` do SGDM não é um cartão de fato: é a tela escura centralizada, e assim ficou; o resultado ("Senha redefinida", "Link inválido") é o `AuthMessage`, com o verde-claro no token novo `on-dark-success` (emerald-400; o SGDM usa green-400, mas sucesso é esmeralda desde o A1).
> - Larguras novas por token: `max-w-form` (448px, o `max-w-md` do login e do texto de erro), `max-w-public-sm` (512px) e `max-w-public-md` (768px) do `PublicLayout`.
> - `ErrorPage`: `<main>` na tela cheia e `<div>` com `fullScreen={false}`, para não aninhar dois `<main>` dentro do `AppLayout`. O título e a mensagem ficam numa região `role="alert"`, porque o `error.tsx` do Next troca a tela sem recarregar.
> - Kanban: o quadro é uma região rolável que recebe foco (rolagem pelo teclado); cada coluna é uma `<section>` nomeada pelo título, com os cartões numa lista. O cartão vira link (`href`/`linkComponent`), botão (`onClick`) ou `div`, só com elementos de frase dentro. Hover da borda em `primary-light/60`, no lugar do blue-300, que não é degrau do pacote.
> - Painel: `DashboardHero` tem `soft` (o `DashboardRoleHero`) e `solid` (o destaque do `PlatformDashboard`), para os cinco perfis; o gradiente termina sempre em `-soft/30` (a secretaria do SGDM termina em sky-50/40). `QuickActions` sem perfil usa a cor principal, como a secretaria no SGDM; o foco dos itens é um anel por dentro, que o `overflow-hidden` do card não corta. `QueueCard` tinge o cabeçalho em `-soft` inteiro (o SGDM usa `/80`). `CountList` usa o degrau 500 (`TONE_BG_BASE`, novo em `tones.ts`) no ponto; o SGDM mistura 400 e 500. `MiniStat` é o indicador pequeno do painel da plataforma (ícone solto, sem quadrado), com a variante `dashed`. `MiniCalendar` é uma tabela com o mês na legenda, os dias da semana por extenso para o leitor de tela e o hoje em `aria-current="date"`; `month` controla de fora e `onDayClick` torna os dias clicáveis.
- [x] **B25. `InlineCode` / `Mono`**, para protocolo e hash.
- [x] **B26. `FlowChips`**, a sequência A → B → C (`components/perfis/PerfilGuiaCard.tsx:164-176`).
- [x] **B27. `StickyAside`**, o painel lateral fixo (`components/pecas/ChecklistConteudoMinimo.tsx:24`).

> **Notas de B25–B27 (feitas em 28/09/2026).**
> - `InlineCode` é `<code>` e `Mono` é `<span>`, com as mesmas props: `size`, `tone`, `weight`, `boxed` (fundo cinza) e `breakAll` (hash).
> - `FlowChips` é uma `<ol>` com as setas escondidas do leitor de tela. A cor de cada perfil vem por `tone` (fundo 50, texto 900, contorno 100); o `tones.ts` ganhou `TONE_RING_TINT`, `TONE_TEXT_HOVER` e `TONE_BG_STRONG`.
> - `StickyAside` é um `<aside>` nomeado pelo título, com o cabeçalho tingido por `tone` e `offset` de 16, 24 (padrão, o `top-6` do SGDM) ou 32px. Não leva `z-sticky`, como no SGDM, para não passar por cima de menus abertos no conteúdo.
- [x] **B28. Gráficos.**
  - `ChartCard`, com título e ações.
  - `ChartLegend`, com amostra de cor e %.
  - Defaults para recharts: cores, grade e eixos por token.
  - Recharts é peer dependency **opcional**, então o pacote não pode quebrar sem ele: exportar os helpers de config e a legenda em HTML.
- [x] **B29. Estilos do editor de texto rico.**
  - `EditorFrame` e `EditorToolbar`, com botões de toolbar, separador e select de tamanho.
  - Classes de conteúdo `.documento` para o modo leitura, que substituem o `prose` que hoje não funciona no SGDM.
  - Não embutir o Tiptap: só a moldura, a toolbar como componentes de apresentação e o CSS.
- [x] **B30. Folha de impressão.**
  - `print.css` com `@page` A4, margens de 20mm e 18mm, `.nao-imprimir`, `.quebra-pagina`, `.folha-processo` e `.peca-impressa`.
  - Tabelas com borda `#999` e fonte de 10pt.
  - Componente `PrintSheet`.

> **Notas de B28–B30 (feitas em 28/09/2026).**
> - Gráficos: o recharts é `peerDependency` opcional (`peerDependenciesMeta`) e nenhum arquivo do pacote o importa — um teste varre o `src`, e o `dist` não tem a palavra. O `src/charts.ts` monta props prontas (`chartProps()`: grade, eixo, barra deitada e em pé, rosca e tooltip), `chartColor`/`chartSeriesColor`, `toChartData` (tira os zeros, põe rótulo, cor e %) e `getChartTheme()`, que lê os tokens com `getComputedStyle` (um sistema que troca as cores continua certo; no servidor dá os hex). Entraram `CHART_AXIS_COLOR` (= text-muted) e `CHART_CURSOR_COLOR` (= surface-muted), e um teste confere que batem com os tokens. A amostra da `ChartLegend` pinta a cor por `style`, porque a cor é dado (vem do mapa de status); sem cor, usa `--sd-color-chart-N` pela posição.
> - `ChartCard` com `legend` põe o gráfico num quadrado de 208px ao lado da legenda (o "Documentos por status"); sem legenda, 256px de altura na largura toda (o dos relatórios). `center` escreve o total no meio da rosca; `chartLabel` transforma a área numa imagem nomeada.
> - Editor: só apresentação. `EditorToolbar` é `role="toolbar"`, com setas, Home e End entre os controles (dentro do select as setas continuam mudando o valor). `EditorToolbarButton` tem `aria-pressed` quando recebe `active` (negrito) e não tem quando é comando (desfazer), e não rouba o foco do editor no clique. O ativo é `primary-ring`/`accent-text` (blue-100/700) e o hover, `bg-border` (slate-200).
> - `.documento` agora devolve o que o preflight do Tailwind zera: margens de parágrafo, títulos (h1 centrado 14pt, h2 12pt, h3 12pt itálico), listas com marcador e número, citação, linha e tabela com borda. Vale no modo leitura (`DocumentContent`, `EditorFrame html`) e dentro do editor, porque a área editável fica em `.editor-document-page.documento`. A margem da folha (32px × 24px) passou para o `.editor-document-page .ProseMirror`.
> - `print.css`: o mesmo bloco do `globals.css` do SGDM, com cores e fontes por token (`--sd-color-print-ink`, `-paper`, `-border` = #999, `--sd-font-size-print-*`). As regras que disputam com utilitários do Tailwind levam `!important`: a impressão emulada no catálogo mostrou que, com o `@import` no topo do CSS, o `max-w-print-sheet`, a sombra e a fonte Inter do body venciam. O `AppLayout` ganhou `print:` para a moldura (altura da tela, rolagem interna, padding) sair da frente, e o `Header` e a barra de progresso somem no papel.
> - `PrintSheet` (a folha de 820px, com `toolbar` só na tela), `PrintCover` (a capa), `PrintSection` (seção, ou peça com `piece`: `.peca-impressa`, `.quebra-pagina` e traço em cima) e `NoPrint`.

## C. Completar o que ficou pela metade

- [x] **C1. `Table`.**
  - Linha de total (`tfoot`) e seleção de linhas com checkbox e "selecionar todas".
  - `density` compact (`px-3 py-2`) e cabeçalho `uppercase text-xs`.
  - Prop `bare`, para usar dentro de um card sem o wrapper.
- [x] **C2. `Card`.** Prop `tone` (tingido) e `padding` sm, md, lg (`p-4`, `p-5`, `p-6`) e none.
- [x] **C3. `StatusBadge`.**
  - `size` xs/sm e `case` upper/normal, para o estilo da licitação (`text-xs font-medium`).
  - Variante `outline`, com borda e `rounded-md`, para a fase.
  - Exportar também `NUMERACAO_STATUS_COLORS` e os mapas de licitação, de situação, de fase e de peça, de `lib/licitacoes.ts:311-362` e `lib/pecas.ts:129`.
- [x] **C4. `StatCard`.** Tons violet, emerald, teal, sky, amber, purple, orange e indigo.
- [x] **C5. `CollapsibleCard`.** Modo controlado (`open` e `onOpenChange`) e novo `Accordion` para linhas de lista.
- [x] **C6. `Tooltip`.** Posição top, bottom, left e right.
- [x] **C7. `EmptyState`.** Variante `dashed`.
- [x] **C8. `Select`.** Tamanho compact e ícone à esquerda, como no seletor de prefeitura.

## D. Entrega

- [x] **D1. Catálogo.** Uma seção por grupo, mostrando cada item novo em todas as variantes.
  - Lote 4: seções Páginas, Kanban, Painel inicial, Gráficos, Editor de texto e Impressão (`catalogo/src/CatalogoD.tsx`). As páginas inteiras aparecem pela metade numa moldura; os gráficos são SVG simples, porque o recharts não está instalado (é opcional); o editor usa um `contentEditable` no lugar do Tiptap.
- [x] **D2. Testes.** Um por componente novo, incluindo:
  - Checkbox indeterminado;
  - Dropdown fechando com Esc e com clique fora;
  - FileUpload aceitando e removendo arquivo;
  - Table selecionando linhas;
  - teste de tokens atualizado.
  - O teste "sem cor fixa em componente" continua valendo.
  - Os quatro testes de comportamento já existiam (lotes 2 e 3). O lote 4 trouxe `layouts-b22`, `kanban-painel-b23-b24`, `graficos-b28`, `editor-impressao-b29-b30` e `tokens-b4`: 292 testes no total.
- [x] **D3. README.** Tabela "padrão do SGDM → componente do pacote" com todos os itens.
  - Seção "Padrão do SGDM → componente do pacote", de A1 a C8, com a referência no app e o que usar no lugar.
- [ ] **D4. Versão.** `package.json` passa a 0.2.0, com `CHANGELOG.md`.
- [ ] **D5. Verificação.** Build, testes, `tsc`, build do catálogo e instalação pelo git. Tirar uma captura do catálogo.
