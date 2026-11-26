import 'package:flutter/material.dart';
import '../data/sparring_store.dart';
import '../models/sparring_models.dart';
import '../theme/sparring_theme.dart';
import '../widgets/help_guide_view.dart';

class FighterShell extends StatefulWidget {
  final SparRingStore store;

  const FighterShell({super.key, required this.store});

  @override
  State<FighterShell> createState() => _FighterShellState();
}

class _FighterShellState extends State<FighterShell> {
  int _tabIndex = 0;

  // Matchmaking filters
  String _filterModality = 'Todas';
  double _maxWeightDiff = 6;
  double _targetIntensity = 60;
  String _filterStance = 'Todas';
  int _minRankLevel = 0;

  void _snack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg, style: const TextStyle(color: Colors.white)),
        backgroundColor: SparRingColors.bgElevated,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.store;
    final u = store.currentUser;

    final pages = [
      _buildMatchmakingTab(),
      _buildCartelTab(),
      _buildAnalyticsTab(),
      _buildTatamesTab(),
      const HelpGuideView(),
    ];

    final titles = [
      'MATCHMAKING',
      'CARTEL DIGITAL',
      'INSIGHTS E FADIGA',
      'TATAMES E AULOES',
      'AJUDA E GRAUS',
    ];

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(titles[_tabIndex]),
            Text(
              '${u.name} | ${u.weight}kg | ${u.category} | ${u.stance}',
              style: const TextStyle(fontSize: 11, color: SparRingColors.textSecondary, fontWeight: FontWeight.w500),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: SparRingColors.borderGrid),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.symmetric(vertical: 10),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: SparRingColors.accentOrange.withAlpha(30),
              border: Border.all(color: SparRingColors.accentOrange),
            ),
            child: Row(
              children: [
                const Icon(Icons.local_fire_department, size: 14, color: SparRingColors.accentOrange),
                const SizedBox(width: 4),
                Text(
                  '${u.streakDays}D',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white),
                ),
              ],
            ),
          ),
          IconButton(
            tooltip: 'Trocar plano Free/Premium',
            onPressed: () {
              store.setPremium(!store.isPremium);
              _snack(store.isPremium ? 'Plano Premium ativado na simulacao.' : 'Plano Free ativado.');
            },
            icon: Icon(
              store.isPremium ? Icons.workspace_premium : Icons.workspace_premium_outlined,
              color: store.isPremium ? SparRingColors.accentOrange : SparRingColors.textSecondary,
            ),
          ),
          IconButton(
            tooltip: 'Trocar Perfil / Sair',
            onPressed: store.logout,
            icon: const Icon(Icons.logout, size: 20, color: SparRingColors.textSecondary),
          ),
        ],
      ),
      body: pages[_tabIndex],
      floatingActionButton: _tabIndex == 1
          ? FloatingActionButton.extended(
              backgroundColor: SparRingColors.accentOrange,
              foregroundColor: Colors.white,
              onPressed: _openLogSessionSheet,
              icon: const Icon(Icons.add),
              label: const Text('SPARRING', style: TextStyle(fontWeight: FontWeight.w800)),
            )
          : null,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: SparRingColors.borderGrid)),
        ),
        child: BottomNavigationBar(
          currentIndex: _tabIndex,
          onTap: (i) => setState(() => _tabIndex = i),
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Match'),
            BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Cartel'),
            BottomNavigationBarItem(icon: Icon(Icons.show_chart), label: 'PRO'),
            BottomNavigationBarItem(icon: Icon(Icons.location_on_outlined), label: 'Tatames'),
            BottomNavigationBarItem(icon: Icon(Icons.help_outline), label: 'Ajuda'),
          ],
        ),
      ),
    );
  }

  /* ========================================================================
     1. MATCHMAKING TAB
     ======================================================================== */
  Widget _buildMatchmakingTab() {
    final store = widget.store;
    final u = store.currentUser;
    final highRiskFilter = _maxWeightDiff > 10;

    final filtered = store.fighters.where((f) {
      final delta = (f.weight - u.weight).abs();
      if (_filterModality != 'Todas' && f.modality != _filterModality) return false;
      if (delta > _maxWeightDiff) return false;
      if (store.isPremium && _filterStance != 'Todas' && f.stance != _filterStance) return false;
      if (store.isPremium && f.rankLevel < _minRankLevel) return false;
      return true;
    }).toList()
      ..sort((a, b) => store
          .computeCompatibility(b, _targetIntensity.round())
          .compareTo(store.computeCompatibility(a, _targetIntensity.round())));

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Filter box
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: SparRingColors.bgSurface,
            border: Border.all(color: SparRingColors.borderGrid),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField<String>(
                value: _filterModality,
                decoration: const InputDecoration(labelText: 'Modalidade (11 opcoes)'),
                dropdownColor: SparRingColors.bgElevated,
                items: ['Todas', ...kSparRingModalities]
                    .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                    .toList(),
                onChanged: (v) => setState(() => _filterModality = v ?? 'Todas'),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('TOLERANCIA DE PESO', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: SparRingColors.textSecondary)),
                  Text('+/- ${_maxWeightDiff.round()} kg', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: SparRingColors.accentOrange)),
                ],
              ),
              Slider(
                value: _maxWeightDiff,
                min: 2,
                max: 30,
                divisions: 28,
                activeColor: SparRingColors.accentOrange,
                onChanged: (v) => setState(() => _maxWeightDiff = v),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('INTENSIDADE ALVO', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: SparRingColors.textSecondary)),
                  Text('${_targetIntensity.round()}%', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: SparRingColors.accentOrange)),
                ],
              ),
              Slider(
                value: _targetIntensity,
                min: 30,
                max: 90,
                divisions: 6,
                activeColor: SparRingColors.accentOrange,
                onChanged: (v) => setState(() => _targetIntensity = v),
              ),
              if (store.isPremium) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _filterStance,
                        decoration: const InputDecoration(labelText: 'Base (PRO)'),
                        dropdownColor: SparRingColors.bgElevated,
                        items: const [
                          DropdownMenuItem(value: 'Todas', child: Text('Todas')),
                          DropdownMenuItem(value: 'Canhoto', child: Text('Canhoto')),
                          DropdownMenuItem(value: 'Destro', child: Text('Destro')),
                        ],
                        onChanged: (v) => setState(() => _filterStance = v ?? 'Todas'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: DropdownButtonFormField<int>(
                        value: _minRankLevel,
                        decoration: const InputDecoration(labelText: 'Nivel (PRO)'),
                        dropdownColor: SparRingColors.bgElevated,
                        items: const [
                          DropdownMenuItem(value: 0, child: Text('Todos')),
                          DropdownMenuItem(value: 2, child: Text('N2+')),
                          DropdownMenuItem(value: 3, child: Text('N3+')),
                          DropdownMenuItem(value: 4, child: Text('N4')),
                        ],
                        onChanged: (v) => setState(() => _minRankLevel = v ?? 0),
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Safety alert banner
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: highRiskFilter ? SparRingColors.accentRed.withAlpha(25) : SparRingColors.bgSurface,
            border: Border(
              left: BorderSide(color: highRiskFilter ? SparRingColors.accentRed : SparRingColors.accentGreen, width: 3),
              top: const BorderSide(color: SparRingColors.borderGrid),
              right: const BorderSide(color: SparRingColors.borderGrid),
              bottom: const BorderSide(color: SparRingColors.borderGrid),
            ),
          ),
          child: Text(
            highRiskFilter
                ? 'ALERTA DE DISPARIDADE: diferenca acima de 10 kg eleva o risco de lesao em sparrings intensos.'
                : 'PAREAMENTO SEGURO (${u.city}): tolerancia de +/- ${_maxWeightDiff.round()} kg para seus ${u.weight} kg.',
            style: TextStyle(
              fontSize: 12,
              color: highRiskFilter ? const Color(0xFFFFD5D8) : SparRingColors.textSecondary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(height: 14),

        if (filtered.isEmpty)
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: SparRingColors.bgSurface,
              border: Border.all(color: SparRingColors.borderGrid),
            ),
            child: const Text(
              'Nenhum parceiro encontrado com esses filtros. Ajuste a modalidade ou a tolerancia de peso.',
              textAlign: TextAlign.center,
              style: TextStyle(color: SparRingColors.textSecondary),
            ),
          )
        else
          ...filtered.map((f) {
            final matchScore = store.computeCompatibility(f, _targetIntensity.round());
            final delta = (f.weight - u.weight).abs();
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: SparRingColors.bgSurface,
                border: Border.all(color: SparRingColors.borderGrid),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: SparRingColors.bgElevated,
                          border: Border.all(color: SparRingColors.accentOrange),
                        ),
                        child: Text(f.initials, style: const TextStyle(fontWeight: FontWeight.w800)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(f.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                            Text(
                              '${f.gym} | ${f.neighborhood} (${f.distanceKm} km)',
                              style: const TextStyle(color: SparRingColors.textSecondary, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('$matchScore%', style: const TextStyle(color: SparRingColors.accentOrange, fontSize: 17, fontWeight: FontWeight.w900)),
                          const Text('MATCH', style: TextStyle(color: SparRingColors.textMuted, fontSize: 10)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      _badge(f.modality, SparRingColors.accentOrange),
                      _badge('N${f.rankLevel}', SparRingColors.textSecondary),
                      _badge(f.stance, SparRingColors.textSecondary),
                      _badge(f.verified ? 'VALIDADO MESTRE' : 'PENDENTE', f.verified ? SparRingColors.accentGreen : SparRingColors.textMuted),
                      if (delta > 10) _badge('DELTA ${delta}KG', SparRingColors.accentRed),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    '${f.weight}kg | ${f.height}cm | Intensidade ${f.preferredIntensity}% | ${f.roundsLogged} rounds',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 4),
                  Text(f.bio, style: const TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          '${f.rank}\nLivre: ${f.availability}',
                          style: const TextStyle(fontSize: 11, color: SparRingColors.textMuted),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () => _openBookMatchSheet(f),
                        child: const Text('SOLICITAR'),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
      ],
    );
  }

  void _openBookMatchSheet(FighterPartner fighter) {
    final store = widget.store;
    GymPartner selectedGym = store.gyms.first;
    String selectedSlot = selectedGym.slots.first;
    final roundsCtrl = TextEditingController(text: '6');
    final intCtrl = TextEditingController(text: '${fighter.preferredIntensity}');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: SparRingColors.bgSurface,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) {
          final fee = selectedGym.hourlyRate * (selectedGym.takeRatePercent / 100.0);
          final net = selectedGym.hourlyRate - fee;
          return Padding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, MediaQuery.of(ctx).viewInsets.bottom + 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('AGENDAR SPARRING COM ${fighter.name.toUpperCase()}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: selectedGym.id,
                  decoration: const InputDecoration(labelText: 'Academia / Tatame'),
                  dropdownColor: SparRingColors.bgElevated,
                  items: store.gyms.map((g) => DropdownMenuItem(value: g.id, child: Text('${g.name} (R\$ ${g.hourlyRate}/h)'))).toList(),
                  onChanged: (id) {
                    if (id == null) return;
                    setModalState(() {
                      selectedGym = store.gyms.firstWhere((g) => g.id == id);
                      selectedSlot = selectedGym.slots.first;
                    });
                  },
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: selectedSlot,
                  decoration: const InputDecoration(labelText: 'Horario Disponivel'),
                  dropdownColor: SparRingColors.bgElevated,
                  items: selectedGym.slots.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (s) => setModalState(() => selectedSlot = s ?? selectedSlot),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: TextField(controller: roundsCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Rounds'))),
                    const SizedBox(width: 10),
                    Expanded(child: TextField(controller: intCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Intensidade (%)'))),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: SparRingColors.bgMain,
                    border: const Border(left: BorderSide(color: SparRingColors.accentOrange, width: 3)),
                  ),
                  child: Text(
                    'Total: R\$ ${selectedGym.hourlyRate},00 | Academia: R\$ ${net.toStringAsFixed(2)} | Taxa App (${selectedGym.takeRatePercent}%): R\$ ${fee.toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 11.5, color: SparRingColors.textSecondary),
                  ),
                ),
                const SizedBox(height: 14),
                ElevatedButton(
                  onPressed: () {
                    store.bookMatch(
                      ScheduledMatch(
                        id: 'm_${DateTime.now().millisecondsSinceEpoch}',
                        partnerName: fighter.name,
                        modality: fighter.modality,
                        gym: selectedGym.name,
                        slot: selectedSlot,
                        rounds: int.tryParse(roundsCtrl.text) ?? 6,
                        intensity: int.tryParse(intCtrl.text) ?? fighter.preferredIntensity,
                        totalPrice: selectedGym.hourlyRate.toDouble(),
                        platformFee: fee,
                        status: 'Confirmado',
                      ),
                    );
                    Navigator.pop(ctx);
                    _snack('Sparring agendado com ${fighter.name} ($selectedSlot).');
                  },
                  child: const Text('CONFIRMAR SPARRING E TATAME'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  /* ========================================================================
     2. CARTEL DIGITAL TAB
     ======================================================================== */
  Widget _buildCartelTab() {
    final store = widget.store;
    final totalRounds = store.sessions.fold<int>(0, (sum, s) => sum + s.rounds);
    final totalMin = store.sessions.fold<int>(0, (sum, s) => sum + s.rounds * s.roundMinutes);
    final avgInt = store.sessions.isEmpty
        ? 0
        : (store.sessions.fold<int>(0, (sum, s) => sum + s.intensity) / store.sessions.length).round();
    final latest = store.sessions.isNotEmpty ? store.sessions.first : null;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 84),
      children: [
        Row(
          children: [
            Expanded(child: _kpiCard('STREAK', '${store.currentUser.streakDays} dias', highlight: true)),
            const SizedBox(width: 10),
            Expanded(child: _kpiCard('VOLUME', '$totalRounds rds')),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _kpiCard('TEMPO', '${(totalMin / 60).toStringAsFixed(1)} h')),
            const SizedBox(width: 10),
            Expanded(child: _kpiCard('INTENSIDADE', '$avgInt%')),
          ],
        ),
        if (latest != null) ...[
          const SizedBox(height: 16),
          const Text('CARD COMPARTILHAVEL (ESTILO STRAVA)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1, color: SparRingColors.textSecondary)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0C0C0C),
              border: Border.all(color: SparRingColors.accentOrange),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('SparRing', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
                    _badge(latest.date, SparRingColors.accentOrange),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '${latest.modality.toUpperCase()} | ${store.currentUser.category.toUpperCase()}',
                  style: const TextStyle(color: SparRingColors.accentOrange, fontSize: 11, fontWeight: FontWeight.w800),
                ),
                Text(store.currentUser.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                Text('vs ${latest.partnerName} (${latest.partnerWeight}kg, ${latest.partnerRank})', style: const TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${latest.rounds} ROUNDS', style: const TextStyle(color: SparRingColors.accentOrange, fontWeight: FontWeight.w900, fontSize: 14)),
                    Text('${latest.rounds * latest.roundMinutes} MIN', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                    Text('${latest.intensity}% INT.', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                  ],
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 16),
        const Text('HISTORICO DE SESSOES', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1, color: SparRingColors.textSecondary)),
        const SizedBox(height: 8),
        ...store.sessions.map((s) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: SparRingColors.bgSurface,
                border: Border.all(color: SparRingColors.borderGrid),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${s.partnerName} (${s.modality})', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
                        const SizedBox(height: 2),
                        Text(
                          '${s.date} | ${s.partnerWeight}kg | ${s.partnerRank}',
                          style: const TextStyle(fontSize: 11.5, color: SparRingColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('${s.rounds}x${s.roundMinutes}m', style: const TextStyle(fontWeight: FontWeight.w800)),
                      Text('${s.intensity}%', style: const TextStyle(color: SparRingColors.accentOrange, fontWeight: FontWeight.w700, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            )),
      ],
    );
  }

  void _openLogSessionSheet() {
    final partnerCtrl = TextEditingController();
    final weightCtrl = TextEditingController(text: '76');
    final roundsCtrl = TextEditingController(text: '6');
    final intCtrl = TextEditingController(text: '65');
    final fatCtrl = TextEditingController(text: '7');
    String mod = widget.store.currentUser.modality;
    String stance = 'Destro';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: SparRingColors.bgSurface,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.fromLTRB(16, 16, 16, MediaQuery.of(ctx).viewInsets.bottom + 20),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('REGISTRAR NOVO SPARRING', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                const SizedBox(height: 12),
                TextField(controller: partnerCtrl, decoration: const InputDecoration(labelText: 'Nome do Parceiro')),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: mod,
                        decoration: const InputDecoration(labelText: 'Modalidade'),
                        dropdownColor: SparRingColors.bgElevated,
                        items: kSparRingModalities.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                        onChanged: (v) => setModalState(() => mod = v ?? mod),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: stance,
                        decoration: const InputDecoration(labelText: 'Base'),
                        dropdownColor: SparRingColors.bgElevated,
                        items: const [
                          DropdownMenuItem(value: 'Destro', child: Text('Destro')),
                          DropdownMenuItem(value: 'Canhoto', child: Text('Canhoto')),
                        ],
                        onChanged: (v) => setModalState(() => stance = v ?? stance),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: TextField(controller: weightCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Peso (kg)'))),
                    const SizedBox(width: 8),
                    Expanded(child: TextField(controller: roundsCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Rounds'))),
                    const SizedBox(width: 8),
                    Expanded(child: TextField(controller: intCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Int. (%)'))),
                    const SizedBox(width: 8),
                    Expanded(child: TextField(controller: fatCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Fadiga 1-10'))),
                  ],
                ),
                const SizedBox(height: 14),
                ElevatedButton(
                  onPressed: () {
                    final now = DateTime.now();
                    final dateStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
                    widget.store.addSession(
                      SparringSession(
                        id: 's_${now.millisecondsSinceEpoch}',
                        date: dateStr,
                        modality: mod,
                        partnerName: partnerCtrl.text.trim().isEmpty ? 'Parceiro de Treino' : partnerCtrl.text.trim(),
                        partnerWeight: int.tryParse(weightCtrl.text) ?? 76,
                        partnerHeight: 178,
                        partnerAge: 25,
                        partnerRank: 'N3 Avancado',
                        partnerRankLevel: 3,
                        partnerStance: stance,
                        gym: widget.store.currentUser.gym,
                        rounds: int.tryParse(roundsCtrl.text) ?? 6,
                        roundMinutes: 3,
                        intensity: int.tryParse(intCtrl.text) ?? 65,
                        fatigue: (int.tryParse(fatCtrl.text) ?? 7).clamp(1, 10),
                        focusBoxe: 40,
                        focusChutes: 40,
                        focusClinch: 20,
                      ),
                    );
                    Navigator.pop(ctx);
                    _snack('Sparring registrado no Cartel Digital.');
                  },
                  child: const Text('SALVAR NO CARTEL'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /* ========================================================================
     3. ANALYTICS PREMIUM TAB (INSIGHTS + DISTRIBUICAO + GRAFICO FADIGA)
     ======================================================================== */
  Widget _buildAnalyticsTab() {
    final store = widget.store;
    if (!store.isPremium) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: SparRingColors.bgSurface,
              border: Border.all(color: SparRingColors.accentOrange),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _badge('SPARRING PREMIUM | R\$ 14,90/MES', SparRingColors.accentOrange),
                const SizedBox(height: 12),
                const Text(
                  'Desbloqueie Metricas Avancadas',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Insights de Oponente, Distribuicao Tecnica (Boxe, Chutes e Clinch), Rastreio de Fadiga contra Overtraining e filtros por canhotos e graduacao.',
                  style: TextStyle(color: SparRingColors.textSecondary, fontSize: 13),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 18),
                ElevatedButton(
                  onPressed: () {
                    store.setPremium(true);
                    _snack('Modo Premium ativado.');
                  },
                  child: const Text('ATIVAR SIMULACAO PREMIUM'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final sessions = store.sessions;
    final total = sessions.isEmpty ? 1 : sessions.length;
    final vsAdv = ((sessions.where((s) => s.partnerRankLevel >= 3).length / total) * 100).round();
    final vsHeavy = ((sessions.where((s) => s.partnerWeight >= store.currentUser.weight + 5).length / total) * 100).round();
    final avgBoxe = (sessions.fold<int>(0, (a, s) => a + s.focusBoxe) / total).round();
    final avgChutes = (sessions.fold<int>(0, (a, s) => a + s.focusChutes) / total).round();
    final avgClinch = (100 - avgBoxe - avgChutes).clamp(0, 100);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _metricCard('INSIGHTS DE OPONENTE (PRO)', [
          _progressLine('Contra nivel N3/N4 (Avancado / Pro)', vsAdv, SparRingColors.accentOrange),
          _progressLine('Contra oponentes +5kg mais pesados', vsHeavy, SparRingColors.accentRed),
        ]),
        const SizedBox(height: 14),
        _metricCard('DISTRIBUICAO TECNICA (PRO)', [
          _progressLine('Boxe e Maos', avgBoxe, SparRingColors.accentOrange),
          _progressLine('Chutes e Joelhos', avgChutes, Colors.white),
          _progressLine('Clinch, Quedas e Chao', avgClinch, SparRingColors.textSecondary),
        ]),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: SparRingColors.bgSurface,
            border: Border.all(color: SparRingColors.borderGrid),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('RASTREIO DE FADIGA VS INTENSIDADE', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5)),
              const SizedBox(height: 4),
              const Text('Linha laranja: Intensidade (%) | Linha branca: Desgaste fisico (10 a 100)', style: TextStyle(fontSize: 11, color: SparRingColors.textSecondary)),
              const SizedBox(height: 14),
              SizedBox(
                height: 170,
                width: double.infinity,
                child: CustomPaint(painter: _FatigueChartPainter(sessions.take(6).toList().reversed.toList())),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /* ========================================================================
     4. TATAMES E AULOES TAB
     ======================================================================== */
  Widget _buildTatamesTab() {
    final store = widget.store;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('SEUS SPARRINGS E RESERVAS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1, color: SparRingColors.textSecondary)),
        const SizedBox(height: 8),
        if (store.scheduledMatches.isEmpty)
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: SparRingColors.bgSurface, border: Border.all(color: SparRingColors.borderGrid)),
            child: const Text('Nenhum sparring ou reserva ativa.', style: TextStyle(color: SparRingColors.textSecondary)),
          )
        else
          ...store.scheduledMatches.map((m) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: SparRingColors.bgSurface,
                  border: const Border(
                    left: BorderSide(color: SparRingColors.accentOrange, width: 3),
                    top: BorderSide(color: SparRingColors.borderGrid),
                    right: BorderSide(color: SparRingColors.borderGrid),
                    bottom: BorderSide(color: SparRingColors.borderGrid),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(m.partnerName, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                        _badge(m.status, SparRingColors.accentGreen),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('${m.modality} | ${m.gym} | ${m.slot}', style: const TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        OutlinedButton(
                          onPressed: () => _openRescheduleMatchDialog(m),
                          child: const Text('REAGENDAR'),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFFFF5C66),
                            side: const BorderSide(color: SparRingColors.accentRed),
                          ),
                          onPressed: () {
                            store.cancelMatch(m.id);
                            _snack('Agendamento cancelado.');
                          },
                          child: const Text('CANCELAR'),
                        ),
                      ],
                    ),
                  ],
                ),
              )),

        const SizedBox(height: 16),
        const Text('AULOES E INTERCAMBIOS ABERTOS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1, color: SparRingColors.textSecondary)),
        const SizedBox(height: 8),
        ...store.academyEvents.map((ev) {
          final joined = ev.enrolledByUser;
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: SparRingColors.bgSurface,
              border: Border.all(
                color: joined ? SparRingColors.accentGreen : SparRingColors.borderGrid,
                width: joined ? 1.5 : 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    if (joined) ...[
                      const Icon(Icons.check_circle, color: SparRingColors.accentGreen, size: 20),
                      const SizedBox(width: 6),
                    ],
                    _badge(joined ? 'VAGA GARANTIDA' : ev.modality, joined ? SparRingColors.accentGreen : SparRingColors.accentOrange),
                    const Spacer(),
                    Text('${ev.enrolled}/${ev.spots} vagas', style: const TextStyle(fontSize: 11.5, color: SparRingColors.textMuted)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(ev.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                Text('${ev.gym} | ${ev.date}', style: const TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
                const SizedBox(height: 12),
                if (joined)
                  Row(
                    children: [
                      _badge('CONFIRMADO', SparRingColors.accentGreen),
                      const SizedBox(width: 10),
                      OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFFFF5C66),
                          side: const BorderSide(color: SparRingColors.accentRed),
                        ),
                        onPressed: () {
                          store.toggleEventEnrollment(ev.id);
                          _snack('Inscricao cancelada.');
                        },
                        child: const Text('CANCELAR VAGA'),
                      ),
                    ],
                  )
                else
                  ElevatedButton(
                    onPressed: () {
                      store.toggleEventEnrollment(ev.id);
                      _snack('Vaga garantida em ${ev.title}.');
                    },
                    child: const Text('GARANTIR VAGA'),
                  ),
              ],
            ),
          );
        }),

        const SizedBox(height: 16),
        const Text('HORARIOS OCIOSOS EM ACADEMIAS (BH)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1, color: SparRingColors.textSecondary)),
        const SizedBox(height: 8),
        ...store.gyms.map((g) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: SparRingColors.bgSurface, border: Border.all(color: SparRingColors.borderGrid)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(g.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                      Text('R\$ ${g.hourlyRate}/h', style: const TextStyle(color: SparRingColors.accentOrange, fontWeight: FontWeight.w800)),
                    ],
                  ),
                  Text('${g.neighborhood} | ${g.spaceType}', style: const TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: g.slots
                        .map((s) => OutlinedButton(
                              onPressed: () {
                                final fee = g.hourlyRate * (g.takeRatePercent / 100.0);
                                store.bookMatch(
                                  ScheduledMatch(
                                    id: 'm_${DateTime.now().millisecondsSinceEpoch}',
                                    partnerName: 'Reserva Avulsa de Tatame',
                                    modality: store.currentUser.modality,
                                    gym: g.name,
                                    slot: s,
                                    rounds: 8,
                                    intensity: 50,
                                    totalPrice: g.hourlyRate.toDouble(),
                                    platformFee: fee,
                                    status: 'Confirmado',
                                  ),
                                );
                                _snack('Tatame reservado em ${g.name} ($s).');
                              },
                              child: Text('RESERVAR $s'),
                            ))
                        .toList(),
                  ),
                ],
              ),
            )),
      ],
    );
  }

  void _openRescheduleMatchDialog(ScheduledMatch match) {
    final options = ['Sexta 18:30', 'Sabado 10:30', 'Sabado 15:00', 'Domingo 10:00', 'Domingo 16:00'];
    String chosen = options.first;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDState) => AlertDialog(
          backgroundColor: SparRingColors.bgSurface,
          title: const Text('Reagendar Sparring', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          content: DropdownButtonFormField<String>(
            value: chosen,
            dropdownColor: SparRingColors.bgElevated,
            decoration: const InputDecoration(labelText: 'Novo Horario'),
            items: options.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
            onChanged: (v) => setDState(() => chosen = v ?? chosen),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('CANCELAR')),
            ElevatedButton(
              onPressed: () {
                widget.store.rescheduleMatch(match.id, chosen);
                Navigator.pop(ctx);
                _snack('Sparring reagendado para $chosen.');
              },
              child: const Text('CONFIRMAR'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _badge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: color.withAlpha(28),
        border: Border.all(color: color),
      ),
      child: Text(text.toUpperCase(), style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w800)),
    );
  }

  Widget _kpiCard(String label, String value, {bool highlight = false}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: SparRingColors.bgSurface,
        border: Border(
          left: BorderSide(color: highlight ? SparRingColors.accentOrange : SparRingColors.borderGrid, width: highlight ? 3 : 1),
          top: const BorderSide(color: SparRingColors.borderGrid),
          right: const BorderSide(color: SparRingColors.borderGrid),
          bottom: const BorderSide(color: SparRingColors.borderGrid),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: SparRingColors.textSecondary, letterSpacing: 1)),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: highlight ? SparRingColors.accentOrange : Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _metricCard(String title, List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: SparRingColors.bgSurface,
        border: const Border(
          left: BorderSide(color: SparRingColors.accentOrange, width: 3),
          top: BorderSide(color: SparRingColors.borderGrid),
          right: BorderSide(color: SparRingColors.borderGrid),
          bottom: BorderSide(color: SparRingColors.borderGrid),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5)),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _progressLine(String label, int pct, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
              Text('$pct%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: color)),
            ],
          ),
          const SizedBox(height: 5),
          LinearProgressIndicator(
            value: (pct / 100).clamp(0.0, 1.0),
            minHeight: 7,
            backgroundColor: const Color(0xFF242424),
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ],
      ),
    );
  }
}

class _FatigueChartPainter extends CustomPainter {
  final List<SparringSession> sessions;

  _FatigueChartPainter(this.sessions);

  @override
  void paint(Canvas canvas, Size size) {
    if (sessions.isEmpty) return;

    // Overtraining danger zone (top 20%)
    final dangerPaint = Paint()..color = SparRingColors.accentRed.withAlpha(32);
    final dangerH = size.height * 0.2;
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, dangerH), dangerPaint);

    final gridPaint = Paint()
      ..color = SparRingColors.borderStrong
      ..strokeWidth = 1;
    canvas.drawLine(Offset(0, dangerH), Offset(size.width, dangerH), Paint()..color = SparRingColors.accentRed);
    canvas.drawLine(Offset(0, size.height - 1), Offset(size.width, size.height - 1), gridPaint);

    final stepX = sessions.length > 1 ? size.width / (sessions.length - 1) : size.width / 2;
    final intPath = Path();
    final fatPath = Path();

    for (var i = 0; i < sessions.length; i++) {
      final s = sessions[i];
      final x = sessions.length > 1 ? i * stepX : size.width / 2;
      final yInt = size.height - (s.intensity / 100.0) * size.height;
      final yFat = size.height - ((s.fatigue * 10) / 100.0) * size.height;

      if (i == 0) {
        intPath.moveTo(x, yInt);
        fatPath.moveTo(x, yFat);
      } else {
        intPath.lineTo(x, yInt);
        fatPath.lineTo(x, yFat);
      }
      canvas.drawCircle(Offset(x, yInt), 4.5, Paint()..color = SparRingColors.accentOrange);
      canvas.drawCircle(Offset(x, yFat), 4, Paint()..color = Colors.white);
    }

    canvas.drawPath(
      intPath,
      Paint()
        ..color = SparRingColors.accentOrange
        ..strokeWidth = 2.6
        ..style = PaintingStyle.stroke,
    );
    canvas.drawPath(
      fatPath,
      Paint()
        ..color = Colors.white70
        ..strokeWidth = 1.8
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(covariant _FatigueChartPainter oldDelegate) => true;
}
