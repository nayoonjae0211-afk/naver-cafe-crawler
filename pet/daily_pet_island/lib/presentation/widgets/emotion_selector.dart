import 'package:flutter/material.dart';
import '../../core/constants/app_sizes.dart';
import '../../core/constants/app_strings.dart';
import '../../domain/entities/emotion.dart';

class EmotionSelector extends StatelessWidget {
  final Emotion? selectedEmotion;
  final ValueChanged<Emotion> onEmotionSelected;

  const EmotionSelector({
    super.key,
    required this.selectedEmotion,
    required this.onEmotionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.selectEmotion,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: AppSizes.md),
        Wrap(
          spacing: AppSizes.sm,
          runSpacing: AppSizes.sm,
          children: Emotion.values.map((emotion) {
            final isSelected = selectedEmotion == emotion;
            return _EmotionChip(
              emotion: emotion,
              isSelected: isSelected,
              onTap: () => onEmotionSelected(emotion),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _EmotionChip extends StatelessWidget {
  final Emotion emotion;
  final bool isSelected;
  final VoidCallback onTap;

  const _EmotionChip({
    required this.emotion,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isSelected ? emotion.color.withOpacity(0.2) : Colors.transparent,
      borderRadius: BorderRadius.circular(AppSizes.radiusRound),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSizes.radiusRound),
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSizes.md,
            vertical: AppSizes.sm,
          ),
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected ? emotion.color : Colors.grey.shade300,
              width: isSelected ? 2 : 1,
            ),
            borderRadius: BorderRadius.circular(AppSizes.radiusRound),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                emotion.emoji,
                style: const TextStyle(fontSize: AppSizes.fontXl),
              ),
              const SizedBox(width: AppSizes.xs),
              Text(
                emotion.displayName,
                style: TextStyle(
                  color: isSelected ? emotion.color : Colors.grey.shade700,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
