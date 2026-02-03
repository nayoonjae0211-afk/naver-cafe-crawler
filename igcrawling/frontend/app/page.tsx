"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import CrawlerForm, { CrawlFormData } from "@/components/CrawlerForm";
import StatusDisplay from "@/components/StatusDisplay";

// 개발/배포 환경에 따른 API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Comment {
  username: string;
  content: string;
  datetime?: string;
  is_reply: boolean;
  is_follower?: boolean;
}

interface CrawlStatus {
  task_id: string;
  status: string;
  message: string;
  progress: number;
  comments_count: number;
  current_step?: string;
  error?: string;
}

interface CrawlResult {
  task_id: string;
  status: string;
  comments: Comment[];
  total_comments: number;
  follower_count: number;
  non_follower_count: number;
  error?: string;
}

export default function Home() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<CrawlStatus | null>(null);
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 상태 폴링
  const pollStatus = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status/${id}`);
      if (!response.ok) {
        throw new Error("상태 조회 실패");
      }
      const data: CrawlStatus = await response.json();
      setStatus(data);

      // 완료 또는 실패 시 결과 조회
      if (data.status === "completed") {
        const resultResponse = await fetch(`${API_BASE_URL}/api/result/${id}`);
        if (resultResponse.ok) {
          const resultData: CrawlResult = await resultResponse.json();
          setResult(resultData);
        }
        setIsLoading(false);
        return true; // 폴링 중지
      } else if (data.status === "failed") {
        setError(data.error || "크롤링 실패");
        setIsLoading(false);
        return true; // 폴링 중지
      }

      return false; // 폴링 계속
    } catch (err) {
      console.error("상태 조회 오류:", err);
      return false;
    }
  }, []);

  // 폴링 시작
  useEffect(() => {
    if (!taskId || !isLoading) return;

    const intervalId = setInterval(async () => {
      const shouldStop = await pollStatus(taskId);
      if (shouldStop) {
        clearInterval(intervalId);
      }
    }, 2000); // 2초마다 폴링

    return () => clearInterval(intervalId);
  }, [taskId, isLoading, pollStatus]);

  // 크롤링 시작
  const handleSubmit = async (formData: CrawlFormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/crawl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "크롤링 시작 실패");
      }

      const data = await response.json();
      setTaskId(data.task_id);

      // 초기 상태 설정
      setStatus({
        task_id: data.task_id,
        status: "pending",
        message: "크롤링 대기 중...",
        progress: 0,
        comments_count: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
      setIsLoading(false);
    }
  };

  // Excel 다운로드
  const handleDownload = async () => {
    if (!taskId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/result/${taskId}/excel`);
      if (!response.ok) {
        throw new Error("다운로드 실패");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instagram_comments_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  // 새 크롤링 시작
  const handleReset = () => {
    setIsLoading(false);
    setTaskId(null);
    setStatus(null);
    setResult(null);
    setError(null);
  };

  const warningItems = t("warningItems") as string[];

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-500">
            {t("description")}
          </p>
        </header>

        {/* 메인 컨텐츠 */}
        {!status && !result && (
          <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
            <CrawlerForm onSubmit={handleSubmit} isLoading={isLoading} />

            {/* 에러 표시 */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-[var(--error)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* 주의사항 */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">{t("warning")}</h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {warningItems.map((item, idx) => (
                  <li key={idx}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 진행 상태 */}
        {status && (
          <div className="space-y-4">
            <StatusDisplay
              status={status.status}
              message={status.message}
              progress={status.progress}
              commentsCount={status.comments_count}
              currentStep={status.current_step}
              error={status.error}
            />

            {/* 완료 시 다운로드 버튼 */}
            {status.status === "completed" && (
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-[var(--success)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">{t("crawlComplete")}</h2>
                  <p className="text-gray-500">{status.comments_count}{t("commentsCollected")}</p>

                  <button
                    onClick={handleDownload}
                    className="w-full py-4 px-6 rounded-lg bg-[var(--success)] text-white font-semibold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    {t("downloadExcel")}
                  </button>
                </div>
              </div>
            )}

            {/* 실패 또는 완료 시 다시 시도 버튼 */}
            {(status.status === "failed" || status.status === "completed") && (
              <button
                onClick={handleReset}
                className="w-full py-3 px-6 rounded-lg border border-[var(--card-border)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {status.status === "failed" ? t("retry") : t("newCrawl")}
              </button>
            )}
          </div>
        )}

        {/* 푸터 */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>{t("title")} {t("version")}</p>
          <p className="mt-1">{t("footer")}</p>
        </footer>
      </div>
    </main>
  );
}
