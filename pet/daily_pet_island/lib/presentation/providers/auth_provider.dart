import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/user_repository.dart';
import '../../data/repositories/creature_repository.dart';
import '../../data/repositories/island_repository.dart';
import '../../data/services/auth_service.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepository();
});

final creatureRepositoryProvider = Provider<CreatureRepository>((ref) {
  return CreatureRepository();
});

final islandRepositoryProvider = Provider<IslandRepository>((ref) {
  return IslandRepository();
});

final authStateProvider = StreamProvider<User?>((ref) {
  return ref.watch(authServiceProvider).authStateChanges;
});

final currentUserProvider = FutureProvider<UserModel?>((ref) async {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return null;

  final userRepo = ref.watch(userRepositoryProvider);
  return await userRepo.getUser(user.uid);
});

class AuthNotifier extends StateNotifier<AsyncValue<void>> {
  final AuthService _authService;
  final UserRepository _userRepository;
  final CreatureRepository _creatureRepository;
  final IslandRepository _islandRepository;

  AuthNotifier(
    this._authService,
    this._userRepository,
    this._creatureRepository,
    this._islandRepository,
  ) : super(const AsyncValue.data(null));

  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    state = const AsyncValue.loading();
    try {
      await _authService.signInWithEmail(
        email: email,
        password: password,
      );
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String nickname,
  }) async {
    state = const AsyncValue.loading();
    try {
      final credential = await _authService.registerWithEmail(
        email: email,
        password: password,
      );

      final userId = credential.user!.uid;

      // 사용자 정보 생성
      final user = UserModel(
        id: userId,
        email: email,
        nickname: nickname,
        createdAt: DateTime.now(),
      );
      await _userRepository.createUser(user);

      // 생물 및 섬 초기화
      await Future.wait([
        _creatureRepository.getOrCreateCreature(userId),
        _islandRepository.getOrCreateIsland(userId),
      ]);

      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    try {
      await _authService.signOut();
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AsyncValue<void>>((ref) {
  return AuthNotifier(
    ref.watch(authServiceProvider),
    ref.watch(userRepositoryProvider),
    ref.watch(creatureRepositoryProvider),
    ref.watch(islandRepositoryProvider),
  );
});
