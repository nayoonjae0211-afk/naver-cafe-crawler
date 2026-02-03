"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const contactContent = {
  ko: {
    title: "문의하기",
    subtitle: "질문이나 피드백이 있으시면 아래 양식을 작성해 주세요.",
    categoryLabel: "문의 유형",
    categories: {
      bug: "버그 신고",
      feature: "기능 제안",
      question: "일반 문의",
      other: "기타"
    },
    subjectLabel: "제목",
    subjectPlaceholder: "문의 제목을 입력하세요",
    messageLabel: "내용",
    messagePlaceholder: "문의 내용을 상세히 작성해 주세요...",
    emailLabel: "회신받을 이메일 (선택)",
    emailPlaceholder: "your@email.com",
    submitButton: "문의 보내기",
    sending: "전송 중...",
    successTitle: "문의가 전송되었습니다!",
    successMessage: "빠른 시일 내에 확인 후 답변드리겠습니다.",
    newInquiry: "새 문의하기",
    responseTime: "응답 시간",
    responseTimeValue: "영업일 기준 1-2일 내 답변 드립니다.",
    note: "참고사항",
    noteContent: "- 서비스 관련 문의\n- 기술적 문제 신고\n- 개선 제안\n- 기타 피드백"
  },
  en: {
    title: "Contact Us",
    subtitle: "Fill out the form below with your questions or feedback.",
    categoryLabel: "Inquiry Type",
    categories: {
      bug: "Bug Report",
      feature: "Feature Request",
      question: "General Inquiry",
      other: "Other"
    },
    subjectLabel: "Subject",
    subjectPlaceholder: "Enter inquiry subject",
    messageLabel: "Message",
    messagePlaceholder: "Please describe your inquiry in detail...",
    emailLabel: "Reply Email (Optional)",
    emailPlaceholder: "your@email.com",
    submitButton: "Send Inquiry",
    sending: "Sending...",
    successTitle: "Inquiry Sent!",
    successMessage: "We will review and respond as soon as possible.",
    newInquiry: "New Inquiry",
    responseTime: "Response Time",
    responseTimeValue: "We respond within 1-2 business days.",
    note: "Notes",
    noteContent: "- Service-related inquiries\n- Technical issue reports\n- Improvement suggestions\n- Other feedback"
  },
  ja: {
    title: "お問い合わせ",
    subtitle: "ご質問やフィードバックは下記フォームにご記入ください。",
    categoryLabel: "お問い合わせ種類",
    categories: {
      bug: "バグ報告",
      feature: "機能リクエスト",
      question: "一般的なお問い合わせ",
      other: "その他"
    },
    subjectLabel: "件名",
    subjectPlaceholder: "お問い合わせの件名を入力",
    messageLabel: "内容",
    messagePlaceholder: "お問い合わせ内容を詳しくご記入ください...",
    emailLabel: "返信用メールアドレス（任意）",
    emailPlaceholder: "your@email.com",
    submitButton: "送信する",
    sending: "送信中...",
    successTitle: "お問い合わせを送信しました！",
    successMessage: "確認後、できるだけ早くご返信いたします。",
    newInquiry: "新規お問い合わせ",
    responseTime: "回答時間",
    responseTimeValue: "営業日1-2日以内に回答いたします。",
    note: "備考",
    noteContent: "- サービス関連のお問い合わせ\n- 技術的な問題の報告\n- 改善提案\n- その他のフィードバック"
  },
  zh: {
    title: "联系我们",
    subtitle: "如有问题或反馈，请填写以下表单。",
    categoryLabel: "咨询类型",
    categories: {
      bug: "错误报告",
      feature: "功能请求",
      question: "一般咨询",
      other: "其他"
    },
    subjectLabel: "主题",
    subjectPlaceholder: "输入咨询主题",
    messageLabel: "内容",
    messagePlaceholder: "请详细描述您的咨询内容...",
    emailLabel: "回复邮箱（可选）",
    emailPlaceholder: "your@email.com",
    submitButton: "发送咨询",
    sending: "发送中...",
    successTitle: "咨询已发送！",
    successMessage: "我们会尽快审核并回复。",
    newInquiry: "新咨询",
    responseTime: "回复时间",
    responseTimeValue: "我们在1-2个工作日内回复。",
    note: "备注",
    noteContent: "- 服务相关咨询\n- 技术问题报告\n- 改进建议\n- 其他反馈"
  }
};

type Category = "bug" | "feature" | "question" | "other";

export default function ContactPage() {
  const { language } = useLanguage();
  const content = contactContent[language] || contactContent.ko;

  const [category, setCategory] = useState<Category>("question");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const categoryName = content.categories[category];
    const emailSubject = `[${categoryName}] ${subject}`;
    const emailBody = `문의 유형: ${categoryName}\n\n${message}${replyEmail ? `\n\n회신 이메일: ${replyEmail}` : ""}`;

    // mailto 링크로 이메일 클라이언트 열기
    const mailtoLink = `mailto:nayoonjae0211@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;

    // 짧은 딜레이 후 성공 상태 표시
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleNewInquiry = () => {
    setCategory("question");
    setSubject("");
    setMessage("");
    setReplyEmail("");
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--card-border)] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">{content.successTitle}</h1>
            <p className="text-gray-500 mb-6">{content.successMessage}</p>
            <button
              onClick={handleNewInquiry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {content.newInquiry}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--card-border)]">
          <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
          <p className="text-gray-500 mb-8">{content.subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 문의 유형 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">{content.categoryLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(content.categories) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {content.categories[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium mb-2">{content.subjectLabel}</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={content.subjectPlaceholder}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium mb-2">{content.messageLabel}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={content.messagePlaceholder}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* 회신 이메일 */}
            <div>
              <label className="block text-sm font-medium mb-2">{content.emailLabel}</label>
              <input
                type="email"
                value={replyEmail}
                onChange={(e) => setReplyEmail(e.target.value)}
                placeholder={content.emailPlaceholder}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting || !subject || !message}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? content.sending : content.submitButton}
            </button>
          </form>

          {/* 참고사항 */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold text-sm text-gray-500 mb-1">{content.responseTime}</h3>
              <p>{content.responseTimeValue}</p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">{content.note}</h3>
              <p className="text-yellow-700 dark:text-yellow-300 whitespace-pre-line">
                {content.noteContent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
