import 'package:flutter/material.dart';
import '../../core/constants/app_sizes.dart';
import '../../data/models/island_model.dart';
import '../../domain/entities/environment_state.dart';

class IslandWidget extends StatelessWidget {
  final IslandModel island;
  final Widget? child;

  const IslandWidget({
    super.key,
    required this.island,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: AppSizes.islandSize,
      height: AppSizes.islandSize * 0.6,
      decoration: BoxDecoration(
        gradient: _getGradient(),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(150),
          topRight: Radius.circular(150),
          bottomLeft: Radius.circular(80),
          bottomRight: Radius.circular(80),
        ),
        boxShadow: [
          BoxShadow(
            color: island.environmentState.color.withOpacity(0.4),
            blurRadius: 30,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          _buildDecorations(),
          if (child != null)
            Positioned(
              top: 20,
              child: child!,
            ),
        ],
      ),
    );
  }

  LinearGradient _getGradient() {
    switch (island.environmentState) {
      case EnvironmentState.barren:
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFFDFE6E9), Color(0xFFB2BEC3)],
        );
      case EnvironmentState.growing:
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFFA8E6CF), Color(0xFF81C784)],
        );
      case EnvironmentState.flourishing:
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF66BB6A), Color(0xFF388E3C)],
        );
    }
  }

  Widget _buildDecorations() {
    final decorations = <Widget>[];

    switch (island.environmentState) {
      case EnvironmentState.barren:
        // 몇 개의 돌만 표시
        decorations.addAll([
          const Positioned(
            left: 40,
            bottom: 30,
            child: Text('🪨', style: TextStyle(fontSize: 20)),
          ),
          const Positioned(
            right: 50,
            bottom: 40,
            child: Text('🪨', style: TextStyle(fontSize: 16)),
          ),
        ]);
        break;
      case EnvironmentState.growing:
        // 새싹과 작은 꽃
        decorations.addAll([
          const Positioned(
            left: 30,
            bottom: 25,
            child: Text('🌱', style: TextStyle(fontSize: 24)),
          ),
          const Positioned(
            right: 40,
            bottom: 35,
            child: Text('🌸', style: TextStyle(fontSize: 20)),
          ),
          const Positioned(
            left: 80,
            bottom: 45,
            child: Text('🌿', style: TextStyle(fontSize: 18)),
          ),
        ]);
        break;
      case EnvironmentState.flourishing:
        // 나무, 꽃, 풀
        decorations.addAll([
          const Positioned(
            left: 20,
            bottom: 20,
            child: Text('🌳', style: TextStyle(fontSize: 32)),
          ),
          const Positioned(
            right: 25,
            bottom: 25,
            child: Text('🌺', style: TextStyle(fontSize: 28)),
          ),
          const Positioned(
            left: 90,
            bottom: 40,
            child: Text('🌻', style: TextStyle(fontSize: 24)),
          ),
          const Positioned(
            right: 90,
            bottom: 35,
            child: Text('🌷', style: TextStyle(fontSize: 22)),
          ),
          const Positioned(
            left: 60,
            bottom: 55,
            child: Text('🦋', style: TextStyle(fontSize: 18)),
          ),
        ]);
        break;
    }

    return Stack(children: decorations);
  }
}
