import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/creature_model.dart';
import '../services/firebase_service.dart';

class CreatureRepository {
  final _collection = FirebaseService.creaturesCollection;

  Future<void> createCreature(CreatureModel creature) async {
    await _collection.doc(creature.userId).set(creature.toFirestore());
  }

  Future<CreatureModel?> getCreature(String userId) async {
    final doc = await _collection.doc(userId).get();
    if (!doc.exists) return null;
    return CreatureModel.fromFirestore(doc);
  }

  Future<CreatureModel> getOrCreateCreature(String userId) async {
    final existing = await getCreature(userId);
    if (existing != null) return existing;

    final newCreature = CreatureModel.initial(userId);
    await createCreature(newCreature);
    return newCreature;
  }

  Future<void> updateCreature(CreatureModel creature) async {
    await _collection.doc(creature.userId).set(
          creature.toFirestore(),
          SetOptions(merge: true),
        );
  }

  Stream<CreatureModel?> watchCreature(String userId) {
    return _collection.doc(userId).snapshots().map((doc) {
      if (!doc.exists) return null;
      return CreatureModel.fromFirestore(doc);
    });
  }

  Future<void> deleteCreature(String userId) async {
    await _collection.doc(userId).delete();
  }
}
