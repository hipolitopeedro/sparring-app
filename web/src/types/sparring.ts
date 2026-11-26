export type UserRole = 'fighter' | 'academy';
export type PlanType = 'free' | 'premium';
export type AuthMode = 'login' | 'register';

export interface UserProfile {
  name: string;
  modality: string;
  rank: string;
  rankLevel: number;
  weight: number;
  height: number;
  age: number;
  category: 'Amador' | 'Profissional';
  stance: 'Destro' | 'Canhoto';
  city: string;
  gym: string;
  streakDays: number;
}

export interface AcademyAccount {
  gymName: string;
  coachName: string;
  neighborhood: string;
  spaceType: string;
}

export interface FighterPartner {
  id: string;
  name: string;
  modality: string;
  weight: number;
  height: number;
  age: number;
  stance: 'Destro' | 'Canhoto';
  rank: string;
  rankLevel: number;
  preferredIntensity: number;
  gym: string;
  neighborhood: string;
  distanceKm: number;
  availability: string;
  verified: boolean;
  roundsLogged: number;
  bio: string;
}

export interface SparringSession {
  id: string;
  date: string;
  modality: string;
  partnerName: string;
  partnerWeight: number;
  partnerHeight: number;
  partnerAge: number;
  partnerRank: string;
  partnerRankLevel: number;
  partnerStance: 'Destro' | 'Canhoto';
  gym: string;
  rounds: number;
  roundMinutes: number;
  intensity: number;
  fatigue: number;
  focus: {
    boxe: number;
    chutes: number;
    clinch: number;
  };
}

export interface GymPartner {
  id: string;
  name: string;
  neighborhood: string;
  spaceType: string;
  hourlyRate: number;
  takeRatePercent: number;
  slots: string[];
}

export interface ScheduledMatch {
  id: string;
  partnerName: string;
  modality: string;
  gym: string;
  slot: string;
  rounds: number;
  intensity: number;
  totalPrice: number;
  platformFee: number;
  status: string;
}

export interface AcademyEvent {
  id: string;
  title: string;
  gym: string;
  modality: string;
  date: string;
  spots: number;
  enrolled: number;
  enrolledByUser: boolean;
}

export interface ValidationRequest {
  id: string;
  studentName: string;
  declaredWeight: number;
  declaredRank: string;
  modality: string;
  requestedAt: string;
  status: 'Pendente' | 'Validado' | 'Ajustar';
}

export interface GymStudent {
  name: string;
  modality: string;
  roundsMonth: number;
  streak: number;
  lastSeenDays: number;
  status: 'Ativo' | 'Risco de Evasao';
}

export interface GraduationRank {
  name: string;
  color: string;
  tip?: string;
  levelLabel: string;
  levelNum: number;
  note: string;
}

export interface ModalityGuide {
  federation: string;
  overview: string;
  ranks: GraduationRank[];
}

export interface AppState {
  screen: 'home' | 'auth' | 'fighter' | 'academy';
  authMode: AuthMode;
  userRole: UserRole;
  plan: PlanType;
  currentUser: UserProfile;
  academyAccount: AcademyAccount;
  fighters: FighterPartner[];
  sessions: SparringSession[];
  gyms: GymPartner[];
  scheduledMatches: ScheduledMatch[];
  academyEvents: AcademyEvent[];
  b2bPendingValidations: ValidationRequest[];
  b2bStudents: GymStudent[];
}
