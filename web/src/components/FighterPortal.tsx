import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Crown,
  Download,
  Flame,
  Home,
  Lock,
  LogOut,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
  X,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getInitials, MODALITIES } from '../data/mockData';
import {
  AppState,
  FighterPartner,
  GymPartner,
  PlanType,
  ScheduledMatch,
  SparringSession,
} from '../types/sparring';
import { HelpGuide } from './HelpGuide';

type FighterTab = 'matchmaking' | 'cartel' | 'analytics' | 'spaces' | 'help';

interface FighterPortalProps {
  state: AppState;
  onGoHome: () => void;
  onLogout: () => void;
  onTogglePlan: (plan: PlanType) => void;
  onBookMatch: (match: Omit<ScheduledMatch, 'id' | 'status'>) => void;
  onCancelMatch: (matchId: string) => void;
  onRescheduleMatch: (matchId: string, gym: string, slot: string) => void;
  onToggleEventEnrollment: (eventId: string) => void;
  onLogSession: (session: Omit<SparringSession, 'id'>) => void;
}

function calcCompatibility(
  user: AppState['currentUser'],
  partner: FighterPartner,
  desiredIntensity: number,
): number {
  let score = 100;
  if (partner.modality !== user.modality) score -= 12;
  const weightDiff = Math.abs(partner.weight - user.weight);
  score -= Math.min(45, weightDiff * 2.4);
  score -= Math.abs(partner.rankLevel - user.rankLevel) * 10;
  score -= Math.round(Math.abs(partner.preferredIntensity - desiredIntensity) * 0.25);
  if (partner.verified) score += 5;
  return Math.max(25, Math.min(99, Math.round(score)));
}

export const FighterPortal: React.FC<FighterPortalProps> = ({
  state,
  onGoHome,
  onLogout,
  onTogglePlan,
  onBookMatch,
  onCancelMatch,
  onRescheduleMatch,
  onToggleEventEnrollment,
  onLogSession,
}) => {
  const [activeTab, setActiveTab] = useState<FighterTab>('matchmaking');

  // Matchmaking filters
  const [filterModality, setFilterModality] = useState<string>('Todas');
  const [weightTolerance, setWeightTolerance] = useState<number>(8);
  const [desiredIntensity, setDesiredIntensity] = useState<number>(60);
  const [onlyLefty, setOnlyLefty] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [filterLevel, setFilterLevel] = useState<string>('Todos');

  // Booking modal state
  const [bookingPartner, setBookingPartner] = useState<FighterPartner | null>(null);
  const [bookGymId, setBookGymId] = useState<string>(state.gyms[0]?.id || '');
  const [bookSlot, setBookSlot] = useState<string>(state.gyms[0]?.slots[0] || 'Sabado 09:30');
  const [bookRounds, setBookRounds] = useState<number>(6);
  const [bookIntensity, setBookIntensity] = useState<number>(60);

  // Reschedule modal state (ONLY for sparrings / mat reservations, NEVER for auloes)
  const [rescheduleTarget, setRescheduleTarget] = useState<ScheduledMatch | null>(null);
  const [reschedGym, setReschedGym] = useState<string>('');
  const [reschedSlot, setReschedSlot] = useState<string>('');

  // Log session modal state
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [logModality, setLogModality] = useState<string>(state.currentUser.modality);
  const [logPartner, setLogPartner] = useState<string>('Lucas Andrade');
  const [logWeight, setLogWeight] = useState<number>(76);
  const [logStance, setLogStance] = useState<'Destro' | 'Canhoto'>('Destro');
  const [logGym, setLogGym] = useState<string>(state.gyms[0]?.name || 'CT Nova Era BH');
  const [logRounds, setLogRounds] = useState<number>(6);
  const [logMinutes, setLogMinutes] = useState<number>(3);
  const [logIntensity, setLogIntensity] = useState<number>(65);
  const [logFatigue, setLogFatigue] = useState<number>(6);
  const [logBoxe, setLogBoxe] = useState<number>(40);
  const [logChutes, setLogChutes] = useState<number>(35);
  const [logClinch, setLogClinch] = useState<number>(25);

  // Story Card modal state
  const [storyPreviewUrl, setStoryPreviewUrl] = useState<string | null>(null);

  const isPremium = state.plan === 'premium';
  const user = state.currentUser;

  const filteredFighters = useMemo(() => {
    return state.fighters
      .filter((f) => {
        if (filterModality !== 'Todas' && f.modality !== filterModality) return false;
        if (Math.abs(f.weight - user.weight) > weightTolerance) return false;
        if (isPremium && onlyLefty && f.stance !== 'Canhoto') return false;
        if (isPremium && onlyVerified && !f.verified) return false;
        if (isPremium && filterLevel !== 'Todos' && f.rankLevel !== Number(filterLevel)) return false;
        return true;
      })
      .map((f) => ({
        fighter: f,
        matchScore: calcCompatibility(user, f, desiredIntensity),
        weightDiff: Math.abs(f.weight - user.weight),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [
    state.fighters,
    filterModality,
    user,
    weightTolerance,
    desiredIntensity,
    isPremium,
    onlyLefty,
    onlyVerified,
    filterLevel,
  ]);

  const cartelStats = useMemo(() => {
    const totalRounds = state.sessions.reduce((acc, s) => acc + s.rounds, 0);
    const totalMinutes = state.sessions.reduce((acc, s) => acc + s.rounds * s.roundMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const leftyCount = state.sessions.filter((s) => s.partnerStance === 'Canhoto').length;
    const leftyPct = state.sessions.length ? Math.round((leftyCount / state.sessions.length) * 100) : 0;
    const avgPartnerWeight = state.sessions.length
      ? (state.sessions.reduce((acc, s) => acc + s.partnerWeight, 0) / state.sessions.length).toFixed(1)
      : '0';
    const avgBoxe = state.sessions.length
      ? Math.round(state.sessions.reduce((acc, s) => acc + s.focus.boxe, 0) / state.sessions.length)
      : 0;
    const avgChutes = state.sessions.length
      ? Math.round(state.sessions.reduce((acc, s) => acc + s.focus.chutes, 0) / state.sessions.length)
      : 0;
    const avgClinch = state.sessions.length
      ? Math.round(state.sessions.reduce((acc, s) => acc + s.focus.clinch, 0) / state.sessions.length)
      : 0;
    const latestFatigue = state.sessions[0]?.fatigue ?? 0;

    return {
      totalRounds,
      totalHours,
      leftyPct,
      avgPartnerWeight,
      avgBoxe,
      avgChutes,
      avgClinch,
      latestFatigue,
    };
  }, [state.sessions]);

  const chartData = useMemo(() => {
    return [...state.sessions]
      .reverse()
      .map((s) => ({
        date: s.date.slice(5),
        intensidade: s.intensity,
        fadiga: s.fatigue,
        rounds: s.rounds,
        parceiro: s.partnerName,
      }));
  }, [state.sessions]);

  const openBookingForPartner = (partner: FighterPartner) => {
    setBookingPartner(partner);
    const matchingGym = state.gyms.find((g) => g.name === partner.gym) || state.gyms[0];
    setBookGymId(matchingGym?.id || '');
    setBookSlot(matchingGym?.slots[0] || partner.availability);
    setBookRounds(6);
    setBookIntensity(partner.preferredIntensity);
  };

  const selectedBookGym: GymPartner | undefined = state.gyms.find((g) => g.id === bookGymId) || state.gyms[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPartner || !selectedBookGym) return;
    const totalPrice = selectedBookGym.hourlyRate;
    const platformFee = Number(((totalPrice * selectedBookGym.takeRatePercent) / 100).toFixed(2));
    onBookMatch({
      partnerName: bookingPartner.name,
      modality: bookingPartner.modality,
      gym: selectedBookGym.name,
      slot: bookSlot,
      rounds: bookRounds,
      intensity: bookIntensity,
      totalPrice,
      platformFee,
    });
    setBookingPartner(null);
    setActiveTab('spaces');
  };

  const handleBookIdleSlot = (gym: GymPartner, slot: string) => {
    const platformFee = Number(((gym.hourlyRate * gym.takeRatePercent) / 100).toFixed(2));
    onBookMatch({
      partnerName: 'Reserva de Tatame Livre',
      modality: user.modality,
      gym: gym.name,
      slot,
      rounds: 6,
      intensity: 50,
      totalPrice: gym.hourlyRate,
      platformFee,
    });
  };

  const openRescheduleModal = (m: ScheduledMatch) => {
    setRescheduleTarget(m);
    setReschedGym(m.gym);
    const gymObj = state.gyms.find((g) => g.name === m.gym) || state.gyms[0];
    setReschedSlot(gymObj?.slots[0] || m.slot);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;
    onRescheduleMatch(rescheduleTarget.id, reschedGym, reschedSlot);
    setRescheduleTarget(null);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = logBoxe + logChutes + logClinch || 100;
    onLogSession({
      date: new Date().toISOString().slice(0, 10),
      modality: logModality,
      partnerName: logPartner.trim() || 'Parceiro SparRing',
      partnerWeight: Number(logWeight) || 75,
      partnerHeight: 178,
      partnerAge: 25,
      partnerRank: 'Graduado',
      partnerRankLevel: 2,
      partnerStance: logStance,
      gym: logGym,
      rounds: Number(logRounds) || 5,
      roundMinutes: Number(logMinutes) || 3,
      intensity: Number(logIntensity) || 60,
      fatigue: Number(logFatigue) || 5,
      focus: {
        boxe: Math.round((logBoxe / sum) * 100),
        chutes: Math.round((logChutes / sum) * 100),
        clinch: Math.round((logClinch / sum) * 100),
      },
    });
    setShowLogModal(false);
  };

  const generateStoryCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Carbon background + architectural grid
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 1080, 1350);
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1080; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1350);
      ctx.stroke();
    }
    for (let y = 0; y <= 1350; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }

    // Top orange stripe
    ctx.fillStyle = '#FF5500';
    ctx.fillRect(0, 0, 1080, 14);

    // Brand
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 78px Inter, Arial, sans-serif';
    ctx.fillText('SparRing', 80, 145);
    ctx.fillStyle = '#FF5500';
    ctx.fillRect(80, 170, 180, 8);
    ctx.font = '700 26px Inter, Arial, sans-serif';
    ctx.fillText('ONDE CADA ROUND CONTA.', 80, 224);

    // Athlete box
    ctx.fillStyle = '#171717';
    ctx.fillRect(80, 290, 920, 210);
    ctx.strokeStyle = '#FF5500';
    ctx.lineWidth = 4;
    ctx.strokeRect(80, 290, 920, 210);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 46px Inter, Arial, sans-serif';
    ctx.fillText(user.name.toUpperCase(), 120, 370);
    ctx.fillStyle = '#FF5500';
    ctx.font = '700 28px Inter, Arial, sans-serif';
    ctx.fillText(`${user.modality.toUpperCase()}  |  ${user.category.toUpperCase()}  |  ${user.stance.toUpperCase()}`, 120, 422);
    ctx.fillStyle = '#A3A3A3';
    ctx.font = '600 24px monospace';
    ctx.fillText(`${user.weight} KG  |  ${user.height} CM  |  ${user.rank}`, 120, 466);

    // Big metrics
    const metrics = [
      { label: 'ROUNDS REGISTRADOS', val: String(cartelStats.totalRounds) },
      { label: 'HORAS DE TATAME', val: `${cartelStats.totalHours}h` },
      { label: 'STREAK ATUAL', val: `${user.streakDays} DIAS` },
      { label: 'SESSOES NO CARTEL', val: String(state.sessions.length) },
    ];
    metrics.forEach((m, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 80 + col * 480;
      const y = 550 + row * 220;
      ctx.fillStyle = '#171717';
      ctx.fillRect(x, y, 440, 190);
      ctx.strokeStyle = '#2A2A2A';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 440, 190);
      ctx.fillStyle = '#A3A3A3';
      ctx.font = '700 22px Inter, Arial, sans-serif';
      ctx.fillText(m.label, x + 36, y + 58);
      ctx.fillStyle = idx === 2 ? '#FF5500' : '#FFFFFF';
      ctx.font = '900 72px monospace';
      ctx.fillText(m.val, x + 36, y + 148);
    });

    // Latest sparring footer
    const latest = state.sessions[0];
    ctx.fillStyle = '#171717';
    ctx.fillRect(80, 1020, 920, 180);
    ctx.fillStyle = '#FF5500';
    ctx.fillRect(80, 1020, 10, 180);
    ctx.fillStyle = '#A3A3A3';
    ctx.font = '700 22px Inter, Arial, sans-serif';
    ctx.fillText('ULTIMO SPARRING VALIDADO', 120, 1072);
    if (latest) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 34px Inter, Arial, sans-serif';
      ctx.fillText(`${latest.modality} vs ${latest.partnerName} (${latest.partnerWeight}kg)`, 120, 1126);
      ctx.fillStyle = '#D4D4D4';
      ctx.font = '600 24px monospace';
      ctx.fillText(`${latest.rounds} ROUNDS x ${latest.roundMinutes} MIN  |  INTENSIDADE ${latest.intensity}%  |  ${latest.gym}`, 120, 1170);
    }

    ctx.fillStyle = '#737373';
    ctx.font = '700 22px monospace';
    ctx.fillText('SPARRING.APP  |  CARTEL DIGITAL OFICIAL', 80, 1280);

    setStoryPreviewUrl(canvas.toDataURL('image/png'));
  };

  const navItems: { id: FighterTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'matchmaking', label: 'Matchmaking', icon: Swords },
    { id: 'cartel', label: 'Cartel Digital', icon: Award },
    { id: 'analytics', label: 'Insights PRO', icon: Activity },
    { id: 'spaces', label: 'Tatames e Auloes', icon: MapPin },
    { id: 'help', label: 'Ajuda e Graus', icon: BookOpen },
  ];

  const tabMeta: Record<FighterTab, { title: string; subtitle: string }> = {
    matchmaking: {
      title: 'Matchmaking Inteligente',
      subtitle: 'Encontre parceiros do mesmo peso, graduacao e intensidade em 11 modalidades.',
    },
    cartel: {
      title: 'Cartel Digital e Gamificacao',
      subtitle: 'Historico completo de rounds, horas de tatame, consistencia e card estilo Strava.',
    },
    analytics: {
      title: 'Insights e Fadiga PRO',
      subtitle: 'Analise de oponentes, distribuicao tecnica e monitoramento contra overtraining.',
    },
    spaces: {
      title: 'Tatames, Sparrings e Auloes',
      subtitle: 'Gerencie seus sparrings, garanta vaga em auloes abertos e reserve tatames ociosos.',
    },
    help: {
      title: 'Ajuda e Guia de Graduacoes',
      subtitle: 'Entenda os graus, faixas e o nivelamento universal (N1 a N4) de cada modalidade.',
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
              <div className="w-10 h-[3px] bg-sparring mt-1.5" />
            </div>
            <span className="border border-sparring bg-sparring/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sparring">
              Lutador B2C
            </span>
          </div>
        </div>

        {/* Athlete summary */}
        <div className="p-5 border-b border-gridline bg-carbon/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border border-sparring bg-sparring/15 text-sparring font-mono font-black text-sm flex items-center justify-center shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold truncate">{user.name}</div>
              <div className="text-[11px] text-sparring font-bold uppercase tracking-wider truncate">
                {user.modality} | {user.category}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-3 text-center">
            <div className="border border-gridline bg-surface py-1.5">
              <div className="font-mono text-xs font-bold">{user.weight}kg</div>
              <div className="text-[9px] uppercase text-neutral-500">Peso</div>
            </div>
            <div className="border border-gridline bg-surface py-1.5">
              <div className="font-mono text-xs font-bold">{user.height}cm</div>
              <div className="text-[9px] uppercase text-neutral-500">Altura</div>
            </div>
            <div className="border border-gridline bg-surface py-1.5">
              <div className="font-mono text-xs font-bold">{user.stance}</div>
              <div className="text-[9px] uppercase text-neutral-500">Base</div>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-2.5 truncate">
            {user.rank}
          </div>
          <div className="text-[11px] text-neutral-500 truncate">{user.city}</div>
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
                    ? 'bg-sparring/15 border-sparring text-white'
                    : 'border-transparent text-neutral-400 hover:bg-surface hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-sparring' : ''}`} />
                <span className="flex-1">{item.label}</span>
                {item.id === 'analytics' && !isPremium && <Lock className="w-3.5 h-3.5 text-neutral-500" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gridline space-y-2">
          <button
            type="button"
            onClick={() => onTogglePlan(isPremium ? 'free' : 'premium')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 text-[11px] font-extrabold uppercase tracking-wider border transition ${
              isPremium
                ? 'border-sparring bg-sparring/10 text-sparring hover:bg-sparring/20'
                : 'border-sparring bg-sparring text-white hover:bg-[#ff6a1f]'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            {isPremium ? 'Plano Premium Ativo' : 'Testar SparRing PRO'}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center justify-center gap-1.5 border border-neutral-700 bg-surface hover:border-neutral-400 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition"
            >
              <Home className="w-3.5 h-3.5" /> Site
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 border border-neutral-700 bg-surface hover:border-crimson hover:text-crimson py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-gridline bg-carbon/95 backdrop-blur-md px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 lg:hidden mb-1">
              <span className="text-lg font-black">SparRing</span>
              <span className="border border-sparring bg-sparring/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-sparring">
                Lutador
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none">
              {tabMeta[activeTab].title}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">{tabMeta[activeTab].subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTogglePlan(isPremium ? 'free' : 'premium')}
              className={`border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition ${
                isPremium
                  ? 'border-sparring bg-sparring/15 text-sparring'
                  : 'border-neutral-700 bg-surface text-neutral-300 hover:border-sparring'
              }`}
            >
              {isPremium ? 'PRO ATIVO' : 'CONTA FREE'}
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="lg:hidden border border-neutral-700 bg-surface p-2 text-neutral-300"
              title="Homepage"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="lg:hidden border border-neutral-700 bg-surface p-2 text-neutral-300"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-7 max-w-6xl w-full mx-auto space-y-6">
          {/* TAB 1: MATCHMAKING */}
          {activeTab === 'matchmaking' && (
            <div className="space-y-6">
              {/* Filters panel */}
              <div className="border border-gridline bg-surface p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider">
                    Parametros de Pareamento Seguro ({user.weight} kg | {user.modality})
                  </div>
                  <span className="font-mono text-xs text-sparring font-bold">
                    {filteredFighters.length} parceiros compativeis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Modalidade (11 opcoes)
                    </label>
                    <select
                      value={filterModality}
                      onChange={(e) => setFilterModality(e.target.value)}
                      className="w-full bg-carbon border border-neutral-700 focus:border-sparring px-3 py-2 text-sm outline-none"
                    >
                      <option value="Todas">Todas as Modalidades</option>
                      {MODALITIES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
                      <span className="text-neutral-400">Tolerancia de Peso</span>
                      <span className={`font-mono ${weightTolerance > 10 ? 'text-crimson' : 'text-sparring'}`}>
                        +/- {weightTolerance} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={25}
                      value={weightTolerance}
                      onChange={(e) => setWeightTolerance(Number(e.target.value))}
                      className="w-full accent-[#FF5500]"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
                      <span>2 kg (Restrito)</span>
                      <span>8 kg (Ideal)</span>
                      <span>25 kg (Risco)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
                      <span className="text-neutral-400">Intensidade Desejada</span>
                      <span className="font-mono text-sparring">{desiredIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={90}
                      step={5}
                      value={desiredIntensity}
                      onChange={(e) => setDesiredIntensity(Number(e.target.value))}
                      className="w-full accent-[#FF5500]"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
                      <span>30% Tecnico</span>
                      <span>60% Moderado</span>
                      <span>90% Combate</span>
                    </div>
                  </div>
                </div>

                {weightTolerance > 10 && (
                  <div className="border border-crimson bg-crimson/10 p-3 flex items-start gap-2.5 text-xs text-red-200">
                    <AlertTriangle className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                    <div>
                      <strong className="uppercase">Alerta de Risco Fisico:</strong> Tolerancia acima de 10 kg pode parear atletas com grande disparidade de peso e inercia. Recomendamos manter ate 8 kg para seguranca.
                    </div>
                  </div>
                )}

                {/* Premium filters row */}
                <div className="border-t border-gridline pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider border border-sparring/60 bg-sparring/10 text-sparring px-2 py-0.5">
                      <Crown className="w-3 h-3" /> Filtros PRO
                    </span>
                    <label className={`flex items-center gap-2 text-xs ${isPremium ? 'text-neutral-200 cursor-pointer' : 'text-neutral-500 cursor-not-allowed'}`}>
                      <input
                        type="checkbox"
                        disabled={!isPremium}
                        checked={onlyLefty}
                        onChange={(e) => setOnlyLefty(e.target.checked)}
                        className="accent-[#FF5500]"
                      />
                      Somente Canhotos
                    </label>
                    <label className={`flex items-center gap-2 text-xs ${isPremium ? 'text-neutral-200 cursor-pointer' : 'text-neutral-500 cursor-not-allowed'}`}>
                      <input
                        type="checkbox"
                        disabled={!isPremium}
                        checked={onlyVerified}
                        onChange={(e) => setOnlyVerified(e.target.checked)}
                        className="accent-[#FF5500]"
                      />
                      Somente Validados pelo Mestre
                    </label>
                    <select
                      disabled={!isPremium}
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="bg-carbon border border-neutral-700 px-2.5 py-1 text-xs outline-none disabled:opacity-40"
                    >
                      <option value="Todos">Qualquer Nivel (N1-N4)</option>
                      <option value="1">N1 Iniciante</option>
                      <option value="2">N2 Intermediario</option>
                      <option value="3">N3 Avancado</option>
                      <option value="4">N4 Mestre / Pro</option>
                    </select>
                  </div>
                  {!isPremium && (
                    <button
                      type="button"
                      onClick={() => onTogglePlan('premium')}
                      className="text-[11px] font-extrabold uppercase tracking-wider text-sparring hover:underline"
                    >
                      Desbloquear Filtros PRO
                    </button>
                  )}
                </div>
              </div>

              {/* Fighter Cards Grid */}
              {filteredFighters.length === 0 ? (
                <div className="border border-gridline bg-surface p-10 text-center space-y-2">
                  <div className="text-sm font-extrabold uppercase">Nenhum parceiro encontrado com esses filtros</div>
                  <p className="text-xs text-neutral-400">
                    Tente ampliar a modalidade para Todas ou ajustar a tolerancia de peso.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFighters.map(({ fighter, matchScore, weightDiff }) => (
                    <div
                      key={fighter.id}
                      className={`border bg-surface p-5 flex flex-col justify-between transition ${
                        weightDiff > 10 ? 'border-crimson/70' : 'border-gridline hover:border-sparring/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 border border-neutral-700 bg-carbon font-mono font-black text-sm flex items-center justify-center text-white">
                              {getInitials(fighter.name)}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-extrabold">{fighter.name}</h3>
                                {fighter.verified ? (
                                  <span className="inline-flex items-center gap-1 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                                    <ShieldCheck className="w-3 h-3" /> Validado Mestre
                                  </span>
                                ) : (
                                  <span className="border border-neutral-700 bg-carbon text-neutral-400 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                                    Em Validacao
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-sparring font-bold uppercase tracking-wider mt-0.5">
                                {fighter.modality} | {fighter.rank}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-mono text-xl font-black text-sparring leading-none">
                              {matchScore}%
                            </div>
                            <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 mt-0.5">
                              Match
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed mb-4">{fighter.bio}</p>

                        <div className="grid grid-cols-4 gap-2 text-center mb-4">
                          <div className="border border-gridline bg-carbon py-2 px-1">
                            <div className={`font-mono text-xs font-bold ${weightDiff > 10 ? 'text-crimson' : 'text-white'}`}>
                              {fighter.weight}kg
                            </div>
                            <div className="text-[9px] uppercase text-neutral-500">Peso</div>
                          </div>
                          <div className="border border-gridline bg-carbon py-2 px-1">
                            <div className="font-mono text-xs font-bold">{fighter.height}cm</div>
                            <div className="text-[9px] uppercase text-neutral-500">Altura</div>
                          </div>
                          <div className="border border-gridline bg-carbon py-2 px-1">
                            <div className="font-mono text-xs font-bold">{fighter.stance}</div>
                            <div className="text-[9px] uppercase text-neutral-500">Base</div>
                          </div>
                          <div className="border border-gridline bg-carbon py-2 px-1">
                            <div className="font-mono text-xs font-bold text-sparring">{fighter.preferredIntensity}%</div>
                            <div className="text-[9px] uppercase text-neutral-500">Ritmo</div>
                          </div>
                        </div>

                        {weightDiff > 10 && (
                          <div className="mb-3 border border-crimson/60 bg-crimson/10 px-2.5 py-1.5 text-[11px] text-red-200 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-crimson shrink-0" />
                            Diferenca de {weightDiff} kg acima do recomendado.
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gridline pt-3.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-neutral-400 space-y-0.5">
                          <div className="font-semibold text-neutral-200">
                            {fighter.gym} ({fighter.neighborhood} | {fighter.distanceKm} km)
                          </div>
                          <div>Disponivel: {fighter.availability} | {fighter.roundsLogged} rounds</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openBookingForPartner(fighter)}
                          className="bg-sparring hover:bg-[#ff6a1f] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition"
                        >
                          Agendar Sparring
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CARTEL DIGITAL */}
          {activeTab === 'cartel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-gridline bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total de Rounds</div>
                  <div className="font-mono text-3xl font-black mt-2">{cartelStats.totalRounds}</div>
                  <div className="text-[11px] text-neutral-500 mt-1">Acumulado verificado</div>
                </div>
                <div className="border border-gridline bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Horas de Tatame</div>
                  <div className="font-mono text-3xl font-black mt-2">{cartelStats.totalHours}h</div>
                  <div className="text-[11px] text-neutral-500 mt-1">Tempo efetivo de combate</div>
                </div>
                <div className="border border-sparring/60 bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sparring flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Streak Atual
                  </div>
                  <div className="font-mono text-3xl font-black text-sparring mt-2">{user.streakDays} dias</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Consistencia ativa</div>
                </div>
                <div className="border border-gridline bg-surface p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sessoes no Cartel</div>
                  <div className="font-mono text-3xl font-black mt-2">{state.sessions.length}</div>
                  <div className="text-[11px] text-neutral-500 mt-1">Historico completo</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border border-gridline bg-surface p-4">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider">Registre seus rounds e compartilhe</div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Exporte seu card estilo Strava em PNG (1080x1350) pronto para Stories.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={generateStoryCard}
                    className="inline-flex items-center gap-2 border border-sparring text-sparring hover:bg-sparring/10 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition"
                  >
                    <Download className="w-4 h-4" /> Gerar Card Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLogModal(true)}
                    className="inline-flex items-center gap-2 bg-sparring hover:bg-[#ff6a1f] text-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition"
                  >
                    <Plus className="w-4 h-4" /> Registrar Sparring
                  </button>
                </div>
              </div>

              <div className="border border-gridline bg-surface overflow-hidden">
                <div className="p-4 border-b border-gridline text-xs font-extrabold uppercase tracking-wider">
                  Historico de Sessoes de Sparring
                </div>
                <div className="divide-y divide-gridline">
                  {state.sessions.map((s) => (
                    <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-carbon/50 transition">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-neutral-400">{s.date}</span>
                          <span className="border border-sparring/60 bg-sparring/10 text-sparring px-2 py-0.5 text-[10px] font-bold uppercase">
                            {s.modality}
                          </span>
                          <span className="text-sm font-extrabold">vs {s.partnerName}</span>
                          <span className="text-xs text-neutral-400">
                            ({s.partnerWeight}kg | {s.partnerStance})
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          {s.gym} | Foco tecnico: Boxe {s.focus.boxe}% / Chutes {s.focus.chutes}% / Clinch {s.focus.clinch}%
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <div className="border border-gridline bg-carbon px-3 py-1.5 text-center">
                          <div className="font-mono text-xs font-bold">{s.rounds}x {s.roundMinutes}m</div>
                          <div className="text-[9px] uppercase text-neutral-500">Volume</div>
                        </div>
                        <div className="border border-gridline bg-carbon px-3 py-1.5 text-center">
                          <div className="font-mono text-xs font-bold text-sparring">{s.intensity}%</div>
                          <div className="text-[9px] uppercase text-neutral-500">Ritmo</div>
                        </div>
                        <div className={`border px-3 py-1.5 text-center ${s.fatigue >= 8 ? 'border-crimson bg-crimson/10' : 'border-gridline bg-carbon'}`}>
                          <div className={`font-mono text-xs font-bold ${s.fatigue >= 8 ? 'text-crimson' : 'text-white'}`}>
                            {s.fatigue}/10
                          </div>
                          <div className="text-[9px] uppercase text-neutral-500">Fadiga</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSIGHTS E FADIGA PRO */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {!isPremium ? (
                <div className="border border-sparring bg-surface p-8 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto border border-sparring bg-sparring/15 flex items-center justify-center text-sparring">
                    <Crown className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Desbloqueie Insights de Oponente e Rastreio de Fadiga
                  </h2>
                  <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                    Com o SparRing Premium (R$ 14,90/mes), voce acompanha a curva de fadiga contra overtraining, distribuicao tecnica por fundamento e perfil dos seus adversarios.
                  </p>
                  <button
                    type="button"
                    onClick={() => onTogglePlan('premium')}
                    className="inline-flex items-center gap-2 bg-sparring hover:bg-[#ff6a1f] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition"
                  >
                    <Sparkles className="w-4 h-4" /> Ativar Modo Premium (Demonstracao)
                  </button>
                </div>
              ) : (
                <>
                  {cartelStats.latestFatigue >= 8 && (
                    <div className="border border-crimson bg-crimson/10 p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-crimson shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wider text-red-200">
                          Zona de Alerta de Overtraining Detectada
                        </div>
                        <p className="text-xs text-red-200/80 mt-1">
                          Sua ultima sessao registrou fadiga {cartelStats.latestFatigue}/10. Recomendamos um sparring tecnico leve (30% a 40%) ou 48h de recuperacao ativa antes do proximo combate intenso.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gridline bg-surface p-5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Combates contra Canhotos
                      </div>
                      <div className="font-mono text-3xl font-black text-sparring mt-2">{cartelStats.leftyPct}%</div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Exposicao a guardas invertidas nos ultimos treinos
                      </p>
                    </div>
                    <div className="border border-gridline bg-surface p-5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Peso Medio dos Oponentes
                      </div>
                      <div className="font-mono text-3xl font-black mt-2">{cartelStats.avgPartnerWeight} kg</div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Seu peso atual cadastrado: {user.weight} kg
                      </p>
                    </div>
                    <div className="border border-gridline bg-surface p-5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Indice de Fadiga Recente
                      </div>
                      <div className={`font-mono text-3xl font-black mt-2 ${cartelStats.latestFatigue >= 8 ? 'text-crimson' : 'text-emerald-400'}`}>
                        {cartelStats.latestFatigue}/10
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {cartelStats.latestFatigue >= 8 ? 'Carga alta, priorize recuperacao' : 'Carga sob controle seguro'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 border border-gridline bg-surface p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-xs font-extrabold uppercase tracking-wider">
                            Curva de Intensidade vs Fadiga (Anti-Overtraining)
                          </h3>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Faixa vermelha indica risco elevado de sobrecarga (fadiga acima de 7.5/10).
                          </p>
                        </div>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                            <XAxis dataKey="date" stroke="#737373" tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="left" domain={[0, 10]} stroke="#D91E2A" tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#FF5500" tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#111111',
                                borderColor: '#333333',
                                fontSize: '12px',
                              }}
                            />
                            <ReferenceArea yAxisId="left" y1={7.5} y2={10} fill="#D91E2A" fillOpacity={0.14} />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="intensidade"
                              name="Intensidade (%)"
                              stroke="#FF5500"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#FF5500' }}
                            />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="fadiga"
                              name="Fadiga (0-10)"
                              stroke="#D91E2A"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#D91E2A' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="lg:col-span-4 border border-gridline bg-surface p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4">
                          Distribuicao Tecnica Media
                        </h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Boxe / Maos', pct: cartelStats.avgBoxe, color: 'bg-sparring' },
                            { label: 'Chutes / Pernas', pct: cartelStats.avgChutes, color: 'bg-sky-400' },
                            { label: 'Clinch / Quedas / Solo', pct: cartelStats.avgClinch, color: 'bg-emerald-400' },
                          ].map((b) => (
                            <div key={b.label}>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-neutral-300 font-semibold">{b.label}</span>
                                <span className="font-mono font-bold">{b.pct}%</span>
                              </div>
                              <div className="h-2.5 bg-carbon border border-gridline overflow-hidden">
                                <div className={`h-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gridline pt-4 mt-6 text-xs text-neutral-400">
                        <strong className="text-white uppercase block mb-1">Recomendacao IA SparRing:</strong>
                        Equilibre sua proxima sessao com um parceiro de base invertida (Canhoto) para ampliar defesa de contragolpe.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: TATAMES E AULOES */}
          {activeTab === 'spaces' && (
            <div className="space-y-7">
              {/* Section 1: My Scheduled Sparrings (WITH Reagendar AND Cancelar) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sparring" /> Meus Sparrings e Tatames Agendados
                  </h2>
                  <span className="font-mono text-xs text-neutral-400">{state.scheduledMatches.length} ativo(s)</span>
                </div>

                {state.scheduledMatches.length === 0 ? (
                  <div className="border border-gridline bg-surface p-6 text-center text-xs text-neutral-400">
                    Nenhum sparring agendado no momento. Escolha um parceiro no Matchmaking ou reserve um horario ocioso abaixo.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.scheduledMatches.map((m) => (
                      <div key={m.id} className="border border-gridline border-l-[3px] border-l-sparring bg-surface p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-extrabold">{m.partnerName}</div>
                            <div className="text-xs text-sparring font-bold uppercase mt-0.5">
                              {m.modality} | {m.gym}
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 border border-emerald-500/60 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" /> {m.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-carbon border border-gridline p-2.5">
                          <div>
                            <div className="text-[9px] text-neutral-500 uppercase">Horario</div>
                            <div className="font-bold">{m.slot}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-neutral-500 uppercase">Volume</div>
                            <div className="font-bold">{m.rounds} rds ({m.intensity}%)</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-neutral-500 uppercase">Tatame</div>
                            <div className="font-bold">R$ {m.totalPrice}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => openRescheduleModal(m)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 border border-neutral-600 hover:border-sparring hover:text-sparring py-2 text-xs font-bold uppercase tracking-wider transition"
                          >
                            <CalendarClock className="w-3.5 h-3.5" /> Reagendar
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelMatch(m.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 border border-crimson/70 text-crimson hover:bg-crimson/10 py-2 text-xs font-bold uppercase tracking-wider transition"
                          >
                            <X className="w-3.5 h-3.5" /> Cancelar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Section 2: Auloes e Intercambio (GREEN confirmation, Cancelar Vaga ONLY - NO Reagendar!) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-sparring" /> Auloes e Treinos Abertos de Intercambio
                  </h2>
                  <span className="text-[11px] text-neutral-400">Organizados pelas academias parceiras</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.academyEvents.map((ev) => {
                    const isEnrolled = ev.enrolledByUser;
                    const isFull = ev.enrolled >= ev.spots && !isEnrolled;
                    return (
                      <div
                        key={ev.id}
                        className={`border p-5 flex flex-col justify-between transition ${
                          isEnrolled
                            ? 'border-emerald-500 bg-emerald-500/[0.06]'
                            : 'border-gridline bg-surface'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              {isEnrolled && (
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-extrabold">{ev.title}</div>
                                <div className="text-xs text-neutral-400 mt-0.5">
                                  {ev.gym} | {ev.modality} | {ev.date}
                                </div>
                              </div>
                            </div>

                            {isEnrolled ? (
                              <span className="border border-emerald-500 bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[10px] font-extrabold uppercase whitespace-nowrap">
                                VAGA GARANTIDA
                              </span>
                            ) : (
                              <span className="border border-sparring/60 bg-sparring/10 text-sparring px-2 py-0.5 text-[10px] font-bold uppercase whitespace-nowrap">
                                {ev.enrolled}/{ev.spots} vagas
                              </span>
                            )}
                          </div>

                          {isEnrolled && (
                            <div className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado na lista oficial da academia ({ev.enrolled}/{ev.spots} atletas)
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-gridline/80 mt-2">
                          {isEnrolled ? (
                            <button
                              type="button"
                              onClick={() => onToggleEventEnrollment(ev.id)}
                              className="w-full inline-flex items-center justify-center gap-1.5 border border-crimson/70 text-crimson hover:bg-crimson/10 py-2.5 text-xs font-extrabold uppercase tracking-wider transition"
                            >
                              <X className="w-3.5 h-3.5" /> Cancelar Vaga
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isFull}
                              onClick={() => onToggleEventEnrollment(ev.id)}
                              className="w-full bg-sparring hover:bg-[#ff6a1f] disabled:opacity-40 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition"
                            >
                              {isFull ? 'Aulão Lotado' : 'Garantir Vaga'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 3: Idle Mats Marketplace */}
              <section className="space-y-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sparring" /> Locacao de Tatames Ociosos (Belo Horizonte)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.gyms.map((g) => (
                    <div key={g.id} className="border border-gridline bg-surface p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-extrabold">{g.name}</div>
                          <div className="text-xs text-neutral-400">{g.neighborhood}</div>
                          <div className="text-xs text-sparring font-semibold mt-0.5">{g.spaceType}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-lg font-black text-white">R$ {g.hourlyRate}</div>
                          <div className="text-[10px] text-neutral-500">por hora</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          Clique em um horario ocioso para reservar:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {g.slots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleBookIdleSlot(g, slot)}
                              className="border border-neutral-700 bg-carbon hover:border-sparring hover:text-sparring px-3 py-1.5 text-xs font-mono transition"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 5: AJUDA E GRAUS */}
          {activeTab === 'help' && <HelpGuide />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gridline bg-[#131313]/95 backdrop-blur-md grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase ${
                active ? 'text-sparring' : 'text-neutral-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-full px-1">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* MODAL: AGENDAR SPARRING */}
      {bookingPartner && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border border-sparring bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gridline pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sparring">Agendar Sparring</div>
                <h3 className="text-lg font-black">{bookingPartner.name} ({bookingPartner.modality})</h3>
              </div>
              <button type="button" onClick={() => setBookingPartner(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Academia / Tatame Parceiro
                </label>
                <select
                  value={bookGymId}
                  onChange={(e) => {
                    const next = state.gyms.find((g) => g.id === e.target.value);
                    setBookGymId(e.target.value);
                    if (next?.slots[0]) setBookSlot(next.slots[0]);
                  }}
                  className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                >
                  {state.gyms.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.neighborhood}) - R$ {g.hourlyRate}/h
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Horario Disponivel
                </label>
                <select
                  value={bookSlot}
                  onChange={(e) => setBookSlot(e.target.value)}
                  className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                >
                  {(selectedBookGym?.slots || [bookingPartner.availability]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Quantidade de Rounds
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={12}
                    value={bookRounds}
                    onChange={(e) => setBookRounds(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Intensidade Combinada (%)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={90}
                    step={5}
                    value={bookIntensity}
                    onChange={(e) => setBookIntensity(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm font-mono outline-none"
                  />
                </div>
              </div>

              {selectedBookGym && (
                <div className="border border-gridline bg-carbon p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Locacao do Tatame (dividido pelos 2 atletas)</span>
                    <span className="font-mono font-bold">R$ {selectedBookGym.hourlyRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Split SparRing ({selectedBookGym.takeRatePercent}%)</span>
                    <span className="font-mono">
                      R$ {((selectedBookGym.hourlyRate * selectedBookGym.takeRatePercent) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-sparring hover:bg-[#ff6a1f] py-3 text-xs font-extrabold uppercase tracking-wider text-white transition"
              >
                Confirmar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REAGENDAR SPARRING */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md border border-sparring bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gridline pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sparring">Reagendar Sparring</div>
                <h3 className="text-base font-black">{rescheduleTarget.partnerName}</h3>
              </div>
              <button type="button" onClick={() => setRescheduleTarget(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Nova Academia / Tatame
                </label>
                <select
                  value={reschedGym}
                  onChange={(e) => {
                    setReschedGym(e.target.value);
                    const gObj = state.gyms.find((g) => g.name === e.target.value);
                    if (gObj?.slots[0]) setReschedSlot(gObj.slots[0]);
                  }}
                  className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                >
                  {state.gyms.map((g) => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Novo Horario
                </label>
                <select
                  value={reschedSlot}
                  onChange={(e) => setReschedSlot(e.target.value)}
                  className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                >
                  {(state.gyms.find((g) => g.name === reschedGym)?.slots || ['Sabado 11:00', 'Domingo 10:00']).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-sparring hover:bg-[#ff6a1f] py-3 text-xs font-extrabold uppercase tracking-wider text-white transition"
              >
                Salvar Novo Horario
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR SPARRING */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg border border-sparring bg-surface p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-gridline pb-3">
              <h3 className="text-base font-black uppercase tracking-tight">Registrar Sparring no Cartel</h3>
              <button type="button" onClick={() => setShowLogModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLogSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Modalidade</label>
                  <select
                    value={logModality}
                    onChange={(e) => setLogModality(e.target.value)}
                    className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                  >
                    {MODALITIES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Parceiro</label>
                  <input
                    type="text"
                    value={logPartner}
                    onChange={(e) => setLogPartner(e.target.value)}
                    required
                    className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Peso Parc. (kg)</label>
                  <input
                    type="number"
                    value={logWeight}
                    onChange={(e) => setLogWeight(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Base Parc.</label>
                  <select
                    value={logStance}
                    onChange={(e) => setLogStance(e.target.value as 'Destro' | 'Canhoto')}
                    className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                  >
                    <option value="Destro">Destro</option>
                    <option value="Canhoto">Canhoto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Local</label>
                  <input
                    type="text"
                    value={logGym}
                    onChange={(e) => setLogGym(e.target.value)}
                    className="w-full bg-carbon border border-neutral-700 px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Rounds</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={logRounds}
                    onChange={(e) => setLogRounds(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-2.5 py-2 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Min/Rd</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={logMinutes}
                    onChange={(e) => setLogMinutes(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-2.5 py-2 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Ritmo %</label>
                  <input
                    type="number"
                    min={20}
                    max={100}
                    step={5}
                    value={logIntensity}
                    onChange={(e) => setLogIntensity(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-2.5 py-2 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Fadiga (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={logFatigue}
                    onChange={(e) => setLogFatigue(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-2.5 py-2 text-sm font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Boxe %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={logBoxe}
                    onChange={(e) => setLogBoxe(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-2.5 py-1.5 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Chutes %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={logChutes}
                    onChange={(e) => setLogChutes(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-2.5 py-1.5 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Clinch/Solo %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={logClinch}
                    onChange={(e) => setLogClinch(Number(e.target.value))}
                    className="w-full bg-carbon border border-neutral-700 px-2.5 py-1.5 text-sm font-mono outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-sparring hover:bg-[#ff6a1f] py-3 text-xs font-extrabold uppercase tracking-wider text-white transition"
              >
                Salvar no Cartel Digital
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW STORY CARD */}
      {storyPreviewUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md border border-sparring bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold uppercase tracking-wider text-sparring">
                Card SparRing (1080x1350 PNG)
              </div>
              <button type="button" onClick={() => setStoryPreviewUrl(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={storyPreviewUrl} alt="Cartel SparRing" className="w-full border border-gridline" />
            <a
              href={storyPreviewUrl}
              download="sparring-cartel.png"
              className="w-full inline-flex items-center justify-center gap-2 bg-sparring hover:bg-[#ff6a1f] py-3 text-xs font-extrabold uppercase tracking-wider text-white transition"
            >
              <Download className="w-4 h-4" /> Baixar PNG para Instagram
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
