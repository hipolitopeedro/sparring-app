// SparRing Application Logic - Portais Separados: Lutador (B2C) e Academia / Treinador (B2B)

const STORAGE_KEY = "sparring_mvp_state_v3";

let appState = loadState();
let selectedSessionId = appState.sessions[0] ? appState.sessions[0].id : null;
let selectedLoginRole = appState.userRole || "fighter";
let selectedHelpModality = "Muay Thai";
let retentionFilter = "all";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Nao foi possivel carregar o estado salvo", e);
  }
  return JSON.parse(JSON.stringify(window.SPARRING_DEFAULT_DATA));
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn("Nao foi possivel salvar o estado", e);
  }
}

function getInitials(name) {
  const parts = (name || "SP").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 3000);
}

/* ==========================================================================
   POPULATE MODALITIES SELECTS
   ========================================================================== */
function populateModalitySelects() {
  const mods = window.SPARRING_MODALITIES || [];

  const filterEl = document.getElementById("filterModality");
  if (filterEl) {
    filterEl.innerHTML =
      '<option value="all">Todas as modalidades (11)</option>' +
      mods.map((m) => `<option value="${m}">${m}</option>`).join("");
  }

  ["loginFighterModality", "logModality", "eventModality"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = mods.map((m) => `<option value="${m}">${m}</option>`).join("");
      el.value = appState.currentUser.modality || "Muay Thai";
    }
  });
}

/* ==========================================================================
   LOGIN SCREEN -> ABRE PORTAL LUTADOR (B2C) OU PORTAL ACADEMIA (B2B)
   ========================================================================== */
function selectLoginRole(role) {
  selectedLoginRole = role;
  const isFighter = role === "fighter";

  document.getElementById("roleTabFighter").classList.toggle("active", isFighter);
  document.getElementById("roleTabAcademy").classList.toggle("active", !isFighter);

  document.getElementById("loginFighterFields").style.display = isFighter ? "grid" : "none";
  document.getElementById("loginAcademyFields").style.display = isFighter ? "none" : "grid";

  document.getElementById("loginEmail").value = isFighter
    ? "pedro.hipolito@sparring.app"
    : "contato@ctnovaerabh.com.br";
  document.getElementById("loginSubmitBtn").textContent = isFighter
    ? "Entrar no Portal do Lutador"
    : "Entrar no Portal da Academia";
}

function handleLoginSubmit(e) {
  e.preventDefault();
  appState.isAuthenticated = true;
  appState.userRole = selectedLoginRole;

  if (selectedLoginRole === "fighter") {
    const name = document.getElementById("loginFighterName").value.trim() || "Pedro Hipolito";
    const mod = document.getElementById("loginFighterModality").value || "Muay Thai";
    const weight = Number(document.getElementById("loginFighterWeight").value) || 76;
    appState.currentUser.name = name;
    appState.currentUser.initials = getInitials(name);
    appState.currentUser.modality = mod;
    appState.currentUser.weight = weight;
    saveState();
    openFighterPortal("matchmaking");
    showToast(`Bem-vindo ao Portal do Lutador, ${appState.currentUser.name}.`);
  } else {
    const gymName = document.getElementById("loginGymName").value.trim() || "CT Nova Era BH";
    const coachName = document.getElementById("loginCoachName").value.trim() || "Mestre Ricardo Alves";
    appState.academyAccount.gymName = gymName;
    appState.academyAccount.coachName = coachName;
    appState.academyAccount.initials = getInitials(gymName);
    saveState();
    openAcademyPortal("overview");
    showToast(`Portal B2B aberto para ${appState.academyAccount.gymName}.`);
  }
}

function quickOpenHelpFromLogin() {
  appState.isAuthenticated = true;
  appState.userRole = "fighter";
  saveState();
  openFighterPortal("help");
}

function openFighterPortal(initialView) {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("academyShell").classList.add("hidden");
  document.getElementById("fighterShell").classList.remove("hidden");

  const mobAcademy = document.getElementById("mobileNavAcademy");
  const mobFighter = document.getElementById("mobileNavFighter");
  if (mobAcademy) mobAcademy.style.display = "none";
  if (mobFighter) mobFighter.style.display = window.innerWidth <= 860 ? "grid" : "none";

  document.getElementById("fighterAvatar").textContent = appState.currentUser.initials;
  document.getElementById("fighterProfileName").textContent = appState.currentUser.name;
  document.getElementById("fighterProfileMeta").textContent = `${appState.currentUser.weight}kg | ${appState.currentUser.modality}`;

  syncPlanUI();
  syncBadges();
  switchFighterView(initialView || "matchmaking");
}

function openAcademyPortal(initialView) {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("fighterShell").classList.add("hidden");
  document.getElementById("academyShell").classList.remove("hidden");

  const mobFighter = document.getElementById("mobileNavFighter");
  const mobAcademy = document.getElementById("mobileNavAcademy");
  if (mobFighter) mobFighter.style.display = "none";
  if (mobAcademy) mobAcademy.style.display = window.innerWidth <= 860 ? "grid" : "none";

  document.getElementById("academyAvatar").textContent = appState.academyAccount.initials;
  document.getElementById("academyProfileName").textContent = appState.academyAccount.gymName;
  document.getElementById("academyProfileMeta").textContent = appState.academyAccount.coachName;
  document.getElementById("b2bGymBadgeNote").textContent = `${appState.academyAccount.gymName} | Licenca Ativa`;

  syncBadges();
  switchAcademyView(initialView || "overview");
}

function logoutToLogin() {
  appState.isAuthenticated = false;
  saveState();
  document.getElementById("fighterShell").classList.add("hidden");
  document.getElementById("academyShell").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("mobileNavFighter").style.display = "none";
  document.getElementById("mobileNavAcademy").style.display = "none";
  selectLoginRole(appState.userRole || "fighter");
}

/* ==========================================================================
   NAVIGATION: PORTAL DO LUTADOR (B2C)
   ========================================================================== */
const FIGHTER_VIEW_META = {
  matchmaking: {
    title: "Matchmaking Inteligente",
    subtitle: "Pareamento seguro por peso, graduacao e intensidade em 11 modalidades."
  },
  cartel: {
    title: "Cartel Digital e Consistencia",
    subtitle: "Historico real de rounds, horas de treino e card compartilhavel estilo Strava."
  },
  analytics: {
    title: "Insights de Oponente e Fadiga",
    subtitle: "Metricas avancadas do plano Premium para evolucao tecnica sem overtraining."
  },
  tatames: {
    title: "Tatames BH e Auloes Abertos",
    subtitle: "Reserve horarios ociosos em academias parceiras e inscreva-se em intercambios."
  },
  help: {
    title: "Ajuda e Guia de Graduacoes",
    subtitle: "Entenda os graus de Muay Thai (CBMT), faixas de Jiu-Jitsu, MMA, Sambo, Capoeira e seguranca."
  }
};

function switchFighterView(viewName) {
  document.querySelectorAll("#fighterShell .view-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === "fview-" + viewName);
  });
  document.querySelectorAll("[data-fighter-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-fighter-view") === viewName);
  });

  const meta = FIGHTER_VIEW_META[viewName];
  if (meta) {
    document.getElementById("fighterTopbarTitle").textContent = meta.title;
    document.getElementById("fighterTopbarSubtitle").textContent = meta.subtitle;
  }

  if (viewName === "matchmaking") renderMatchmaking();
  if (viewName === "cartel") renderCartel();
  if (viewName === "analytics") renderAnalytics();
  if (viewName === "tatames") renderTatames();
  if (viewName === "help") renderHelpGuide("fighterHelpMount");
}

/* ==========================================================================
   NAVIGATION: PORTAL DA ACADEMIA / TREINADOR (B2B)
   ========================================================================== */
const ACADEMY_VIEW_META = {
  overview: {
    title: "Visao Geral da Academia",
    subtitle: "Indicadores de retencao, validacoes pendentes e receita de locacao de tatames."
  },
  validations: {
    title: "Validacao Tecnica de Alunos",
    subtitle: "Ateste peso e graduacao para manter a seguranca e a integridade do matchmaking."
  },
  retention: {
    title: "Ranking Interno e Controle de Evasao",
    subtitle: "Monitore assiduidade, streaks e reengaje alunos com risco de abandono."
  },
  slots: {
    title: "Gestao de Tatames e Horarios Ociosos",
    subtitle: "Publique horarios vazios na vitrine de BH com split automatico (88% Academia / 12% App)."
  },
  events: {
    title: "Auloes e Intercambios entre Escolas",
    subtitle: "Organize treinos coletivos abertos para captar novos alunos na regiao."
  },
  help: {
    title: "Guia de Graduacoes e Nivelamento",
    subtitle: "Referencia oficial de graus, faixas e equivalencias (N1 a N4) para validacoes do mestre."
  },
  business: {
    title: "Modelo de Negocio e Projecao",
    subtitle: "Estrutura de receitas B2B/B2C, matriz competitiva e escala de 5 anos."
  }
};

function switchAcademyView(viewName) {
  document.querySelectorAll("#academyShell .view-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === "aview-" + viewName);
  });
  document.querySelectorAll("[data-academy-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-academy-view") === viewName);
  });

  const meta = ACADEMY_VIEW_META[viewName];
  if (meta) {
    document.getElementById("academyTopbarTitle").textContent = meta.title;
    document.getElementById("academyTopbarSubtitle").textContent = meta.subtitle;
  }

  if (viewName === "overview") renderAcademyOverview();
  if (viewName === "validations") renderAcademyValidations();
  if (viewName === "retention") renderAcademyRetention();
  if (viewName === "slots") renderAcademySlots();
  if (viewName === "events") renderAcademyEvents();
  if (viewName === "help") renderHelpGuide("academyHelpMount");
}

function setPlan(plan) {
  appState.plan = plan;
  saveState();
  syncPlanUI();
  renderMatchmaking();
  renderAnalytics();
  showToast(plan === "premium" ? "Plano Premium ativado na simulacao." : "Plano Free ativado na simulacao.");
}

function syncPlanUI() {
  const isPro = appState.plan === "premium";
  document.getElementById("btnPlanFree").classList.toggle("active", !isPro);
  document.getElementById("btnPlanPremium").classList.toggle("active", isPro);
  document.getElementById("sidebarPlanBadge").textContent = isPro ? "PREMIUM" : "FREE";
  document.getElementById("sidebarPlanDesc").textContent = isPro
    ? "Metricas avancadas, rastreio de fadiga e filtros exclusivos liberados."
    : "Alterne para testar recursos Premium (R$ 14,90/mes).";

  const stanceEl = document.getElementById("filterStance");
  const rankEl = document.getElementById("filterRank");
  stanceEl.disabled = !isPro;
  rankEl.disabled = !isPro;
  if (!isPro) {
    stanceEl.value = "all";
    rankEl.value = "0";
  }

  const wrapper = document.getElementById("premiumAnalyticsWrapper");
  const overlay = document.getElementById("premiumLockOverlay");
  wrapper.classList.toggle("premium-locked", !isPro);
  overlay.style.display = isPro ? "none" : "flex";
}

function syncBadges() {
  document.getElementById("headerStreakText").textContent = `${appState.currentUser.streakDays} DIAS STREAK`;
  document.getElementById("navSessionCount").textContent = appState.sessions.length;
  document.getElementById("navBookedCount").textContent = appState.scheduledMatches.length;

  const pendingCount = appState.b2bPendingValidations.filter((v) => v.status === "Pendente").length;
  const churnCount = appState.b2bStudents.filter((s) => s.status === "Risco de Evasao").length;
  document.getElementById("navPendingValB2B").textContent = pendingCount;
  document.getElementById("navChurnCountB2B").textContent = churnCount;
}

/* ==========================================================================
   B2C: MATCHMAKING INTELIGENTE (11 MODALIDADES)
   ========================================================================== */
function updateWeightFilterLabel() {
  const val = document.getElementById("filterWeightDiff").value;
  document.getElementById("weightDiffLabel").textContent = `+/- ${val} kg`;
  renderMatchmaking();
}

function updateIntensityFilterLabel() {
  const val = document.getElementById("filterIntensity").value;
  document.getElementById("intensityFilterLabel").textContent = `${val}%`;
  renderMatchmaking();
}

function resetFilters() {
  document.getElementById("filterModality").value = "all";
  document.getElementById("filterWeightDiff").value = 6;
  document.getElementById("filterIntensity").value = 60;
  document.getElementById("filterStance").value = "all";
  document.getElementById("filterRank").value = "0";
  updateWeightFilterLabel();
  updateIntensityFilterLabel();
}

function computeCompatibility(fighter, targetIntensity) {
  const user = appState.currentUser;
  const weightDelta = Math.abs(fighter.weight - user.weight);
  const rankDelta = Math.abs(fighter.rankLevel - user.rankLevel);
  const intDelta = Math.abs(fighter.preferredIntensity - targetIntensity);

  let score = 100;
  score -= weightDelta * 2.4;
  score -= rankDelta * 7;
  score -= intDelta * 0.45;
  if (fighter.verified) score += 4;
  return Math.max(25, Math.min(99, Math.round(score)));
}

function renderMatchmaking() {
  const mod = document.getElementById("filterModality").value;
  const maxWeightDiff = Number(document.getElementById("filterWeightDiff").value);
  const targetIntensity = Number(document.getElementById("filterIntensity").value);
  const stance = document.getElementById("filterStance").value;
  const minRank = Number(document.getElementById("filterRank").value);
  const userWeight = appState.currentUser.weight;

  const banner = document.getElementById("safetyAlertBanner");
  if (maxWeightDiff > 10) {
    banner.className = "safety-banner warning";
    banner.innerHTML = `
      <div>
        <strong>Alerta de Disparidade Fisica:</strong> tolerancia ampliada para <span class="mono">+/- ${maxWeightDiff} kg</span>. Pareamentos com mais de 10 kg de diferenca elevam o risco de lesao em sparrings intensos.
      </div>
      <span class="badge-pill red">RISCO ELEVADO</span>
    `;
  } else {
    banner.className = "safety-banner";
    banner.innerHTML = `
      <div>
        <strong>Pareamento Seguro Ativo:</strong> diferenca maxima configurada em <span class="mono">+/- ${maxWeightDiff} kg</span> em relacao ao seu peso atual (<span class="mono">${userWeight} kg</span>), prevenindo disparidades criticas de impacto.
      </div>
      <span class="badge-pill green">RISCO CONTROLADO</span>
    `;
  }

  const filtered = appState.fighters
    .map((f) => ({
      ...f,
      weightDelta: Math.abs(f.weight - userWeight),
      compatibility: computeCompatibility(f, targetIntensity)
    }))
    .filter((f) => {
      if (mod !== "all" && f.modality !== mod) return false;
      if (f.weightDelta > maxWeightDiff) return false;
      if (stance !== "all" && f.stance !== stance) return false;
      if (f.rankLevel < minRank) return false;
      return true;
    })
    .sort((a, b) => b.compatibility - a.compatibility);

  document.getElementById("navMatchCount").textContent = filtered.length;
  const grid = document.getElementById("fightersGrid");

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 36px;">
        <div style="font-weight: 700; font-size: 1rem; margin-bottom: 6px;">Nenhum parceiro encontrado com esses filtros</div>
        <div style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 14px;">
          Ajuste a modalidade ou a tolerancia de peso para visualizar outros atletas em Belo Horizonte.
        </div>
        <button class="btn btn-primary btn-sm" onclick="resetFilters()">Redefinir Filtros</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered
    .map((f) => {
      const highRisk = f.weightDelta > 10;
      const intensityTag =
        f.preferredIntensity <= 40
          ? "Tecnico " + f.preferredIntensity + "%"
          : f.preferredIntensity <= 70
          ? "Moderado " + f.preferredIntensity + "%"
          : "Combate " + f.preferredIntensity + "%";

      return `
        <article class="fighter-card">
          <div>
            <div class="fighter-head">
              <div class="fighter-identity">
                <div class="fighter-avatar">${f.initials}</div>
                <div>
                  <div class="fighter-name">${f.name}</div>
                  <div class="fighter-meta">${f.gym} | ${f.neighborhood} (${f.distanceKm} km)</div>
                </div>
              </div>
              <div class="match-score">
                <div class="match-score-val mono">${f.compatibility}%</div>
                <div class="match-score-lbl">Match</div>
              </div>
            </div>

            <div class="tags-row" style="margin-top: 12px;">
              <span class="badge-pill orange">${f.modality}</span>
              <span class="badge-pill">N${f.rankLevel}</span>
              <span class="badge-pill">${f.stance}</span>
              ${f.verified ? '<span class="badge-pill green">Validado Mestre</span>' : '<span class="badge-pill">Aguardando Mestre</span>'}
              ${highRisk ? `<span class="badge-pill red">Delta ${f.weightDelta}kg</span>` : ""}
            </div>

            <div class="specs-row" style="margin-top: 12px;">
              <div>
                <div class="spec-cell-label">Peso / Altura</div>
                <div class="spec-cell-val mono">${f.weight}kg / ${f.height}cm</div>
              </div>
              <div>
                <div class="spec-cell-label">Intensidade</div>
                <div class="spec-cell-val mono" style="color: var(--accent-orange);">${intensityTag}</div>
              </div>
              <div>
                <div class="spec-cell-label">Cartel</div>
                <div class="spec-cell-val mono">${f.roundsLogged} rds</div>
              </div>
            </div>

            <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 10px;">
              ${f.bio}
            </p>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 8px; border-top: 1px solid var(--border-grid);">
            <div style="font-size: 0.72rem; color: var(--text-muted);">
              <strong style="color: var(--text-secondary);">${f.rank}</strong><br />
              Livre: ${f.availability}
            </div>
            <button class="btn btn-primary btn-sm" onclick="openMatchModal('${f.id}')">Solicitar</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function openMatchModal(fighterId) {
  const f = appState.fighters.find((x) => x.id === fighterId);
  if (!f) return;

  document.getElementById("matchFighterId").value = f.id;
  document.getElementById("matchModalTitle").textContent = `Solicitar Sparring com ${f.name}`;
  document.getElementById("matchIntensity").value = f.preferredIntensity;

  const delta = Math.abs(f.weight - appState.currentUser.weight);
  document.getElementById("matchFighterSummary").innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
      <div>
        <div style="font-weight: 700;">${f.name} (${f.modality})</div>
        <div style="font-size: 0.76rem; color: var(--text-secondary);">${f.weight}kg | ${f.height}cm | ${f.stance} | ${f.rank}</div>
      </div>
      <span class="badge-pill ${delta > 10 ? "red" : "green"}">Diferenca: ${delta} kg</span>
    </div>
  `;

  const gymSelect = document.getElementById("matchGymSelect");
  gymSelect.innerHTML = appState.gyms
    .map((g) => `<option value="${g.id}">${g.name} (R$ ${g.hourlyRate}/h)</option>`)
    .join("");

  updateMatchSplitPreview();
  document.getElementById("matchModal").classList.add("open");
}

function updateMatchSplitPreview() {
  const gymId = document.getElementById("matchGymSelect").value;
  const gym = appState.gyms.find((g) => g.id === gymId) || appState.gyms[0];
  const slotSelect = document.getElementById("matchSlotSelect");
  slotSelect.innerHTML = gym.slots.map((s) => `<option value="${s}">${s}</option>`).join("");

  const fee = +(gym.hourlyRate * (gym.takeRatePercent / 100)).toFixed(2);
  const gymNet = +(gym.hourlyRate - fee).toFixed(2);

  document.getElementById("matchSplitBox").innerHTML = `
    <div style="font-weight: 700; margin-bottom: 4px; color: var(--text-primary);">Locacao de Tatame e Split Automatico</div>
    <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
      <span>Total da sessao (${gym.spaceType}):</span>
      <strong class="mono" style="color: #fff;">R$ ${gym.hourlyRate.toFixed(2)}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
      <span>Repasse Academia (${100 - gym.takeRatePercent}%):</span>
      <span class="mono">R$ ${gymNet.toFixed(2)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; color: var(--accent-orange);">
      <span>Taxa SparRing (${gym.takeRatePercent}%):</span>
      <strong class="mono">R$ ${fee.toFixed(2)}</strong>
    </div>
  `;
}

function closeMatchModal() {
  document.getElementById("matchModal").classList.remove("open");
}

function submitMatchBooking(e) {
  e.preventDefault();
  const fighter = appState.fighters.find((x) => x.id === document.getElementById("matchFighterId").value);
  const gym = appState.gyms.find((x) => x.id === document.getElementById("matchGymSelect").value);
  const slot = document.getElementById("matchSlotSelect").value;
  const rounds = Number(document.getElementById("matchRounds").value);
  const intensity = Number(document.getElementById("matchIntensity").value);
  const fee = +(gym.hourlyRate * (gym.takeRatePercent / 100)).toFixed(2);

  appState.scheduledMatches.unshift({
    id: "m_" + Date.now(),
    partnerName: fighter.name,
    modality: fighter.modality,
    gym: gym.name,
    slot,
    rounds,
    intensity,
    totalPrice: gym.hourlyRate,
    platformFee: fee,
    status: "Confirmado"
  });

  saveState();
  syncBadges();
  closeMatchModal();
  showToast(`Sparring agendado com ${fighter.name} em ${gym.name} (${slot}).`);
}

/* ==========================================================================
   B2C: CARTEL DIGITAL & CARD COMPARTILHAVEL
   ========================================================================== */
function renderCartel() {
  const totalRounds = appState.sessions.reduce((acc, s) => acc + s.rounds, 0);
  const totalMinutes = appState.sessions.reduce((acc, s) => acc + s.rounds * (s.roundMinutes || 3), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgIntensity = appState.sessions.length
    ? Math.round(appState.sessions.reduce((acc, s) => acc + s.intensity, 0) / appState.sessions.length)
    : 0;
  const uniquePartners = new Set(appState.sessions.map((s) => s.partnerName)).size;

  document.getElementById("cartelKpis").innerHTML = `
    <div class="card card-accent-left">
      <div class="kpi-label">Streak de Consistencia</div>
      <div class="kpi-value orange mono">${appState.currentUser.streakDays} dias</div>
      <div class="kpi-note">Gamificacao ativa estilo Duolingo</div>
    </div>
    <div class="card">
      <div class="kpi-label">Volume Total</div>
      <div class="kpi-value mono">${totalRounds} rds</div>
      <div class="kpi-note">${totalHours} horas acumuladas no tatame</div>
    </div>
    <div class="card">
      <div class="kpi-label">Intensidade Media</div>
      <div class="kpi-value mono">${avgIntensity}%</div>
      <div class="kpi-note">Baseado em ${appState.sessions.length} sessoes registradas</div>
    </div>
    <div class="card">
      <div class="kpi-label">Parceiros Diferentes</div>
      <div class="kpi-value mono">${uniquePartners}</div>
      <div class="kpi-note">Intercambio tecnico contra estagnacao</div>
    </div>
  `;

  if (!selectedSessionId && appState.sessions.length > 0) {
    selectedSessionId = appState.sessions[0].id;
  }

  document.getElementById("sessionsTableBody").innerHTML = appState.sessions
    .map((s) => {
      const isSelected = s.id === selectedSessionId;
      return `
        <tr style="${isSelected ? "background: rgba(255, 85, 0, 0.08);" : ""}">
          <td class="mono" style="color: var(--text-secondary); white-space: nowrap;">${s.date}</td>
          <td>
            <div style="font-weight: 700;">${s.partnerName} <span class="badge-pill" style="margin-left: 4px;">${s.modality}</span></div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">
              ${s.partnerWeight}kg | ${s.partnerHeight}cm | ${s.partnerAge}a | ${s.partnerRank} (${s.partnerStance})
            </div>
          </td>
          <td class="mono" style="font-weight: 700;">${s.rounds} x ${s.roundMinutes || 3}m</td>
          <td><span class="badge-pill ${s.intensity >= 80 ? "red" : "orange"} mono">${s.intensity}%</span></td>
          <td>
            <button class="btn btn-sm ${isSelected ? "btn-primary" : ""}" onclick="selectSessionForCard('${s.id}')">
              ${isSelected ? "Ativo" : "Gerar Card"}
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  renderStoryCardPreview();
}

function selectSessionForCard(sessionId) {
  selectedSessionId = sessionId;
  renderCartel();
}

function renderStoryCardPreview() {
  const s = appState.sessions.find((x) => x.id === selectedSessionId) || appState.sessions[0];
  const el = document.getElementById("storyPreviewCard");
  if (!s) {
    el.innerHTML = `<div style="color: var(--text-muted); font-size: 0.84rem;">Registre um sparring para gerar seu card.</div>`;
    return;
  }

  const totalMin = s.rounds * (s.roundMinutes || 3);
  el.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
      <div>
        <div style="font-size: 1.25rem; font-weight: 900; letter-spacing: -0.02em;">SparRing</div>
        <div style="width: 32px; height: 3px; background: var(--accent-orange); margin-top: 4px;"></div>
      </div>
      <span class="badge-pill orange mono">${s.date}</span>
    </div>

    <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent-orange); font-weight: 700;">
      SESSAO DE SPARRING VERIFICADA | ${s.modality.toUpperCase()}
    </div>
    <div style="font-size: 1.35rem; font-weight: 800; margin-top: 4px;">${appState.currentUser.name}</div>
    <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 18px;">
      vs ${s.partnerName} (${s.partnerWeight}kg, ${s.partnerRank})
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px;">
      <div style="border: 1px solid var(--border-grid); padding: 10px; background: #141414;">
        <div style="font-size: 0.62rem; text-transform: uppercase; color: var(--text-muted);">Rounds</div>
        <div class="mono" style="font-size: 1.3rem; font-weight: 800; color: var(--accent-orange);">${s.rounds}</div>
      </div>
      <div style="border: 1px solid var(--border-grid); padding: 10px; background: #141414;">
        <div style="font-size: 0.62rem; text-transform: uppercase; color: var(--text-muted);">Tempo</div>
        <div class="mono" style="font-size: 1.3rem; font-weight: 800;">${totalMin}m</div>
      </div>
      <div style="border: 1px solid var(--border-grid); padding: 10px; background: #141414;">
        <div style="font-size: 0.62rem; text-transform: uppercase; color: var(--text-muted);">Intensidade</div>
        <div class="mono" style="font-size: 1.3rem; font-weight: 800;">${s.intensity}%</div>
      </div>
    </div>

    <div style="border-top: 1px solid var(--border-grid); padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem;">
      <span style="color: var(--text-secondary);">${s.gym || appState.currentUser.gym}</span>
      <span class="mono" style="color: var(--accent-orange); font-weight: 700;">STREAK: ${appState.currentUser.streakDays} DIAS</span>
    </div>
  `;
}

function downloadStoryCard() {
  const s = appState.sessions.find((x) => x.id === selectedSessionId) || appState.sessions[0];
  if (!s) return;

  const canvas = document.getElementById("storyExportCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#222222";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 90) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 90) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.fillStyle = "#ff5500";
  ctx.fillRect(0, 0, W, 14);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 68px Inter, Arial, sans-serif";
  ctx.fillText("SparRing", 80, 150);
  ctx.fillStyle = "#ff5500";
  ctx.fillRect(80, 174, 120, 10);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = "600 26px JetBrains Mono, monospace";
  ctx.fillText(s.date + " | " + (s.gym || appState.currentUser.gym).toUpperCase(), 80, 235);

  ctx.fillStyle = "#ff5500";
  ctx.font = "700 28px Inter, Arial, sans-serif";
  ctx.fillText("CARTEL DIGITAL VERIFICADO | " + s.modality.toUpperCase(), 80, 360);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 64px Inter, Arial, sans-serif";
  ctx.fillText(appState.currentUser.name, 80, 440);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = "500 32px Inter, Arial, sans-serif";
  ctx.fillText(`Oponente: ${s.partnerName} (${s.partnerWeight}kg, ${s.partnerRank})`, 80, 500);

  const stats = [
    { label: "ROUNDS", value: String(s.rounds), color: "#ff5500" },
    { label: "DURACAO", value: `${s.rounds * (s.roundMinutes || 3)} MIN`, color: "#ffffff" },
    { label: "INTENSIDADE", value: `${s.intensity}%`, color: "#ffffff" }
  ];

  stats.forEach((st, idx) => {
    const bx = 80 + idx * 315;
    const by = 600;
    ctx.fillStyle = "#171717";
    ctx.fillRect(bx, by, 290, 220);
    ctx.strokeStyle = idx === 0 ? "#ff5500" : "#333333";
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, 290, 220);

    ctx.fillStyle = "#8c8c8c";
    ctx.font = "700 24px Inter, Arial, sans-serif";
    ctx.fillText(st.label, bx + 28, by + 62);

    ctx.fillStyle = st.color;
    ctx.font = "800 60px JetBrains Mono, monospace";
    ctx.fillText(st.value, bx + 28, by + 160);
  });

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 28px Inter, Arial, sans-serif";
  ctx.fillText("DISTRIBUICAO TECNICA DA SESSAO", 80, 930);

  const focus = s.focus || { boxe: 40, chutes: 40, clinch: 20 };
  const barY = 965;
  const barW = 920;
  const wBoxe = (focus.boxe / 100) * barW;
  const wChutes = (focus.chutes / 100) * barW;
  const wClinch = barW - wBoxe - wChutes;

  ctx.fillStyle = "#ff5500";
  ctx.fillRect(80, barY, wBoxe, 34);
  ctx.fillStyle = "#e5e5e5";
  ctx.fillRect(80 + wBoxe, barY, wChutes, 34);
  ctx.fillStyle = "#525252";
  ctx.fillRect(80 + wBoxe + wChutes, barY, wClinch, 34);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = "600 26px JetBrains Mono, monospace";
  ctx.fillText(`BOXE ${focus.boxe}%   |   CHUTES ${focus.chutes}%   |   CLINCH ${focus.clinch}%`, 80, 1045);

  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(80, 1170); ctx.lineTo(W - 80, 1170); ctx.stroke();

  ctx.fillStyle = "#ff5500";
  ctx.font = "700 32px Inter, Arial, sans-serif";
  ctx.fillText("ONDE CADA ROUND CONTA.", 80, 1245);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 28px JetBrains Mono, monospace";
  ctx.fillText(`STREAK: ${appState.currentUser.streakDays} DIAS`, 690, 1245);

  const link = document.createElement("a");
  link.download = `sparring-card-${s.date}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("Card PNG exportado com sucesso.");
}

function openLogModal() {
  document.getElementById("logModal").classList.add("open");
}

function closeLogModal() {
  document.getElementById("logModal").classList.remove("open");
}

function submitNewSession(e) {
  e.preventDefault();
  const [rankLabel, rankLevelStr] = document.getElementById("logRank").value.split("|");
  const boxe = Number(document.getElementById("logBoxe").value);
  const chutes = Number(document.getElementById("logChutes").value);
  const clinch = Number(document.getElementById("logClinch").value);
  const totalFocus = boxe + chutes + clinch || 100;

  const newSession = {
    id: "s_" + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    modality: document.getElementById("logModality").value,
    partnerName: document.getElementById("logPartnerName").value.trim(),
    partnerWeight: Number(document.getElementById("logWeight").value),
    partnerHeight: Number(document.getElementById("logHeight").value),
    partnerAge: Number(document.getElementById("logAge").value),
    partnerRank: rankLabel,
    partnerRankLevel: Number(rankLevelStr),
    partnerStance: document.getElementById("logStance").value,
    gym: appState.currentUser.gym,
    rounds: Number(document.getElementById("logRounds").value),
    roundMinutes: 3,
    intensity: Number(document.getElementById("logIntensity").value),
    fatigue: Number(document.getElementById("logFatigue").value),
    focus: {
      boxe: Math.round((boxe / totalFocus) * 100),
      chutes: Math.round((chutes / totalFocus) * 100),
      clinch: Math.max(0, 100 - Math.round((boxe / totalFocus) * 100) - Math.round((chutes / totalFocus) * 100))
    }
  };

  appState.sessions.unshift(newSession);
  appState.currentUser.streakDays += 1;
  selectedSessionId = newSession.id;
  saveState();
  syncBadges();
  closeLogModal();
  document.getElementById("logForm").reset();
  switchFighterView("cartel");
  showToast("Sparring registrado no seu Cartel Digital.");
}

/* ==========================================================================
   B2C: ANALISES PREMIUM
   ========================================================================== */
function renderAnalytics() {
  const sessions = appState.sessions;
  const userWeight = appState.currentUser.weight;
  if (!sessions.length) return;

  const total = sessions.length;
  const vsAdvanced = Math.round((sessions.filter((s) => s.partnerRankLevel >= 3).length / total) * 100);
  const vsHeavier = Math.round((sessions.filter((s) => s.partnerWeight >= userWeight + 5).length / total) * 100);
  const vsSouthpaw = Math.round((sessions.filter((s) => s.partnerStance === "Canhoto").length / total) * 100);

  document.getElementById("opponentInsightsBody").innerHTML = `
    <div style="font-size: 0.9rem; margin-bottom: 14px; color: var(--text-primary);">
      <strong style="color: var(--accent-orange);">${vsAdvanced}%</strong> dos seus sparrings foram contra atletas avancados ou faixas graduadas, e <strong style="color: var(--accent-orange);">${vsHeavier}%</strong> contra parceiros 5kg+ mais pesados.
    </div>
    <div style="display: grid; gap: 12px; font-size: 0.8rem;">
      <div>
        <div style="display: flex; justify-content: space-between;"><span>Contra Nivel N3 Avancado / N4 Pro</span><span class="mono">${vsAdvanced}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width: ${vsAdvanced}%;"></div></div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between;"><span>Contra Oponentes +5kg Pesados</span><span class="mono">${vsHeavier}%</span></div>
        <div class="bar-track"><div class="bar-fill red" style="width: ${vsHeavier}%;"></div></div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between;"><span>Contra Base Canhota (Southpaw)</span><span class="mono">${vsSouthpaw}%</span></div>
        <div class="bar-track"><div class="bar-fill white" style="width: ${vsSouthpaw}%;"></div></div>
      </div>
    </div>
  `;

  const avgBoxe = Math.round(sessions.reduce((a, s) => a + (s.focus ? s.focus.boxe : 40), 0) / total);
  const avgChutes = Math.round(sessions.reduce((a, s) => a + (s.focus ? s.focus.chutes : 40), 0) / total);
  const avgClinch = Math.max(0, 100 - avgBoxe - avgChutes);

  document.getElementById("techDistributionBody").innerHTML = `
    <div style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 14px;">
      Porcentagem media do tempo efetivo de sparring distribuida por fundamento tecnico:
    </div>
    <div style="display: grid; gap: 12px; font-size: 0.8rem;">
      <div>
        <div style="display: flex; justify-content: space-between;"><span>Boxe e Maos</span><span class="mono" style="color: var(--accent-orange);">${avgBoxe}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width: ${avgBoxe}%;"></div></div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between;"><span>Chutes e Joelhos</span><span class="mono">${avgChutes}%</span></div>
        <div class="bar-track"><div class="bar-fill white" style="width: ${avgChutes}%;"></div></div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between;"><span>Clinch, Quedas e Chao</span><span class="mono">${avgClinch}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width: ${avgClinch}%; background: #666666;"></div></div>
      </div>
    </div>
  `;

  const recent = sessions.slice(0, 6).reverse();
  const avgRecentLoad =
    recent.reduce((acc, s) => acc + (s.intensity * 0.6 + s.fatigue * 4), 0) / recent.length;
  const badge = document.getElementById("overtrainingStatusBadge");
  if (avgRecentLoad >= 75) {
    badge.className = "badge-pill red";
    badge.textContent = "ALERTA DE OVERTRAINING";
  } else {
    badge.className = "badge-pill green";
    badge.textContent = "CARGA EQUILIBRADA";
  }

  const width = 760;
  const height = 220;
  const padX = 48;
  const padY = 26;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const stepX = recent.length > 1 ? innerW / (recent.length - 1) : innerW / 2;

  const intPoints = recent
    .map((s, i) => `${padX + i * stepX},${padY + innerH - (s.intensity / 100) * innerH}`)
    .join(" ");
  const fatPoints = recent
    .map((s, i) => `${padX + i * stepX},${padY + innerH - ((s.fatigue * 10) / 100) * innerH}`)
    .join(" ");

  const dangerY = padY + innerH * 0.2;

  const dotsHtml = recent
    .map((s, i) => {
      const cx = padX + i * stepX;
      const cyInt = padY + innerH - (s.intensity / 100) * innerH;
      const cyFat = padY + innerH - ((s.fatigue * 10) / 100) * innerH;
      return `
        <circle cx="${cx}" cy="${cyInt}" r="5" fill="#ff5500" />
        <circle cx="${cx}" cy="${cyFat}" r="4.5" fill="#ffffff" />
        <text x="${cx}" y="${height - 4}" fill="#8c8c8c" font-size="11" text-anchor="middle" font-family="JetBrains Mono, monospace">${s.date.slice(5)}</text>
      `;
    })
    .join("");

  document.getElementById("fatigueChartContainer").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; min-width: 500px; height: auto;">
      <rect x="${padX}" y="${padY}" width="${innerW}" height="${dangerY - padY}" fill="rgba(217, 30, 42, 0.12)" />
      <line x1="${padX}" y1="${dangerY}" x2="${width - padX}" y2="${dangerY}" stroke="#d91e2a" stroke-dasharray="4 4" />
      <text x="${width - padX - 4}" y="${dangerY - 6}" fill="#ff5c66" font-size="10" text-anchor="end" font-family="JetBrains Mono, monospace">ZONA OVERTRAINING (80%+)</text>

      <line x1="${padX}" y1="${padY + innerH}" x2="${width - padX}" y2="${padY + innerH}" stroke="#333333" />
      <polyline fill="none" stroke="#ff5500" stroke-width="3" points="${intPoints}" />
      <polyline fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="5 3" points="${fatPoints}" />
      ${dotsHtml}
    </svg>
    <div style="display: flex; gap: 18px; font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px;">
      <span><strong style="color: var(--accent-orange);">Linha Laranja:</strong> Intensidade (%)</span>
      <span><strong style="color: #ffffff;">Linha Branca Tracejada:</strong> Desgaste Fisico (Escala 10-100)</span>
    </div>
  `;
}

/* ==========================================================================
   B2C: TATAMES E AULOES
   ========================================================================== */
function renderTatames() {
  document.getElementById("gymsList").innerHTML = appState.gyms
    .map((g) => {
      const fee = +(g.hourlyRate * (g.takeRatePercent / 100)).toFixed(2);
      const net = +(g.hourlyRate - fee).toFixed(2);
      return `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
            <div>
              <div style="font-size: 1rem; font-weight: 800;">${g.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-secondary);">${g.neighborhood} | ${g.spaceType}</div>
            </div>
            <div style="text-align: right;">
              <div class="mono" style="font-size: 1.15rem; font-weight: 800; color: var(--accent-orange);">R$ ${g.hourlyRate},00/h</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">Split: R$ ${net.toFixed(2)} Academia | R$ ${fee.toFixed(2)} App</div>
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px;">
            ${g.slots
              .map(
                (slot) =>
                  `<button class="btn btn-sm" onclick="quickBookMat('${g.id}', '${slot}')">Reservar ${slot}</button>`
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");

  document.getElementById("scheduledBadgeCount").textContent = `${appState.scheduledMatches.length} ATIVO(S)`;
  const listEl = document.getElementById("scheduledMatchesList");

  if (!appState.scheduledMatches.length) {
    listEl.innerHTML = `<div class="card" style="color: var(--text-muted); font-size: 0.84rem;">Nenhum sparring agendado no momento.</div>`;
  } else {
    listEl.innerHTML = appState.scheduledMatches
      .map(
        (m) => `
        <div class="card card-accent-left">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="font-size: 0.92rem;">${m.partnerName}</strong>
            <span class="badge-pill green">${m.status}</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">
            ${m.modality} | ${m.gym} | <strong>${m.slot}</strong>
          </div>
          <div class="mono" style="font-size: 0.74rem; color: var(--text-muted); margin-top: 8px;">
            ${m.rounds} rounds | Intensidade ${m.intensity}% | Locacao R$ ${m.totalPrice.toFixed(2)} (Taxa app R$ ${m.platformFee.toFixed(2)})
          </div>
        </div>
      `
      )
      .join("");
  }

  document.getElementById("fighterEventsList").innerHTML = (appState.academyEvents || [])
    .map(
      (ev) => `
      <div style="border: 1px solid var(--border-grid); padding: 14px; background: var(--bg-main); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <span class="badge-pill orange">${ev.modality}</span>
            <span class="mono" style="font-size: 0.72rem; color: var(--text-muted);">${ev.enrolled}/${ev.spots} inscritos</span>
          </div>
          <div style="font-weight: 800; font-size: 0.92rem; margin-top: 8px;">${ev.title}</div>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 2px;">${ev.gym} | ${ev.date}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="enrollInEvent('${ev.id}')">Garantir Vaga</button>
      </div>
    `
    )
    .join("");
}

function quickBookMat(gymId, slot) {
  const gym = appState.gyms.find((g) => g.id === gymId);
  if (!gym) return;
  const fee = +(gym.hourlyRate * (gym.takeRatePercent / 100)).toFixed(2);
  appState.scheduledMatches.unshift({
    id: "m_" + Date.now(),
    partnerName: "Reserva Avulsa de Tatame",
    modality: appState.currentUser.modality,
    gym: gym.name,
    slot,
    rounds: 8,
    intensity: 50,
    totalPrice: gym.hourlyRate,
    platformFee: fee,
    status: "Confirmado"
  });
  saveState();
  syncBadges();
  renderTatames();
  showToast(`Tatame reservado em ${gym.name} para ${slot}.`);
}

function enrollInEvent(eventId) {
  const ev = (appState.academyEvents || []).find((x) => x.id === eventId);
  if (!ev) return;
  if (ev.enrolled < ev.spots) {
    ev.enrolled += 1;
    saveState();
    renderTatames();
    showToast(`Vaga confirmada em: ${ev.title}.`);
  } else {
    showToast("Vagas esgotadas para este aulao.");
  }
}

/* ==========================================================================
   B2B PORTAL: VISAO GERAL, VALIDACOES, RETENCAO, TATAMES E AULOES
   ========================================================================== */
function getManagedGym() {
  const targetName = appState.academyAccount.gymName;
  let gym = appState.gyms.find((g) => g.name.toLowerCase() === targetName.toLowerCase());
  if (!gym) {
    gym = appState.gyms[1] || appState.gyms[0];
    gym.name = targetName;
  }
  return gym;
}

function renderAcademyOverview() {
  const pending = appState.b2bPendingValidations.filter((v) => v.status === "Pendente");
  const churnRisk = appState.b2bStudents.filter((s) => s.status === "Risco de Evasao");
  const rentalNet = appState.scheduledMatches.reduce((acc, m) => acc + (m.totalPrice - m.platformFee), 475.2);

  document.getElementById("b2bPendingCount").textContent = pending.length;
  document.getElementById("b2bRentalNet").textContent = `R$ ${rentalNet.toFixed(2).replace(".", ",")}`;

  const alertsEl = document.getElementById("b2bOverviewAlerts");
  const items = [];
  if (pending.length > 0) {
    items.push(`
      <div style="border-left: 3px solid var(--accent-orange); padding: 10px 12px; background: var(--bg-main); font-size: 0.8rem;">
        <strong>${pending.length} aluno(s) aguardando validacao de peso e graduacao.</strong><br />
        <span style="color: var(--text-secondary);">Aprove na aba Validar Alunos para liberar o selo verificado no matchmaking.</span>
      </div>
    `);
  }
  if (churnRisk.length > 0) {
    items.push(`
      <div style="border-left: 3px solid var(--accent-red); padding: 10px 12px; background: var(--bg-main); font-size: 0.8rem;">
        <strong>${churnRisk.length} aluno(s) com risco de evasao (mais de 14 dias sem treinar).</strong><br />
        <span style="color: var(--text-secondary);">${churnRisk.map((c) => c.name).join(", ")}.</span>
      </div>
    `);
  }
  if (!items.length) {
    items.push(`<div style="color: var(--text-secondary); font-size: 0.82rem;">Nenhum alerta pendente. Operacao da academia em dia.</div>`);
  }
  alertsEl.innerHTML = items.join("");

  const bookingsEl = document.getElementById("b2bOverviewBookings");
  bookingsEl.innerHTML = appState.scheduledMatches
    .slice(0, 4)
    .map(
      (m) => `
      <div style="border: 1px solid var(--border-grid); padding: 10px 12px; background: var(--bg-main); font-size: 0.78rem; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
        <div>
          <div style="font-weight: 700;">${m.partnerName} (${m.modality})</div>
          <div style="color: var(--text-secondary);">${m.gym} | ${m.slot}</div>
        </div>
        <span class="mono" style="color: var(--accent-orange); font-weight: 700;">+R$ ${(m.totalPrice - m.platformFee).toFixed(2)}</span>
      </div>
    `
    )
    .join("");
}

function renderAcademyValidations() {
  const valList = document.getElementById("b2bValidationsList");
  valList.innerHTML = appState.b2bPendingValidations
    .map((v) => {
      const isPending = v.status === "Pendente";
      return `
        <div style="border: 1px solid var(--border-grid); padding: 14px; background: var(--bg-main); display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">${v.studentName} <span class="badge-pill orange" style="margin-left: 6px;">${v.modality}</span></div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">Peso declarado: <span class="mono">${v.declaredWeight}kg</span> | Graduacao: ${v.declaredRank}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Solicitado: ${v.requestedAt}</div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${
              isPending
                ? `
                  <button class="btn btn-primary btn-sm" onclick="handleValidation('${v.id}', 'Validado')">Validar Selo</button>
                  <button class="btn btn-danger btn-sm" onclick="handleValidation('${v.id}', 'Ajustar')">Recusar</button>
                `
                : `<span class="badge-pill ${v.status === "Validado" ? "green" : "red"}">${v.status}</span>`
            }
          </div>
        </div>
      `;
    })
    .join("");
}

function handleValidation(valId, decision) {
  const item = appState.b2bPendingValidations.find((v) => v.id === valId);
  if (!item) return;
  item.status = decision;

  if (decision === "Validado") {
    const fighter = appState.fighters.find((f) => f.name === item.studentName);
    if (fighter) fighter.verified = true;
  }

  saveState();
  syncBadges();
  renderAcademyValidations();
  showToast(`Validacao de ${item.studentName}: ${decision}.`);
}

function setRetentionFilter(mode) {
  retentionFilter = mode;
  renderAcademyRetention();
}

function renderAcademyRetention() {
  document.getElementById("churnFilterAll").className =
    retentionFilter === "all" ? "btn btn-primary btn-sm" : "btn btn-sm";
  document.getElementById("churnFilterRisk").className =
    retentionFilter === "risk" ? "btn btn-primary btn-sm" : "btn btn-sm";

  const list =
    retentionFilter === "risk"
      ? appState.b2bStudents.filter((s) => s.status === "Risco de Evasao")
      : appState.b2bStudents;

  document.getElementById("b2bStudentsTableBody").innerHTML = list
    .map(
      (st) => `
      <tr>
        <td>
          <div style="font-weight: 700;">${st.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${st.modality} | Ultimo treino ha ${st.lastSeenDays} dias</div>
        </td>
        <td class="mono" style="font-weight: 700;">${st.roundsMonth}</td>
        <td class="mono">${st.streak} dias</td>
        <td><span class="badge-pill ${st.status === "Ativo" ? "green" : "red"}">${st.status}</span></td>
        <td>
          ${
            st.status === "Risco de Evasao"
              ? `<button class="btn btn-primary btn-sm" onclick="sendRetentionNudge('${st.name}')">Convidar para Treino</button>`
              : `<span style="font-size: 0.74rem; color: var(--text-muted);">Engajado</span>`
          }
        </td>
      </tr>
    `
    )
    .join("");
}

function sendRetentionNudge(studentName) {
  showToast(`Notificacao de convite para sparring enviada para ${studentName}.`);
}

function renderAcademySlots() {
  const gym = getManagedGym();
  const fee = +(gym.hourlyRate * (gym.takeRatePercent / 100)).toFixed(2);
  const net = +(gym.hourlyRate - fee).toFixed(2);

  document.getElementById("b2bSlotsList").innerHTML = gym.slots
    .map(
      (slot, idx) => `
      <div style="border: 1px solid var(--border-grid); padding: 12px 14px; background: var(--bg-main); display: flex; justify-content: space-between; align-items: center; gap: 10px;">
        <div>
          <div style="font-weight: 700; font-size: 0.88rem;">${slot}</div>
          <div style="font-size: 0.74rem; color: var(--text-secondary);">
            ${gym.spaceType} | Valor R$ ${gym.hourlyRate},00/h (Liquido academia: <span class="mono" style="color: var(--accent-orange);">R$ ${net.toFixed(2)}</span>)
          </div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeGymSlot(${idx})">Remover</button>
      </div>
    `
    )
    .join("");
}

function submitNewGymSlot(e) {
  e.preventDefault();
  const gym = getManagedGym();
  const slotLabel = document.getElementById("newSlotLabel").value.trim();
  const price = Number(document.getElementById("newSlotPrice").value);
  if (!slotLabel) return;

  gym.slots.push(slotLabel);
  gym.hourlyRate = price;
  saveState();
  document.getElementById("addSlotForm").reset();
  document.getElementById("newSlotPrice").value = price;
  renderAcademySlots();
  showToast(`Horario ${slotLabel} publicado na vitrine B2C por R$ ${price},00/h.`);
}

function removeGymSlot(idx) {
  const gym = getManagedGym();
  gym.slots.splice(idx, 1);
  saveState();
  renderAcademySlots();
  showToast("Horario removido da vitrine.");
}

function renderAcademyEvents() {
  document.getElementById("b2bEventsList").innerHTML = (appState.academyEvents || [])
    .map(
      (ev) => `
      <div style="border: 1px solid var(--border-grid); padding: 14px; background: var(--bg-main); display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
        <div>
          <div style="font-weight: 700; font-size: 0.9rem;">${ev.title}</div>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 2px;">${ev.gym} | ${ev.modality} | ${ev.date}</div>
        </div>
        <span class="badge-pill orange mono">${ev.enrolled} / ${ev.spots} VAGAS</span>
      </div>
    `
    )
    .join("");
}

function submitNewAcademyEvent(e) {
  e.preventDefault();
  const title = document.getElementById("eventTitle").value.trim();
  const modality = document.getElementById("eventModality").value;
  const date = document.getElementById("eventDate").value.trim();
  const spots = Number(document.getElementById("eventSpots").value);

  appState.academyEvents = appState.academyEvents || [];
  appState.academyEvents.unshift({
    id: "ev_" + Date.now(),
    title,
    gym: appState.academyAccount.gymName,
    modality,
    date,
    spots,
    enrolled: 1
  });

  saveState();
  document.getElementById("addEventForm").reset();
  renderAcademyEvents();
  showToast(`Aulao "${title}" publicado para os lutadores de BH.`);
}

/* ==========================================================================
   AJUDA E GUIA DE GRADUACOES (COMPARTILHADO ENTRE OS DOIS PORTAIS)
   ========================================================================== */
function renderHelpGuide(mountId) {
  const target = document.getElementById(mountId);
  if (!target) return;

  const guide = window.SPARRING_GRADUATION_GUIDE;
  const keys = Object.keys(guide);
  if (!guide[selectedHelpModality]) selectedHelpModality = keys[0];
  const current = guide[selectedHelpModality];

  const tabsHtml = keys
    .map(
      (k) =>
        `<button class="help-tab-btn ${k === selectedHelpModality ? "active" : ""}" onclick="selectHelpModality('${k}', '${mountId}')">${k}</button>`
    )
    .join("");

  const rowsHtml = current.ranks
    .map((r) => {
      const tipHtml = r.tip ? `<span class="belt-tip" style="background: ${r.tip};"></span>` : "";
      return `
        <div class="belt-row">
          <div class="belt-swatch" style="background: ${r.color};">${tipHtml}</div>
          <div>
            <div style="font-weight: 700; font-size: 0.86rem;">${r.name}</div>
            <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 2px;">${r.note}</div>
          </div>
          <span class="badge-pill orange mono">${r.level}</span>
        </div>
      `;
    })
    .join("");

  target.innerHTML = `
    <div class="card card-accent-left" style="margin-bottom: 20px;">
      <div class="section-heading" style="margin-bottom: 8px;">Como funciona o Nivelamento Universal do SparRing (N1 a N4)</div>
      <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 14px;">
        Como cada arte marcial possui seu proprio sistema de faixas, cordas ou kruangs (e modalidades como Boxe, MMA, Wrestling e Sambo nao usam faixas coloridas), o SparRing adota os padroes oficiais de cada confederacao e traduz todos os atletas para 4 niveis equivalentes de seguranca no pareamento:
      </p>
      <div class="kpi-grid" style="margin-bottom: 0;">
        <div style="border: 1px solid var(--border-grid); padding: 12px; background: var(--bg-main);">
          <div class="mono" style="color: var(--accent-orange); font-weight: 800; font-size: 0.85rem;">N1 INICIANTE</div>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 4px;">Sparring educativo 30% a 40%. Foco em controle, postura e seguranca sem impacto forte.</div>
        </div>
        <div style="border: 1px solid var(--border-grid); padding: 12px; background: var(--bg-main);">
          <div class="mono" style="color: var(--accent-orange); font-weight: 800; font-size: 0.85rem;">N2 INTERMEDIARIO</div>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 4px;">Sparring tecnico 40% a 60%. Dominio de defesa, combinacoes e leitura de distancia.</div>
        </div>
        <div style="border: 1px solid var(--border-grid); padding: 12px; background: var(--bg-main);">
          <div class="mono" style="color: var(--accent-orange); font-weight: 800; font-size: 0.85rem;">N3 AVANCADO</div>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 4px;">Ritmo competitivo 65% a 85%. Atletas graduados, amadores de campeonato e sparrings intensos.</div>
        </div>
        <div style="border: 1px solid var(--border-grid); padding: 12px; background: var(--bg-main);">
          <div class="mono" style="color: var(--accent-orange); font-weight: 800; font-size: 0.85rem;">N4 MESTRE / PRO</div>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 4px;">Faixas pretas, Kruangs pretos, atletas profissionais e mestres habilitados a validar alunos.</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 20px;">
      <div class="section-header">
        <div class="section-heading">Guia de Graduacoes por Modalidade</div>
        <span class="badge-pill orange">SELECIONE A MODALIDADE</span>
      </div>
      <div class="help-tabs">${tabsHtml}</div>
      <div style="border-top: 1px solid var(--border-grid); padding-top: 16px;">
        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-orange); font-weight: 700;">
          ${current.federation}
        </div>
        <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 8px 0 16px 0;">
          ${current.overview}
        </p>
        <div style="display: grid; gap: 8px;">
          ${rowsHtml}
        </div>
      </div>
    </div>

    <div class="equal-two-col">
      <div class="card">
        <div class="section-heading" style="margin-bottom: 10px;">Escala de Intensidade Combinada</div>
        <div style="display: grid; gap: 10px; font-size: 0.8rem;">
          <div style="border-left: 3px solid #22c55e; padding-left: 12px;">
            <strong>30% a 40% (Tecnico / Educativo):</strong> foco total em timing, movimentacao, esquiva e toque leve.
          </div>
          <div style="border-left: 3px solid var(--accent-orange); padding-left: 12px;">
            <strong>50% a 70% (Moderado / Condicional):</strong> ritmo constante, pressao controlada no corpo e pernas, com potencia reduzida na cabeca.
          </div>
          <div style="border-left: 3px solid var(--accent-red); padding-left: 12px;">
            <strong>80% a 90% (Simulacao de Combate):</strong> preparacao para competicao. Exige equipamento completo e validacao de peso.
          </div>
        </div>
      </div>

      <div class="card">
        <div class="section-heading" style="margin-bottom: 10px;">Regra de Seguranca de Peso e Validacao</div>
        <div style="display: grid; gap: 10px; font-size: 0.8rem; color: var(--text-secondary);">
          <p>
            <strong style="color: var(--text-primary);">Tolerancia recomendada (ate 6 kg a 8 kg):</strong> mantem equilibrio real de inercia e forca de impacto, evitando o cenario classico de risco (70 kg contra 100 kg).
          </p>
          <p>
            <strong style="color: var(--text-primary);">Selo Validado pelo Mestre:</strong> atletas com o selo verde tiveram seu peso e graduacao confirmados por uma academia parceira no Portal B2B.
          </p>
        </div>
      </div>
    </div>
  `;
}

function selectHelpModality(modKey, mountId) {
  selectedHelpModality = modKey;
  renderHelpGuide(mountId);
}

/* ==========================================================================
   INIT
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  populateModalitySelects();
  selectLoginRole(appState.userRole || "fighter");
  if (appState.isAuthenticated) {
    if (appState.userRole === "academy") {
      openAcademyPortal("overview");
    } else {
      openFighterPortal("matchmaking");
    }
  }
});
