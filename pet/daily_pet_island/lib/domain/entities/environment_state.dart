import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';

enum EnvironmentState {
  barren,
  growing,
  flourishing;

  String get displayName {
    switch (this) {
      case EnvironmentState.barren:
        return AppStrings.envBarren;
      case EnvironmentState.growing:
        return AppStrings.envGrowing;
      case EnvironmentState.flourishing:
        return AppStrings.envFlourishing;
    }
  }

  Color get color {
    switch (this) {
      case EnvironmentState.barren:
        return AppColors.islandBarren;
      case EnvironmentState.growing:
        return AppColors.islandGrowing;
      case EnvironmentState.flourishing:
        return AppColors.islandFlourishing;
    }
  }

  int get requiredConsecutiveDays {
    switch (this) {
      case EnvironmentState.barren:
        return 0;
      case EnvironmentState.growing:
        return 3;
      case EnvironmentState.flourishing:
        return 7;
    }
  }

  static EnvironmentState fromString(String value) {
    return EnvironmentState.values.firstWhere(
      (e) => e.name == value,
      orElse: () => EnvironmentState.barren,
    );
  }

  static EnvironmentState fromConsecutiveDays(int days) {
    if (days >= EnvironmentState.flourishing.requiredConsecutiveDays) {
      return EnvironmentState.flourishing;
    } else if (days >= EnvironmentState.growing.requiredConsecutiveDays) {
      return EnvironmentState.growing;
    }
    return EnvironmentState.barren;
  }
}
