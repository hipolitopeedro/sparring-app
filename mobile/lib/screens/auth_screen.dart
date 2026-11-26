import 'package:flutter/material.dart';
import '../data/sparring_store.dart';
import '../models/sparring_models.dart';
import '../theme/sparring_theme.dart';

class AuthScreen extends StatefulWidget {
  final SparRingStore store;

  const AuthScreen({super.key, required this.store});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isRegister = false;
  String _role = 'fighter'; // 'fighter' ou 'academy'

  final _nameCtrl = TextEditingController(text: 'Pedro Hipolito');
  final _weightCtrl = TextEditingController(text: '76');
  final _heightCtrl = TextEditingController(text: '178');
  final _cityCtrl = TextEditingController(text: 'Savassi, Belo Horizonte');

  final _gymNameCtrl = TextEditingController(text: 'CT Nova Era BH');
  final _coachNameCtrl = TextEditingController(text: 'Mestre Ricardo Alves');
  final _gymCityCtrl = TextEditingController(text: 'Centro, Belo Horizonte');
  final _gymSpaceCtrl = TextEditingController(text: 'Ringue + Tatame 80m2');

  final _emailCtrl = TextEditingController(text: 'pedro.hipolito@sparring.app');
  final _passCtrl = TextEditingController(text: 'sparring2026');

  String _modality = 'Muay Thai';
  String _category = 'Amador';
  String _stance = 'Destro';
  late GraduationRank _selectedRank;

  @override
  void initState() {
    super.initState();
    _selectedRank = ranksForModality(_modality).last;
  }

  void _onModalityChanged(String? val) {
    if (val == null) return;
    setState(() {
      _modality = val;
      _selectedRank = ranksForModality(val).first;
    });
  }

  void _submit() {
    if (_role == 'fighter') {
      if (_isRegister) {
        final profile = UserProfile(
          name: _nameCtrl.text.trim().isEmpty ? 'Pedro Hipolito' : _nameCtrl.text.trim(),
          modality: _modality,
          rank: _selectedRank.name,
          rankLevel: _selectedRank.levelNum,
          weight: int.tryParse(_weightCtrl.text) ?? 76,
          height: int.tryParse(_heightCtrl.text) ?? 178,
          category: _category,
          stance: _stance,
          city: _cityCtrl.text.trim().isEmpty ? 'Savassi, Belo Horizonte' : _cityCtrl.text.trim(),
          gym: widget.store.currentUser.gym,
          streakDays: widget.store.currentUser.streakDays,
        );
        widget.store.loginAsFighter(updatedProfile: profile);
      } else {
        widget.store.loginAsFighter();
      }
    } else {
      if (_isRegister) {
        final acc = AcademyAccount(
          gymName: _gymNameCtrl.text.trim().isEmpty ? 'CT Nova Era BH' : _gymNameCtrl.text.trim(),
          coachName: _coachNameCtrl.text.trim().isEmpty ? 'Mestre Ricardo Alves' : _coachNameCtrl.text.trim(),
          neighborhood: _gymCityCtrl.text.trim().isEmpty ? 'Centro, Belo Horizonte' : _gymCityCtrl.text.trim(),
          spaceType: _gymSpaceCtrl.text.trim().isEmpty ? 'Ringue + Tatame' : _gymSpaceCtrl.text.trim(),
        );
        widget.store.loginAsAcademy(updatedAcademy: acc);
      } else {
        widget.store.loginAsAcademy();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final availableRanks = ranksForModality(_modality);
    if (!availableRanks.any((r) => r.name == _selectedRank.name)) {
      _selectedRank = availableRanks.first;
    }

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 460),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'SparRing',
                    style: TextStyle(fontSize: 38, fontWeight: FontWeight.w900, letterSpacing: -1),
                  ),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Container(width: 56, height: 4, color: SparRingColors.accentOrange, margin: const EdgeInsets.only(top: 6)),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'ONDE CADA ROUND CONTA.',
                    style: TextStyle(color: SparRingColors.accentOrange, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 2),
                  ),
                  const SizedBox(height: 24),

                  // Entrar vs Criar Conta
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => setState(() => _isRegister = false),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 11),
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: !_isRegister ? SparRingColors.accentOrange : SparRingColors.bgSurface,
                              border: Border.all(color: SparRingColors.borderStrong),
                            ),
                            child: Text(
                              'ENTRAR',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 12,
                                color: !_isRegister ? Colors.white : SparRingColors.textSecondary,
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: InkWell(
                          onTap: () => setState(() => _isRegister = true),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 11),
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: _isRegister ? SparRingColors.accentOrange : SparRingColors.bgSurface,
                              border: Border.all(color: SparRingColors.borderStrong),
                            ),
                            child: Text(
                              'CRIAR CONTA',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 12,
                                color: _isRegister ? Colors.white : SparRingColors.textSecondary,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Role Switcher: Lutador vs Academia
                  Row(
                    children: [
                      Expanded(
                        child: _RoleBox(
                          title: 'SOU LUTADOR',
                          subtitle: 'Portal Atleta B2C',
                          active: _role == 'fighter',
                          onTap: () => setState(() {
                            _role = 'fighter';
                            _emailCtrl.text = 'pedro.hipolito@sparring.app';
                          }),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _RoleBox(
                          title: 'ACADEMIA / MESTRE',
                          subtitle: 'Portal Gestor B2B',
                          active: _role == 'academy',
                          onTap: () => setState(() {
                            _role = 'academy';
                            _emailCtrl.text = 'contato@ctnovaerabh.com.br';
                          }),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: SparRingColors.bgSurface,
                      border: Border.all(color: SparRingColors.borderGrid),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        if (_isRegister && _role == 'fighter') ...[
                          TextField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Nome Completo')),
                          const SizedBox(height: 12),
                          DropdownButtonFormField<String>(
                            value: _modality,
                            decoration: const InputDecoration(labelText: 'Arte Marcial'),
                            dropdownColor: SparRingColors.bgElevated,
                            items: kSparRingModalities.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                            onChanged: _onModalityChanged,
                          ),
                          const SizedBox(height: 12),
                          DropdownButtonFormField<String>(
                            value: _selectedRank.name,
                            isExpanded: true,
                            decoration: const InputDecoration(labelText: 'Graduacao (ou Nivel)'),
                            dropdownColor: SparRingColors.bgElevated,
                            items: availableRanks
                                .map((r) => DropdownMenuItem(value: r.name, child: Text('${r.name} (${r.levelLabel})', overflow: TextOverflow.ellipsis)))
                                .toList(),
                            onChanged: (v) {
                              if (v == null) return;
                              setState(() {
                                _selectedRank = availableRanks.firstWhere((r) => r.name == v);
                              });
                            },
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _heightCtrl,
                                  keyboardType: TextInputType.number,
                                  decoration: const InputDecoration(labelText: 'Altura (cm)'),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: TextField(
                                  controller: _weightCtrl,
                                  keyboardType: TextInputType.number,
                                  decoration: const InputDecoration(labelText: 'Peso (kg)'),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: DropdownButtonFormField<String>(
                                  value: _category,
                                  decoration: const InputDecoration(labelText: 'Categoria'),
                                  dropdownColor: SparRingColors.bgElevated,
                                  items: const [
                                    DropdownMenuItem(value: 'Amador', child: Text('Amador')),
                                    DropdownMenuItem(value: 'Profissional', child: Text('Profissional')),
                                  ],
                                  onChanged: (v) => setState(() => _category = v ?? 'Amador'),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: DropdownButtonFormField<String>(
                                  value: _stance,
                                  decoration: const InputDecoration(labelText: 'Base'),
                                  dropdownColor: SparRingColors.bgElevated,
                                  items: const [
                                    DropdownMenuItem(value: 'Destro', child: Text('Destro')),
                                    DropdownMenuItem(value: 'Canhoto', child: Text('Canhoto')),
                                  ],
                                  onChanged: (v) => setState(() => _stance = v ?? 'Destro'),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          TextField(controller: _cityCtrl, decoration: const InputDecoration(labelText: 'Bairro / Cidade')),
                          const SizedBox(height: 12),
                        ],
                        if (_isRegister && _role == 'academy') ...[
                          TextField(controller: _gymNameCtrl, decoration: const InputDecoration(labelText: 'Nome da Academia / CT')),
                          const SizedBox(height: 12),
                          TextField(controller: _coachNameCtrl, decoration: const InputDecoration(labelText: 'Mestre / Treinador Responsavel')),
                          const SizedBox(height: 12),
                          TextField(controller: _gymCityCtrl, decoration: const InputDecoration(labelText: 'Bairro / Cidade')),
                          const SizedBox(height: 12),
                          TextField(controller: _gymSpaceCtrl, decoration: const InputDecoration(labelText: 'Estrutura (Ringue / Tatame)')),
                          const SizedBox(height: 12),
                        ],
                        TextField(controller: _emailCtrl, decoration: const InputDecoration(labelText: 'E-mail')),
                        const SizedBox(height: 12),
                        TextField(controller: _passCtrl, obscureText: true, decoration: const InputDecoration(labelText: 'Senha')),
                        const SizedBox(height: 18),
                        ElevatedButton(
                          onPressed: _submit,
                          child: Text(
                            _isRegister
                                ? (_role == 'fighter' ? 'FINALIZAR CADASTRO DE LUTADOR' : 'FINALIZAR CADASTRO DE ACADEMIA')
                                : (_role == 'fighter' ? 'ENTRAR NO PORTAL DO LUTADOR' : 'ENTRAR NO PORTAL DA ACADEMIA'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleBox extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool active;
  final VoidCallback onTap;

  const _RoleBox({
    required this.title,
    required this.subtitle,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: active ? SparRingColors.accentOrange.withAlpha(28) : SparRingColors.bgSurface,
          border: Border.all(
            color: active ? SparRingColors.accentOrange : SparRingColors.borderStrong,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 11,
                color: active ? SparRingColors.accentOrange : SparRingColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
