// SparRing - Dados iniciais de Belo Horizonte, novas modalidades e guia de graduacoes

window.SPARRING_MODALITIES = [
  "Muay Thai",
  "MMA",
  "Boxe",
  "Jiu-Jitsu",
  "Kickboxing",
  "Sambo",
  "Capoeira",
  "Judo",
  "Wrestling",
  "Karate",
  "Taekwondo"
];

window.SPARRING_GRADUATION_GUIDE = {
  "Muay Thai": {
    federation: "Padrao CBMT (Confederacao Brasileira de Muay Thai) - Sistema Prajioud / Kruang",
    overview: "No Brasil existem variacoes entre federacoes (CBMT, CBMTT, WMF e IFMA). Para padronizar o matchmaking sem confusao entre escolas, o SparRing adota oficialmente a escala CBMT de 9 graus de Kruang (bracadeira) e mapeia automaticamente qualquer escola equivalente para os 4 niveis de seguranca (N1 a N4).",
    ranks: [
      { name: "Grau Branco", color: "#f5f5f5", tip: null, level: "N1 Iniciante", note: "Fundamentos de guarda, base, jab, direto e chutes basicos. Recomendado sparring educativo 30%." },
      { name: "Grau Branco Ponta Vermelha", color: "#f5f5f5", tip: "#dc2626", level: "N1 Iniciante", note: "Primeiras combinacoes de boxe e defesa de chutes baixos." },
      { name: "Grau Vermelho", color: "#dc2626", tip: null, level: "N1 Iniciante", note: "Introducao ao sparring leve controlado e movimentacao." },
      { name: "Grau Vermelho Ponta Azul Claro", color: "#dc2626", tip: "#38bdf8", level: "N2 Intermediario", note: "Controle de distancia, bloqueio de canela e entradas de clinch." },
      { name: "Grau Azul Claro", color: "#38bdf8", tip: null, level: "N2 Intermediario", note: "Sparring moderado (40% a 60%) com leitura de contragolpe." },
      { name: "Grau Azul Claro Ponta Azul Escuro", color: "#38bdf8", tip: "#1e3a8a", level: "N2 Intermediario", note: "Dominio de joelhadas no clinch e transicoes de ritmo." },
      { name: "Grau Azul Escuro", color: "#1e3a8a", tip: null, level: "N3 Avancado", note: "Nivel competitivo amador, ritmo de rounds completos de 3 minutos." },
      { name: "Grau Azul Escuro Ponta Preta", color: "#1e3a8a", tip: "#0a0a0a", level: "N3 Avancado", note: "Pronto para simulacao de combate intenso (75% a 85%) e instrucao auxiliar." },
      { name: "Grau Preto (Kru / Instrutor)", color: "#0a0a0a", tip: "#ff5500", level: "N4 Mestre / Pro", note: "Alto rendimento, atleta profissional ou professor responsavel por validacoes B2B." }
    ]
  },
  "Jiu-Jitsu": {
    federation: "Padrao IBJJF / CBJJ (Sistema Oficial de Faixas Adulto)",
    overview: "No Jiu-Jitsu Brasileiro adulto (a partir de 16 anos), a progressao segue 5 faixas principais, cada uma dividida em ate 4 graus (listras brancas na ponteira preta). O pareamento no SparRing cruza peso corporal e faixa para evitar lesoes articulares.",
    ranks: [
      { name: "Faixa Branca (0 a 4 graus)", color: "#f5f5f5", tip: "#111111", level: "N1 Iniciante", note: "Sobrevivencia, postura na guarda, escapes basicos e controle de pegada." },
      { name: "Faixa Azul (0 a 4 graus)", color: "#2563eb", tip: "#111111", level: "N2 Intermediario", note: "Construcao de jogo proprio, transicoes entre passagens e raspagens." },
      { name: "Faixa Roxa (0 a 4 graus)", color: "#7c3aed", tip: "#111111", level: "N3 Avancado", note: "Encadeamento de ataques, pressao posicional e leitura avancada." },
      { name: "Faixa Marrom (0 a 4 graus)", color: "#78350f", tip: "#111111", level: "N3 Avancado", note: "Refinamento tecnico, chaves de pe/joelho e ritmo de competicao." },
      { name: "Faixa Preta (1 ao 6 grau+)", color: "#0a0a0a", tip: "#dc2626", level: "N4 Mestre / Pro", note: "Dominio completo da arte suave e habilitacao para validar alunos no painel B2B." }
    ]
  },
  "MMA": {
    federation: "Padrao SparRing / CABMMA (Classificacao por Nivel Competitivo e Tempo de Tatame)",
    overview: "Como o MMA integra luta em pe, quedas e chao sem um sistema unico de faixas coloridas, o SparRing classifica os atletas por experiencia real de sparring integrado, numero de lutas e validacao do treinador.",
    ranks: [
      { name: "Iniciante / Recreativo (ate 1 ano)", color: "#525252", tip: null, level: "N1 Iniciante", note: "Adaptacao de luvas 7oz, transicao basica entre troca e grade sem impacto forte." },
      { name: "Intermediario (1 a 3 anos)", color: "#2563eb", tip: null, level: "N2 Intermediario", note: "Defesa de quedas (sprawl), ground and pound controlado e sparring 50%." },
      { name: "Competidor Amador (Cartel Amador)", color: "#ff5500", tip: null, level: "N3 Avancado", note: "Simulacao completa de rounds de 3 ou 5 minutos com trabalho de grade e chao." },
      { name: "Atleta Profissional / Head Coach", color: "#0a0a0a", tip: "#ff5500", level: "N4 Mestre / Pro", note: "Lutadores com cartel profissional ou treinadores principais de equipe." }
    ]
  },
  "Sambo": {
    federation: "Padrao FIAS (Federacao Internacional de Sambo) - Esportivo e Combat Sambo",
    overview: "O Sambo russo nao utiliza faixas coloridas para indicar graduacao (as cores vermelho e azul da kurtka identificam apenas o corner do atleta). No SparRing, distinguimos Sambo Esportivo (grappling e chaves de perna) de Combat Sambo (com golpes), nivelando por experiencia tecnica e categoria competitiva.",
    ranks: [
      { name: "Nivel Base (Fundamentos de Queda)", color: "#ef4444", tip: "#2563eb", level: "N1 Iniciante", note: "Ukemi (amortecimento de quedas), pegadas na kurtka e imobilizacoes basicas." },
      { name: "Praticante Intermediario", color: "#2563eb", tip: "#ef4444", level: "N2 Intermediario", note: "Projecoes combinadas, armlocks e introducao segura a chaves de tornozelo." },
      { name: "Competidor (Esportivo ou Combat Sambo)", color: "#ff5500", tip: "#111111", level: "N3 Avancado", note: "Ritmo de competicao, transicao de striking para queda (Combat Sambo)." },
      { name: "Mestre de Esporte / Instrutor", color: "#0a0a0a", tip: "#eab308", level: "N4 Mestre / Pro", note: "Alto rendimento internacional ou tecnico credenciado." }
    ]
  },
  "Capoeira": {
    federation: "Sistema de Cordas / Cordeis (Equivalencia entre Grupos: Abada, CDO, CBCA)",
    overview: "Cada grupo de Capoeira possui uma sequencia propria de cores de corda. Para permitir rodas e treinos de intercambio seguros entre escolas diferentes, o SparRing padroniza o nivel tecnico pelo estagio de formacao do capoeirista e pelo estilo do jogo (Angola, Regional ou Contemporanea).",
    ranks: [
      { name: "Iniciante / Batizado (Primeiras Cordas)", color: "#e5e5e5", tip: "#22c55e", level: "N1 Iniciante", note: "Ginga, esquivas basicas, au e jogo educativo sem contato." },
      { name: "Aluno Intermediario", color: "#eab308", tip: "#2563eb", level: "N2 Intermediario", note: "Floreios, sequencias de Bimba, baloes e leitura de ritmo no berimbau." },
      { name: "Aluno Graduado / Monitor", color: "#2563eb", tip: "#78350f", level: "N3 Avancado", note: "Jogo rapido de Benguela e Sao Bento Grande, controle de quedas e rasteiras." },
      { name: "Instrutor / Professor / Mestre", color: "#78350f", tip: "#0a0a0a", level: "N4 Mestre / Pro", note: "Lideranca de roda, musicalidade completa e validacao de alunos." }
    ]
  },
  "Boxe": {
    federation: "Padrao CBBoxe / Olimpica e Profissional (Classificacao Tecnica)",
    overview: "O Boxe nao usa faixas. A classificacao no SparRing considera experiencia de ringue, categoria de peso e controle de intensidade (sparring condicional de jab/esquiva ate combate completo).",
    ranks: [
      { name: "Fundamentos (Escola de Boxe)", color: "#737373", tip: null, level: "N1 Iniciante", note: "Base, deslocamento, jab, direto e sparring condicional leve." },
      { name: "Intermediario", color: "#38bdf8", tip: null, level: "N2 Intermediario", note: "Combinacoes na curta distancia, pendulo, esquiva e rounds de 3 min." },
      { name: "Competidor Amador / Olimpico", color: "#ff5500", tip: null, level: "N3 Avancado", note: "Alto volume de golpes, gestao de gas e sparring competitivo 75% a 85%." },
      { name: "Profissional / Treinador", color: "#0a0a0a", tip: "#ff5500", level: "N4 Mestre / Pro", note: "Experiencia profissional de ringue ou tecnico de equipe." }
    ]
  },
  "Kickboxing": {
    federation: "Padrao CBKB / WAKO (Low Kicks e K1 Rules)",
    overview: "Segue a sequencia tradicional de faixas coloridas da Confederacao Brasileira de Kickboxing, especificando sempre a regra do treino (Point Fight, Light Contact, Low Kicks ou K1).",
    ranks: [
      { name: "Faixa Branca e Amarela", color: "#facc15", tip: null, level: "N1 Iniciante", note: "Postura, combinacoes basicas de maos e chutes circulares." },
      { name: "Faixa Laranja e Verde", color: "#22c55e", tip: null, level: "N2 Intermediario", note: "Bloqueios de canela, chutes frontais e sparring controlado." },
      { name: "Faixa Azul e Marrom", color: "#78350f", tip: null, level: "N3 Avancado", note: "Ritmo K1 com joelhadas e combinacoes de alta intensidade." },
      { name: "Faixa Preta (1 Dan+)", color: "#0a0a0a", tip: "#ff5500", level: "N4 Mestre / Pro", note: "Atleta de ponta ou professor credenciado." }
    ]
  },
  "Judo e Wrestling": {
    federation: "Padrao CBJ / Kodokan (Judo) e UWW / CBW (Wrestling - Luta Olimpica)",
    overview: "No Judo usamos as faixas Kyu (Branca a Marrom) e Dan (Preta). No Wrestling (Estilo Livre e Greco-Romana), nao ha faixas: o pareamento ocorre por tempo de pratica, categoria de peso e experiencia competitiva.",
    ranks: [
      { name: "Judo Branca/Cinza/Azul | Wrestling Base", color: "#e5e5e5", tip: "#38bdf8", level: "N1 Iniciante", note: "Ukemi, pegadas basicas, entrada de double leg e single leg educativa." },
      { name: "Judo Amarela/Laranja/Verde | Wrestling Interm.", color: "#22c55e", tip: null, level: "N2 Intermediario", note: "Randori controlado, defesa de quedas e transicoes para solo." },
      { name: "Judo Roxa/Marrom | Wrestling Competidor", color: "#78350f", tip: null, level: "N3 Avancado", note: "Alta intensidade de quedas, contragolpes e ritmo de torneio." },
      { name: "Judo Faixa Preta (Dan) | Wrestling Elite", color: "#0a0a0a", tip: "#ff5500", level: "N4 Mestre / Pro", note: "Nivel tecnico maximo e habilitacao para validar treinos." }
    ]
  },
  "Karate e Taekwondo": {
    federation: "Padrao CBK / WKF (Karate) e CBTKD / WT (Taekwondo)",
    overview: "Sistemas baseados em faixas coloridas (Kyu no Karate e Gup no Taekwondo) culminando na Faixa Preta (Dan). No SparRing o atleta define se o treino sera no formato olimpico (pontos) ou full contact (Kyokushin).",
    ranks: [
      { name: "Branca / Amarela (Kyu/Gup Inicial)", color: "#facc15", tip: null, level: "N1 Iniciante", note: "Bases, chutes basicos e combate educativo sem impacto." },
      { name: "Vermelha / Laranja / Verde / Azul", color: "#2563eb", tip: null, level: "N2 Intermediario", note: "Velocidade de pernas, distancias e combinacoes de pontuacao." },
      { name: "Roxa / Marrom (Pre-Preta)", color: "#78350f", tip: null, level: "N3 Avancado", note: "Chutes giratorios, contragolpe explosivo e ritmo competitivo." },
      { name: "Faixa Preta (1 Dan ou superior)", color: "#0a0a0a", tip: "#ff5500", level: "N4 Mestre / Pro", note: "Graduacao Dan oficial e qualificacao de instrutor." }
    ]
  }
};

window.SPARRING_DEFAULT_DATA = {
  isAuthenticated: false,
  userRole: "fighter", // "fighter" or "academy"
  plan: "free", // "free" or "premium"
  currentUser: {
    name: "Pedro Hipolito",
    initials: "PH",
    city: "Savassi, Belo Horizonte",
    gym: "CT Nova Era BH",
    modality: "Muay Thai",
    weight: 76,
    height: 178,
    age: 22,
    stance: "Destro",
    category: "Amador",
    rank: "Grau Azul Escuro Ponta Preta",
    rankLevel: 3,
    streakDays: 14,
    verified: true
  },
  academyAccount: {
    gymName: "CT Nova Era BH",
    coachName: "Mestre Ricardo Alves",
    initials: "NE",
    neighborhood: "Centro, Belo Horizonte"
  },
  fighters: [
    {
      id: "f1",
      name: "Lucas Andrade",
      initials: "LA",
      modality: "Muay Thai",
      weight: 75,
      height: 177,
      age: 24,
      stance: "Canhoto",
      rank: "Grau Azul Escuro Ponta Preta (CBMT)",
      rankLevel: 3,
      preferredIntensity: 60,
      gym: "CT Savassi Fight",
      neighborhood: "Savassi",
      distanceKm: 2.1,
      availability: "Sabado 09:30",
      verified: true,
      roundsLogged: 148,
      bio: "Foco em sparring tecnico de boxe e chutes baixos com controle de distancia."
    },
    {
      id: "f2",
      name: "Rafael Mendes",
      initials: "RM",
      modality: "Muay Thai",
      weight: 78,
      height: 180,
      age: 27,
      stance: "Destro",
      rank: "Grau Azul Claro (CBMT)",
      rankLevel: 2,
      preferredIntensity: 40,
      gym: "Academia Iron Pampulha",
      neighborhood: "Pampulha",
      distanceKm: 5.4,
      availability: "Domingo 10:00",
      verified: true,
      roundsLogged: 92,
      bio: "Treino solto 30% a 40% para refinar bloqueios, clinch e contragolpes."
    },
    {
      id: "f3",
      name: "Bruno Castilho",
      initials: "BC",
      modality: "Boxe",
      weight: 74,
      height: 175,
      age: 25,
      stance: "Canhoto",
      rank: "Competidor Amador",
      rankLevel: 3,
      preferredIntensity: 80,
      gym: "Nobre Arte BH",
      neighborhood: "Funcionarios",
      distanceKm: 1.8,
      availability: "Sexta 19:30",
      verified: true,
      roundsLogged: 210,
      bio: "Preparacao para campeonato mineiro amador. Ritmo alto de simulacao de luta."
    },
    {
      id: "f4",
      name: "Thiago Nogueira",
      initials: "TN",
      modality: "Kickboxing",
      weight: 81,
      height: 182,
      age: 29,
      stance: "Destro",
      rank: "Faixa Marrom (CBKB)",
      rankLevel: 3,
      preferredIntensity: 70,
      gym: "CT Buritis Strike",
      neighborhood: "Buritis",
      distanceKm: 6.2,
      availability: "Sabado 11:00",
      verified: true,
      roundsLogged: 184,
      bio: "Combinacoes K1, movimentacao lateral e volume alto em rounds de 3 minutos."
    },
    {
      id: "f5",
      name: "Gabriel Ferreira",
      initials: "GF",
      modality: "Jiu-Jitsu",
      weight: 77,
      height: 176,
      age: 23,
      stance: "Destro",
      rank: "Faixa Roxa (IBJJF)",
      rankLevel: 3,
      preferredIntensity: 65,
      gym: "Gracie Barra Sion",
      neighborhood: "Sion",
      distanceKm: 3.0,
      availability: "Sabado 15:00",
      verified: true,
      roundsLogged: 165,
      bio: "Open mat de passagem de guarda e drills posicionais sem quimono."
    },
    {
      id: "f6",
      name: "Henrique Duarte",
      initials: "HD",
      modality: "MMA",
      weight: 99,
      height: 189,
      age: 31,
      stance: "Destro",
      rank: "Atleta Profissional",
      rankLevel: 4,
      preferredIntensity: 85,
      gym: "BH Top Team",
      neighborhood: "Prado",
      distanceKm: 4.1,
      availability: "Sabado 10:30",
      verified: true,
      roundsLogged: 312,
      bio: "Peso pesado buscando parceiros acima de 92kg para simulacao de grade e chao."
    },
    {
      id: "f9",
      name: "Caio Ribeiro",
      initials: "CR",
      modality: "MMA",
      weight: 77,
      height: 179,
      age: 25,
      stance: "Destro",
      rank: "Competidor Amador (Meio-Medio)",
      rankLevel: 3,
      preferredIntensity: 75,
      gym: "CT Buritis Strike",
      neighborhood: "Buritis",
      distanceKm: 5.8,
      availability: "Sabado 10:00",
      verified: true,
      roundsLogged: 190,
      bio: "Sparring de MMA com luva 7oz focado em transicao de boxe para queda na grade."
    },
    {
      id: "f10",
      name: "Igor Volkov",
      initials: "IV",
      modality: "Sambo",
      weight: 79,
      height: 181,
      age: 28,
      stance: "Canhoto",
      rank: "Competidor Combat Sambo (FIAS)",
      rankLevel: 3,
      preferredIntensity: 65,
      gym: "CT Savassi Fight",
      neighborhood: "Savassi",
      distanceKm: 2.4,
      availability: "Domingo 11:00",
      verified: true,
      roundsLogged: 156,
      bio: "Treino de Combat Sambo e Sambo Esportivo com foco em quedas de quadril e chaves de perna."
    },
    {
      id: "f11",
      name: "Luan Santana Lima",
      initials: "LS",
      modality: "Capoeira",
      weight: 74,
      height: 176,
      age: 26,
      stance: "Destro",
      rank: "Aluno Graduado (Regional / Benguela)",
      rankLevel: 3,
      preferredIntensity: 50,
      gym: "Espaco Ginga BH",
      neighborhood: "Santa Tereza",
      distanceKm: 3.5,
      availability: "Sabado 16:00",
      verified: true,
      roundsLogged: 130,
      bio: "Intercambio de jogo tecnico, esquivas, rasteiras controladas e floreios em roda aberta."
    },
    {
      id: "f12",
      name: "Kenji Takahashi",
      initials: "KT",
      modality: "Judo",
      weight: 76,
      height: 175,
      age: 27,
      stance: "Destro",
      rank: "Faixa Marrom (1 Kyu - CBJ)",
      rankLevel: 3,
      preferredIntensity: 70,
      gym: "Minas Judo Club",
      neighborhood: "Lourdes",
      distanceKm: 2.0,
      availability: "Quinta 19:30",
      verified: true,
      roundsLogged: 204,
      bio: "Randori em pe focado em kumi-kata, uchimata e transicao direta para ne-waza."
    },
    {
      id: "f13",
      name: "Vitor Resende",
      initials: "VR",
      modality: "Wrestling",
      weight: 78,
      height: 177,
      age: 24,
      stance: "Destro",
      rank: "Competidor Estilo Livre",
      rankLevel: 3,
      preferredIntensity: 80,
      gym: "BH Top Team",
      neighborhood: "Prado",
      distanceKm: 4.0,
      availability: "Sabado 09:00",
      verified: true,
      roundsLogged: 172,
      bio: "Drills de single leg, sprawl e controle de cintura sem quimono."
    },
    {
      id: "f14",
      name: "Andre Martins",
      initials: "AM",
      modality: "Karate",
      weight: 75,
      height: 178,
      age: 23,
      stance: "Canhoto",
      rank: "Faixa Preta 1 Dan (Kyokushin)",
      rankLevel: 4,
      preferredIntensity: 60,
      gym: "Dojo Liberdade BH",
      neighborhood: "Funcionarios",
      distanceKm: 1.9,
      availability: "Domingo 09:30",
      verified: true,
      roundsLogged: 225,
      bio: "Kumite tecnico focado em distancia, chutes giratorios e condicionamento de tronco."
    },
    {
      id: "f15",
      name: "Pedro Lucas Moura",
      initials: "PM",
      modality: "Taekwondo",
      weight: 72,
      height: 180,
      age: 21,
      stance: "Canhoto",
      rank: "Faixa Vermelha Ponta Preta (1 Gup)",
      rankLevel: 3,
      preferredIntensity: 55,
      gym: "CT Pampulha Kicks",
      neighborhood: "Pampulha",
      distanceKm: 6.0,
      availability: "Sabado 14:30",
      verified: true,
      roundsLogged: 118,
      bio: "Sparring de chutes rapidos, movimentacao olimpica e contragolpe na longa distancia."
    },
    {
      id: "f7",
      name: "Matheus Vieira",
      initials: "MV",
      modality: "Muay Thai",
      weight: 73,
      height: 174,
      age: 21,
      stance: "Destro",
      rank: "Grau Vermelho (CBMT)",
      rankLevel: 1,
      preferredIntensity: 30,
      gym: "CT Nova Era BH",
      neighborhood: "Centro",
      distanceKm: 1.2,
      availability: "Domingo 09:00",
      verified: false,
      roundsLogged: 28,
      bio: "Iniciante focado em sparring educativo leve 30% sem contato forte."
    }
  ],
  sessions: [
    {
      id: "s1",
      date: "2026-11-24",
      modality: "Muay Thai",
      partnerName: "Lucas Andrade",
      partnerWeight: 75,
      partnerHeight: 177,
      partnerAge: 24,
      partnerRank: "Grau Azul Escuro Ponta Preta",
      partnerRankLevel: 3,
      partnerStance: "Canhoto",
      gym: "CT Savassi Fight",
      rounds: 8,
      roundMinutes: 3,
      intensity: 75,
      fatigue: 7,
      focus: { boxe: 45, chutes: 35, clinch: 20 }
    },
    {
      id: "s2",
      date: "2026-11-21",
      modality: "MMA",
      partnerName: "Caio Ribeiro",
      partnerWeight: 77,
      partnerHeight: 179,
      partnerAge: 25,
      partnerRank: "Competidor Amador",
      partnerRankLevel: 3,
      partnerStance: "Destro",
      gym: "CT Buritis Strike",
      rounds: 5,
      roundMinutes: 5,
      intensity: 80,
      fatigue: 8,
      focus: { boxe: 40, chutes: 25, clinch: 35 }
    },
    {
      id: "s3",
      date: "2026-11-18",
      modality: "Sambo",
      partnerName: "Igor Volkov",
      partnerWeight: 79,
      partnerHeight: 181,
      partnerAge: 28,
      partnerRank: "Competidor Combat Sambo",
      partnerRankLevel: 3,
      partnerStance: "Canhoto",
      gym: "CT Savassi Fight",
      rounds: 6,
      roundMinutes: 4,
      intensity: 70,
      fatigue: 8,
      focus: { boxe: 30, chutes: 15, clinch: 55 }
    },
    {
      id: "s4",
      date: "2026-11-14",
      modality: "Muay Thai",
      partnerName: "Rafael Mendes",
      partnerWeight: 78,
      partnerHeight: 180,
      partnerAge: 27,
      partnerRank: "Grau Azul Claro",
      partnerRankLevel: 2,
      partnerStance: "Destro",
      gym: "Academia Iron Pampulha",
      rounds: 10,
      roundMinutes: 3,
      intensity: 40,
      fatigue: 4,
      focus: { boxe: 35, chutes: 40, clinch: 25 }
    },
    {
      id: "s5",
      date: "2026-11-10",
      modality: "Kickboxing",
      partnerName: "Thiago Nogueira",
      partnerWeight: 81,
      partnerHeight: 182,
      partnerAge: 29,
      partnerRank: "Faixa Marrom",
      partnerRankLevel: 3,
      partnerStance: "Destro",
      gym: "CT Nova Era BH",
      rounds: 6,
      roundMinutes: 3,
      intensity: 65,
      fatigue: 6,
      focus: { boxe: 40, chutes: 45, clinch: 15 }
    }
  ],
  gyms: [
    {
      id: "g1",
      name: "CT Savassi Fight",
      neighborhood: "Savassi, Belo Horizonte",
      spaceType: "Ringue Oficial + 80m2 Tatame",
      hourlyRate: 60,
      takeRatePercent: 12,
      slots: ["Sabado 09:00", "Sabado 14:00", "Domingo 10:00"],
      rating: 4.9,
      activeStudents: 84
    },
    {
      id: "g2",
      name: "CT Nova Era BH",
      neighborhood: "Centro, Belo Horizonte",
      spaceType: "Tatame Olimpico + Area de Sacos",
      hourlyRate: 50,
      takeRatePercent: 12,
      slots: ["Sexta 15:00", "Sabado 11:00", "Domingo 09:00"],
      rating: 4.8,
      activeStudents: 62
    },
    {
      id: "g3",
      name: "Nobre Arte BH",
      neighborhood: "Funcionarios, Belo Horizonte",
      spaceType: "Ringue de Boxe Profissional",
      hourlyRate: 70,
      takeRatePercent: 15,
      slots: ["Quinta 16:00", "Sabado 13:00", "Domingo 11:00"],
      rating: 5.0,
      activeStudents: 51
    },
    {
      id: "g4",
      name: "CT Buritis Strike",
      neighborhood: "Buritis, Belo Horizonte",
      spaceType: "Cage Wall MMA + Tatame Sambo/BJJ",
      hourlyRate: 65,
      takeRatePercent: 12,
      slots: ["Sabado 10:00", "Sabado 16:00", "Domingo 14:00"],
      rating: 4.7,
      activeStudents: 73
    }
  ],
  scheduledMatches: [
    {
      id: "m1",
      partnerName: "Lucas Andrade",
      modality: "Muay Thai",
      gym: "CT Savassi Fight",
      slot: "Sabado 09:30",
      rounds: 6,
      intensity: 60,
      totalPrice: 60,
      platformFee: 7.2,
      status: "Confirmado"
    }
  ],
  b2bPendingValidations: [
    {
      id: "v1",
      studentName: "Matheus Vieira",
      declaredWeight: 73,
      declaredRank: "Grau Vermelho (CBMT)",
      modality: "Muay Thai",
      requestedAt: "Hoje, 11:20",
      status: "Pendente"
    },
    {
      id: "v2",
      studentName: "Joao Paulo Silva",
      declaredWeight: 84,
      declaredRank: "Faixa Azul (IBJJF)",
      modality: "Jiu-Jitsu",
      requestedAt: "Ontem, 19:45",
      status: "Pendente"
    },
    {
      id: "v3",
      studentName: "Felipe Rocha",
      declaredWeight: 77,
      declaredRank: "Competidor Amador (MMA)",
      modality: "MMA",
      requestedAt: "Ontem, 16:10",
      status: "Pendente"
    }
  ],
  b2bStudents: [
    { name: "Pedro Hipolito", modality: "Muay Thai", roundsMonth: 37, streak: 14, lastSeenDays: 2, status: "Ativo" },
    { name: "Lucas Andrade", modality: "Muay Thai", roundsMonth: 42, streak: 19, lastSeenDays: 1, status: "Ativo" },
    { name: "Caio Ribeiro", modality: "MMA", roundsMonth: 31, streak: 11, lastSeenDays: 2, status: "Ativo" },
    { name: "Igor Volkov", modality: "Sambo", roundsMonth: 26, streak: 8, lastSeenDays: 3, status: "Ativo" },
    { name: "Carlos Eduardo", modality: "Boxe", roundsMonth: 6, streak: 0, lastSeenDays: 18, status: "Risco de Evasao" },
    { name: "Vinicius Lopes", modality: "Capoeira", roundsMonth: 4, streak: 0, lastSeenDays: 23, status: "Risco de Evasao" }
  ],
  academyEvents: [
    {
      id: "ev1",
      title: "Aulao Intercambio Muay Thai e Boxe (30% a 60%)",
      gym: "CT Nova Era BH",
      modality: "Muay Thai",
      date: "Sabado 10:00",
      altDates: ["Sabado 10:00", "Sabado 16:00", "Domingo 09:30"],
      spots: 24,
      enrolled: 16,
      enrolledByUser: false
    },
    {
      id: "ev2",
      title: "Open Mat MMA e Combat Sambo (Grade + Quedas)",
      gym: "CT Buritis Strike",
      modality: "MMA",
      date: "Domingo 09:30",
      altDates: ["Domingo 09:30", "Domingo 15:00", "Terca 20:00"],
      spots: 16,
      enrolled: 11,
      enrolledByUser: false
    }
  ]
};
