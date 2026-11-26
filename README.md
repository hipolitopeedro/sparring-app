# SparRing

Onde cada round conta.

Monorepo oficial do projeto de empreendedorismo SparRing, um ecossistema digital para praticantes amadores, atletas de combate e academias de artes marciais. O repositorio reune a aplicacao Web (Homepage publica, Portal do Lutador B2C e Portal da Academia B2B hospedados no GitHub Pages) e o aplicativo Mobile nativo em Flutter/Dart para Android (com compilacao automatica de APK via GitHub Actions).

## Estrutura do Monorepo

```text
sparring-app/
├── index.html                           # Aplicacao Web: Homepage, Login/Cadastro e Portais B2C/B2B
├── css/styles.css                       # Identidade visual SparRing (preto carbono e laranja)
├── js/data.js                           # Base de dados nas 11 modalidades e guia de graduacoes
├── js/app.js                            # Logica completa da versao Web
├── mobile/                              # Aplicativo Mobile nativo em Flutter / Dart (Android Studio)
│   ├── pubspec.yaml                     # Dependencias do app Flutter
│   ├── android/                         # Projeto Android (com.sparring.app, Gradle KTS)
│   ├── lib/
│   │   ├── main.dart                    # Ponto de entrada e roteamento B2C / B2B
│   │   ├── theme/sparring_theme.dart    # Tema Material 3 com a paleta dos slides
│   │   ├── models/sparring_models.dart  # Modelos e guia oficial de graduacoes (11 modalidades)
│   │   ├── data/sparring_store.dart     # Estado reativo, matchmaking e persistencia local
│   │   ├── screens/auth_screen.dart     # Login e cadastro separado (Lutador e Academia)
│   │   ├── screens/fighter_shell.dart   # Portal do Lutador (Match, Cartel, PRO, Tatames, Ajuda)
│   │   ├── screens/academy_shell.dart   # Portal da Academia B2B (Validacoes, Churn, Tatames)
│   │   └── widgets/help_guide_view.dart # Guia de graus (CBMT, IBJJF, MMA, Sambo, Capoeira)
│   └── test/sparring_test.dart          # Testes unitarios e de widget
└── .github/workflows/
    └── build-android-apk.yml            # Pipeline automatico que analisa, testa e gera o APK Android
```

## Funcionalidades Principais (Web e Mobile)

- Dois portais independentes: Portal do Lutador (B2C) e Portal da Academia / Treinador (B2B), acessados por cadastros e logins separados.
- Cadastro completo do lutador: nome, arte marcial (entre 11 modalidades), graduacao dinamica, altura, peso, categoria (Amador ou Profissional), base (Canhoto ou Destro) e bairro/cidade.
- 11 modalidades suportadas: Muay Thai, MMA, Boxe, Jiu-Jitsu, Kickboxing, Sambo, Capoeira, Judo, Wrestling, Karate e Taekwondo.
- Matchmaking seguro: filtro de tolerancia de peso com alerta automatico de disparidade fisica acima de 10 kg, intensidade alvo e pontuacao de compatibilidade.
- Cartel Digital e Metricas Premium: registro de rounds, streak de consistencia, card compartilhavel estilo Strava, Insights de Oponente, Distribuicao Tecnica e grafico de Rastreio de Fadiga contra Overtraining.
- Tatames e Auloes: reserva de horarios ociosos em academias com split automatico (10% a 15%), opcoes de reagendar ou cancelar sparrings, e inscricao em auloes com confirmacao visual verde e cancelamento de vaga.
- Guia de Graduacoes: explicacao do nivelamento universal (N1 a N4) e das escalas adotadas (como o padrao brasileiro CBMT de 9 graus no Muay Thai e IBJJF no Jiu-Jitsu).

## Como Rodar o App Mobile no Android Studio

1. Clone o repositorio:

```bash
git clone https://github.com/hipolitopeedro/sparring-app.git
```

2. No Android Studio, clique em File -> Open e selecione a subpasta `sparring-app/mobile`.
3. Execute `flutter pub get` e clique em Run para abrir no emulador ou celular Android.
4. Para gerar o arquivo APK localmente:

```bash
cd mobile
flutter build apk --release
```

Tambem e possivel baixar o arquivo `app-release.apk` compilado automaticamente na aba Actions do repositorio no GitHub (artefato `sparring-android-apk`).

## Como Executar a Versao Web

A versao web roda diretamente no GitHub Pages ou abrindo o arquivo `index.html` na raiz do repositorio em qualquer navegador moderno.
