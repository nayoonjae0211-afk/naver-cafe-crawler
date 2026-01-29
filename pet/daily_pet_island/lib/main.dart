import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'data/services/firebase_service.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 병렬 초기화로 시작 시간 단축
  await Future.wait([
    FirebaseService.initialize(),
    initializeDateFormatting('ko_KR'),
  ]);

  runApp(
    const ProviderScope(
      child: DailyPetIslandApp(),
    ),
  );
}
