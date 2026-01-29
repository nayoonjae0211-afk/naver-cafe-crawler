import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../firebase_options.dart';

class FirebaseService {
  static FirebaseAuth get auth => FirebaseAuth.instance;
  static FirebaseFirestore get firestore => FirebaseFirestore.instance;

  static Future<void> initialize() async {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );

    // Firestore 설정
    firestore.settings = const Settings(
      persistenceEnabled: true,
      cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
    );
  }

  // Collections
  static CollectionReference<Map<String, dynamic>> get usersCollection =>
      firestore.collection('users');

  static CollectionReference<Map<String, dynamic>> get logsCollection =>
      firestore.collection('logs');

  static CollectionReference<Map<String, dynamic>> get creaturesCollection =>
      firestore.collection('creatures');

  static CollectionReference<Map<String, dynamic>> get islandsCollection =>
      firestore.collection('islands');
}
