"use client";

import { useLanguage } from "@/lib/LanguageContext";

const termsContent = {
  ko: {
    title: "이용약관",
    lastUpdated: "최종 업데이트: 2026년 2월",
    sections: [
      {
        title: "제1조 (목적)",
        content: "본 약관은 Instagram Comment Crawler(이하 '서비스')의 이용에 관한 조건과 절차를 규정함을 목적으로 합니다."
      },
      {
        title: "제2조 (서비스 내용)",
        content: "본 서비스는 다음 기능을 제공합니다:\n- Instagram 게시물 댓글 수집\n- 댓글 작성자의 팔로워 여부 확인\n- 수집된 데이터의 Excel 파일 다운로드"
      },
      {
        title: "제3조 (이용자 의무)",
        content: "이용자는 다음 사항을 준수해야 합니다:\n- 본인의 Instagram 계정으로만 서비스를 이용할 것\n- 타인의 계정 정보를 도용하지 않을 것\n- Instagram 서비스 약관을 준수할 것\n- 상업적 목적으로 무단 사용하지 않을 것"
      },
      {
        title: "제4조 (면책조항)",
        content: "운영자는 다음 사항에 대해 책임을 지지 않습니다:\n- Instagram 정책 변경으로 인한 서비스 장애\n- 이용자의 과도한 사용으로 인한 계정 제한\n- 서비스 이용 중 발생하는 데이터 손실\n- 제3자와의 분쟁"
      },
      {
        title: "제5조 (서비스 제한)",
        content: "다음 경우 서비스 이용이 제한될 수 있습니다:\n- 시간당 5회 이상의 크롤링 요청 시\n- 비정상적인 접근 패턴 감지 시\n- 약관 위반 행위 발견 시"
      },
      {
        title: "제6조 (지적재산권)",
        content: "서비스 및 관련 콘텐츠의 저작권은 운영자에게 있습니다. 수집된 Instagram 데이터의 저작권은 해당 콘텐츠 작성자에게 있습니다."
      },
      {
        title: "제7조 (약관 변경)",
        content: "본 약관은 사전 고지 후 변경될 수 있으며, 변경된 약관은 공지 후 효력이 발생합니다."
      }
    ]
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last Updated: February 2026",
    sections: [
      {
        title: "Article 1 (Purpose)",
        content: "These terms aim to define the conditions and procedures for using Instagram Comment Crawler (the 'Service')."
      },
      {
        title: "Article 2 (Service Description)",
        content: "This service provides:\n- Instagram post comment collection\n- Follower status verification of commenters\n- Excel file download of collected data"
      },
      {
        title: "Article 3 (User Obligations)",
        content: "Users must:\n- Use the service with their own Instagram account only\n- Not misuse others' account information\n- Comply with Instagram's terms of service\n- Not use for unauthorized commercial purposes"
      },
      {
        title: "Article 4 (Disclaimer)",
        content: "The operator is not responsible for:\n- Service disruptions due to Instagram policy changes\n- Account restrictions from excessive user activity\n- Data loss during service use\n- Disputes with third parties"
      },
      {
        title: "Article 5 (Service Restrictions)",
        content: "Service may be restricted when:\n- More than 5 crawling requests per hour\n- Abnormal access patterns detected\n- Terms violations discovered"
      },
      {
        title: "Article 6 (Intellectual Property)",
        content: "Service and related content copyrights belong to the operator. Instagram data copyrights belong to their respective creators."
      },
      {
        title: "Article 7 (Terms Changes)",
        content: "These terms may change with prior notice. Changed terms take effect after announcement."
      }
    ]
  },
  ja: {
    title: "利用規約",
    lastUpdated: "最終更新: 2026年2月",
    sections: [
      {
        title: "第1条（目的）",
        content: "本規約はInstagram Comment Crawler（以下「サービス」）の利用に関する条件と手順を定めることを目的とします。"
      },
      {
        title: "第2条（サービス内容）",
        content: "本サービスは以下の機能を提供します：\n- Instagram投稿コメントの収集\n- コメント者のフォロワー状況確認\n- 収集データのExcelファイルダウンロード"
      },
      {
        title: "第3条（ユーザーの義務）",
        content: "ユーザーは以下を遵守する必要があります：\n- 自分のInstagramアカウントのみでサービスを利用すること\n- 他人のアカウント情報を悪用しないこと\n- Instagramの利用規約を遵守すること\n- 無断で商業目的に使用しないこと"
      },
      {
        title: "第4条（免責事項）",
        content: "運営者は以下について責任を負いません：\n- Instagramポリシー変更によるサービス障害\n- ユーザーの過度な使用によるアカウント制限\n- サービス利用中のデータ損失\n- 第三者との紛争"
      },
      {
        title: "第5条（サービス制限）",
        content: "以下の場合、サービス利用が制限される場合があります：\n- 1時間あたり5回以上のクローリング要求時\n- 異常なアクセスパターン検出時\n- 規約違反行為発見時"
      },
      {
        title: "第6条（知的財産権）",
        content: "サービスおよび関連コンテンツの著作権は運営者に帰属します。収集されたInstagramデータの著作権は各コンテンツ作成者に帰属します。"
      },
      {
        title: "第7条（規約変更）",
        content: "本規約は事前通知後に変更される場合があり、変更された規約は告知後に効力を発します。"
      }
    ]
  },
  zh: {
    title: "服务条款",
    lastUpdated: "最后更新: 2026年2月",
    sections: [
      {
        title: "第1条（目的）",
        content: "本条款旨在规定使用Instagram Comment Crawler（以下简称'服务'）的条件和程序。"
      },
      {
        title: "第2条（服务内容）",
        content: "本服务提供：\n- Instagram帖子评论收集\n- 评论者关注者状态验证\n- 收集数据的Excel文件下载"
      },
      {
        title: "第3条（用户义务）",
        content: "用户必须：\n- 仅使用自己的Instagram账户使用服务\n- 不得滥用他人的账户信息\n- 遵守Instagram的服务条款\n- 不得用于未经授权的商业目的"
      },
      {
        title: "第4条（免责声明）",
        content: "运营者不对以下情况负责：\n- 因Instagram政策变更导致的服务中断\n- 因用户过度使用导致的账户限制\n- 服务使用期间的数据丢失\n- 与第三方的纠纷"
      },
      {
        title: "第5条（服务限制）",
        content: "以下情况可能限制服务：\n- 每小时超过5次爬取请求\n- 检测到异常访问模式\n- 发现违反条款的行为"
      },
      {
        title: "第6条（知识产权）",
        content: "服务及相关内容的版权归运营者所有。收集的Instagram数据的版权归各内容创作者所有。"
      },
      {
        title: "第7条（条款变更）",
        content: "本条款可能在事先通知后变更。变更后的条款在公告后生效。"
      }
    ]
  }
};

export default function TermsPage() {
  const { language } = useLanguage();
  const content = termsContent[language] || termsContent.ko;

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
