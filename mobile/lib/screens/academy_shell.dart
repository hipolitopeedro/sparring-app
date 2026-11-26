import 'package:flutter/material.dart';
import '../data/sparring_store.dart';
import '../models/sparring_models.dart';
import '../theme/sparring_theme.dart';
import '../widgets/help_guide_view.dart';

class AcademyShell extends StatefulWidget {
  final SparRingStore store;

  const AcademyShell({super.key, required this.store});

  @override
  State<AcademyShell> createState() => _AcademyShellState();
}

class _AcademyShellState extends State<AcademyShell> {
  int _tabIndex = 0;
  bool _onlyChurnRisk = false;

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
    final acc = store.academyAccount;

    final pages = [
      _buildOverviewTab(),
      _buildValidationsTab(),
      _buildRetentionTab(),
      _buildTatamesAndEventsTab(),
      const HelpGuideView(),
    ];

    final titles = [
      'VISAO GERAL B2B',
      'VALIDAR ALUNOS',
      'RANKING E EVASAO',
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
              '${acc.gymName} | ${acc.coachName}',
              style: const TextStyle(fontSize: 11, color: SparRingColors.textSecondary, fontWeight: FontWeight.w500),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: SparRingColors.borderGrid),
        ),
        actions: [
          IconButton(
            tooltip: 'Trocar Perfil / Sair',
            onPressed: store.logout,
            icon: const Icon(Icons.logout, size: 20, color: SparRingColors.textSecondary),
          ),
        ],
      ),
      body: pages[_tabIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: SparRingColors.borderGrid)),
        ),
        child: BottomNavigationBar(
          currentIndex: _tabIndex,
          onTap: (i) => setState(() => _tabIndex = i),
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Geral'),
            BottomNavigationBarItem(icon: Icon(Icons.verified_user_outlined), label: 'Validar'),
            BottomNavigationBarItem(icon: Icon(Icons.leaderboard_outlined), label: 'Evasao'),
            BottomNavigationBarItem(icon: Icon(Icons.calendar_month_outlined), label: 'Tatames'),
            BottomNavigationBarItem(icon: Icon(Icons.help_outline), label: 'Ajuda'),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    final store = widget.store;
    final pendingCount = store.pendingValidations.where((v) => v.status == 'Pendente').length;
    final churnRisk = store.gymStudents.where((s) => s.status == 'Risco de Evasao').length;
    final netRental = store.scheduledMatches.fold<double>(475.2, (a, m) => a + (m.totalPrice - m.platformFee));

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(child: _kpi('RETENCAO 6M', '87%', highlight: true)),
            const SizedBox(width: 10),
            Expanded(child: _kpi('VALIDACOES', '$pendingCount')),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _kpi('RISCO EVASAO', '$churnRisk')),
            const SizedBox(width: 10),
            Expanded(child: _kpi('TATAME LIQUIDO', 'R\$ ${netRental.toStringAsFixed(0)}')),
          ],
        ),
        const SizedBox(height: 16),
        Container(
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
              const Text('PLANO B2B ATIVO (R\$ 89,90/MES)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5, color: SparRingColors.accentOrange)),
              const SizedBox(height: 6),
              Text(
                '${store.academyAccount.gymName} (${store.academyAccount.neighborhood}) operando com vitrine de tatames, validacao oficial de atletas e alertas de churn.',
                style: const TextStyle(fontSize: 12.5, color: SparRingColors.textSecondary),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildValidationsTab() {
    final store = widget.store;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Ateste peso e graduacao dos alunos para ativar o selo Validado Mestre no Portal do Lutador.',
          style: TextStyle(fontSize: 12.5, color: SparRingColors.textSecondary),
        ),
        const SizedBox(height: 14),
        ...store.pendingValidations.map((v) {
          final isPending = v.status == 'Pendente';
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: SparRingColors.bgSurface, border: Border.all(color: SparRingColors.borderGrid)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${v.studentName} (${v.modality})', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                const SizedBox(height: 4),
                Text('Peso: ${v.declaredWeight}kg | ${v.declaredRank}', style: const TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
                Text(v.requestedAt, style: const TextStyle(fontSize: 11, color: SparRingColors.textMuted)),
                const SizedBox(height: 10),
                if (isPending)
                  Row(
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          store.resolveValidation(v.id, 'Validado');
                          _snack('${v.studentName} validado com sucesso.');
                        },
                        child: const Text('VALIDAR SELO'),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFFFF5C66),
                          side: const BorderSide(color: SparRingColors.accentRed),
                        ),
                        onPressed: () {
                          store.resolveValidation(v.id, 'Ajustar');
                          _snack('Solicitacao de ajuste enviada para ${v.studentName}.');
                        },
                        child: const Text('RECUSAR'),
                      ),
                    ],
                  )
                else
                  Text(
                    v.status.toUpperCase(),
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 12,
                      color: v.status == 'Validado' ? SparRingColors.accentGreen : SparRingColors.accentRed,
                    ),
                  ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildRetentionTab() {
    final list = _onlyChurnRisk
        ? widget.store.gymStudents.where((s) => s.status == 'Risco de Evasao').toList()
        : widget.store.gymStudents;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: !_onlyChurnRisk ? SparRingColors.accentOrange : SparRingColors.bgSurface,
                ),
                onPressed: () => setState(() => _onlyChurnRisk = false),
                child: const Text('TODOS OS ALUNOS'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _onlyChurnRisk ? SparRingColors.accentRed : SparRingColors.bgSurface,
                ),
                onPressed: () => setState(() => _onlyChurnRisk = true),
                child: const Text('SOMENTE RISCO'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        ...list.map((st) {
          final isRisk = st.status == 'Risco de Evasao';
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: SparRingColors.bgSurface,
              border: Border.all(color: isRisk ? SparRingColors.accentRed : SparRingColors.borderGrid),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${st.name} (${st.modality})', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                      Text(
                        '${st.roundsMonth} rounds/mes | Streak ${st.streak}d | Ultimo treino ha ${st.lastSeenDays}d',
                        style: const TextStyle(fontSize: 11.5, color: SparRingColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                if (isRisk)
                  ElevatedButton(
                    onPressed: () => _snack('Convite de reengajamento enviado para ${st.name}.'),
                    child: const Text('CONVIDAR'),
                  )
                else
                  const Text('ATIVO', style: TextStyle(color: SparRingColors.accentGreen, fontWeight: FontWeight.w800, fontSize: 11)),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildTatamesAndEventsTab() {
    final store = widget.store;
    final gym = store.getManagedGym();
    final slotCtrl = TextEditingController();
    final priceCtrl = TextEditingController(text: '${gym.hourlyRate}');
    final evTitleCtrl = TextEditingController();
    final evDateCtrl = TextEditingController(text: 'Sabado 10:00');
    String evMod = 'Muay Thai';

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('HORARIOS OCIOSOS PUBLICADOS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: SparRingColors.textSecondary, letterSpacing: 1)),
        const SizedBox(height: 8),
        ...gym.slots.asMap().entries.map((e) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(color: SparRingColors.bgSurface, border: Border.all(color: SparRingColors.borderGrid)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('${e.value} (R\$ ${gym.hourlyRate}/h)', style: const TextStyle(fontWeight: FontWeight.w700)),
                  IconButton(
                    onPressed: () {
                      store.removeGymSlot(e.key);
                      _snack('Horario removido.');
                    },
                    icon: const Icon(Icons.delete_outline, color: SparRingColors.accentRed, size: 20),
                  ),
                ],
              ),
            )),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: SparRingColors.bgSurface, border: Border.all(color: SparRingColors.borderGrid)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('PUBLICAR NOVO HORARIO', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(child: TextField(controller: slotCtrl, decoration: const InputDecoration(labelText: 'Ex: Sabado 15:00'))),
                  const SizedBox(width: 8),
                  SizedBox(width: 90, child: TextField(controller: priceCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'R\$/h'))),
                ],
              ),
              const SizedBox(height: 10),
              ElevatedButton(
                onPressed: () {
                  if (slotCtrl.text.trim().isEmpty) return;
                  store.addGymSlot(slotCtrl.text.trim(), int.tryParse(priceCtrl.text) ?? gym.hourlyRate);
                  _snack('Horario publicado na vitrine B2C.');
                },
                child: const Text('PUBLICAR HORARIO'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: SparRingColors.bgSurface, border: Border.all(color: SparRingColors.borderGrid)),
          child: StatefulBuilder(
            builder: (ctx, setLocal) => Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('CRIAR NOVO AULAO / INTERCAMBIO', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
                const SizedBox(height: 10),
                TextField(controller: evTitleCtrl, decoration: const InputDecoration(labelText: 'Titulo do Aulao')),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: evMod,
                  dropdownColor: SparRingColors.bgElevated,
                  decoration: const InputDecoration(labelText: 'Modalidade'),
                  items: kSparRingModalities.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                  onChanged: (v) => setLocal(() => evMod = v ?? evMod),
                ),
                const SizedBox(height: 10),
                TextField(controller: evDateCtrl, decoration: const InputDecoration(labelText: 'Data e Hora')),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () {
                    if (evTitleCtrl.text.trim().isEmpty) return;
                    store.createAcademyEvent(
                      title: evTitleCtrl.text.trim(),
                      modality: evMod,
                      date: evDateCtrl.text.trim(),
                      spots: 20,
                    );
                    _snack('Aulao publicado para os lutadores.');
                  },
                  child: const Text('PUBLICAR AULAO'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _kpi(String label, String value, {bool highlight = false}) {
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
          Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: highlight ? SparRingColors.accentOrange : Colors.white)),
        ],
      ),
    );
  }
}
