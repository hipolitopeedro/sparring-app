import 'package:flutter/material.dart';

const List<String> kSparRingModalities = [
  'Muay Thai',
  'MMA',
  'Boxe',
  'Jiu-Jitsu',
  'Kickboxing',
  'Sambo',
  'Capoeira',
  'Judo',
  'Wrestling',
  'Karate',
  'Taekwondo',
];

class UserProfile {
  String name;
  String modality;
  String rank;
  int rankLevel;
  int weight;
  int height;
  String category; // Amador ou Profissional
  String stance; // Destro ou Canhoto
  String city;
  String gym;
  int streakDays;

  UserProfile({
    required this.name,
    required this.modality,
    required this.rank,
    required this.rankLevel,
    required this.weight,
    required this.height,
    required this.category,
    required this.stance,
    required this.city,
    required this.gym,
    required this.streakDays,
  });

  String get initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts.first.isEmpty) return 'SP';
    if (parts.length == 1) {
      return parts.first.substring(0, parts.first.length >= 2 ? 2 : 1).toUpperCase();
    }
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }
}

class AcademyAccount {
  String gymName;
  String coachName;
  String neighborhood;
  String spaceType;

  AcademyAccount({
    required this.gymName,
    required this.coachName,
    required this.neighborhood,
    required this.spaceType,
  });
}

class FighterPartner {
  final String id;
  final String name;
  final String modality;
  final int weight;
  final int height;
  final int age;
  final String stance;
  final String rank;
  final int rankLevel;
  final int preferredIntensity;
  final String gym;
  final String neighborhood;
  final double distanceKm;
  final String availability;
  bool verified;
  final int roundsLogged;
  final String bio;

  FighterPartner({
    required this.id,
    required this.name,
    required this.modality,
    required this.weight,
    required this.height,
    required this.age,
    required this.stance,
    required this.rank,
    required this.rankLevel,
    required this.preferredIntensity,
    required this.gym,
    required this.neighborhood,
    required this.distanceKm,
    required this.availability,
    required this.verified,
    required this.roundsLogged,
    required this.bio,
  });

  String get initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length == 1) return parts.first.substring(0, 2).toUpperCase();
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }
}

class SparringSession {
  final String id;
  final String date;
  final String modality;
  final String partnerName;
  final int partnerWeight;
  final int partnerHeight;
  final int partnerAge;
  final String partnerRank;
  final int partnerRankLevel;
  final String partnerStance;
  final String gym;
  final int rounds;
  final int roundMinutes;
  final int intensity;
  final int fatigue;
  final int focusBoxe;
  final int focusChutes;
  final int focusClinch;

  SparringSession({
    required this.id,
    required this.date,
    required this.modality,
    required this.partnerName,
    required this.partnerWeight,
    required this.partnerHeight,
    required this.partnerAge,
    required this.partnerRank,
    required this.partnerRankLevel,
    required this.partnerStance,
    required this.gym,
    required this.rounds,
    required this.roundMinutes,
    required this.intensity,
    required this.fatigue,
    required this.focusBoxe,
    required this.focusChutes,
    required this.focusClinch,
  });
}

class GymPartner {
  final String id;
  String name;
  String neighborhood;
  String spaceType;
  int hourlyRate;
  final int takeRatePercent;
  final List<String> slots;

  GymPartner({
    required this.id,
    required this.name,
    required this.neighborhood,
    required this.spaceType,
    required this.hourlyRate,
    required this.takeRatePercent,
    required this.slots,
  });
}

class ScheduledMatch {
  final String id;
  final String partnerName;
  final String modality;
  final String gym;
  String slot;
  final int rounds;
  final int intensity;
  final double totalPrice;
  final double platformFee;
  String status;

  ScheduledMatch({
    required this.id,
    required this.partnerName,
    required this.modality,
    required this.gym,
    required this.slot,
    required this.rounds,
    required this.intensity,
    required this.totalPrice,
    required this.platformFee,
    required this.status,
  });
}

class AcademyEvent {
  final String id;
  final String title;
  final String gym;
  final String modality;
  final String date;
  final int spots;
  int enrolled;
  bool enrolledByUser;

  AcademyEvent({
    required this.id,
    required this.title,
    required this.gym,
    required this.modality,
    required this.date,
    required this.spots,
    required this.enrolled,
    this.enrolledByUser = false,
  });
}

class ValidationRequest {
  final String id;
  final String studentName;
  final int declaredWeight;
  final String declaredRank;
  final String modality;
  final String requestedAt;
  String status;

  ValidationRequest({
    required this.id,
    required this.studentName,
    required this.declaredWeight,
    required this.declaredRank,
    required this.modality,
    required this.requestedAt,
    required this.status,
  });
}

class GymStudent {
  final String name;
  final String modality;
  final int roundsMonth;
  final int streak;
  final int lastSeenDays;
  final String status;

  GymStudent({
    required this.name,
    required this.modality,
    required this.roundsMonth,
    required this.streak,
    required this.lastSeenDays,
    required this.status,
  });
}

class GraduationRank {
  final String name;
  final Color color;
  final Color? tip;
  final String levelLabel;
  final int levelNum;
  final String note;

  const GraduationRank({
    required this.name,
    required this.color,
    this.tip,
    required this.levelLabel,
    required this.levelNum,
    required this.note,
  });
}

class ModalityGuide {
  final String federation;
  final String overview;
  final List<GraduationRank> ranks;

  const ModalityGuide({
    required this.federation,
    required this.overview,
    required this.ranks,
  });
}

final Map<String, ModalityGuide> kGraduationGuides = {
  'Muay Thai': const ModalityGuide(
    federation: 'Padrao CBMT (Confederacao Brasileira de Muay Thai) - Prajioud / Kruang',
    overview:
        'Para evitar diferencas entre federacoes (CBMT, CBMTT, WMF e IFMA), o SparRing adota oficialmente a escala brasileira CBMT de 9 graus de Kruang e mapeia todos os atletas para os 4 niveis de seguranca (N1 a N4).',
    ranks: [
      GraduationRank(name: 'Grau Branco', color: Color(0xFFF5F5F5), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Fundamentos de guarda, base, jab, direto e sparring educativo 30%.'),
      GraduationRank(name: 'Grau Branco Ponta Vermelha', color: Color(0xFFF5F5F5), tip: Color(0xFFDC2626), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Primeiras combinacoes de boxe e defesa de chutes baixos.'),
      GraduationRank(name: 'Grau Vermelho', color: Color(0xFFDC2626), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Introducao ao sparring leve controlado e movimentacao.'),
      GraduationRank(name: 'Grau Vermelho Ponta Azul Claro', color: Color(0xFFDC2626), tip: Color(0xFF38BDF8), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Controle de distancia, bloqueio de canela e entradas de clinch.'),
      GraduationRank(name: 'Grau Azul Claro', color: Color(0xFF38BDF8), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Sparring moderado (40% a 60%) com leitura de contragolpe.'),
      GraduationRank(name: 'Grau Azul Claro Ponta Azul Escuro', color: Color(0xFF38BDF8), tip: Color(0xFF1E3A8A), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Dominio de joelhadas no clinch e transicoes de ritmo.'),
      GraduationRank(name: 'Grau Azul Escuro', color: Color(0xFF1E3A8A), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Nivel competitivo amador e rounds completos de 3 minutos.'),
      GraduationRank(name: 'Grau Azul Escuro Ponta Preta', color: Color(0xFF1E3A8A), tip: Color(0xFF0A0A0A), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Pronto para simulacao de combate intenso (75% a 85%).'),
      GraduationRank(name: 'Grau Preto (Kru / Instrutor)', color: Color(0xFF0A0A0A), tip: Color(0xFFFF5500), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Alto rendimento, atleta profissional ou professor validador B2B.'),
    ],
  ),
  'Jiu-Jitsu': const ModalityGuide(
    federation: 'Padrao IBJJF / CBJJ (Sistema Oficial de Faixas Adulto)',
    overview:
        'No Jiu-Jitsu adulto (16+), a progressao segue 5 faixas principais divididas em ate 4 graus. O pareamento cruza peso corporal e faixa para seguranca articular.',
    ranks: [
      GraduationRank(name: 'Faixa Branca (0 a 4 graus)', color: Color(0xFFF5F5F5), tip: Color(0xFF111111), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Sobrevivencia, postura na guarda e escapes basicos.'),
      GraduationRank(name: 'Faixa Azul (0 a 4 graus)', color: Color(0xFF2563EB), tip: Color(0xFF111111), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Construcao de jogo proprio, passagens e raspagens.'),
      GraduationRank(name: 'Faixa Roxa (0 a 4 graus)', color: Color(0xFF7C3AED), tip: Color(0xFF111111), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Encadeamento de ataques e pressao posicional.'),
      GraduationRank(name: 'Faixa Marrom (0 a 4 graus)', color: Color(0xFF78350F), tip: Color(0xFF111111), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Refinamento tecnico e ritmo de competicao.'),
      GraduationRank(name: 'Faixa Preta (1 ao 6 grau+)', color: Color(0xFF0A0A0A), tip: Color(0xFFDC2626), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Dominio completo e habilitacao para validar alunos no painel B2B.'),
    ],
  ),
  'MMA': const ModalityGuide(
    federation: 'Padrao SparRing / CABMMA (Nivel Competitivo)',
    overview:
        'Como o MMA integra luta em pe, quedas e chao sem faixas unicas, a classificacao considera experiencia real de sparring integrado e cartel amador ou profissional.',
    ranks: [
      GraduationRank(name: 'Iniciante / Recreativo (ate 1 ano)', color: Color(0xFF525252), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Adaptacao de luvas 7oz e transicoes sem impacto forte.'),
      GraduationRank(name: 'Intermediario (1 a 3 anos)', color: Color(0xFF2563EB), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Defesa de quedas (sprawl) e sparring controlado 50%.'),
      GraduationRank(name: 'Competidor Amador', color: Color(0xFFFF5500), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Simulacao completa de rounds de 3 ou 5 minutos com grade e chao.'),
      GraduationRank(name: 'Atleta Profissional / Head Coach', color: Color(0xFF0A0A0A), tip: Color(0xFFFF5500), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Lutadores com cartel profissional ou treinadores principais.'),
    ],
  ),
  'Sambo': const ModalityGuide(
    federation: 'Padrao FIAS (Sambo Esportivo e Combat Sambo)',
    overview:
        'O Sambo nao utiliza faixas coloridas (vermelho e azul na kurtka indicam apenas o corner). O nivelamento diferencia Sambo Esportivo e Combat Sambo por experiencia tecnica.',
    ranks: [
      GraduationRank(name: 'Nivel Base (Fundamentos)', color: Color(0xFFEF4444), tip: Color(0xFF2563EB), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Amortecimento de quedas (ukemi) e pegadas na kurtka.'),
      GraduationRank(name: 'Praticante Intermediario', color: Color(0xFF2563EB), tip: Color(0xFFEF4444), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Projecoes combinadas e introducao segura a chaves de perna.'),
      GraduationRank(name: 'Competidor Esportivo / Combat', color: Color(0xFFFF5500), tip: Color(0xFF111111), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Transicao de striking para queda em ritmo competitivo.'),
      GraduationRank(name: 'Mestre de Esporte / Instrutor', color: Color(0xFF0A0A0A), tip: Color(0xFFEAB308), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Alto rendimento ou tecnico credenciado.'),
    ],
  ),
  'Capoeira': const ModalityGuide(
    federation: 'Equivalencia de Cordas / Cordeis (Abada, CDO, CBCA)',
    overview:
        'Como cada grupo possui sequencia propria de cores de corda, o SparRing padroniza o nivel tecnico pelo estagio de formacao e estilo de jogo (Angola, Regional ou Contemporanea).',
    ranks: [
      GraduationRank(name: 'Iniciante / Batizado', color: Color(0xFFE5E5E5), tip: Color(0xFF22C55E), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Ginga, esquivas basicas e jogo educativo.'),
      GraduationRank(name: 'Aluno Intermediario', color: Color(0xFFEAB308), tip: Color(0xFF2563EB), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Sequencias, floreios e leitura de ritmo no berimbau.'),
      GraduationRank(name: 'Aluno Graduado / Monitor', color: Color(0xFF2563EB), tip: Color(0xFF78350F), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Jogo rapido de Benguela e Sao Bento Grande com controle de rasteiras.'),
      GraduationRank(name: 'Instrutor / Professor / Mestre', color: Color(0xFF78350F), tip: Color(0xFF0A0A0A), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Lideranca de roda e validacao de alunos.'),
    ],
  ),
  'Boxe': const ModalityGuide(
    federation: 'Padrao CBBoxe / Olimpica e Profissional',
    overview:
        'O Boxe nao utiliza faixas. A classificacao considera experiencia de ringue, categoria de peso e controle de intensidade.',
    ranks: [
      GraduationRank(name: 'Fundamentos (Escola de Boxe)', color: Color(0xFF737373), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Base, deslocamento, jab, direto e sparring condicional leve.'),
      GraduationRank(name: 'Intermediario', color: Color(0xFF38BDF8), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Pendulo, esquiva e combinacoes em rounds de 3 min.'),
      GraduationRank(name: 'Competidor Amador / Olimpico', color: Color(0xFFFF5500), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Alto volume de golpes e sparring competitivo 75% a 85%.'),
      GraduationRank(name: 'Profissional / Treinador', color: Color(0xFF0A0A0A), tip: Color(0xFFFF5500), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Experiencia profissional de ringue ou tecnico de equipe.'),
    ],
  ),
  'Kickboxing': const ModalityGuide(
    federation: 'Padrao CBKB / WAKO (Low Kicks e K1 Rules)',
    overview:
        'Sequencia de faixas coloridas da Confederacao Brasileira de Kickboxing, definindo sempre a regra combinada (Light Contact, Low Kicks ou K1).',
    ranks: [
      GraduationRank(name: 'Faixa Branca e Amarela', color: Color(0xFFFACC15), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Postura e combinacoes basicas de maos e chutes.'),
      GraduationRank(name: 'Faixa Laranja e Verde', color: Color(0xFF22C55E), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Bloqueios de canela e sparring controlado.'),
      GraduationRank(name: 'Faixa Azul e Marrom', color: Color(0xFF78350F), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Ritmo K1 com joelhadas e alta intensidade.'),
      GraduationRank(name: 'Faixa Preta (1 Dan+)', color: Color(0xFF0A0A0A), tip: Color(0xFFFF5500), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Atleta de ponta ou professor credenciado.'),
    ],
  ),
  'Judo e Wrestling': const ModalityGuide(
    federation: 'Padrao CBJ / Kodokan (Judo) e UWW (Wrestling)',
    overview:
        'No Judo adotamos Kyu (Branca a Marrom) e Dan (Preta). No Wrestling (Estilo Livre e Greco-Romana), o pareamento ocorre por peso e experiencia competitiva.',
    ranks: [
      GraduationRank(name: 'Judo Branca/Cinza/Azul | Wrestling Base', color: Color(0xFFE5E5E5), tip: Color(0xFF38BDF8), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Ukemi, pegadas basicas e entradas educativas de queda.'),
      GraduationRank(name: 'Judo Amarela/Laranja/Verde | Wrestling Interm.', color: Color(0xFF22C55E), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Randori controlado, sprawl e transicoes para solo.'),
      GraduationRank(name: 'Judo Roxa/Marrom | Wrestling Competidor', color: Color(0xFF78350F), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Alta intensidade de quedas e ritmo de torneio.'),
      GraduationRank(name: 'Judo Faixa Preta (Dan) | Wrestling Elite', color: Color(0xFF0A0A0A), tip: Color(0xFFFF5500), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Nivel tecnico maximo e validacao B2B.'),
    ],
  ),
  'Karate e Taekwondo': const ModalityGuide(
    federation: 'Padrao CBK / WKF (Karate) e CBTKD / WT (Taekwondo)',
    overview:
        'Sistemas de faixas coloridas (Kyu no Karate e Gup no Taekwondo) ate Faixa Preta (Dan), permitindo escolher combate por pontos ou full contact.',
    ranks: [
      GraduationRank(name: 'Branca / Amarela (Kyu/Gup Inicial)', color: Color(0xFFFACC15), levelLabel: 'N1 Iniciante', levelNum: 1, note: 'Bases, chutes basicos e combate educativo.'),
      GraduationRank(name: 'Vermelha / Laranja / Verde / Azul', color: Color(0xFF2563EB), levelLabel: 'N2 Intermediario', levelNum: 2, note: 'Velocidade de pernas e controle de distancia.'),
      GraduationRank(name: 'Roxa / Marrom (Pre-Preta)', color: Color(0xFF78350F), levelLabel: 'N3 Avancado', levelNum: 3, note: 'Chutes giratorios e contragolpe explosivo.'),
      GraduationRank(name: 'Faixa Preta (1 Dan ou superior)', color: Color(0xFF0A0A0A), tip: Color(0xFFFF5500), levelLabel: 'N4 Mestre / Pro', levelNum: 4, note: 'Graduacao Dan oficial e qualificacao de instrutor.'),
    ],
  ),
};

List<GraduationRank> ranksForModality(String modality) {
  if (kGraduationGuides.containsKey(modality)) {
    return kGraduationGuides[modality]!.ranks;
  }
  if (modality == 'Judo' || modality == 'Wrestling') {
    return kGraduationGuides['Judo e Wrestling']!.ranks;
  }
  if (modality == 'Karate' || modality == 'Taekwondo') {
    return kGraduationGuides['Karate e Taekwondo']!.ranks;
  }
  return kGraduationGuides['Muay Thai']!.ranks;
}
