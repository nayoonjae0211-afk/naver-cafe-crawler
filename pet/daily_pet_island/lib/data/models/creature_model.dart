import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/growth_stage.dart';

class CreatureModel extends Equatable {
  final String userId;
  final GrowthStage growthStage;
  final String mood;
  final int totalLogs;

  const CreatureModel({
    required this.userId,
    required this.growthStage,
    required this.mood,
    required this.totalLogs,
  });

  factory CreatureModel.initial(String userId) {
    return CreatureModel(
      userId: userId,
      growthStage: GrowthStage.egg,
      mood: 'neutral',
      totalLogs: 0,
    );
  }

  factory CreatureModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return CreatureModel(
      userId: doc.id,
      growthStage: GrowthStage.fromString(data['growthStage'] ?? 'egg'),
      mood: data['mood'] ?? 'neutral',
      totalLogs: data['totalLogs'] ?? 0,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'growthStage': growthStage.name,
      'mood': mood,
      'totalLogs': totalLogs,
    };
  }

  CreatureModel copyWith({
    String? userId,
    GrowthStage? growthStage,
    String? mood,
    int? totalLogs,
  }) {
    return CreatureModel(
      userId: userId ?? this.userId,
      growthStage: growthStage ?? this.growthStage,
      mood: mood ?? this.mood,
      totalLogs: totalLogs ?? this.totalLogs,
    );
  }

  @override
  List<Object?> get props => [userId, growthStage, mood, totalLogs];
}
