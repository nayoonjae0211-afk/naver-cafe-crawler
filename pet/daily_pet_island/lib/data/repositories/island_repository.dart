import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/island_model.dart';
import '../services/firebase_service.dart';

class IslandRepository {
  final _collection = FirebaseService.islandsCollection;

  Future<void> createIsland(IslandModel island) async {
    await _collection.doc(island.userId).set(island.toFirestore());
  }

  Future<IslandModel?> getIsland(String userId) async {
    final doc = await _collection.doc(userId).get();
    if (!doc.exists) return null;
    return IslandModel.fromFirestore(doc);
  }

  Future<IslandModel> getOrCreateIsland(String userId) async {
    final existing = await getIsland(userId);
    if (existing != null) return existing;

    final newIsland = IslandModel.initial(userId);
    await createIsland(newIsland);
    return newIsland;
  }

  Future<void> updateIsland(IslandModel island) async {
    await _collection.doc(island.userId).set(
          island.toFirestore(),
          SetOptions(merge: true),
        );
  }

  Stream<IslandModel?> watchIsland(String userId) {
    return _collection.doc(userId).snapshots().map((doc) {
      if (!doc.exists) return null;
      return IslandModel.fromFirestore(doc);
    });
  }

  Future<void> deleteIsland(String userId) async {
    await _collection.doc(userId).delete();
  }
}
