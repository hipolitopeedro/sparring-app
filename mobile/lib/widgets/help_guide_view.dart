import 'package:flutter/material.dart';
import '../models/sparring_models.dart';
import '../theme/sparring_theme.dart';

class HelpGuideView extends StatefulWidget {
  const HelpGuideView({super.key});

  @override
  State<HelpGuideView> createState() => _HelpGuideViewState();
}

class _HelpGuideViewState extends State<HelpGuideView> {
  String _selectedModality = 'Muay Thai';

  @override
  Widget build(BuildContext context) {
    final keys = kGraduationGuides.keys.toList();
    final guide = kGraduationGuides[_selectedModality]!;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
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
            children: const [
              Text(
                'NIVELAMENTO UNIVERSAL (N1 A N4)',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, letterSpacing: 0.8),
              ),
              SizedBox(height: 8),
              Text(
                'Como cada arte marcial usa seu proprio sistema de faixas, cordas ou kruangs (e Boxe, MMA, Wrestling e Sambo nao usam faixas coloridas), o SparRing traduz todas as modalidades para 4 niveis equivalentes de seguranca no pareamento.',
                style: TextStyle(color: SparRingColors.textSecondary, fontSize: 12.5, height: 1.4),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'GUIA DE GRADUACOES POR MODALIDADE',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, letterSpacing: 1, color: SparRingColors.textSecondary),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: keys.map((k) {
            final active = k == _selectedModality;
            return InkWell(
              onTap: () => setState(() => _selectedModality = k),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: active ? SparRingColors.accentOrange : SparRingColors.bgSurface,
                  border: Border.all(
                    color: active ? SparRingColors.accentOrange : SparRingColors.borderStrong,
                  ),
                ),
                child: Text(
                  k.toUpperCase(),
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: active ? Colors.white : SparRingColors.textSecondary,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: SparRingColors.bgSurface,
            border: Border.all(color: SparRingColors.borderGrid),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                guide.federation.toUpperCase(),
                style: const TextStyle(
                  color: SparRingColors.accentOrange,
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.6,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                guide.overview,
                style: const TextStyle(color: SparRingColors.textSecondary, fontSize: 12.5),
              ),
              const SizedBox(height: 14),
              ...guide.ranks.map((r) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: SparRingColors.bgMain,
                      border: Border.all(color: SparRingColors.borderGrid),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 14,
                          decoration: BoxDecoration(
                            color: r.color,
                            border: Border.all(color: const Color(0xFF404040)),
                          ),
                          child: r.tip != null
                              ? Align(
                                  alignment: Alignment.centerRight,
                                  child: Container(width: 15, color: r.tip),
                                )
                              : null,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(r.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                              const SizedBox(height: 2),
                              Text(r.note, style: const TextStyle(color: SparRingColors.textSecondary, fontSize: 11.5)),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                          decoration: BoxDecoration(
                            border: Border.all(color: SparRingColors.accentOrange),
                            color: SparRingColors.accentOrange.withAlpha(28),
                          ),
                          child: Text(
                            'N${r.levelNum}',
                            style: const TextStyle(
                              color: SparRingColors.accentOrange,
                              fontWeight: FontWeight.w800,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: SparRingColors.bgSurface,
            border: Border.all(color: SparRingColors.borderGrid),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('ESCALA DE INTENSIDADE E REGRA DE PESO', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5)),
              SizedBox(height: 8),
              Text('30% a 40% (Tecnico): foco em timing, esquiva e toque leve.', style: TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
              SizedBox(height: 4),
              Text('50% a 70% (Moderado): ritmo constante e pressao controlada.', style: TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
              SizedBox(height: 4),
              Text('80% a 90% (Combate): simulacao competitiva com equipamento completo.', style: TextStyle(fontSize: 12, color: SparRingColors.textSecondary)),
              SizedBox(height: 8),
              Text(
                'Seguranca de Peso: recomendamos diferenca maxima de 6 kg a 8 kg para evitar o risco critico de lesoes (ex: 70 kg contra 100 kg).',
                style: TextStyle(fontSize: 12, color: SparRingColors.accentOrange, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
