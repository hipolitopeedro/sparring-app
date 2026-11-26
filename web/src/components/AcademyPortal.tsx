import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Building2,
  CalendarPlus,
  CheckCircle2,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import { MODALITIES } from '../data/mockData';
import { AcademyEvent, AppState } from '../types/sparring';
import { HelpGuide } from './HelpGuide';

type AcademyTab = 'overview' | 'validations' | 'retention' | 'mats' | 'events' | 'help';

interface AcademyPortalProps {
  state: AppState;
  onGoHome: () => void;
  onLogout: () => void;
  onValidateStudent: (validationId: string, decision: 'Validado' | 'Ajustar') => void;
  onNudgeStudent: (studentName: string) => void;
  onAddGymSlot: (slotLabel: string, hourlyRate: number) => void;
  onRemoveGymSlot: (slotLabel: string) => void;
  onCreateEvent: (event: Omit<AcademyEvent, 'id' | 'enrolled' | 'enrolledByUser'>) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const AcademyPortal: React.FC<AcademyPortalProps> = ({
  state,
  onGoHome,
  onLogout,
  onValidateStudent,
  onNudgeStudent,
  onAddGymSlot,
  onRemoveGymSlot,
  onCreateEvent,
  onDeleteEvent,
}) => {
  const [activeTab, setActiveTab] = useState<AcademyTab>('overview');
  const [retentionFilter, setRetentionFilter] = useState<'all' | 'risk'>('all');
  const [nudgedNames, setNudgedNames] = useState<string[]>([]);

  // Mat slot form
  const managedGym =
    state.gyms.find((g) => g.name === state.academyAccount.gymName) || state.gyms[1] || state.gyms[0];
  const [newSlot, setNewSlot] = useState<string>('Sexta 16:30');
  const [slotRate, setSlotRate] = useState<number>(managedGym?.hourlyRate || 55);

  // Event form
  const [evTitle, setEvTitle] = useState<string>('');
  const [evModality, setEvModality] = useState<string>('Muay Thai');
  const [evDate, setEvDate] = useState<string>('Sabado 16:00');
  const [evSpots, setEvSpots] = useState<number>(20);

  const pendingCount = state.b2bPendingValidations.filter((v) => v.status === 'Pendente').length;
  const riskCount = state.b2bStudents.filter((s) => s.status === 'Risco de Evasao').length;
  const gymRevenueNet = useMemo(() => {
    return state.scheduledMatches.reduce((acc, m) => acc + (m.totalPrice - m.platformFee), 0);
  }, [state.scheduledMatches]);

  const sortedStudents = useMemo(() => {
    return [...state.b2bStudents]
      .filter((s) => (retentionFilter === 'risk' ? s.status === 'Risco de Evasao' : true))
      .sort((a, b) => b.roundsMonth - a.roundsMonth);
  }, [state.b2bStudents, retentionFilter]);

  const handleSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.trim()) return;
    onAddGymSlot(newSlot.trim(), Number(slotRate) || 50);
    setNewSlot('');
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim()) return;
    onCreateEvent({
      title: evTitle.trim(),
      gym: state.academyAccount.gymName,
      modality: evModality,
      date: evDate.trim() || 'Sabado 16:00',
      spots: Number(evSpots) || 20,
    });
    setEvTitle('');
  };

  const handleNudge = (name: string) => {
    setNudgedNames((prev) => (prev.includes(name) ? prev : [...prev, name]));
    onNudgeStudent(name);
  };

  const navItems: { id: AcademyTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Visao Geral', icon: LayoutDashboard },
    { id: 'validations', label: 'Validar Alunos', icon: ShieldCheck, badge: pendingCount },
    { id: 'retention', label: 'Ranking e Evasao', icon: Trophy, badge: riskCount },
    { id: 'mats', label: 'Gestao de Tatames', icon: MapPin },
    { id: 'events', label: 'Auloes e Intercambio', icon: CalendarPlus },
    { id: 'help', label: 'Ajuda e Graus', icon: BookOpen },
  ];

  const tabMeta: Record<AcademyTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Painel da Academia (B2B)',
      subtitle: 'Resumo operacional de validacoes, retencao de alunos e monetizacao de tatames.',
    },
    validations: {
      title: 'Validacao Tecnica de Alunos',
      subtitle: 'Confirme peso e graduacao reais para liberar o Selo Validado pelo Mestre no matchmaking.',
    },
    retention: {
      title: 'Ranking Interno e Anti-Evasao',
      subtitle: 'Identifique alunos frequentes e resgate atletas afastados antes do cancelamento.',
    },
    mats: {
      title: 'Gestao de Horarios Ociosos',
      subtitle: 'Publique janelas vagas entre aulas coletivas e receba 88% de repasse automatico.',
    },
    events: {
      title: 'Auloes e Treinos de Intercambio',
      subtitle: 'Crie eventos abertos sincronizados em tempo real com o portal dos lutadores.',
    },
    help: {
      title: 'Ajuda e Padrao de Graduacoes',
      subtitle: 'Referencia oficial de graduacoes (CBMT, IBJJF, CABMMA, FIAS) utilizada na validacao.',
    },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r border-gridline bg-[#131313] sticky top-0 h-screen">
        <div className="p-6 border-b border-gridline">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight leading-none">SparRing</div>
              <div className="w-10 h-[3px] bg-emerald-500 mt-1.5" />
            </div>
            <span className="border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Academia B2B
            </span>
          </div>
        </div>

        {/* Academy Profile */}
        <div className="p-5 border-b border-gridline bg-carbon/60 space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 border border-emerald-500/60 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold truncate">{state.academyAccount.gymName}</div>
              <div className="text-[11px] text-emerald-400 font-bold truncate">
                {state.academyAccount.coachName}
              </div>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 pt-1">{state.academyAccount.neighborhood}</div>
          <div className="text-[11px] text-neutral-500">{state.academyAccount.spaceType}</div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider border transition text-left ${
                  active
                    ? 'bg-emerald-500/15 border-emerald-500/70 text-white'
                    : 'border-transparent text-neutral-400 hover:bg-surface hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : ''}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="font-mono text-[10px] bg-sparring text-white px-1.5 py-0.5 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gridline grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center justify-center gap-1.5 border border-neutral-700 bg-surface hover:border-neutral-400 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition"
          >
            <Home className="w-3.5 h-3.5" /> Site
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 border border-neutral-700 bg-surface hover:border-crimson hover:text-crimson py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-gridline bg-carbon/95 backdrop-blur-md px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 lg:hidden mb-1">
              <span className="text-lg font-black">SparRing</span>
              <span className="border border-emerald-500/60 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-400">
                Academia B2B
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none">
              {tabMeta[activeTab].title}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">{tabMeta[activeTab].subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
              {state.academyAccount.gymName}
            </span>
            <button type="button" onClick={onGoHome} className="lg:hidden border border-neutral-700 bg-surface p-2 text-neutral-300">
              <Home className="w-4 h-4" />
            </button>
            <button type="button" onClick={onLogout} className="lg:hidden border border-neutral-700 bg-surface p-2 text-neutral-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-7 max-w-6xl w-full mx-auto space-y-6">
          {/* TAB 1: VISAO GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-gridline bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Alunos Monitorados</div>
                  <div className="font-mono text-3xl font-black mt-2">{state.b2bStudents.length}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">
                    {state.b2bStudents.length - riskCount} ativos nesta semana
                  </div>
                </div>
                <div className="border border-sparring/60 bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sparring">Validacoes Pendentes</div>
                  <div className="font-mono text-3xl font-black text-sparring mt-2">{pendingCount}</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Aguardando selo do mestre</div>
                </div>
                <div className="border border-crimson/60 bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-crimson">Alerta de Evasao</div>
                  <div className="font-mono text-3xl font-black text-crimson mt-2">{riskCount}</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Mais de 14 dias sem sparring</div>
                </div>
                <div className="border border-emerald-500/50 bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Repasse Tatames</div>
                  <div className="font-mono text-3xl font-black text-emerald-400 mt-2">
                    R$ {gymRevenueNet.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">{state.scheduledMatches.length} reserva(s) ativa(s)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="border border-gridline bg-surface p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider">Fila de Validacao Rapida</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('validations')}
                      className="text-[11px] font-bold uppercase text-sparring hover:underline"
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="divide-y divide-gridline">
                    {state.b2bPendingValidations.map((v) => (
                      <div key={v.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold">{v.studentName}</div>
                          <div className="text-xs text-neutral-400">
                            {v.modality} | {v.declaredWeight}kg | {v.declaredRank}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                            v.status === 'Validado'
                              ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                              : v.status === 'Ajustar'
                                ? 'border-crimson/60 bg-crimson/10 text-crimson'
                                : 'border-sparring/60 bg-sparring/10 text-sparring'
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gridline bg-surface p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider">Proximos Sparrings no Tatame</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('mats')}
                      className="text-[11px] font-bold uppercase text-emerald-400 hover:underline"
                    >
                      Gerenciar horarios
                    </button>
                  </div>
                  {state.scheduledMatches.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-4">Nenhuma reserva de tatame registrada.</p>
                  ) : (
                    <div className="divide-y divide-gridline">
                      {state.scheduledMatches.map((m) => (
                        <div key={m.id} className="py-3 flex items-center justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold">{m.partnerName} ({m.modality})</div>
                            <div className="text-xs text-neutral-400">{m.gym} | {m.slot}</div>
                          </div>
                          <div className="font-mono text-xs font-bold text-emerald-400">
                            + R$ {(m.totalPrice - m.platformFee).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VALIDAR ALUNOS */}
          {activeTab === 'validations' && (
            <div className="space-y-4">
              {state.b2bPendingValidations.map((v) => (
                <div
                  key={v.id}
                  className="border border-gridline bg-surface p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold">{v.studentName}</span>
                      <span className="border border-neutral-700 bg-carbon px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-300">
                        {v.modality}
                      </span>
                      <span className="text-xs text-neutral-500">{v.requestedAt}</span>
                    </div>
                    <div className="text-xs text-neutral-300">
                      Declarado: <strong className="font-mono text-white">{v.declaredWeight} kg</strong> |{' '}
                      <strong className="text-sparring">{v.declaredRank}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {v.status === 'Validado' ? (
                      <span className="inline-flex items-center gap-1.5 border border-emerald-500 bg-emerald-500/15 text-emerald-400 px-3 py-2 text-xs font-extrabold uppercase">
                        <CheckCircle2 className="w-4 h-4" /> Selo Mestre Ativo
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onValidateStudent(v.id, 'Validado')}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition"
                        >
                          <ShieldCheck className="w-4 h-4" /> Aprovar Selo
                        </button>
                        <button
                          type="button"
                          onClick={() => onValidateStudent(v.id, 'Ajustar')}
                          className="border border-crimson/70 text-crimson hover:bg-crimson/10 px-3 py-2 text-xs font-bold uppercase tracking-wider transition"
                        >
                          Pedir Ajuste
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RANKING E EVASAO */}
          {activeTab === 'retention' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRetentionFilter('all')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition ${
                      retentionFilter === 'all'
                        ? 'border-sparring bg-sparring text-white'
                        : 'border-neutral-700 bg-surface text-neutral-400'
                    }`}
                  >
                    Todos ({state.b2bStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRetentionFilter('risk')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition ${
                      retentionFilter === 'risk'
                        ? 'border-crimson bg-crimson text-white'
                        : 'border-neutral-700 bg-surface text-neutral-400'
                    }`}
                  >
                    Risco de Evasao ({riskCount})
                  </button>
                </div>
              </div>

              <div className="border border-gridline bg-surface overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141414] border-b border-gridline text-[10px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-3.5">#</th>
                      <th className="p-3.5">Atleta</th>
                      <th className="p-3.5">Modalidade</th>
                      <th className="p-3.5">Rounds/Mes</th>
                      <th className="p-3.5">Streak</th>
                      <th className="p-3.5">Ultimo Treino</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Acao</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gridline">
                    {sortedStudents.map((s, idx) => {
                      const isRisk = s.status === 'Risco de Evasao';
                      const wasNudged = nudgedNames.includes(s.name);
                      return (
                        <tr key={s.name} className="hover:bg-carbon/50">
                          <td className="p-3.5 font-mono font-bold text-neutral-500">#{idx + 1}</td>
                          <td className="p-3.5 font-bold text-white">{s.name}</td>
                          <td className="p-3.5 text-neutral-300">{s.modality}</td>
                          <td className="p-3.5 font-mono font-bold text-sparring">{s.roundsMonth}</td>
                          <td className="p-3.5 font-mono">{s.streak}d</td>
                          <td className="p-3.5 text-neutral-400">ha {s.lastSeenDays} dia(s)</td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase border ${
                                isRisk
                                  ? 'border-crimson/60 bg-crimson/10 text-crimson'
                                  : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                              }`}
                            >
                              {isRisk && <AlertTriangle className="w-3 h-3" />}
                              {s.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {isRisk ? (
                              <button
                                type="button"
                                disabled={wasNudged}
                                onClick={() => handleNudge(s.name)}
                                className="inline-flex items-center gap-1 border border-sparring text-sparring hover:bg-sparring/10 disabled:opacity-50 px-2.5 py-1 text-[10px] font-bold uppercase transition"
                              >
                                <Send className="w-3 h-3" /> {wasNudged ? 'Convite Enviado' : 'Convidar Treino'}
                              </button>
                            ) : (
                              <span className="text-neutral-500">Engajado</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GESTAO DE TATAMES */}
          {activeTab === 'mats' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 border border-gridline bg-surface p-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4">
                  Publicar Horario Ocioso no Marketplace
                </h3>
                <form onSubmit={handleSlotSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Dia e Horario Disponivel
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Sexta 16:30"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      required
                      className="w-full bg-carbon border border-neutral-700 focus:border-emerald-500 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Valor da Hora (R$)
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={300}
                      value={slotRate}
                      onChange={(e) => setSlotRate(Number(e.target.value))}
                      required
                      className="w-full bg-carbon border border-neutral-700 focus:border-emerald-500 px-3 py-2 text-sm font-mono outline-none"
                    />
                    <div className="text-[11px] text-neutral-500 mt-1">
                      Repasse liquido da academia (88%): R$ {(slotRate * 0.88).toFixed(2)}/hora
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition"
                  >
                    <Plus className="w-4 h-4" /> Publicar Horario
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 border border-gridline bg-surface p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider">
                      Horarios Publicados ({managedGym?.name})
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Sincronizado instantaneamente com a aba Tatames dos lutadores.
                    </p>
                  </div>
                  <span className="font-mono text-sm font-black text-emerald-400">
                    R$ {managedGym?.hourlyRate}/h
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(managedGym?.slots || []).map((slot) => (
                    <div
                      key={slot}
                      className="border border-gridline bg-carbon px-3.5 py-2.5 flex items-center justify-between"
                    >
                      <span className="font-mono text-xs font-bold">{slot}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveGymSlot(slot)}
                        className="text-neutral-500 hover:text-crimson transition"
                        title="Remover horario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AULOES E INTERCAMBIO */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 border border-gridline bg-surface p-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4">
                  Criar Novo Aulao ou Open Mat
                </h3>
                <form onSubmit={handleEventSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Titulo do Evento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Intercambio Muay Thai 40% a 60%"
                      value={evTitle}
                      onChange={(e) => setEvTitle(e.target.value)}
                      required
                      className="w-full bg-carbon border border-neutral-700 focus:border-emerald-500 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Modalidade
                      </label>
                      <select
                        value={evModality}
                        onChange={(e) => setEvModality(e.target.value)}
                        className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                      >
                        {MODALITIES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Vagas
                      </label>
                      <input
                        type="number"
                        min={4}
                        max={80}
                        value={evSpots}
                        onChange={(e) => setEvSpots(Number(e.target.value))}
                        required
                        className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Data e Horario
                    </label>
                    <input
                      type="text"
                      value={evDate}
                      onChange={(e) => setEvDate(e.target.value)}
                      required
                      className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-sparring hover:bg-[#ff6a1f] py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition"
                  >
                    <Plus className="w-4 h-4" /> Publicar Aulao
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-sparring" /> Eventos Publicados ({state.academyEvents.length})
                </h3>
                {state.academyEvents.map((ev) => {
                  const pct = Math.min(100, Math.round((ev.enrolled / ev.spots) * 100));
                  return (
                    <div key={ev.id} className="border border-gridline bg-surface p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-extrabold">{ev.title}</div>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            {ev.gym} | {ev.modality} | {ev.date}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteEvent(ev.id)}
                          className="text-neutral-500 hover:text-crimson transition"
                          title="Encerrar evento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-neutral-400">Inscritos</span>
                          <span className="font-mono font-bold text-sparring">
                            {ev.enrolled}/{ev.spots} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-carbon border border-gridline overflow-hidden">
                          <div className="h-full bg-sparring" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: AJUDA E GRAUS */}
          {activeTab === 'help' && <HelpGuide />}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gridline bg-[#131313]/95 backdrop-blur-md grid grid-cols-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase ${
                active ? 'text-emerald-400' : 'text-neutral-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-full px-0.5">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
