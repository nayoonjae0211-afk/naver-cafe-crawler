import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/island_model.dart';
import '../../data/repositories/island_repository.dart';
import '../../data/repositories/log_repository.dart';
import '../../domain/usecases/growth_calculator.dart';
import '../../core/utils/date_utils.dart';
import 'auth_provider.dart';
import 'log_provider.dart';

final islandProvider = StreamProvider<IslandModel?>((ref) {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return Stream.value(null);

  final islandRepo = ref.watch(islandRepositoryProvider);
  return islandRepo.watchIsland(user.uid);
});

class IslandNotifier extends StateNotifier<AsyncValue<void>> {
  final IslandRepository _islandRepository;
  final LogRepository _logRepository;
  final Ref _ref;

  IslandNotifier(
    this._islandRepository,
    this._logRepository,
    this._ref,
  ) : super(const AsyncValue.data(null));

  Future<void> initializeIsland() async {
    state = const AsyncValue.loading();
    try {
      final user = _ref.read(authStateProvider).valueOrNull;
      if (user == null) return;

      await _islandRepository.getOrCreateIsland(user.uid);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateAfterLog() async {
    try {
      final user = _ref.read(authStateProvider).valueOrNull;
      if (user == null) return;

      final currentIsland = await _islandRepository.getIsland(user.uid);
      if (currentIsland == null) return;

      final dates = await _logRepository.getUserLogDates(user.uid);
      final consecutiveDays = AppDateUtils.calculateConsecutiveDays(dates);

      final updatedIsland = GrowthCalculator.calculateIslandGrowth(
        currentIsland: currentIsland,
        consecutiveDays: consecutiveDays,
      );

      await _islandRepository.updateIsland(updatedIsland);
    } catch (e) {
      // 에러 무시 - 기록 저장은 성공했으므로
    }
  }
}

final islandNotifierProvider =
    StateNotifierProvider<IslandNotifier, AsyncValue<void>>((ref) {
  return IslandNotifier(
    ref.watch(islandRepositoryProvider),
    ref.watch(logRepositoryProvider),
    ref,
  );
});
