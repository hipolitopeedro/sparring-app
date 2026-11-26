import 'package:flutter_test/flutter_test.dart';
import 'package:sparring_mobile/data/sparring_store.dart';
import 'package:sparring_mobile/main.dart';

void main() {
  test('Calculo de compatibilidade penaliza grande diferenca de peso', () {
    final store = SparRingStore();
    final similar = store.fighters.firstWhere((f) => f.id == 'f1'); // 75kg
    final heavy = store.fighters.firstWhere((f) => f.id == 'f9'); // 99kg

    final scoreSimilar = store.computeCompatibility(similar, 60);
    final scoreHeavy = store.computeCompatibility(heavy, 60);

    expect(scoreSimilar, greaterThan(scoreHeavy));
    expect(scoreSimilar, greaterThanOrEqualTo(85));
  });

  test('Inscricao e cancelamento em aulao atualizam contagem corretamente', () {
    final store = SparRingStore();
    final ev = store.academyEvents.first;
    final initialEnrolled = ev.enrolled;

    store.toggleEventEnrollment(ev.id);
    expect(ev.enrolledByUser, isTrue);
    expect(ev.enrolled, equals(initialEnrolled + 1));

    store.toggleEventEnrollment(ev.id);
    expect(ev.enrolledByUser, isFalse);
    expect(ev.enrolled, equals(initialEnrolled));
  });

  testWidgets('Tela inicial de autenticacao SparRing renderiza corretamente', (tester) async {
    final store = SparRingStore();
    await tester.pumpWidget(SparRingMobileApp(store: store));
    expect(find.text('SparRing'), findsOneWidget);
    expect(find.text('ONDE CADA ROUND CONTA.'), findsOneWidget);
  });
}
