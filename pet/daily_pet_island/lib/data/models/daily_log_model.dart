import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/emotion.dart';

class DailyLogModel extends Equatable {
  final String id;
  final String userId;
  final String content;
  final Emotion emotion;
  final DateTime createdDate;

  const DailyLogModel({
    required this.id,
    required this.userId,
    required this.content,
    required this.emotion,
    required this.createdDate,
  });

  factory DailyLogModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return DailyLogModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      content: data['content'] ?? '',
      emotion: Emotion.fromString(data['emotion'] ?? 'peaceful'),
      createdDate:
          (data['createdDate'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'content': content,
      'emotion': emotion.name,
      'createdDate': Timestamp.fromDate(createdDate),
    };
  }

  DailyLogModel copyWith({
    String? id,
    String? userId,
    String? content,
    Emotion? emotion,
    DateTime? createdDate,
  }) {
    return DailyLogModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      content: content ?? this.content,
      emotion: emotion ?? this.emotion,
      createdDate: createdDate ?? this.createdDate,
    );
  }

  @override
  List<Object?> get props => [id, userId, content, emotion, createdDate];
}
