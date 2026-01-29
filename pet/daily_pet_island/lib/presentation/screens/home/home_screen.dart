import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_sizes.dart';
import '../../../core/constants/app_strings.dart';
import '../../../domain/usecases/growth_calculator.dart';
import '../../providers/creature_provider.dart';
import '../../providers/island_provider.dart';
import '../../providers/log_provider.dart';
import '../../widgets/creature_widget.dart';
import '../../widgets/island_widget.dart';
import '../../widgets/loading_widget.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final creatureAsync = ref.watch(creatureProvider);
    final islandAsync = ref.watch(islandProvider);
    final hasLoggedToday = ref.watch(hasLoggedTodayProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.appName),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () => context.push('/history'),
            tooltip: AppStrings.history,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => context.push('/settings'),
            tooltip: AppStrings.settings,
          ),
        ],
      ),
      body: SafeArea(
        child: creatureAsync.when(
          loading: () => const LoadingWidget(),
          error: (e, _) => Center(child: Text('오류: $e')),
          data: (creature) {
            if (creature == null) {
              return const LoadingWidget();
            }

            return islandAsync.when(
              loading: () => const LoadingWidget(),
              error: (e, _) => Center(child: Text('오류: $e')),
              data: (island) {
                if (island == null) {
                  return const LoadingWidget();
                }

                return SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSizes.md),
                    child: Column(
                      children: [
                        const SizedBox(height: AppSizes.lg),

                        // 섬 + 생물
                        Center(
                          child: IslandWidget(
                            island: island,
                            child: CreatureWidget(
                              creature: creature,
                              size: AppSizes.creatureSizeLg,
                            ),
                          ),
                        ),
                        const SizedBox(height: AppSizes.xl),

                        // 상태 카드들
                        Row(
                          children: [
                            Expanded(
                              child: _StatusCard(
                                title: AppStrings.creatureName,
                                value: creature.growthStage.displayName,
                                subtitle:
                                    '총 ${creature.totalLogs}회 기록',
                                icon: Icons.pets,
                                color: AppColors.primary,
                              ),
                            ),
                            const SizedBox(width: AppSizes.md),
                            Expanded(
                              child: _StatusCard(
                                title: AppStrings.islandName,
                                value: island.environmentState.displayName,
                                subtitle: '연속 ${island.consecutiveDays}일',
                                icon: Icons.landscape,
                                color: island.environmentState.color,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSizes.md),

                        // 성장 진행률
                        _ProgressCard(
                          title: '다음 성장까지',
                          current: creature.totalLogs,
                          target: creature.growthStage.logsUntilNextStage ??
                              creature.totalLogs,
                          progress: GrowthCalculator.stageProgress(
                            creature.growthStage,
                            creature.totalLogs,
                          ),
                        ),
                        const SizedBox(height: AppSizes.xl),

                        // 오늘의 기록 상태
                        _TodayStatusCard(hasLoggedToday: hasLoggedToday),
                        const SizedBox(height: AppSizes.lg),
                      ],
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
      floatingActionButton: hasLoggedToday
          ? null
          : FloatingActionButton.extended(
              onPressed: () => context.push('/record'),
              backgroundColor: AppColors.primary,
              icon: const Icon(Icons.edit, color: Colors.white),
              label: Text(
                AppStrings.writeRecord,
                style: const TextStyle(color: Colors.white),
              ),
            ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}

class _StatusCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _StatusCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 20, color: color),
                const SizedBox(width: AppSizes.xs),
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
            const SizedBox(height: AppSizes.sm),
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: color,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: AppSizes.xs),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProgressCard extends StatelessWidget {
  final String title;
  final int current;
  final int target;
  final double progress;

  const _ProgressCard({
    required this.title,
    required this.current,
    required this.target,
    required this.progress,
  });

  @override
  Widget build(BuildContext context) {
    final remaining = target - current;
    final isComplete = progress >= 1.0;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Text(
                  isComplete ? '최고 단계!' : '$remaining회 남음',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.md),
            ClipRRect(
              borderRadius: BorderRadius.circular(AppSizes.radiusSm),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 12,
                backgroundColor: AppColors.surfaceVariant,
                valueColor: AlwaysStoppedAnimation<Color>(
                  isComplete ? AppColors.success : AppColors.primary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TodayStatusCard extends StatelessWidget {
  final bool hasLoggedToday;

  const _TodayStatusCard({required this.hasLoggedToday});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: hasLoggedToday
          ? AppColors.success.withOpacity(0.1)
          : AppColors.secondary.withOpacity(0.2),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.md),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(AppSizes.sm),
              decoration: BoxDecoration(
                color: hasLoggedToday ? AppColors.success : AppColors.secondary,
                shape: BoxShape.circle,
              ),
              child: Icon(
                hasLoggedToday ? Icons.check : Icons.edit_note,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: AppSizes.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hasLoggedToday
                        ? AppStrings.recordDone
                        : AppStrings.noRecordToday,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  Text(
                    hasLoggedToday
                        ? '오늘도 펫이 기뻐해요!'
                        : '기록하고 펫을 성장시켜보세요',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
