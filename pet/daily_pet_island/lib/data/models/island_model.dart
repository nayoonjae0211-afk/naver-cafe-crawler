import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/environment_state.dart';

class IslandModel extends Equatable {
  final String userId;
  final int areaLevel;
  final EnvironmentState environmentState;
  final int consecutiveDays;

  const IslandModel({
    required this.userId,
    required this.areaLevel,
    required this.environmentState,
    required this.consecutiveDays,
  });

  factory IslandModel.initial(String userId) {
    return IslandModel(
      userId: userId,
      areaLevel: 1,
      environmentState: EnvironmentState.barren,
      consecutiveDays: 0,
    );
  }

  factory IslandModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return IslandModel(
      userId: doc.id,
      areaLevel: data['areaLevel'] ?? 1,
      environmentState:
          EnvironmentState.fromString(data['environmentState'] ?? 'barren'),
      consecutiveDays: data['consecutiveDays'] ?? 0,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'areaLevel': areaLevel,
      'environmentState': environmentState.name,
      'consecutiveDays': consecutiveDays,
    };
  }

  IslandModel copyWith({
    String? userId,
    int? areaLevel,
    EnvironmentState? environmentState,
    int? consecutiveDays,
  }) {
    return IslandModel(
      userId: userId ?? this.userId,
      areaLevel: areaLevel ?? this.areaLevel,
      environmentState: environmentState ?? this.environmentState,
      consecutiveDays: consecutiveDays ?? this.consecutiveDays,
    );
  }

  @override
  List<Object?> get props => [userId, areaLevel, environmentState, consecutiveDays];
}
