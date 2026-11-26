import React, { useState } from 'react';
import { GRADUATION_GUIDES } from '../data/mockData';

export const HelpGuide: React.FC = () => {
  const keys = Object.keys(GRADUATION_GUIDES);
  const [selected, setSelected] = useState<string>('Muay Thai');
  const current = GRADUATION_GUIDES[selected];

  return (
    <div className="space-y-5">
      <div className="border border-gridline border-l-[3px] border-l-sparring bg-surface p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider mb-2">
          Como funciona o Nivelamento Universal do SparRing (N1 a N4)
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          Como cada arte marcial possui seu proprio sistema de faixas, cordas ou kruangs (e modalidades como Boxe, MMA, Wrestling e Sambo nao usam faixas coloridas), o SparRing adota os padroes oficiais de cada confederacao e traduz todos os atletas para 4 niveis equivalentes de seguranca:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { lvl: 'N1 INICIANTE', desc: 'Sparring educativo 30% a 40%. Controle, postura e seguranca sem impacto forte.' },
            { lvl: 'N2 INTERMEDIARIO', desc: 'Sparring tecnico 40% a 60%. Defesa, combinacoes e leitura de distancia.' },
            { lvl: 'N3 AVANCADO', desc: 'Ritmo competitivo 65% a 85%. Atletas graduados e amadores de campeonato.' },
            { lvl: 'N4 MESTRE / PRO', desc: 'Faixas pretas, Kruangs pretos, atletas pro e mestres validadores B2B.' },
          ].map((item) => (
            <div key={item.lvl} className="border border-gridline bg-carbon p-3">
              <div className="font-mono text-xs font-extrabold text-sparring">{item.lvl}</div>
              <p className="text-xs text-neutral-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gridline bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider">Guia de Graduacoes por Modalidade</h3>
          <span className="border border-sparring bg-sparring/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sparring">
            Selecione a modalidade
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelected(k)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition ${
                k === selected
                  ? 'bg-sparring border-sparring text-white'
                  : 'bg-carbon border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="border-t border-gridline pt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-sparring">{current.federation}</div>
          <p className="text-sm text-neutral-400 mt-2 mb-4">{current.overview}</p>

          <div className="space-y-2">
            {current.ranks.map((r) => (
              <div
                key={r.name}
                className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border border-gridline bg-carbon px-3.5 py-3"
              >
                <div
                  className="h-4 w-16 border border-neutral-600 relative overflow-hidden"
                  style={{ backgroundColor: r.color }}
                >
                  {r.tip && (
                    <span
                      className="absolute right-0 top-0 bottom-0 w-5"
                      style={{ backgroundColor: r.tip }}
                    />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{r.name}</div>
                  <div className="text-xs text-neutral-400">{r.note}</div>
                </div>
                <span className="font-mono text-[11px] font-bold uppercase border border-sparring bg-sparring/10 text-sparring px-2 py-0.5 whitespace-nowrap">
                  {r.levelLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gridline bg-surface p-5 space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider">Escala de Intensidade Combinada</h3>
          <div className="border-l-[3px] border-emerald-500 pl-3 text-xs text-neutral-300">
            <strong className="text-white">30% a 40% (Tecnico / Educativo):</strong> foco em timing, esquiva e toque leve sem desgaste articular.
          </div>
          <div className="border-l-[3px] border-sparring pl-3 text-xs text-neutral-300">
            <strong className="text-white">50% a 70% (Moderado / Condicional):</strong> ritmo constante, pressao controlada no corpo e pernas.
          </div>
          <div className="border-l-[3px] border-crimson pl-3 text-xs text-neutral-300">
            <strong className="text-white">80% a 90% (Simulacao de Combate):</strong> preparacao competitiva com equipamento completo e validacao de peso.
          </div>
        </div>

        <div className="border border-gridline bg-surface p-5 space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider">Seguranca de Peso e Selo do Mestre</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            <strong className="text-white">Tolerancia recomendada (ate 6 kg a 8 kg):</strong> mantem equilibrio de inercia e forca de impacto, evitando disparidades criticas como 70 kg contra 100 kg.
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            <strong className="text-white">Selo Validado pelo Mestre:</strong> atletas com selo verde tiveram peso e graduacao confirmados presencialmente no Portal B2B de uma academia parceira.
          </p>
        </div>
      </div>
    </div>
  );
};
