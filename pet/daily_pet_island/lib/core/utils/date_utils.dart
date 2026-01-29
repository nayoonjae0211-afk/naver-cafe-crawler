import 'package:intl/intl.dart';

class AppDateUtils {
  AppDateUtils._();

  static final DateFormat _dateFormat = DateFormat('yyyy-MM-dd');
  static final DateFormat _displayDateFormat = DateFormat('M월 d일 (E)', 'ko');
  static final DateFormat _monthFormat = DateFormat('yyyy년 M월', 'ko');

  static String formatDate(DateTime date) {
    return _dateFormat.format(date);
  }

  static String formatDisplayDate(DateTime date) {
    return _displayDateFormat.format(date);
  }

  static String formatMonth(DateTime date) {
    return _monthFormat.format(date);
  }

  static DateTime parseDate(String dateStr) {
    return _dateFormat.parse(dateStr);
  }

  static String getTodayString() {
    return formatDate(DateTime.now());
  }

  static DateTime getToday() {
    final now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  static bool isSameDay(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }

  static bool isToday(DateTime date) {
    return isSameDay(date, DateTime.now());
  }

  static bool isYesterday(DateTime date) {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return isSameDay(date, yesterday);
  }

  static int daysBetween(DateTime from, DateTime to) {
    final fromDate = DateTime(from.year, from.month, from.day);
    final toDate = DateTime(to.year, to.month, to.day);
    return toDate.difference(fromDate).inDays;
  }

  static int calculateConsecutiveDays(List<DateTime> dates) {
    if (dates.isEmpty) return 0;

    final sortedDates = dates
        .map((d) => DateTime(d.year, d.month, d.day))
        .toSet()
        .toList()
      ..sort((a, b) => b.compareTo(a));

    final today = getToday();
    if (sortedDates.isEmpty) return 0;

    // 오늘 또는 어제부터 시작해야 연속 기록으로 인정
    final mostRecent = sortedDates.first;
    final daysDiff = daysBetween(mostRecent, today);
    if (daysDiff > 1) return 0;

    int consecutive = 1;
    for (int i = 0; i < sortedDates.length - 1; i++) {
      final diff = daysBetween(sortedDates[i + 1], sortedDates[i]);
      if (diff == 1) {
        consecutive++;
      } else {
        break;
      }
    }

    return consecutive;
  }
}
