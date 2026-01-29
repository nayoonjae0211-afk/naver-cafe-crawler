import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_sizes.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/utils/date_utils.dart';
import '../../../data/models/daily_log_model.dart';
import '../../providers/log_provider.dart';
import '../../widgets/loading_widget.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final logsAsync = ref.watch(userLogsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.history),
      ),
      body: logsAsync.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => Center(child: Text('오류: $e')),
        data: (logs) {
          if (logs.isEmpty) {
            return _EmptyState();
          }

          // 날짜별로 그룹화
          final groupedLogs = _groupLogsByDate(logs);

          return ListView.builder(
            padding: const EdgeInsets.all(AppSizes.md),
            itemCount: groupedLogs.length,
            itemBuilder: (context, index) {
              final entry = groupedLogs.entries.elementAt(index);
              return _DateSection(
                date: entry.key,
                logs: entry.value,
              );
            },
          );
        },
      ),
    );
  }

  Map<String, List<DailyLogModel>> _groupLogsByDate(List<DailyLogModel> logs) {
    final grouped = <String, List<DailyLogModel>>{};
    for (final log in logs) {
      final dateKey = AppDateUtils.formatDate(log.createdDate);
      grouped.putIfAbsent(dateKey, () => []).add(log);
    }
    return grouped;
  }
}

class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            '📝',
            style: TextStyle(fontSize: 64),
          ),
          const SizedBox(height: AppSizes.md),
          Text(
            AppStrings.noRecords,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: AppSizes.sm),
          Text(
            AppStrings.startFirst,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textSecondary,
                ),
          ),
        ],
      ),
    );
  }
}

class _DateSection extends StatelessWidget {
  final String date;
  final List<DailyLogModel> logs;

  const _DateSection({
    required this.date,
    required this.logs,
  });

  @override
  Widget build(BuildContext context) {
    final parsedDate = AppDateUtils.parseDate(date);
    final isToday = AppDateUtils.isToday(parsedDate);
    final isYesterday = AppDateUtils.isYesterday(parsedDate);

    String displayDate;
    if (isToday) {
      displayDate = '오늘';
    } else if (isYesterday) {
      displayDate = '어제';
    } else {
      displayDate = AppDateUtils.formatDisplayDate(parsedDate);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: AppSizes.sm),
          child: Text(
            displayDate,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ),
        ...logs.map((log) => _LogCard(log: log)),
        const SizedBox(height: AppSizes.md),
      ],
    );
  }
}

class _LogCard extends StatelessWidget {
  final DailyLogModel log;

  const _LogCard({required this.log});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: AppSizes.sm),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.md),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: log.emotion.color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(AppSizes.radiusMd),
              ),
              child: Center(
                child: Text(
                  log.emotion.emoji,
                  style: const TextStyle(fontSize: 24),
                ),
              ),
            ),
            const SizedBox(width: AppSizes.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    log.content,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: AppSizes.xs),
                  Text(
                    log.emotion.displayName,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: log.emotion.color,
                          fontWeight: FontWeight.w500,
                        ),
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
