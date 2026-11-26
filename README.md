# SparRing

Onde cada round conta.

Aplicacao web interativa desenvolvida a partir do projeto de empreendedorismo SparRing, um ecossistema digital voltado para praticantes amadores, atletas de combate e academias de artes marciais. A plataforma conecta lutadores para sessoes de sparring com pareamento seguro por peso, graduacao e intensidade, ao mesmo tempo em que registra a evolucao tecnica em um Cartel Digital.

## Problema Resolvido

- Desorganizacao: substitui grupos genericos de WhatsApp por agendamentos estruturados e confirmados.
- Risco de lesoes: evita disparidade fisica critica (como 70 kg contra 100 kg) por meio de filtros tecnicos de peso e nivel.
- Evasao nas academias: reduz a desmotivacao de alunos apos 6 meses usando gamificacao e acompanhamento de progresso.
- Estagnacao tecnica: facilita o intercambio seguro com parceiros de outras escolas e estilos de luta.

## Funcionalidades Implementadas

### Area do Atleta (B2C)

- Matchmaking Inteligente: filtros por modalidade, tolerancia de peso com alerta automatico de disparidade fisica, intensidade alvo (30% tecnico ate 90% combate) e pontuacao de compatibilidade.
- Cartel Digital: registro persistente (localStorage) de rounds, horas de treino, intensidade media, parceiros diferentes e streak de consistencia.
- Card Compartilhavel: visualizacao e exportacao em imagem PNG (via HTML5 Canvas) no estilo Strava para compartilhamento em redes sociais.
- Simulacao Freemium e Premium (R$ 14,90/mes): alternancia imediata entre os planos Free e Premium, liberando Insights de Oponente, Distribuicao Tecnica (Boxe, Chutes e Clinch), grafico de Rastreio de Fadiga contra Overtraining e filtros exclusivos por base (canhoto/destro) e graduacao minima.
- Locacao de Tatames (Belo Horizonte): listagem de horarios ociosos em academias parceiras com calculo automatico de split de pagamento (taxa de intermediacao de 10% a 15%).

### Painel de Academias e Mestres (B2B)

- Validacao Tecnica: fila de aprovacao onde o mestre valida o peso e a graduacao declarados pelos alunos, garantindo integridade no matchmaking.
- Ranking Interno e Monitoramento de Evasao: acompanhamento de rounds mensais, streak de assiduidade e sinalizacao de alunos com risco de evasao.
- Visao de Negocio: painel com fontes de monetizacao (B2B, B2C, taxa de intermediacao e publicidade nativa), matriz competitiva e projecao financeira de 5 anos.

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
├── index.html       # Estrutura principal, modais e secoes B2C/B2B
├── css/
│   └── styles.css   # Sistema visual SparRing e layout responsivo
├── js/
│   ├── data.js      # Base inicial realista de atletas, sessoes e academias de BH
│   └── app.js       # Logica de matchmaking, cartel, graficos SVG, canvas PNG e painel B2B
└── README.md        # Documentacao do projeto
```

## Como Executar Localmente

Por ser uma aplicacao web estatica em HTML, CSS e JavaScript puro (sem dependencia de build), basta abrir o arquivo `index.html` diretamente no navegador ou servir a pasta com qualquer servidor HTTP local.
