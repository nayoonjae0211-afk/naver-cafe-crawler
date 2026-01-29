import '../../data/models/creature_model.dart';
import '../../data/models/island_model.dart';
import '../entities/growth_stage.dart';
import '../entities/environment_state.dart';

class GrowthCalculator {
  GrowthCalculator._();

  static CreatureModel calculateCreatureGrowth({
    required CreatureModel currentCreature,
    required int newTotalLogs,
    required String latestEmotion,
  }) {
    final newStage = GrowthStage.fromLogCount(newTotalLogs);

    return currentCreature.copyWith(
      growthStage: newStage,
      totalLogs: newTotalLogs,
      mood: _calculateMood(latestEmotion),
    );
  }

  static IslandModel calculateIslandGrowth({
    required IslandModel currentIsland,
    required int consecutiveDays,
  }) {
    final newEnvironment = EnvironmentState.fromConsecutiveDays(consecutiveDays);
    final newAreaLevel = _calculateAreaLevel(consecutiveDays);

    return currentIsland.copyWith(
      environmentState: newEnvironment,
      consecutiveDays: consecutiveDays,
      areaLevel: newAreaLevel,
    );
  }

  static String _calculateMood(String emotion) {
    switch (emotion) {
      case 'happy':
      case 'excited':
        return 'happy';
      case 'sad':
      case 'tired':
        return 'tired';
      case 'angry':
        return 'upset';
      case 'peaceful':
      default:
        return 'neutral';
    }
  }

  static int _calculateAreaLevel(int consecutiveDays) {
    if (consecutiveDays >= 30) return 5;
    if (consecutiveDays >= 21) return 4;
    if (consecutiveDays >= 14) return 3;
    if (consecutiveDays >= 7) return 2;
    return 1;
  }

  static int logsUntilNextStage(GrowthStage currentStage, int totalLogs) {
    final nextRequired = currentStage.logsUntilNextStage;
    if (nextRequired == null) return 0;
    return (nextRequired - totalLogs).clamp(0, nextRequired);
  }

  static double stageProgress(GrowthStage currentStage, int totalLogs) {
    final nextStage = currentStage.nextStage;
    if (nextStage == null) return 1.0;

    final currentRequired = currentStage.requiredLogs;
    final nextRequired = nextStage.requiredLogs;
    final range = nextRequired - currentRequired;

    if (range <= 0) return 1.0;

    final progress = (totalLogs - currentRequired) / range;
    return progress.clamp(0.0, 1.0);
  }

  static int daysUntilNextEnvironment(
    EnvironmentState currentState,
    int consecutiveDays,
  ) {
    switch (currentState) {
      case EnvironmentState.barren:
        return (3 - consecutiveDays).clamp(0, 3);
      case EnvironmentState.growing:
        return (7 - consecutiveDays).clamp(0, 4);
      case EnvironmentState.flourishing:
        return 0;
    }
  }
}
