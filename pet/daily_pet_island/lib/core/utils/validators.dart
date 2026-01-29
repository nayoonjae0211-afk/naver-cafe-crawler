import '../constants/app_strings.dart';

class Validators {
  Validators._();

  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppStrings.errorEmptyField;
    }

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(value.trim())) {
      return AppStrings.errorInvalidEmail;
    }

    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return AppStrings.errorEmptyField;
    }

    if (value.length < 6) {
      return AppStrings.errorWeakPassword;
    }

    return null;
  }

  static String? validatePasswordConfirm(String? value, String password) {
    if (value == null || value.isEmpty) {
      return AppStrings.errorEmptyField;
    }

    if (value != password) {
      return AppStrings.errorPasswordMismatch;
    }

    return null;
  }

  static String? validateNickname(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppStrings.errorEmptyField;
    }

    if (value.trim().length < 2) {
      return '닉네임은 2자 이상이어야 합니다.';
    }

    if (value.trim().length > 20) {
      return '닉네임은 20자 이하여야 합니다.';
    }

    return null;
  }

  static String? validateLogContent(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppStrings.errorEmptyField;
    }

    if (value.trim().length > 100) {
      return '100자 이내로 작성해주세요.';
    }

    return null;
  }
}
