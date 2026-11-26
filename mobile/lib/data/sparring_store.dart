import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/sparring_models.dart';

class SparRingStore extends ChangeNotifier {
  bool isAuthenticated = false;
  String userRole = 'fighter'; // 'fighter' ou 'academy'
  bool isPremium = false;

  UserProfile currentUser = UserProfile(
    name: 'Pedro Hipolito',
    modality: 'Muay Thai',
    rank: 'Grau Azul Escuro Ponta Preta',
    rankLevel: 3,
    weight: 76,
    height: 178,
    category: 'Amador',
    stance: 'Destro',
    city: 'Savassi, Belo Horizonte',
    gym: 'CT Nova Era BH',
    streakDays: 14,
  );

  AcademyAccount academyAccount = AcademyAccount(
    gymName: 'CT Nova Era BH',
    coachName: 'Mestre Ricardo Alves',
    neighborhood: 'Centro, Belo Horizonte',
    spaceType: 'Tatame Olimpico + Ringue',
  );

  final List<FighterPartner> fighters = [
    FighterPartner(
      id: 'f1',
      name: 'Lucas Andrade',
      modality: 'Muay Thai',
      weight: 75,
      height: 177,
      age: 24,
      stance: 'Canhoto',
      rank: 'Grau Azul Escuro Ponta Preta (CBMT)',
      rankLevel: 3,
      preferredIntensity: 60,
      gym: 'CT Savassi Fight',
      neighborhood: 'Savassi',
      distanceKm: 2.1,
      availability: 'Sabado 09:30',
      verified: true,
      roundsLogged: 148,
      bio: 'Foco em sparring tecnico de boxe e chutes baixos com controle de distancia.',
    ),
    FighterPartner(
      id: 'f2',
      name: 'Caio Ribeiro',
      modality: 'MMA',
      weight: 77,
      height: 179,
      age: 25,
      stance: 'Destro',
      rank: 'Competidor Amador (Meio-Medio)',
      rankLevel: 3,
      preferredIntensity: 75,
      gym: 'CT Buritis Strike',
      neighborhood: 'Buritis',
      distanceKm: 5.8,
      availability: 'Sabado 10:00',
      verified: true,
      roundsLogged: 190,
      bio: 'Sparring de MMA com luva 7oz focado em transicao de boxe para queda na grade.',
    ),
    FighterPartner(
      id: 'f3',
      name: 'Igor Volkov',
      modality: 'Sambo',
      weight: 79,
      height: 181,
      age: 28,
      stance: 'Canhoto',
      rank: 'Competidor Combat Sambo (FIAS)',
      rankLevel: 3,
      preferredIntensity: 65,
      gym: 'CT Savassi Fight',
      neighborhood: 'Savassi',
      distanceKm: 2.4,
      availability: 'Domingo 11:00',
      verified: true,
      roundsLogged: 156,
      bio: 'Treino de Combat Sambo e Sambo Esportivo com quedas de quadril e chaves de perna.',
    ),
    FighterPartner(
      id: 'f4',
      name: 'Luan Santana Lima',
      modality: 'Capoeira',
      weight: 74,
      height: 176,
      age: 26,
      stance: 'Destro',
      rank: 'Aluno Graduado (Regional / Benguela)',
      rankLevel: 3,
      preferredIntensity: 50,
      gym: 'Espaco Ginga BH',
      neighborhood: 'Santa Tereza',
      distanceKm: 3.5,
      availability: 'Sabado 16:00',
      verified: true,
      roundsLogged: 130,
      bio: 'Intercambio de jogo tecnico, esquivas, rasteiras controladas e floreios.',
    ),
    FighterPartner(
      id: 'f5',
      name: 'Bruno Castilho',
      modality: 'Boxe',
      weight: 74,
      height: 175,
      age: 25,
      stance: 'Canhoto',
      rank: 'Competidor Amador',
      rankLevel: 3,
      preferredIntensity: 80,
      gym: 'Nobre Arte BH',
      neighborhood: 'Funcionarios',
      distanceKm: 1.8,
      availability: 'Sexta 19:30',
      verified: true,
      roundsLogged: 210,
      bio: 'Preparacao para campeonato mineiro amador em ritmo alto de simulacao.',
    ),
    FighterPartner(
      id: 'f6',
      name: 'Gabriel Ferreira',
      modality: 'Jiu-Jitsu',
      weight: 77,
      height: 176,
      age: 23,
      stance: 'Destro',
      rank: 'Faixa Roxa (IBJJF)',
      rankLevel: 3,
      preferredIntensity: 65,
      gym: 'Gracie Barra Sion',
      neighborhood: 'Sion',
      distanceKm: 3.0,
      availability: 'Sabado 15:00',
      verified: true,
      roundsLogged: 165,
      bio: 'Open mat de passagem de guarda e drills posicionais sem quimono.',
    ),
    FighterPartner(
      id: 'f7',
      name: 'Kenji Takahashi',
      modality: 'Judo',
      weight: 76,
      height: 175,
      age: 27,
      stance: 'Destro',
      rank: 'Faixa Marrom (1 Kyu - CBJ)',
      rankLevel: 3,
      preferredIntensity: 70,
      gym: 'Minas Judo Club',
      neighborhood: 'Lourdes',
      distanceKm: 2.0,
      availability: 'Quinta 19:30',
      verified: true,
      roundsLogged: 204,
      bio: 'Randori em pe focado em kumi-kata, uchimata e transicao para ne-waza.',
    ),
    FighterPartner(
      id: 'f8',
      name: 'Vitor Resende',
      modality: 'Wrestling',
      weight: 78,
      height: 177,
      age: 24,
      stance: 'Destro',
      rank: 'Competidor Estilo Livre',
      rankLevel: 3,
      preferredIntensity: 80,
      gym: 'BH Top Team',
      neighborhood: 'Prado',
      distanceKm: 4.0,
      availability: 'Sabado 09:00',
      verified: true,
      roundsLogged: 172,
      bio: 'Drills de single leg, sprawl e controle de cintura sem quimono.',
    ),
    FighterPartner(
      id: 'f9',
      name: 'Henrique Duarte',
      modality: 'MMA',
      weight: 99,
      height: 189,
      age: 31,
      stance: 'Destro',
      rank: 'Atleta Profissional',
      rankLevel: 4,
      preferredIntensity: 85,
      gym: 'BH Top Team',
      neighborhood: 'Prado',
      distanceKm: 4.1,
      availability: 'Sabado 10:30',
      verified: true,
      roundsLogged: 312,
      bio: 'Peso pesado buscando parceiros acima de 92kg para simulacao de grade.',
    ),
    FighterPartner(
      id: 'f10',
      name: 'Matheus Vieira',
      modality: 'Muay Thai',
      weight: 73,
      height: 174,
      age: 21,
      stance: 'Destro',
      rank: 'Grau Vermelho (CBMT)',
      rankLevel: 1,
      preferredIntensity: 30,
      gym: 'CT Nova Era BH',
      neighborhood: 'Centro',
      distanceKm: 1.2,
      availability: 'Domingo 09:00',
      verified: false,
      roundsLogged: 28,
      bio: 'Iniciante focado em sparring educativo leve 30% sem contato forte.',
    ),
  ];

  final List<SparringSession> sessions = [
    SparringSession(
      id: 's1',
      date: '2026-11-24',
      modality: 'Muay Thai',
      partnerName: 'Lucas Andrade',
      partnerWeight: 75,
      partnerHeight: 177,
      partnerAge: 24,
      partnerRank: 'Grau Azul Escuro Ponta Preta',
      partnerRankLevel: 3,
      partnerStance: 'Canhoto',
      gym: 'CT Savassi Fight',
      rounds: 8,
      roundMinutes: 3,
      intensity: 75,
      fatigue: 7,
      focusBoxe: 45,
      focusChutes: 35,
      focusClinch: 20,
    ),
    SparringSession(
      id: 's2',
      date: '2026-11-21',
      modality: 'MMA',
      partnerName: 'Caio Ribeiro',
      partnerWeight: 77,
      partnerHeight: 179,
      partnerAge: 25,
      partnerRank: 'Competidor Amador',
      partnerRankLevel: 3,
      partnerStance: 'Destro',
      gym: 'CT Buritis Strike',
      rounds: 5,
      roundMinutes: 5,
      intensity: 80,
      fatigue: 8,
      focusBoxe: 40,
      focusChutes: 25,
      focusClinch: 35,
    ),
    SparringSession(
      id: 's3',
      date: '2026-11-18',
      modality: 'Sambo',
      partnerName: 'Igor Volkov',
      partnerWeight: 82,
      partnerHeight: 181,
      partnerAge: 28,
      partnerRank: 'Competidor Combat Sambo',
      partnerRankLevel: 3,
      partnerStance: 'Canhoto',
      gym: 'CT Savassi Fight',
      rounds: 6,
      roundMinutes: 4,
      intensity: 70,
      fatigue: 8,
      focusBoxe: 30,
      focusChutes: 15,
      focusClinch: 55,
    ),
    SparringSession(
      id: 's4',
      date: '2026-11-14',
      modality: 'Muay Thai',
      partnerName: 'Rafael Mendes',
      partnerWeight: 78,
      partnerHeight: 180,
      partnerAge: 27,
      partnerRank: 'Grau Azul Claro',
      partnerRankLevel: 2,
      partnerStance: 'Destro',
      gym: 'Academia Iron Pampulha',
      rounds: 10,
      roundMinutes: 3,
      intensity: 40,
      fatigue: 4,
      focusBoxe: 35,
      focusChutes: 40,
      focusClinch: 25,
    ),
  ];

  final List<GymPartner> gyms = [
    GymPartner(
      id: 'g1',
      name: 'CT Savassi Fight',
      neighborhood: 'Savassi, Belo Horizonte',
      spaceType: 'Ringue Oficial + 80m2 Tatame',
      hourlyRate: 60,
      takeRatePercent: 12,
      slots: ['Sabado 09:00', 'Sabado 14:00', 'Domingo 10:00'],
    ),
    GymPartner(
      id: 'g2',
      name: 'CT Nova Era BH',
      neighborhood: 'Centro, Belo Horizonte',
      spaceType: 'Tatame Olimpico + Area de Sacos',
      hourlyRate: 50,
      takeRatePercent: 12,
      slots: ['Sexta 15:00', 'Sabado 11:00', 'Domingo 09:00'],
    ),
    GymPartner(
      id: 'g3',
      name: 'CT Buritis Strike',
      neighborhood: 'Buritis, Belo Horizonte',
      spaceType: 'Cage Wall MMA + Tatame Sambo/BJJ',
      hourlyRate: 65,
      takeRatePercent: 12,
      slots: ['Sabado 10:00', 'Sabado 16:00', 'Domingo 14:00'],
    ),
  ];

  final List<ScheduledMatch> scheduledMatches = [
    ScheduledMatch(
      id: 'm1',
      partnerName: 'Lucas Andrade',
      modality: 'Muay Thai',
      gym: 'CT Savassi Fight',
      slot: 'Sabado 09:30',
      rounds: 6,
      intensity: 60,
      totalPrice: 60,
      platformFee: 7.2,
      status: 'Confirmado',
    ),
  ];

  final List<AcademyEvent> academyEvents = [
    AcademyEvent(
      id: 'ev1',
      title: 'Aulao Intercambio Muay Thai e Boxe (30% a 60%)',
      gym: 'CT Nova Era BH',
      modality: 'Muay Thai',
      date: 'Sabado 10:00',
      spots: 24,
      enrolled: 16,
      enrolledByUser: false,
    ),
    AcademyEvent(
      id: 'ev2',
      title: 'Open Mat MMA e Combat Sambo (Grade + Quedas)',
      gym: 'CT Buritis Strike',
      modality: 'MMA',
      date: 'Domingo 09:30',
      spots: 16,
      enrolled: 11,
      enrolledByUser: false,
    ),
  ];

  final List<ValidationRequest> pendingValidations = [
    ValidationRequest(
      id: 'v1',
      studentName: 'Matheus Vieira',
      declaredWeight: 73,
      declaredRank: 'Grau Vermelho (CBMT)',
      modality: 'Muay Thai',
      requestedAt: 'Hoje, 11:20',
      status: 'Pendente',
    ),
    ValidationRequest(
      id: 'v2',
      studentName: 'Joao Paulo Silva',
      declaredWeight: 84,
      declaredRank: 'Faixa Azul (IBJJF)',
      modality: 'Jiu-Jitsu',
      requestedAt: 'Ontem, 19:45',
      status: 'Pendente',
    ),
    ValidationRequest(
      id: 'v3',
      studentName: 'Felipe Rocha',
      declaredWeight: 77,
      declaredRank: 'Competidor Amador (MMA)',
      modality: 'MMA',
      requestedAt: 'Ontem, 16:10',
      status: 'Pendente',
    ),
  ];

  final List<GymStudent> gymStudents = [
    GymStudent(name: 'Pedro Hipolito', modality: 'Muay Thai', roundsMonth: 37, streak: 14, lastSeenDays: 2, status: 'Ativo'),
    GymStudent(name: 'Lucas Andrade', modality: 'Muay Thai', roundsMonth: 42, streak: 19, lastSeenDays: 1, status: 'Ativo'),
    GymStudent(name: 'Caio Ribeiro', modality: 'MMA', roundsMonth: 31, streak: 11, lastSeenDays: 2, status: 'Ativo'),
    GymStudent(name: 'Carlos Eduardo', modality: 'Boxe', roundsMonth: 6, streak: 0, lastSeenDays: 18, status: 'Risco de Evasao'),
    GymStudent(name: 'Vinicius Lopes', modality: 'Capoeira', roundsMonth: 4, streak: 0, lastSeenDays: 23, status: 'Risco de Evasao'),
  ];

  Future<void> initFromDisk() async {
    final prefs = await SharedPreferences.getInstance();
    isPremium = prefs.getBool('sparring_is_premium') ?? false;
    final savedName = prefs.getString('sparring_user_name');
    if (savedName != null && savedName.isNotEmpty) {
      currentUser.name = savedName;
      currentUser.modality = prefs.getString('sparring_user_mod') ?? currentUser.modality;
      currentUser.weight = prefs.getInt('sparring_user_weight') ?? currentUser.weight;
      currentUser.height = prefs.getInt('sparring_user_height') ?? currentUser.height;
      currentUser.category = prefs.getString('sparring_user_cat') ?? currentUser.category;
      currentUser.stance = prefs.getString('sparring_user_stance') ?? currentUser.stance;
      currentUser.city = prefs.getString('sparring_user_city') ?? currentUser.city;
      currentUser.rank = prefs.getString('sparring_user_rank') ?? currentUser.rank;
      currentUser.rankLevel = prefs.getInt('sparring_user_rank_lvl') ?? currentUser.rankLevel;
    }
    notifyListeners();
  }

  Future<void> _persistProfile() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('sparring_is_premium', isPremium);
    await prefs.setString('sparring_user_name', currentUser.name);
    await prefs.setString('sparring_user_mod', currentUser.modality);
    await prefs.setInt('sparring_user_weight', currentUser.weight);
    await prefs.setInt('sparring_user_height', currentUser.height);
    await prefs.setString('sparring_user_cat', currentUser.category);
    await prefs.setString('sparring_user_stance', currentUser.stance);
    await prefs.setString('sparring_user_city', currentUser.city);
    await prefs.setString('sparring_user_rank', currentUser.rank);
    await prefs.setInt('sparring_user_rank_lvl', currentUser.rankLevel);
  }

  int computeCompatibility(FighterPartner f, int targetIntensity) {
    final weightDelta = (f.weight - currentUser.weight).abs();
    final rankDelta = (f.rankLevel - currentUser.rankLevel).abs();
    final intDelta = (f.preferredIntensity - targetIntensity).abs();
    var score = 100.0 - (weightDelta * 2.4) - (rankDelta * 7.0) - (intDelta * 0.45);
    if (f.verified) score += 4;
    return score.round().clamp(25, 99);
  }

  void loginAsFighter({UserProfile? updatedProfile}) {
    if (updatedProfile != null) {
      currentUser = updatedProfile;
    }
    userRole = 'fighter';
    isAuthenticated = true;
    _persistProfile();
    notifyListeners();
  }

  void loginAsAcademy({AcademyAccount? updatedAcademy}) {
    if (updatedAcademy != null) {
      academyAccount = updatedAcademy;
      final managed = getManagedGym();
      managed.name = updatedAcademy.gymName;
      managed.neighborhood = updatedAcademy.neighborhood;
      managed.spaceType = updatedAcademy.spaceType;
    }
    userRole = 'academy';
    isAuthenticated = true;
    notifyListeners();
  }

  void logout() {
    isAuthenticated = false;
    notifyListeners();
  }

  void setPremium(bool value) {
    isPremium = value;
    _persistProfile();
    notifyListeners();
  }

  void addSession(SparringSession s) {
    sessions.insert(0, s);
    currentUser.streakDays += 1;
    notifyListeners();
  }

  void bookMatch(ScheduledMatch match) {
    scheduledMatches.insert(0, match);
    notifyListeners();
  }

  void rescheduleMatch(String matchId, String newSlot) {
    final idx = scheduledMatches.indexWhere((m) => m.id == matchId);
    if (idx != -1) {
      scheduledMatches[idx].slot = newSlot;
      scheduledMatches[idx].status = 'Reagendado';
      notifyListeners();
    }
  }

  void cancelMatch(String matchId) {
    scheduledMatches.removeWhere((m) => m.id == matchId);
    notifyListeners();
  }

  void toggleEventEnrollment(String eventId) {
    final idx = academyEvents.indexWhere((e) => e.id == eventId);
    if (idx == -1) return;
    final ev = academyEvents[idx];
    if (ev.enrolledByUser) {
      ev.enrolledByUser = false;
      ev.enrolled = (ev.enrolled - 1).clamp(0, ev.spots);
    } else if (ev.enrolled < ev.spots) {
      ev.enrolledByUser = true;
      ev.enrolled += 1;
    }
    notifyListeners();
  }

  void resolveValidation(String valId, String decision) {
    final idx = pendingValidations.indexWhere((v) => v.id == valId);
    if (idx == -1) return;
    pendingValidations[idx].status = decision;
    if (decision == 'Validado') {
      final fIdx = fighters.indexWhere((f) => f.name == pendingValidations[idx].studentName);
      if (fIdx != -1) fighters[fIdx].verified = true;
    }
    notifyListeners();
  }

  GymPartner getManagedGym() {
    final idx = gyms.indexWhere((g) => g.name.toLowerCase() == academyAccount.gymName.toLowerCase());
    if (idx != -1) return gyms[idx];
    return gyms[1];
  }

  void addGymSlot(String slot, int price) {
    final g = getManagedGym();
    g.slots.add(slot);
    g.hourlyRate = price;
    notifyListeners();
  }

  void removeGymSlot(int index) {
    final g = getManagedGym();
    if (index >= 0 && index < g.slots.length) {
      g.slots.removeAt(index);
      notifyListeners();
    }
  }

  void createAcademyEvent({
    required String title,
    required String modality,
    required String date,
    required int spots,
  }) {
    academyEvents.insert(
      0,
      AcademyEvent(
        id: 'ev_${DateTime.now().millisecondsSinceEpoch}',
        title: title,
        gym: academyAccount.gymName,
        modality: modality,
        date: date,
        spots: spots,
        enrolled: 1,
      ),
    );
    notifyListeners();
  }
}
