import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/daily_log_model.dart';
import '../services/firebase_service.dart';
import '../../core/utils/date_utils.dart';

class LogRepository {
  final _collection = FirebaseService.logsCollection;

  Future<String> createLog(DailyLogModel log) async {
    final docRef = await _collection.add(log.toFirestore());
    return docRef.id;
  }

  Future<DailyLogModel?> getLog(String logId) async {
    final doc = await _collection.doc(logId).get();
    if (!doc.exists) return null;
    return DailyLogModel.fromFirestore(doc);
  }

  Future<DailyLogModel?> getTodayLog(String userId) async {
    final today = AppDateUtils.getToday();
    final tomorrow = today.add(const Duration(days: 1));

    final query = await _collection
        .where('userId', isEqualTo: userId)
        .where('createdDate', isGreaterThanOrEqualTo: Timestamp.fromDate(today))
        .where('createdDate', isLessThan: Timestamp.fromDate(tomorrow))
        .limit(1)
        .get();

    if (query.docs.isEmpty) return null;
    return DailyLogModel.fromFirestore(query.docs.first);
  }

  Future<List<DailyLogModel>> getUserLogs(
    String userId, {
    int? limit,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    Query<Map<String, dynamic>> query =
        _collection.where('userId', isEqualTo: userId);

    if (startDate != null) {
      query = query.where(
        'createdDate',
        isGreaterThanOrEqualTo: Timestamp.fromDate(startDate),
      );
    }

    if (endDate != null) {
      query = query.where(
        'createdDate',
        isLessThanOrEqualTo: Timestamp.fromDate(endDate),
      );
    }

    query = query.orderBy('createdDate', descending: true);

    if (limit != null) {
      query = query.limit(limit);
    }

    final snapshot = await query.get();
    return snapshot.docs.map((doc) => DailyLogModel.fromFirestore(doc)).toList();
  }

  Future<int> getUserLogCount(String userId) async {
    final snapshot = await _collection
        .where('userId', isEqualTo: userId)
        .count()
        .get();
    return snapshot.count ?? 0;
  }

  Future<List<DateTime>> getUserLogDates(String userId) async {
    final logs = await getUserLogs(userId);
    return logs.map((log) => log.createdDate).toList();
  }

  Stream<List<DailyLogModel>> watchUserLogs(String userId, {int? limit}) {
    Query<Map<String, dynamic>> query = _collection
        .where('userId', isEqualTo: userId)
        .orderBy('createdDate', descending: true);

    if (limit != null) {
      query = query.limit(limit);
    }

    return query.snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => DailyLogModel.fromFirestore(doc))
          .toList();
    });
  }

  Stream<DailyLogModel?> watchTodayLog(String userId) {
    final today = AppDateUtils.getToday();
    final tomorrow = today.add(const Duration(days: 1));

    return _collection
        .where('userId', isEqualTo: userId)
        .where('createdDate', isGreaterThanOrEqualTo: Timestamp.fromDate(today))
        .where('createdDate', isLessThan: Timestamp.fromDate(tomorrow))
        .limit(1)
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) return null;
      return DailyLogModel.fromFirestore(snapshot.docs.first);
    });
  }

  Future<void> updateLog(DailyLogModel log) async {
    await _collection.doc(log.id).update(log.toFirestore());
  }

  Future<void> deleteLog(String logId) async {
    await _collection.doc(logId).delete();
  }
}
