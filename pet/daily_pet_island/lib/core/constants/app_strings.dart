class AppStrings {
  AppStrings._();

  // App
  static const String appName = '펫 아일랜드';
  static const String appTagline = '하루 한 줄로 키우는 나만의 펫';

  // Auth
  static const String login = '로그인';
  static const String register = '회원가입';
  static const String logout = '로그아웃';
  static const String email = '이메일';
  static const String password = '비밀번호';
  static const String passwordConfirm = '비밀번호 확인';
  static const String nickname = '닉네임';
  static const String forgotPassword = '비밀번호를 잊으셨나요?';
  static const String noAccount = '계정이 없으신가요?';
  static const String hasAccount = '이미 계정이 있으신가요?';

  // Home
  static const String home = '홈';
  static const String todayRecord = '오늘의 기록';
  static const String writeRecord = '기록하기';
  static const String noRecordToday = '오늘은 아직 기록이 없어요';
  static const String recordDone = '오늘의 기록 완료!';

  // Record
  static const String recordTitle = '오늘 하루는 어땠나요?';
  static const String recordHint = '한 줄로 표현해보세요 (최대 100자)';
  static const String selectEmotion = '오늘의 감정을 선택하세요';
  static const String save = '저장';
  static const String saving = '저장 중...';
  static const String saved = '저장되었습니다!';

  // Emotions
  static const String emotionHappy = '행복';
  static const String emotionSad = '슬픔';
  static const String emotionAngry = '화남';
  static const String emotionPeaceful = '평온';
  static const String emotionTired = '피곤';
  static const String emotionExcited = '신남';

  // History
  static const String history = '기록 히스토리';
  static const String noRecords = '아직 기록이 없어요';
  static const String startFirst = '첫 기록을 시작해보세요!';

  // Creature
  static const String creatureName = '내 펫';
  static const String stageEgg = '알';
  static const String stageBaby = '아기';
  static const String stageTeen = '청소년';
  static const String stageAdult = '성체';

  // Island
  static const String islandName = '내 섬';
  static const String envBarren = '척박한 땅';
  static const String envGrowing = '싹트는 땅';
  static const String envFlourishing = '무성한 땅';

  // Settings
  static const String settings = '설정';
  static const String profile = '프로필';
  static const String notification = '알림 설정';
  static const String about = '앱 정보';

  // Errors
  static const String errorGeneric = '문제가 발생했습니다. 다시 시도해주세요.';
  static const String errorNetwork = '네트워크 연결을 확인해주세요.';
  static const String errorInvalidEmail = '올바른 이메일을 입력해주세요.';
  static const String errorWeakPassword = '비밀번호는 6자 이상이어야 합니다.';
  static const String errorPasswordMismatch = '비밀번호가 일치하지 않습니다.';
  static const String errorEmptyField = '필수 항목을 입력해주세요.';
  static const String errorLoginFailed = '로그인에 실패했습니다.';
  static const String errorRegisterFailed = '회원가입에 실패했습니다.';

  // Success
  static const String successRegister = '회원가입이 완료되었습니다!';
  static const String successLogout = '로그아웃되었습니다.';
}
