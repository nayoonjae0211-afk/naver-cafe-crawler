"use client";

import { useLanguage } from "@/lib/LanguageContext";

const privacyContent = {
  ko: {
    title: "개인정보처리방침",
    lastUpdated: "최종 업데이트: 2026년 2월",
    sections: [
      {
        title: "1. 수집하는 개인정보",
        content: "본 서비스는 Instagram 댓글 크롤링을 위해 다음 정보를 일시적으로 처리합니다:\n- Instagram 로그인 정보 (아이디, 비밀번호)\n- 크롤링 대상 게시물 URL\n- 게시물 작성자 정보"
      },
      {
        title: "2. 개인정보의 이용 목적",
        content: "수집된 정보는 오직 다음 목적으로만 사용됩니다:\n- Instagram 게시물 댓글 수집\n- 팔로워 여부 확인 (선택 시)"
      },
      {
        title: "3. 개인정보의 보관 및 파기",
        content: "본 서비스는 개인정보를 서버에 저장하지 않습니다. 모든 로그인 정보는 크롤링 세션 종료 즉시 메모리에서 삭제됩니다. 크롤링 결과는 다운로드 완료 후 서버에서 자동 삭제됩니다."
      },
      {
        title: "4. 제3자 제공",
        content: "본 서비스는 수집된 개인정보를 제3자에게 제공하지 않습니다."
      },
      {
        title: "5. 이용자의 권리",
        content: "이용자는 언제든지 서비스 이용을 중단할 수 있으며, 크롤링 중 취소가 가능합니다."
      },
      {
        title: "6. 문의처",
        content: "개인정보 관련 문의: nayoonjae0211@gmail.com"
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: February 2026",
    sections: [
      {
        title: "1. Information We Collect",
        content: "This service temporarily processes the following information for Instagram comment crawling:\n- Instagram login credentials (ID, password)\n- Target post URL\n- Post author information"
      },
      {
        title: "2. Purpose of Use",
        content: "Collected information is used only for:\n- Collecting Instagram post comments\n- Checking follower status (if selected)"
      },
      {
        title: "3. Data Retention and Deletion",
        content: "This service does not store personal information on servers. All login credentials are deleted from memory immediately after the crawling session ends. Crawling results are automatically deleted from the server after download."
      },
      {
        title: "4. Third-Party Disclosure",
        content: "This service does not share collected personal information with third parties."
      },
      {
        title: "5. User Rights",
        content: "Users can stop using the service at any time and can cancel during crawling."
      },
      {
        title: "6. Contact",
        content: "Privacy inquiries: nayoonjae0211@gmail.com"
      }
    ]
  },
  ja: {
    title: "プライバシーポリシー",
    lastUpdated: "最終更新: 2026年2月",
    sections: [
      {
        title: "1. 収集する個人情報",
        content: "本サービスはInstagramコメントクローリングのため、以下の情報を一時的に処理します：\n- Instagramログイン情報（ID、パスワード）\n- クローリング対象投稿のURL\n- 投稿者情報"
      },
      {
        title: "2. 個人情報の利用目的",
        content: "収集した情報は以下の目的のみに使用されます：\n- Instagram投稿コメントの収集\n- フォロワー状況の確認（選択時）"
      },
      {
        title: "3. 個人情報の保管と削除",
        content: "本サービスはサーバーに個人情報を保存しません。すべてのログイン情報はクローリングセッション終了後すぐにメモリから削除されます。クローリング結果はダウンロード完了後、サーバーから自動削除されます。"
      },
      {
        title: "4. 第三者への提供",
        content: "本サービスは収集した個人情報を第三者に提供しません。"
      },
      {
        title: "5. ユーザーの権利",
        content: "ユーザーはいつでもサービスの利用を中止でき、クローリング中にキャンセルできます。"
      },
      {
        title: "6. お問い合わせ",
        content: "プライバシーに関するお問い合わせ: nayoonjae0211@gmail.com"
      }
    ]
  },
  zh: {
    title: "隐私政策",
    lastUpdated: "最后更新: 2026年2月",
    sections: [
      {
        title: "1. 我们收集的信息",
        content: "本服务为Instagram评论爬取临时处理以下信息：\n- Instagram登录信息（ID、密码）\n- 目标帖子URL\n- 帖子作者信息"
      },
      {
        title: "2. 使用目的",
        content: "收集的信息仅用于：\n- 收集Instagram帖子评论\n- 检查关注者状态（如果选择）"
      },
      {
        title: "3. 数据保留和删除",
        content: "本服务不在服务器上存储个人信息。所有登录凭据在爬取会话结束后立即从内存中删除。爬取结果在下载完成后自动从服务器删除。"
      },
      {
        title: "4. 第三方披露",
        content: "本服务不会与第三方共享收集的个人信息。"
      },
      {
        title: "5. 用户权利",
        content: "用户可以随时停止使用服务，并可以在爬取过程中取消。"
      },
      {
        title: "6. 联系方式",
        content: "隐私查询: nayoonjae0211@gmail.com"
      }
    ]
  }
};

export default function PrivacyPage() {
  const { language } = useLanguage();
  const content = privacyContent[language] || privacyContent.ko;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--card-border)]">
          <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
          <p className="text-sm text-gray-500 mb-8">{content.lastUpdated}</p>

          <div className="space-y-6">
            {content.sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
