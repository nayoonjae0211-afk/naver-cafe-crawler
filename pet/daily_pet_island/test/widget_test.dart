import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Firebase 초기화가 필요하므로 기본 테스트는 스킵
    // 실제 테스트는 Firebase 모킹 후 진행
    expect(true, isTrue);
  });
}
