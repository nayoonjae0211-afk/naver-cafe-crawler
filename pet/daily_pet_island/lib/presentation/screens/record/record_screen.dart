import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_sizes.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/utils/validators.dart';
import '../../../domain/entities/emotion.dart';
import '../../providers/log_provider.dart';
import '../../widgets/emotion_selector.dart';

class RecordScreen extends ConsumerStatefulWidget {
  const RecordScreen({super.key});

  @override
  ConsumerState<RecordScreen> createState() => _RecordScreenState();
}

class _RecordScreenState extends ConsumerState<RecordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _contentController = TextEditingController();
  Emotion? _selectedEmotion;

  @override
  void dispose() {
    _contentController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedEmotion == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('감정을 선택해주세요'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final success = await ref.read(logNotifierProvider.notifier).saveLog(
          content: _contentController.text,
          emotion: _selectedEmotion!,
        );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(AppStrings.saved),
          backgroundColor: AppColors.success,
        ),
      );
      context.pop();
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(AppStrings.errorGeneric),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final logState = ref.watch(logNotifierProvider);
    final isLoading = logState.isLoading;
    final characterCount = _contentController.text.length;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.todayRecord),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSizes.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Title
                Text(
                  AppStrings.recordTitle,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: AppSizes.xl),

                // Content Input
                TextFormField(
                  controller: _contentController,
                  maxLines: 4,
                  maxLength: AppSizes.maxLogLength,
                  textInputAction: TextInputAction.done,
                  decoration: InputDecoration(
                    hintText: AppStrings.recordHint,
                    alignLabelWithHint: true,
                    counterText: '',
                  ),
                  validator: Validators.validateLogContent,
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: AppSizes.xs),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    '$characterCount / ${AppSizes.maxLogLength}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: characterCount > AppSizes.maxLogLength
                              ? AppColors.error
                              : AppColors.textHint,
                        ),
                  ),
                ),
                const SizedBox(height: AppSizes.xl),

                // Emotion Selector
                EmotionSelector(
                  selectedEmotion: _selectedEmotion,
                  onEmotionSelected: (emotion) {
                    setState(() {
                      _selectedEmotion = emotion;
                    });
                  },
                ),
                const SizedBox(height: AppSizes.xxl),

                // Save Button
                SizedBox(
                  height: AppSizes.buttonHeight,
                  child: ElevatedButton(
                    onPressed: isLoading ? null : _handleSave,
                    child: isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : Text(AppStrings.save),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
