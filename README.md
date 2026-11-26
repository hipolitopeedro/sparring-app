# SparRing

Onde cada round conta.

Aplicacao web interativa desenvolvida a partir do projeto de empreendedorismo SparRing, um ecossistema digital voltado para praticantes amadores, atletas de combate e academias de artes marciais. A plataforma separa a experiencia em dois portais independentes acessados a partir da tela de login: o Portal do Lutador (B2C) e o Portal da Academia e Treinador (B2B), sincronizados pelo mesmo estado local.

## Problema Resolvido

- Desorganizacao: substitui grupos genericos de WhatsApp por agendamentos estruturados e confirmados.
- Risco de lesoes: evita disparidade fisica critica (como 70 kg contra 100 kg) por meio de filtros tecnicos de peso e nivel.
- Evasao nas academias: reduz a desmotivacao de alunos apos 6 meses usando gamificacao e acompanhamento de progresso.
- Estagnacao tecnica: facilita o intercambio seguro com parceiros de outras escolas e estilos de luta.

## Arquitetura em Dois Portais Separados

### Tela de Login (Selecao de Perfil)

- Sou Lutador (B2C): abre exclusivamente o Portal do Lutador, com configuracao de nome, modalidade principal e peso atual.
- Academia ou Treinador (B2B): abre exclusivamente o Portal da Academia, com menus e ferramentas dedicados ao mestre e gestor do centro de treinamento.

### Portal do Lutador (B2C)

- Matchmaking Inteligente em 11 modalidades: Muay Thai, MMA, Boxe, Jiu-Jitsu, Kickboxing, Sambo, Capoeira, Judo, Wrestling, Karate e Taekwondo, com filtro seguro de peso, intensidade alvo e pontuacao de compatibilidade.
- Cartel Digital: registro persistente (localStorage) de rounds, horas de treino, intensidade media, parceiros diferentes e streak de consistencia.
- Card Compartilhavel: visualizacao e exportacao em imagem PNG (via HTML5 Canvas) no estilo Strava para redes sociais.
- Simulacao Freemium e Premium (R$ 14,90/mes): alternancia entre Free e Premium desbloqueando Insights de Oponente, Distribuicao Tecnica, Rastreio de Fadiga contra Overtraining e filtros exclusivos por base e nivel minimo.
- Tatames e Auloes: reserva de horarios ociosos em academias de Belo Horizonte (com split automatico de 10% a 15%) e inscricao em auloes de intercambio.
- Ajuda e Guia de Graduacoes: explicacao do nivelamento universal (N1 a N4), graus de Muay Thai (padrao CBMT de 9 graus de Kruang/Prajioud), faixas de Jiu-Jitsu (IBJJF/CBJJ), MMA, Sambo (FIAS), Capoeira, Boxe, Kickboxing, Judo, Wrestling, Karate e Taekwondo.

### Portal da Academia e Treinador (B2B)

- Visao Geral: painel de indicadores com alunos ativos, taxa de retencao de 6 meses, validacoes pendentes, receita liquida de tatames e alertas prioritarios.
- Validar Alunos: fila para aprovar ou recusar peso e graduacao declarados, ativando automaticamente o selo Validado Mestre no Portal do Lutador.
- Ranking e Evasao (Churn): monitoramento de assiduidade com filtro para alunos com risco de abandono e envio de lembrete de treino.
- Gestao de Tatames: publicacao e remocao de horarios ociosos e valor por hora, sincronizados em tempo real com a vitrine dos lutadores.
- Auloes e Intercambio: criacao de treinos coletivos abertos para captacao de novos alunos.
- Ajuda e Modelo de Negocio: guia de graduacoes para referencia tecnica do mestre e visao executiva de monetizacao e projecao de 5 anos.

## Identidade Visual

A interface segue fielmente o esquema de cores da apresentacao do projeto:

- Fundo principal: `#111111` com grade arquitetonica sutil (`#262626`)
- Superficies e cards: `#171717` e `#1E1E1E`
- Destaque primario: `#FF5500`
- Alerta de risco e disparidade: `#D91E2A`
- Tipografia: Inter e JetBrains Mono

## Estrutura do Projeto

```text
sparring-app/
├── index.html       # Tela de login, Portal do Lutador (B2C), Portal da Academia (B2B) e modais
├── css/
│   └── styles.css   # Sistema visual SparRing e layout responsivo
├── js/
│   ├── data.js      # Base de atletas nas 11 modalidades, academias, eventos e guia de graduacoes
│   └── app.js       # Logica independente dos dois portais com sincronizacao localStorage
└── README.md        # Documentacao do projeto
```

## Como Executar Localmente

Por ser uma aplicacao web estatica em HTML, CSS e JavaScript puro (sem dependencia de build), basta abrir o arquivo `index.html` diretamente no navegador ou servir a pasta com qualquer servidor HTTP local.
