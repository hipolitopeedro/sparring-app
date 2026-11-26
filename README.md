# SparRing

Onde cada round conta.

O SparRing e uma plataforma completa de matchmaking seguro, cartel digital e gestao de tatames para o ecossistema de artes marciais amadoras e competitivas. Este repositorio concentra em um unico monorepo a aplicacao Web profissional em React + TypeScript e o aplicativo Android nativo em Flutter.

## Acesso Rapido

- Aplicacao Web (React + Vite): https://hipolitopeedro.github.io/sparring-app/
- Aplicativo Android (APK compilado automaticamente via GitHub Actions): aba Actions > Compilar APK Android (Flutter) > Artefato `sparring-android-apk`

## Estrutura do Monorepo

```text
sparring-app/
  web/                Aplicacao Web em React 19, TypeScript, Vite, Tailwind CSS e Recharts
  mobile/             Aplicativo Mobile nativo em Flutter (Android / iOS)
  .github/workflows/  Pipelines automaticos para GitHub Pages (Web) e Build APK (Android)
```

## Principais Funcionalidades

### 1. Homepage e Modelo de Negocio
- Apresentacao do cenario atual, solucao, matriz competitiva (SparRing vs Fightnize vs WhatsApp) e visao de futuro.
- Planos claros para lutadores (Free R$ 0 e Premium R$ 14,90/mes) e academias parceiras (B2B R$ 89,90/mes + split automatico na locacao de tatames).

### 2. Acesso e Cadastro Separados (Lutador vs Academia)
- Cadastro de Lutador (B2C): nome completo, arte marcial (11 modalidades), graduacao dinamica conforme a modalidade, altura, peso, categoria (Amador ou Profissional), base (Destro ou Canhoto) e bairro/cidade.
- Cadastro de Academia / Treinador (B2B): nome da academia, mestre responsavel, bairro/cidade e estrutura de tatame ou ringue.

### 3. Portal do Lutador (B2C)
- Matchmaking Inteligente: 11 modalidades (Muay Thai, MMA, Boxe, Jiu-Jitsu, Kickboxing, Sambo, Capoeira, Judo, Wrestling, Karate e Taekwondo), filtro de tolerancia de peso com alerta automatico acima de 10 kg, filtro de intensidade (30% a 90%) e calculo de compatibilidade (% Match).
- Cartel Digital e Gamificacao: total de rounds, horas de tatame, streak de consistencia, registro de novos sparrings e geracao de Card PNG estilo Strava para compartilhar no Instagram.
- Insights e Fadiga PRO: analise de oponentes (canhotos, peso medio), distribuicao tecnica (boxe, chutes, clinch) e grafico interativo de intensidade vs fadiga com zona de alerta contra overtraining.
- Tatames e Auloes: reagendamento e cancelamento de sparrings marcados, reserva de horarios ociosos em academias parceiras e inscricao em auloes abertos com confirmacao visual verde e opcao exclusiva de cancelar vaga.
- Ajuda e Guia de Graduacoes: explicacao oficial dos sistemas de graus e faixas adotados (CBMT 9 graus de Muay Thai, IBJJF Jiu-Jitsu, CABMMA MMA, FIAS Sambo, Capoeira, Boxe, Kickboxing, Judo/Wrestling e Karate/Taekwondo) e nivelamento universal N1 a N4.

### 4. Portal da Academia / Treinador (B2B)
- Painel completamente separado do perfil do lutador.
- Validacao tecnica de alunos (ativa o selo Validado pelo Mestre no matchmaking).
- Ranking interno de rounds e monitoramento anti-evasao com envio de convite de retorno.
- Gestao de horarios ociosos de tatame e criacao de auloes abertos sincronizados com os lutadores.

## Como Executar Localmente

### Aplicacao Web (React + TypeScript)
```bash
cd web
npm install
npm run dev
```

### Aplicativo Mobile (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```
Para gerar o APK de producao localmente:
```bash
cd mobile
flutter build apk --release
```

## Identidade Visual

- Fundo principal: Carbon Black `#111111` com grade arquitetonica `#262626`
- Superficies: `#171717` e `#1E1E1E`
- Destaque primario: Combustion Orange `#FF5500`
- Alerta de risco / overtraining: Crimson `#D91E2A`
- Confirmacao / validacao: Emerald `#22C55E`

## Autor

Desenvolvido por Pedro Hipolito (Belo Horizonte, MG).
