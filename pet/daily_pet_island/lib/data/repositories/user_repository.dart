import '../models/user_model.dart';
import '../services/firebase_service.dart';

class UserRepository {
  final _collection = FirebaseService.usersCollection;

  Future<void> createUser(UserModel user) async {
    await _collection.doc(user.id).set(user.toFirestore());
  }

  Future<UserModel?> getUser(String userId) async {
    final doc = await _collection.doc(userId).get();
    if (!doc.exists) return null;
    return UserModel.fromFirestore(doc);
  }

  Future<void> updateUser(UserModel user) async {
    await _collection.doc(user.id).update(user.toFirestore());
  }

  Future<void> deleteUser(String userId) async {
    await _collection.doc(userId).delete();
  }

  Stream<UserModel?> watchUser(String userId) {
    return _collection.doc(userId).snapshots().map((doc) {
      if (!doc.exists) return null;
      return UserModel.fromFirestore(doc);
    });
  }
}
