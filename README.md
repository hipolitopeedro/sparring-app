# SparRing

Onde cada round conta.

Aplicacao web interativa desenvolvida a partir do projeto de empreendedorismo SparRing, um ecossistema digital voltado para praticantes amadores, atletas de combate e academias de artes marciais. A plataforma conta com uma Homepage publica de apresentacao e modelo de negocio, telas de cadastro e login separadas e dois portais independentes: o Portal do Lutador (B2C) e o Portal da Academia e Treinador (B2B).

## Estrutura de Navegacao

### Homepage Publica

- Apresentacao da proposta de valor e do mercado enderecavel de 5 milhoes de praticantes no Brasil (IBGE).
- Secao O Desafio (desorganizacao, risco de lesoes 70 kg vs 100 kg, evasao apos 6 meses e estagnacao tecnica) e A Solucao SparRing.
- Modelo de Negocio e Planos (Lutador Free, Lutador Premium R$ 14,90/mes, Academia B2B R$ 89,90/mes e taxa de intermediacao de 10% a 15% na locacao de tatames), matriz competitiva e visao de futuro.
- Botoes diretos para cadastro de lutador, cadastro de academia ou login.

### Cadastro e Login Separados

- Cadastro de Lutador (B2C): coleta nome completo, arte marcial (entre 11 modalidades), graduacao ou nivel (atualizado dinamicamente conforme a arte marcial escolhida), altura em cm, peso em kg, categoria (Amador ou Profissional), base (Canhoto ou Destro), bairro/cidade, e-mail e senha.
- Cadastro de Academia ou Treinador (B2B): coleta nome da academia, mestre responsavel, bairro/cidade, estrutura de tatame/ringue, e-mail e senha.

### Portal do Lutador (B2C)

- Matchmaking Inteligente em 11 modalidades (Muay Thai, MMA, Boxe, Jiu-Jitsu, Kickboxing, Sambo, Capoeira, Judo, Wrestling, Karate e Taekwondo), com filtro de peso, alerta de disparidade fisica e pontuacao de compatibilidade.
- Cartel Digital: registro persistente (localStorage) de rounds, horas de treino, intensidade media, streak de consistencia e exportacao de Card Compartilhavel em PNG.
- Insights e Fadiga (Premium): Insights de Oponente, Distribuicao Tecnica (Boxe, Chutes e Clinch), grafico SVG de Rastreio de Fadiga contra Overtraining e filtros exclusivos por canhotos e nivel minimo.
- Tatames e Auloes: reserva de horarios ociosos em academias de Belo Horizonte com split automatico, confirmacao visual verde ao garantir vaga em auloes e opcoes de reagendar ou cancelar sparrings e aulas.
- Ajuda e Guia de Graduacoes: explicacao do nivelamento universal (N1 a N4), graus de Muay Thai (padrao CBMT de 9 graus de Kruang/Prajioud), faixas de Jiu-Jitsu (IBJJF/CBJJ), MMA, Sambo (FIAS), Capoeira, Boxe, Kickboxing, Judo, Wrestling, Karate e Taekwondo.

### Portal da Academia e Treinador (B2B)

- Visao Geral: indicadores de alunos ativos, retencao de 6 meses, validacoes pendentes, receita liquida de tatames e alertas prioritarios.
- Validar Alunos: aprovacao de peso e graduacao que ativa o selo Validado Mestre no Portal do Lutador.
- Ranking e Evasao (Churn): monitoramento de assiduidade com filtro de risco e convite rapido para reengajamento.
- Gestao de Tatames: publicacao e remocao de horarios ociosos sincronizados com a vitrine B2C.
- Auloes e Intercambio: criacao de treinos coletivos abertos para captacao de novos alunos.
- Ajuda e Graus: guia oficial de graduacoes para referencia do treinador.

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
├── index.html       # Homepage publica, telas de cadastro/login, Portal B2C e Portal B2B
├── css/
│   └── styles.css   # Sistema visual SparRing e layout responsivo
├── js/
│   ├── data.js      # Base de atletas nas 11 modalidades, academias, eventos e guia de graduacoes
│   └── app.js       # Logica da homepage, cadastros separados e sincronizacao entre portais
└── README.md        # Documentacao do projeto
```

## Como Executar Localmente

Por ser uma aplicacao web estatica em HTML, CSS e JavaScript puro (sem dependencia de build), basta abrir o arquivo `index.html` diretamente no navegador ou servir a pasta com qualquer servidor HTTP local.
