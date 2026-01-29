import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';

enum Emotion {
  happy,
  sad,
  angry,
  peaceful,
  tired,
  excited;

  String get displayName {
    switch (this) {
      case Emotion.happy:
        return AppStrings.emotionHappy;
      case Emotion.sad:
        return AppStrings.emotionSad;
      case Emotion.angry:
        return AppStrings.emotionAngry;
      case Emotion.peaceful:
        return AppStrings.emotionPeaceful;
      case Emotion.tired:
        return AppStrings.emotionTired;
      case Emotion.excited:
        return AppStrings.emotionExcited;
    }
  }

  Color get color {
    switch (this) {
      case Emotion.happy:
        return AppColors.emotionHappy;
      case Emotion.sad:
        return AppColors.emotionSad;
      case Emotion.angry:
        return AppColors.emotionAngry;
      case Emotion.peaceful:
        return AppColors.emotionPeaceful;
      case Emotion.tired:
        return AppColors.emotionTired;
      case Emotion.excited:
        return AppColors.emotionExcited;
    }
  }

  IconData get icon {
    switch (this) {
      case Emotion.happy:
        return Icons.sentiment_very_satisfied;
      case Emotion.sad:
        return Icons.sentiment_dissatisfied;
      case Emotion.angry:
        return Icons.sentiment_very_dissatisfied;
      case Emotion.peaceful:
        return Icons.sentiment_satisfied;
      case Emotion.tired:
        return Icons.bedtime;
      case Emotion.excited:
        return Icons.celebration;
    }
  }

  String get emoji {
    switch (this) {
      case Emotion.happy:
        return '😊';
      case Emotion.sad:
        return '😢';
      case Emotion.angry:
        return '😠';
      case Emotion.peaceful:
        return '😌';
      case Emotion.tired:
        return '😴';
      case Emotion.excited:
        return '🎉';
    }
  }

  static Emotion fromString(String value) {
    return Emotion.values.firstWhere(
      (e) => e.name == value,
      orElse: () => Emotion.peaceful,
    );
  }
}
