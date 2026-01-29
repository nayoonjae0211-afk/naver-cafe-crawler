import '../../core/constants/app_strings.dart';

enum GrowthStage {
  egg,
  baby,
  teen,
  adult;

  String get displayName {
    switch (this) {
      case GrowthStage.egg:
        return AppStrings.stageEgg;
      case GrowthStage.baby:
        return AppStrings.stageBaby;
      case GrowthStage.teen:
        return AppStrings.stageTeen;
      case GrowthStage.adult:
        return AppStrings.stageAdult;
    }
  }

  int get requiredLogs {
    switch (this) {
      case GrowthStage.egg:
        return 0;
      case GrowthStage.baby:
        return 7;
      case GrowthStage.teen:
        return 30;
      case GrowthStage.adult:
        return 100;
    }
  }

  GrowthStage? get nextStage {
    switch (this) {
      case GrowthStage.egg:
        return GrowthStage.baby;
      case GrowthStage.baby:
        return GrowthStage.teen;
      case GrowthStage.teen:
        return GrowthStage.adult;
      case GrowthStage.adult:
        return null;
    }
  }

  int? get logsUntilNextStage {
    final next = nextStage;
    if (next == null) return null;
    return next.requiredLogs;
  }

  double get sizeMultiplier {
    switch (this) {
      case GrowthStage.egg:
        return 0.5;
      case GrowthStage.baby:
        return 0.7;
      case GrowthStage.teen:
        return 0.85;
      case GrowthStage.adult:
        return 1.0;
    }
  }

  static GrowthStage fromString(String value) {
    return GrowthStage.values.firstWhere(
      (e) => e.name == value,
      orElse: () => GrowthStage.egg,
    );
  }

  static GrowthStage fromLogCount(int totalLogs) {
    if (totalLogs >= GrowthStage.adult.requiredLogs) {
      return GrowthStage.adult;
    } else if (totalLogs >= GrowthStage.teen.requiredLogs) {
      return GrowthStage.teen;
    } else if (totalLogs >= GrowthStage.baby.requiredLogs) {
      return GrowthStage.baby;
    }
    return GrowthStage.egg;
  }
}
