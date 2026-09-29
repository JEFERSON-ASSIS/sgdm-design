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

- [ ] **B1. `Alert` / `Callout`** (~120×, 56 arquivos).
  - Tons: info, warning, success, danger, violet, neutral.
  - Aceita ícone, título opcional, ações e botão de fechar opcional.
  - Variante `stage` para o aviso "Etapa 3 — Elaboração", como em `DocumentoEditorPanel.tsx:766,774`.
- [ ] **B2. Carregamento** (~88×).
  - `Spinner` nos tamanhos sm, md e lg.
  - `LoadingState`, com spinner e texto "Carregando…" configurável, nos modos inline e bloco.
- [ ] **B3. `Skeleton`**, nas formas linha, bloco e card. Referência: `(d)/loading.tsx`.
- [ ] **B4. `Eyebrow` / `Overline`** (50×). Rótulo `text-[11px] uppercase tracking-wide text-muted`.
- [ ] **B5. `Chip` / `Tag`** (~37×).
  - Tamanhos xs e sm.
  - Tons de todas as famílias, com versão preenchida ou com contorno.
  - Ícone opcional e modo mono, para códigos.
- [ ] **B6. `IconTile`** (~35×). Ícone num quadrado ou círculo com fundo de tom. Exportar e reusar dentro de `StatCard` e `EmptyState`.
- [ ] **B7. Mais variantes de `Button`.**
  - `link`, só texto, `text-primary hover:underline`.
  - `success`, em esmeralda.
  - `danger-outline`.
  - Tamanho `lg`, com `py-3`.
  - Prop `href`, para renderizar como `<a>`, e prop `asChild`, ou um render prop simples, para aceitar o `<Link>` do Next sem depender do Next.
- [ ] **B8. `IconButton`** (~25×). Quadrado nos tamanhos sm e md, com `aria-label` obrigatório e as variantes ghost, secondary e danger.
- [ ] **B9. `DescriptionList` / `KeyValue`** (~36×).
  - Formatos `dl` em linhas `[160px_1fr]`, grade de blocos rótulo/valor e modo compacto.
  - Referências: `DocumentoDadosPanel.tsx:48-58` e `validar/[codigo]/page.tsx:227`.
- [ ] **B10. `Checkbox`** (24×).
  - Checkbox simples.
  - `CheckboxCard`, com borda e descrição.
  - `CheckboxGroup`, com cabeçalho "marcar todos", matriz de permissões e estado indeterminado. Referência: `components/perfis/PerfilPermissoesEditor.tsx:274-320`.
  - O app não tem radio nem switch, então não criar.
- [ ] **B11. `PasswordInput`**, com mostrar/ocultar. Referência: `components/forms/CampoSenha.tsx`.
- [ ] **B12. `Input` com ícone à esquerda e à direita**, e prefixo/sufixo de texto, como `R$` e `%`.
- [ ] **B13. Envio de arquivo.**
  - `FileUpload` com área de arrastar e soltar, lista de arquivos e remoção. Referência: `components/forms/FileUpload.tsx:96-153`.
  - `FileButton`: um `label` com cara de botão sobre um input escondido. Referência: `AssinaturaDigitalPanel.tsx:171`.
- [ ] **B14. `Timeline`.**
  - Variantes: ícone em círculo com linha, lista de pontos com `border-l` e linha do tempo de fases.
  - Referências: `DocumentoHistorico.tsx:153-186` e `LicitacaoTimeline.tsx:99-129`.
- [ ] **B15. `Tabs variant="pill"` / `SegmentedControl`**, com cor por aba. Referência: `(d)/documentos/[id]/page.tsx:690-708`.
- [ ] **B16. `FilterBar`.** Card com título "Filtros", grade de campos e botão limpar. Criar também o `SearchInput`.
- [ ] **B17. Passos.**
  - `NumberedSteps`, uma lista de instruções numeradas (`AssinaturaDigitalPanel.tsx:113-193`).
  - `ProcessStepper` vertical compacto, o "Onde você está no processo" (`DocumentoEditorPanel.tsx:61-102`).
  - `WizardStepper` ganha um modo com links (PassosCadastro) e um modo sem card.
- [ ] **B18. `SelectableList`.** Lista mestre com item ativo destacado. Referência: `(d)/cadastros/perfis/page.tsx:204-235`.
- [ ] **B19. `Dropdown` / `Popover`** genérico, que fecha ao clicar fora e com Esc.
  - `NotificationBell`, com contador (9+), cabeçalho, "marcar todas", lista com ponto de não lido e link no rodapé.
  - Referência: `components/layout/NotificacoesDropdown.tsx:128-297`.
- [ ] **B20. `CounterBadge`**, a bolinha com número sobre um ícone.
- [ ] **B21. `PdfViewer`.** Card com `object`/`iframe`, fallback de download e toolbar. Referência: `DocumentoPreviaPanel.tsx:94-135`.
- [ ] **B22. Layouts de página.**
  - `AuthLayout` dividido: formulário em fundo escuro e painel de imagem com gradiente (`app/login/page.tsx:66-176`). Os componentes de formulário ganham a variante `onDark`.
  - `AuthCard`, o cartão escuro centralizado (`app/redefinir-senha/page.tsx:171-190`).
  - `PublicLayout`, a página pública estreita com cabeçalho de escudo e rodapé (`app/validar/*`).
  - `ErrorPage`, a página inteira de erro (`app/error.tsx`).
- [ ] **B23. `KanbanBoard`**, `KanbanColumn` (cabeçalho com contagem) e `KanbanCard` compacto, sem arrastar. Referência: `components/licitacoes/LicitacaoKanban.tsx`.
- [ ] **B24. Widgets do painel inicial.**
  - `DashboardHero`, por perfil.
  - `QuickActions`.
  - `QueueCard`, com cabeçalho de destaque e "ver todas".
  - `CountList`, com rótulo e contador.
  - `MiniStat`.
  - `MiniCalendar`.
  - Referência: `components/dashboard/*`.
- [ ] **B25. `InlineCode` / `Mono`**, para protocolo e hash.
- [ ] **B26. `FlowChips`**, a sequência A → B → C (`components/perfis/PerfilGuiaCard.tsx:164-176`).
- [ ] **B27. `StickyAside`**, o painel lateral fixo (`components/pecas/ChecklistConteudoMinimo.tsx:24`).
- [ ] **B28. Gráficos.**
  - `ChartCard`, com título e ações.
  - `ChartLegend`, com amostra de cor e %.
  - Defaults para recharts: cores, grade e eixos por token.
  - Recharts é peer dependency **opcional**, então o pacote não pode quebrar sem ele: exportar os helpers de config e a legenda em HTML.
- [ ] **B29. Estilos do editor de texto rico.**
  - `EditorFrame` e `EditorToolbar`, com botões de toolbar, separador e select de tamanho.
  - Classes de conteúdo `.documento` para o modo leitura, que substituem o `prose` que hoje não funciona no SGDM.
  - Não embutir o Tiptap: só a moldura, a toolbar como componentes de apresentação e o CSS.
- [ ] **B30. Folha de impressão.**
  - `print.css` com `@page` A4, margens de 20mm e 18mm, `.nao-imprimir`, `.quebra-pagina`, `.folha-processo` e `.peca-impressa`.
  - Tabelas com borda `#999` e fonte de 10pt.
  - Componente `PrintSheet`.

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

- [ ] **D1. Catálogo.** Uma seção por grupo, mostrando cada item novo em todas as variantes.
- [ ] **D2. Testes.** Um por componente novo, incluindo:
  - Checkbox indeterminado;
  - Dropdown fechando com Esc e com clique fora;
  - FileUpload aceitando e removendo arquivo;
  - Table selecionando linhas;
  - teste de tokens atualizado.
  - O teste "sem cor fixa em componente" continua valendo.
- [ ] **D3. README.** Tabela "padrão do SGDM → componente do pacote" com todos os itens.
- [ ] **D4. Versão.** `package.json` passa a 0.2.0, com `CHANGELOG.md`.
- [ ] **D5. Verificação.** Build, testes, `tsc`, build do catálogo e instalação pelo git. Tirar uma captura do catálogo.
