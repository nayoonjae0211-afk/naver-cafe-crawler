import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/daily_log_model.dart';
import '../../data/repositories/log_repository.dart';
import '../../domain/entities/emotion.dart';
import '../../core/utils/date_utils.dart';
import 'auth_provider.dart';
import 'creature_provider.dart';
import 'island_provider.dart';

final logRepositoryProvider = Provider<LogRepository>((ref) {
  return LogRepository();
});

final todayLogProvider = StreamProvider<DailyLogModel?>((ref) {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return Stream.value(null);

  final logRepo = ref.watch(logRepositoryProvider);
  return logRepo.watchTodayLog(user.uid);
});

final userLogsProvider = StreamProvider<List<DailyLogModel>>((ref) {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return Stream.value([]);

  final logRepo = ref.watch(logRepositoryProvider);
  return logRepo.watchUserLogs(user.uid, limit: 100);
});

final hasLoggedTodayProvider = Provider<bool>((ref) {
  final todayLog = ref.watch(todayLogProvider);
  return todayLog.valueOrNull != null;
});

class LogNotifier extends StateNotifier<AsyncValue<void>> {
  final LogRepository _logRepository;
  final Ref _ref;

  LogNotifier(this._logRepository, this._ref)
      : super(const AsyncValue.data(null));

  Future<bool> saveLog({
    required String content,
    required Emotion emotion,
  }) async {
    state = const AsyncValue.loading();
    try {
      final user = _ref.read(authStateProvider).valueOrNull;
      if (user == null) {
        state = AsyncValue.error('로그인이 필요합니다.', StackTrace.current);
        return false;
      }

      final log = DailyLogModel(
        id: '',
        userId: user.uid,
        content: content.trim(),
        emotion: emotion,
        createdDate: DateTime.now(),
      );

      await _logRepository.createLog(log);

      // 생물과 섬 상태 업데이트
      await Future.wait([
        _ref.read(creatureNotifierProvider.notifier).updateAfterLog(emotion),
        _ref.read(islandNotifierProvider.notifier).updateAfterLog(),
      ]);

      state = const AsyncValue.data(null);
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }
}

final logNotifierProvider =
    StateNotifierProvider<LogNotifier, AsyncValue<void>>((ref) {
  return LogNotifier(
    ref.watch(logRepositoryProvider),
    ref,
  );
});

final consecutiveDaysProvider = FutureProvider<int>((ref) async {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return 0;

  final logRepo = ref.watch(logRepositoryProvider);
  final dates = await logRepo.getUserLogDates(user.uid);
  return AppDateUtils.calculateConsecutiveDays(dates);
});
