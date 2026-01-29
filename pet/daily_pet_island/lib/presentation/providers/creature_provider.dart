import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/creature_model.dart';
import '../../data/repositories/creature_repository.dart';
import '../../data/repositories/log_repository.dart';
import '../../domain/entities/emotion.dart';
import '../../domain/usecases/growth_calculator.dart';
import 'auth_provider.dart';
import 'log_provider.dart';

final creatureProvider = StreamProvider<CreatureModel?>((ref) {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return Stream.value(null);

  final creatureRepo = ref.watch(creatureRepositoryProvider);
  return creatureRepo.watchCreature(user.uid);
});

class CreatureNotifier extends StateNotifier<AsyncValue<void>> {
  final CreatureRepository _creatureRepository;
  final LogRepository _logRepository;
  final Ref _ref;

  CreatureNotifier(
    this._creatureRepository,
    this._logRepository,
    this._ref,
  ) : super(const AsyncValue.data(null));

  Future<void> initializeCreature() async {
    state = const AsyncValue.loading();
    try {
      final user = _ref.read(authStateProvider).valueOrNull;
      if (user == null) return;

      await _creatureRepository.getOrCreateCreature(user.uid);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateAfterLog(Emotion emotion) async {
    try {
      final user = _ref.read(authStateProvider).valueOrNull;
      if (user == null) return;

      final currentCreature = await _creatureRepository.getCreature(user.uid);
      if (currentCreature == null) return;

      final totalLogs = await _logRepository.getUserLogCount(user.uid);

      final updatedCreature = GrowthCalculator.calculateCreatureGrowth(
        currentCreature: currentCreature,
        newTotalLogs: totalLogs,
        latestEmotion: emotion.name,
      );

      await _creatureRepository.updateCreature(updatedCreature);
    } catch (e) {
      // 에러 무시 - 기록 저장은 성공했으므로
    }
  }
}

final creatureNotifierProvider =
    StateNotifierProvider<CreatureNotifier, AsyncValue<void>>((ref) {
  return CreatureNotifier(
    ref.watch(creatureRepositoryProvider),
    ref.watch(logRepositoryProvider),
    ref,
  );
});
