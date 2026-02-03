"use client";

import { useLanguage } from "@/lib/LanguageContext";

const aboutContent = {
  ko: {
    title: "소개",
    subtitle: "Instagram Comment Crawler에 대해",
    sections: [
      {
        title: "서비스 소개",
        content: "Instagram Comment Crawler는 인스타그램 게시물의 댓글을 쉽게 수집하고 분석할 수 있는 웹 서비스입니다. 마케터, 인플루언서, 연구자들이 댓글 데이터를 효율적으로 관리할 수 있도록 도와드립니다."
      },
      {
        title: "주요 기능",
        content: "- 인스타그램 게시물 댓글 자동 수집\n- 댓글 작성자의 팔로워 여부 확인\n- Excel 파일로 데이터 내보내기\n- 실시간 수집 진행 상황 확인"
      },
      {
        title: "사용 방법",
        content: "1. 수집하려는 인스타그램 게시물 URL을 입력합니다\n2. 게시물 작성자의 인스타그램 아이디를 입력합니다\n3. 본인의 인스타그램 계정으로 로그인합니다\n4. 크롤링이 완료되면 Excel 파일로 다운로드합니다"
      },
      {
        title: "문의",
        content: "문의사항이 있으시면 문의하기 페이지를 이용해 주세요."
      }
    ]
  },
  en: {
    title: "About",
    subtitle: "About Instagram Comment Crawler",
    sections: [
      {
        title: "Service Introduction",
        content: "Instagram Comment Crawler is a web service that makes it easy to collect and analyze comments from Instagram posts. It helps marketers, influencers, and researchers efficiently manage comment data."
      },
      {
        title: "Key Features",
        content: "- Automatic Instagram post comment collection\n- Follower status verification of commenters\n- Export data to Excel file\n- Real-time collection progress tracking"
      },
      {
        title: "How to Use",
        content: "1. Enter the Instagram post URL you want to collect\n2. Enter the post author's Instagram ID\n3. Log in with your Instagram account\n4. Download as Excel file when crawling is complete"
      },
      {
        title: "Contact",
        content: "For inquiries, please use the Contact page."
      }
    ]
  },
  ja: {
    title: "概要",
    subtitle: "Instagram Comment Crawlerについて",
    sections: [
      {
        title: "サービス紹介",
        content: "Instagram Comment Crawlerは、Instagramの投稿からコメントを簡単に収集・分析できるWebサービスです。マーケター、インフルエンサー、研究者がコメントデータを効率的に管理できるよう支援します。"
      },
      {
        title: "主な機能",
        content: "- Instagram投稿コメントの自動収集\n- コメント者のフォロワー状況確認\n- Excelファイルへのデータエクスポート\n- リアルタイム収集進捗追跡"
      },
      {
        title: "使い方",
        content: "1. 収集したいInstagram投稿のURLを入力\n2. 投稿者のInstagram IDを入力\n3. あなたのInstagramアカウントでログイン\n4. クローリング完了後、Excelファイルでダウンロード"
      },
      {
        title: "お問い合わせ",
        content: "ご質問がある場合は、お問い合わせページをご利用ください。"
      }
    ]
  },
  zh: {
    title: "关于",
    subtitle: "关于Instagram Comment Crawler",
    sections: [
      {
        title: "服务介绍",
        content: "Instagram Comment Crawler是一个可以轻松收集和分析Instagram帖子评论的网络服务。它帮助营销人员、网红和研究人员高效管理评论数据。"
      },
      {
        title: "主要功能",
        content: "- 自动收集Instagram帖子评论\n- 验证评论者的关注者状态\n- 导出数据到Excel文件\n- 实时收集进度跟踪"
      },
      {
        title: "使用方法",
        content: "1. 输入要收集的Instagram帖子URL\n2. 输入帖子作者的Instagram ID\n3. 使用您的Instagram账户登录\n4. 爬取完成后下载Excel文件"
      },
      {
        title: "联系方式",
        content: "如有疑问，请使用联系我们页面。"
      }
    ]
  }
};

export default function AboutPage() {
  const { language } = useLanguage();
  const content = aboutContent[language] || aboutContent.ko;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--card-border)]">
          <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
          <p className="text-gray-500 mb-8">{content.subtitle}</p>

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
