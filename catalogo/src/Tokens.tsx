import { useState, type ReactNode } from 'react';
import tokensCss from '../../src/styles/tokens.css?raw';
import { Card, PROFILES, Z_INDEX } from '../../src';

interface Token {
  nome: string;
  valor: string;
  nota: string;
}

/** Lê todas as variáveis --sd-* do tokens.css, com o comentário da linha. */
function lerTokens(): Token[] {
  const re = /(--sd-[\w-]+):\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g;
  const saida: Token[] = [];
  for (const m of tokensCss.matchAll(re)) {
    saida.push({ nome: m[1]!, valor: m[2]!.replace(/\s+/g, ' ').trim(), nota: m[3] ?? '' });
  }
  return saida;
}

const TOKENS = lerTokens();
const grupo = (prefixo: string) => TOKENS.filter((t) => t.nome.startsWith(prefixo));

const DEGRAUS = ['soft', 'tint', 'border', '', 'strong', 'hover', 'text', 'deep'] as const;
const NUMERO: Record<string, string> = { soft: '50', tint: '100', border: '200', '': '500', strong: '600', hover: '700', text: '800', deep: '900' };
const TONS = ['success', 'warning', 'danger', 'info', 'cyan', 'indigo', 'rose', 'violet', 'purple', 'orange', 'teal', 'sky'];
const eDeTom = (nome: string) =>
  TONS.some((t) => nome === `--sd-color-${t}` || DEGRAUS.some((d) => d && nome === `--sd-color-${t}-${d}`));

function Amostra({ t }: { t: Token }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded-control border border-border"
        style={{ background: `rgb(var(${t.nome}))` }}
      />
      <div className="min-w-0 text-xs">
        <p className="truncate font-mono font-semibold text-title">{t.nome.replace('--sd-color-', '')}</p>
        <p className="truncate text-muted">{t.nota || t.valor}</p>
      </div>
    </div>
  );
}

function Escala({ titulo, prefixo, children }: { titulo: string; prefixo: string; children: (t: Token) => ReactNode }) {
  return (
    <Card title={titulo} description={prefixo}>
      <div className="space-y-2">{grupo(prefixo).map((t) => <div key={t.nome}>{children(t)}</div>)}</div>
    </Card>
  );
}

function Rotulo({ t, prefixo }: { t: Token; prefixo: string }) {
  return (
    <span className="w-40 shrink-0 font-mono text-xs text-title">
      {t.nome.replace(prefixo, '')} <span className="text-subtle">{t.valor.length < 24 ? t.valor : ''}</span>
    </span>
  );
}

export function Tokens() {
  const cores = grupo('--sd-color-').filter(
    (t) => !t.nome.includes('chart') && !t.nome.includes('profile') && !eDeTom(t.nome),
  );
  const graficos = grupo('--sd-color-chart');
  const [animar, setAnimar] = useState(false);

  return (
    <div className="space-y-6">
      <Card title="Cores de papel" description={`${cores.length} papéis. Clique em "Cor principal" no topo para ver a troca ao vivo.`}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cores.map((t) => (
            <Amostra key={t.nome} t={t} />
          ))}
        </div>
      </Card>

      <Card title="Tons e famílias" description="Oito degraus por tom: --sd-color-<tom>[-soft|-tint|-border|-strong|-hover|-text|-deep]">
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th />
                {DEGRAUS.map((d) => (
                  <th key={d} className="px-1 pb-2 text-center font-mono font-medium text-muted">
                    {d || 'base'}
                    <br />
                    <span className="text-subtle">{NUMERO[d]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TONS.map((t) => (
                <tr key={t}>
                  <td className="pr-3 font-mono font-semibold text-title">{t}</td>
                  {DEGRAUS.map((d) => {
                    const nome = d ? `--sd-color-${t}-${d}` : `--sd-color-${t}`;
                    return (
                      <td key={d} className="p-1">
                        <div
                          className="h-8 w-14 rounded-xs border border-border-subtle"
                          title={`${nome}: ${TOKENS.find((x) => x.nome === nome)?.nota ?? ''}`}
                          style={{ background: `rgb(var(${nome}))` }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Tema por perfil" description="--sd-color-profile-<perfil>-* e --sd-shadow-profile-<perfil>">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {PROFILES.map((p) => (
            <div
              key={p}
              className="rounded-card border p-4"
              style={{
                background: `linear-gradient(135deg, rgb(var(--sd-color-profile-${p}-soft)), rgb(var(--sd-color-surface)))`,
                borderColor: `rgb(var(--sd-color-profile-${p}-border))`,
              }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-tile font-bold text-on-primary"
                style={{ background: `rgb(var(--sd-color-profile-${p}))`, boxShadow: `var(--sd-shadow-profile-${p})` }}
              >
                {p.slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-3 font-semibold" style={{ color: `rgb(var(--sd-color-profile-${p}-title))` }}>
                {p}
              </p>
              <p className="text-sm" style={{ color: `rgb(var(--sd-color-profile-${p}-text))` }}>
                Texto do perfil
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Texto sobre fundo escuro" description="--sd-color-on-dark-* (login, redefinir senha)">
        <div className="space-y-1 rounded-panel bg-sidebar p-4 text-sm">
          <p className="text-on-dark-label">Rótulo do campo (on-dark-label)</p>
          <p className="text-on-dark-muted">Subtítulo (on-dark-muted)</p>
          <p className="text-on-dark-error">Mensagem de erro (on-dark-error)</p>
          <p className="text-on-dark-link hover:text-on-dark-link-hover">Esqueci minha senha (on-dark-link)</p>
        </div>
      </Card>

      <Card title="Gráficos" description="As 12 cores de CHART_COLORS, o sky extra (13) e as auxiliares">
        <div className="flex h-10 overflow-hidden rounded-control">
          {graficos
            .filter((t) => /chart-\d+$/.test(t.nome))
            .map((t) => (
              <div key={t.nome} className="flex-1" title={t.nota} style={{ background: `rgb(var(${t.nome}))` }} />
            ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {graficos
            .filter((t) => !/chart-\d+$/.test(t.nome))
            .map((t) => (
              <Amostra key={t.nome} t={t} />
            ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Fontes">
          <div className="space-y-4">
            {grupo('--sd-font-')
              .filter((t) => !t.nome.includes('size'))
              .map((t) => (
                <div key={t.nome}>
                  <p className="font-mono text-xs text-muted">{t.nome}</p>
                  <p className="text-lg text-foreground" style={{ fontFamily: `var(${t.nome})` }}>
                    Prefeitura Municipal — Ofício nº 123/2026
                  </p>
                </div>
              ))}
          </div>
        </Card>
        <Escala titulo="Tamanhos de fonte" prefixo="--sd-font-size-">
          {(t) => (
            <div className="flex items-baseline gap-3">
              <Rotulo t={t} prefixo="--sd-font-size-" />
              <span
                className="truncate text-foreground"
                style={{ fontSize: `var(${t.nome})`, fontFamily: t.nome.includes('doc') || t.nome.includes('print') ? 'var(--sd-font-document)' : undefined }}
              >
                Ofício nº 123/2026
              </span>
            </div>
          )}
        </Escala>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Raios">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {grupo('--sd-radius-').map((t) => (
              <div key={t.nome} className="text-center text-xs">
                <div
                  className="mx-auto h-14 w-14 border-2 border-accent bg-primary-soft"
                  style={{ borderRadius: `var(${t.nome})` }}
                />
                <p className="mt-1 font-mono text-title">{t.nome.replace('--sd-radius-', '')}</p>
                <p className="text-muted">{t.valor}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Sombras">
          <div className="grid grid-cols-2 gap-4 bg-background p-3 sm:grid-cols-3">
            {grupo('--sd-shadow-').map((t) => (
              <div
                key={t.nome}
                className="rounded-control bg-surface p-3 text-center font-mono text-xs text-title"
                style={{ boxShadow: `var(${t.nome})` }}
              >
                {t.nome.replace('--sd-shadow-', '')}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Camadas (z-index)" description="Z_INDEX no JS">
          <div className="relative h-56">
            {Object.entries(Z_INDEX).map(([nome, z], i) => (
              <div
                key={nome}
                className="absolute flex h-10 w-36 items-center rounded-control border border-border bg-surface px-3 font-mono text-xs text-title shadow-card"
                style={{ left: i * 14, top: i * 22, zIndex: `var(--sd-z-${nome})` }}
              >
                {nome} · {z}
              </div>
            ))}
          </div>
        </Card>
        <Card
          title="Tempo"
          description="Passe o mouse ou clique para animar"
          action={
            <button type="button" className="text-xs font-medium text-accent" onClick={() => setAnimar((v) => !v)}>
              animar
            </button>
          }
        >
          <div className="space-y-3">
            {grupo('--sd-duration-').concat(grupo('--sd-ease-')).map((t) => (
              <div key={t.nome} className="flex items-center gap-3">
                <Rotulo t={t} prefixo="--sd-" />
                {t.nome.includes('duration') && !t.nome.includes('progress') && (
                  <div className="h-3 flex-1 rounded-pill bg-surface-muted">
                    <div
                      className="h-3 rounded-pill bg-accent"
                      style={{
                        width: animar ? '100%' : '10%',
                        transition: `width var(${t.nome}) var(--sd-ease-standard)`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Escala titulo="Medidas de layout" prefixo="--sd-size-">
          {(t) => (
            <div className="flex items-center gap-3">
              <Rotulo t={t} prefixo="--sd-size-" />
              <div className="h-2 rounded-pill bg-primary-light" style={{ width: `calc(var(${t.nome}) / 8)` }} />
            </div>
          )}
        </Escala>
      </div>
      <Escala titulo="Espaço da página e breakpoint" prefixo="--sd-space-">
        {(t) => (
          <div className="flex items-center gap-3">
            <Rotulo t={t} prefixo="--sd-space-" />
            <div className="h-4 bg-primary-soft" style={{ width: `var(${t.nome})` }} />
          </div>
        )}
      </Escala>
    </div>
  );
}
