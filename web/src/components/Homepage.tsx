import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Cpu,
  FileText,
  LogOut,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  TrendingDown,
  Users,
  X,
} from 'lucide-react';
import { AuthMode, UserRole } from '../types/sparring';

interface HomepageProps {
  onOpenAuth: (mode: AuthMode, role: UserRole) => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onOpenAuth }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 border-b border-gridline bg-carbon/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight leading-none">SparRing</span>
            <span className="w-10 h-[3px] bg-sparring mt-1" />
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-widest text-neutral-400">
            <a href="#desafio" className="hover:text-sparring transition">O Desafio</a>
            <a href="#solucao" className="hover:text-sparring transition">Solucao</a>
            <a href="#planos" className="hover:text-sparring transition">Planos</a>
            <a href="#diferenciais" className="hover:text-sparring transition">Diferenciais</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenAuth('login', 'fighter')}
              className="border border-neutral-700 bg-surface hover:border-neutral-400 px-4 py-2 text-xs font-bold uppercase tracking-wider transition"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('register', 'fighter')}
              className="border border-sparring bg-sparring hover:bg-[#ff6a1f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-5 w-full">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-gridline grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block border border-sparring bg-sparring/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sparring">
              Onde cada round conta
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.04]">
              Pareamento seguro e <span className="text-sparring">Cartel Digital</span> para lutadores e academias.
            </h1>

            <p className="text-base text-neutral-400 leading-relaxed max-w-xl">
              O SparRing substitui grupos desorganizados de WhatsApp por um ecossistema orientado a dados. Encontre parceiros do mesmo peso, graduacao e intensidade em 11 modalidades de combate e monetize horarios ociosos de tatame.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenAuth('register', 'fighter')}
                className="inline-flex items-center gap-2 border border-sparring bg-sparring hover:bg-[#ff6a1f] px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition"
              >
                Cadastrar como Lutador <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register', 'academy')}
                className="inline-flex items-center gap-2 border border-sparring bg-surface hover:bg-sparring/10 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-sparring transition"
              >
                Sou Academia / Treinador
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login', 'fighter')}
                className="border border-neutral-700 bg-surface hover:border-neutral-400 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-200 transition"
              >
                Ja tenho conta
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-gridline border-l-[3px] border-l-sparring bg-surface p-7 space-y-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  Mercado Enderecavel no Brasil (IBGE)
                </div>
                <div className="font-mono text-5xl font-black text-sparring mt-2 leading-none">
                  5 Milhoes
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 mt-2">
                  Praticantes de Artes Marciais
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gridline pt-5">
                <div>
                  <div className="font-mono text-2xl font-extrabold">11</div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Modalidades integradas (Muay Thai, MMA, BJJ, Sambo, Capoeira...)
                  </p>
                </div>
                <div>
                  <div className="font-mono text-2xl font-extrabold text-sparring">2 Portais</div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Portal B2C para Lutadores + Painel B2B para Academias
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O Desafio */}
        <section id="desafio" className="py-16 border-b border-gridline">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-sparring mb-2">Cenario Atual</div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">O Desafio no Tatame Amador</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: MessageSquare,
                title: 'Desorganizacao',
                text: 'Atletas dependem de grupos de WhatsApp desorganizados para marcar treinos extras, sem criterios claros ou confirmacoes.',
              },
              {
                icon: AlertTriangle,
                title: 'Risco de Lesoes',
                text: 'Disparidade fisica critica (70 kg vs 100 kg) por falta de criterios tecnicos no pareamento dos treinos.',
              },
              {
                icon: LogOut,
                title: 'Evasao',
                text: 'Alunos desmotivam apos 6 meses devido a rotina monotona e falta de progressao visivel e gamificada.',
              },
              {
                icon: TrendingDown,
                title: 'Estagnacao',
                text: 'O habito de treinar sempre com os mesmos parceiros limita o aprendizado e o repertorio tecnico do lutador.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="border border-gridline bg-surface p-5">
                  <div className="w-10 h-10 border border-crimson bg-crimson/10 flex items-center justify-center text-crimson mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Solucao */}
        <section id="solucao" className="py-16 border-b border-gridline">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-sparring mb-2">Plataforma Completa</div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">A Solucao SparRing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                title: 'Matchmaking Inteligente',
                text: 'Filtros precisos por peso, graduacao, base e intensidade (tecnico 30% ou combate 80%) para o parceiro ideal.',
              },
              {
                icon: FileText,
                title: 'Cartel Digital e Gamificacao',
                text: 'Historico real com registro de rounds, horas de treino, streak de consistencia e cards estilo Strava para Instagram.',
              },
              {
                icon: ShieldCheck,
                title: 'Seguranca e Validacao B2B',
                text: 'Mestres e academias parceiras validam peso e graduacao reais dos alunos, reduzindo riscos de lesao no tatame.',
              },
              {
                icon: MapPin,
                title: 'Locacao de Tatames Ociosos',
                text: 'Academias monetizam horarios vazios entre aulas coletivas com split automatico de pagamento pela plataforma.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="border border-gridline bg-surface p-6 hover:border-sparring/60 transition">
                  <div className="w-10 h-10 border border-sparring bg-sparring/10 flex items-center justify-center text-sparring mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold uppercase tracking-wide mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Modelo de Negocio e Planos (SEM projecao 5 anos) */}
        <section id="planos" className="py-16 border-b border-gridline">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-sparring mb-2">Modelo de Negocio</div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">Planos para Atletas e Academias</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-gridline bg-surface p-6 flex flex-col justify-between">
              <div>
                <span className="border border-neutral-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                  B2C Lutador Free
                </span>
                <div className="font-mono text-3xl font-black mt-4 mb-5">
                  R$ 0 <span className="text-xs font-medium text-neutral-500">/mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-400 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sparring shrink-0" /> Matchmaking seguro por peso e intensidade</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sparring shrink-0" /> Dados do parceiro e volume de rounds</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sparring shrink-0" /> Streak de consistencia e Card Instagram</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenAuth('register', 'fighter')}
                className="w-full border border-neutral-700 hover:border-neutral-400 py-3 text-xs font-extrabold uppercase tracking-wider transition"
              >
                Criar Conta Free
              </button>
            </div>

            <div className="border border-sparring border-t-[3px] bg-surface p-6 flex flex-col justify-between">
              <div>
                <span className="border border-sparring bg-sparring/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sparring">
                  B2C Lutador Premium
                </span>
                <div className="font-mono text-3xl font-black text-sparring mt-4 mb-5">
                  R$ 14,90 <span className="text-xs font-medium text-neutral-500">/mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-300 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sparring shrink-0" /> Insights de Oponente e Distribuicao Tecnica</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sparring shrink-0" /> Rastreio de Fadiga contra Overtraining</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sparring shrink-0" /> Filtros exclusivos por canhotos e graduacao</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenAuth('register', 'fighter')}
                className="w-full border border-sparring bg-sparring hover:bg-[#ff6a1f] py-3 text-xs font-extrabold uppercase tracking-wider text-white transition"
              >
                Cadastrar como Lutador
              </button>
            </div>

            <div className="border border-gridline bg-surface p-6 flex flex-col justify-between">
              <div>
                <span className="border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  B2B Academias e Mestres
                </span>
                <div className="font-mono text-3xl font-black mt-4 mb-5">
                  R$ 89,90 <span className="text-xs font-medium text-neutral-500">/mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-400 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Painel de validacao tecnica e ranking interno</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Monitoramento anti-evasao e auloes abertos</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Locacao de tatame (split automatico 10% a 15%)</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenAuth('register', 'academy')}
                className="w-full border border-sparring text-sparring hover:bg-sparring/10 py-3 text-xs font-extrabold uppercase tracking-wider transition"
              >
                Cadastrar Academia
              </button>
            </div>
          </div>
        </section>

        {/* Concorrentes e Visao de Futuro */}
        <section id="diferenciais" className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gridline bg-surface p-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-5">Matriz Competitiva</h3>
            <div className="overflow-x-auto border border-gridline">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141414] border-b border-gridline text-[10px] uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="p-3">Funcionalidade</th>
                    <th className="p-3 bg-sparring/10 text-sparring">SparRing</th>
                    <th className="p-3">Fightnize</th>
                    <th className="p-3">WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gridline">
                  {[
                    ['Foco em Treinos', true, false, true],
                    ['Matchmaking Inteligente', true, false, false],
                    ['Cartel Digital e Dados', true, true, false],
                    ['Seguranca (Pareamento)', true, false, false],
                    ['Gamificacao Ativa', true, true, false],
                  ].map(([feat, sp, fn, wa]) => (
                    <tr key={feat as string}>
                      <td className="p-3 font-medium">{feat as string}</td>
                      <td className="p-3 bg-sparring/10 text-sparring">
                        {sp ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </td>
                      <td className="p-3">
                        {fn ? <Check className="w-4 h-4 text-sparring" /> : <X className="w-4 h-4 text-crimson" />}
                      </td>
                      <td className="p-3">
                        {wa ? <Check className="w-4 h-4 text-sparring" /> : <X className="w-4 h-4 text-crimson" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-gridline bg-surface p-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-5">Visao de Futuro</h3>
            <div className="space-y-4">
              {[
                {
                  icon: Cpu,
                  title: 'Conectividade Smart',
                  desc: 'Integracao nativa com Watches, Rings e Balancas de Bioimpedancia para coleta automatica de dados biometricos.',
                },
                {
                  icon: ShoppingBag,
                  title: 'Loja In-App',
                  desc: 'Marketplace com marcas parceiras (Maximum, Spank) para venda direta de luvas, quimonos e equipamentos.',
                },
                {
                  icon: Users,
                  title: 'Eventos e Seminarios',
                  desc: 'Seminarios com lutadores profissionais e treinos coletivos de intercambio fomentando o engajamento presencial.',
                },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="flex gap-3.5 border-l-[3px] border-sparring pl-4">
                    <Icon className="w-5 h-5 text-sparring shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wide">{v.title}</div>
                      <p className="text-xs text-neutral-400 mt-1">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gridline py-6 text-center text-xs text-neutral-500">
        SparRing | Onde cada round conta. Desenvolvido por Pedro Hipolito (Belo Horizonte, MG).
      </footer>
    </div>
  );
};
