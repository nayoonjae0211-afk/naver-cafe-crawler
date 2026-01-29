import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../data/models/creature_model.dart';
import '../../domain/entities/growth_stage.dart';

class CreatureWidget extends StatefulWidget {
  final CreatureModel creature;
  final double size;

  const CreatureWidget({
    super.key,
    required this.creature,
    this.size = AppSizes.creatureSize,
  });

  @override
  State<CreatureWidget> createState() => _CreatureWidgetState();
}

class _CreatureWidgetState extends State<CreatureWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _bounceAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);

    _bounceAnimation = Tween<double>(begin: 0, end: 8).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final actualSize = widget.size * widget.creature.growthStage.sizeMultiplier;

    return AnimatedBuilder(
      animation: _bounceAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, -_bounceAnimation.value),
          child: child,
        );
      },
      child: Container(
        width: actualSize,
        height: actualSize,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: _getGradient(),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Center(
          child: Text(
            _getEmoji(),
            style: TextStyle(fontSize: actualSize * 0.5),
          ),
        ),
      ),
    );
  }

  LinearGradient _getGradient() {
    switch (widget.creature.growthStage) {
      case GrowthStage.egg:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFFF8E1), Color(0xFFFFE0B2)],
        );
      case GrowthStage.baby:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFE8F5E9), Color(0xFFC8E6C9)],
        );
      case GrowthStage.teen:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFE3F2FD), Color(0xFFBBDEFB)],
        );
      case GrowthStage.adult:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFCE4EC), Color(0xFFF8BBD9)],
        );
    }
  }

  String _getEmoji() {
    switch (widget.creature.growthStage) {
      case GrowthStage.egg:
        return '🥚';
      case GrowthStage.baby:
        return '🐶';
      case GrowthStage.teen:
        return '🐕';
      case GrowthStage.adult:
        return '🦮';
    }
  }
}
