import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { INITIAL_STATE } from './data/mockData';
import {
  AcademyAccount,
  AcademyEvent,
  AppState,
  AuthMode,
  PlanType,
  ScheduledMatch,
  SparringSession,
  UserProfile,
  UserRole,
} from './types/sparring';
import { AcademyPortal } from './components/AcademyPortal';
import { AuthScreen } from './components/AuthScreen';
import { FighterPortal } from './components/FighterPortal';
import { Homepage } from './components/Homepage';

const STORAGE_KEY = 'sparring_react_state_v1';

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...INITIAL_STATE,
      ...parsed,
      currentUser: { ...INITIAL_STATE.currentUser, ...(parsed.currentUser || {}) },
      academyAccount: { ...INITIAL_STATE.academyAccount, ...(parsed.academyAccount || {}) },
    };
  } catch {
    return INITIAL_STATE;
  }
}

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadInitialState);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  const handleOpenAuth = (mode: AuthMode, role: UserRole) => {
    setState((prev) => ({ ...prev, screen: 'auth', authMode: mode, userRole: role }));
  };

  const handleCompleteFighter = (profile?: UserProfile) => {
    setState((prev) => ({
      ...prev,
      screen: 'fighter',
      userRole: 'fighter',
      currentUser: profile ? profile : prev.currentUser,
    }));
    showToast(profile ? 'Cadastro de lutador concluido com sucesso!' : 'Bem-vindo de volta ao Portal do Lutador!');
  };

  const handleCompleteAcademy = (academy?: AcademyAccount) => {
    setState((prev) => ({
      ...prev,
      screen: 'academy',
      userRole: 'academy',
      academyAccount: academy ? academy : prev.academyAccount,
    }));
    showToast(academy ? 'Academia cadastrada no Portal B2B!' : 'Acesso liberado ao Portal da Academia!');
  };

  const handleTogglePlan = (plan: PlanType) => {
    setState((prev) => ({ ...prev, plan }));
    showToast(plan === 'premium' ? 'SparRing Premium (PRO) ativado!' : 'Alternado para o plano Free.');
  };

  const handleBookMatch = (match: Omit<ScheduledMatch, 'id' | 'status'>) => {
    const created: ScheduledMatch = {
      ...match,
      id: `m_${Date.now()}`,
      status: 'Confirmado',
    };
    setState((prev) => ({
      ...prev,
      scheduledMatches: [created, ...prev.scheduledMatches],
    }));
    showToast(`Sparring agendado em ${match.gym} (${match.slot}).`);
  };

  const handleCancelMatch = (matchId: string) => {
    setState((prev) => ({
      ...prev,
      scheduledMatches: prev.scheduledMatches.filter((m) => m.id !== matchId),
    }));
    showToast('Agendamento cancelado com sucesso.');
  };

  const handleRescheduleMatch = (matchId: string, gym: string, slot: string) => {
    setState((prev) => ({
      ...prev,
      scheduledMatches: prev.scheduledMatches.map((m) =>
        m.id === matchId ? { ...m, gym, slot, status: 'Reagendado' } : m,
      ),
    }));
    showToast(`Sparring reagendado para ${gym} (${slot}).`);
  };

  const handleToggleEventEnrollment = (eventId: string) => {
    setState((prev) => {
      let message = '';
      const updated = prev.academyEvents.map((ev) => {
        if (ev.id !== eventId) return ev;
        if (ev.enrolledByUser) {
          message = `Vaga cancelada em "${ev.title}".`;
          return { ...ev, enrolledByUser: false, enrolled: Math.max(0, ev.enrolled - 1) };
        }
        if (ev.enrolled >= ev.spots) return ev;
        message = `Vaga garantida em "${ev.title}"!`;
        return { ...ev, enrolledByUser: true, enrolled: ev.enrolled + 1 };
      });
      if (message) showToast(message);
      return { ...prev, academyEvents: updated };
    });
  };

  const handleLogSession = (session: Omit<SparringSession, 'id'>) => {
    const created: SparringSession = { ...session, id: `s_${Date.now()}` };
    setState((prev) => ({
      ...prev,
      currentUser: { ...prev.currentUser, streakDays: prev.currentUser.streakDays + 1 },
      sessions: [created, ...prev.sessions],
    }));
    showToast(`Sparring de ${session.rounds} rounds registrado no Cartel!`);
  };

  const handleValidateStudent = (validationId: string, decision: 'Validado' | 'Ajustar') => {
    setState((prev) => {
      const target = prev.b2bPendingValidations.find((v) => v.id === validationId);
      const nextValidations = prev.b2bPendingValidations.map((v) =>
        v.id === validationId ? { ...v, status: decision } : v,
      );
      const nextFighters =
        decision === 'Validado' && target
          ? prev.fighters.map((f) =>
              f.name.toLowerCase() === target.studentName.toLowerCase() ? { ...f, verified: true } : f,
            )
          : prev.fighters;

      return {
        ...prev,
        b2bPendingValidations: nextValidations,
        fighters: nextFighters,
      };
    });
    showToast(
      decision === 'Validado'
        ? 'Selo Validado pelo Mestre ativado para o atleta!'
        : 'Solicitacao de ajuste enviada ao aluno.',
    );
  };

  const handleNudgeStudent = (studentName: string) => {
    showToast(`Convite de retorno enviado para ${studentName}.`);
  };

  const handleAddGymSlot = (slotLabel: string, hourlyRate: number) => {
    setState((prev) => {
      const targetName = prev.academyAccount.gymName;
      const found = prev.gyms.some((g) => g.name === targetName);
      const nextGyms = found
        ? prev.gyms.map((g) =>
            g.name === targetName
              ? {
                  ...g,
                  hourlyRate,
                  slots: g.slots.includes(slotLabel) ? g.slots : [...g.slots, slotLabel],
                }
              : g,
          )
        : [
            {
              id: `g_${Date.now()}`,
              name: targetName,
              neighborhood: prev.academyAccount.neighborhood,
              spaceType: prev.academyAccount.spaceType,
              hourlyRate,
              takeRatePercent: 12,
              slots: [slotLabel],
            },
            ...prev.gyms,
          ];
      return { ...prev, gyms: nextGyms };
    });
    showToast(`Horario "${slotLabel}" publicado no marketplace.`);
  };

  const handleRemoveGymSlot = (slotLabel: string) => {
    setState((prev) => {
      const targetName = prev.academyAccount.gymName;
      return {
        ...prev,
        gyms: prev.gyms.map((g) =>
          g.name === targetName ? { ...g, slots: g.slots.filter((s) => s !== slotLabel) } : g,
        ),
      };
    });
    showToast(`Horario "${slotLabel}" removido.`);
  };

  const handleCreateEvent = (event: Omit<AcademyEvent, 'id' | 'enrolled' | 'enrolledByUser'>) => {
    const created: AcademyEvent = {
      ...event,
      id: `ev_${Date.now()}`,
      enrolled: 1,
      enrolledByUser: false,
    };
    setState((prev) => ({
      ...prev,
      academyEvents: [created, ...prev.academyEvents],
    }));
    showToast(`Aulao "${event.title}" publicado para lutadores!`);
  };

  const handleDeleteEvent = (eventId: string) => {
    setState((prev) => ({
      ...prev,
      academyEvents: prev.academyEvents.filter((e) => e.id !== eventId),
    }));
    showToast('Evento removido da agenda.');
  };

  return (
    <>
      {state.screen === 'home' && <Homepage onOpenAuth={handleOpenAuth} />}

      {state.screen === 'auth' && (
        <AuthScreen
          initialMode={state.authMode}
          initialRole={state.userRole}
          defaultUser={state.currentUser}
          defaultAcademy={state.academyAccount}
          onBackHome={() => setState((prev) => ({ ...prev, screen: 'home' }))}
          onCompleteFighter={handleCompleteFighter}
          onCompleteAcademy={handleCompleteAcademy}
        />
      )}

      {state.screen === 'fighter' && (
        <FighterPortal
          state={state}
          onGoHome={() => setState((prev) => ({ ...prev, screen: 'home' }))}
          onLogout={() => setState((prev) => ({ ...prev, screen: 'auth', authMode: 'login', userRole: 'fighter' }))}
          onTogglePlan={handleTogglePlan}
          onBookMatch={handleBookMatch}
          onCancelMatch={handleCancelMatch}
          onRescheduleMatch={handleRescheduleMatch}
          onToggleEventEnrollment={handleToggleEventEnrollment}
          onLogSession={handleLogSession}
        />
      )}

      {state.screen === 'academy' && (
        <AcademyPortal
          state={state}
          onGoHome={() => setState((prev) => ({ ...prev, screen: 'home' }))}
          onLogout={() => setState((prev) => ({ ...prev, screen: 'auth', authMode: 'login', userRole: 'academy' }))}
          onValidateStudent={handleValidateStudent}
          onNudgeStudent={handleNudgeStudent}
          onAddGymSlot={handleAddGymSlot}
          onRemoveGymSlot={handleRemoveGymSlot}
          onCreateEvent={handleCreateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}

      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-5 z-50 border border-emerald-500 bg-[#141414] px-4 py-3 shadow-2xl flex items-center gap-2.5 max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-white">{toast}</span>
        </div>
      )}
    </>
  );
};

export default App;
