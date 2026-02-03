"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface StatusDisplayProps {
  status: string;
  message: string;
  progress: number;
  commentsCount: number;
  currentStep?: string;
  error?: string;
}

export default function StatusDisplay({
  status,
  message,
  progress,
  commentsCount,
  error,
}: StatusDisplayProps) {
  const { t } = useLanguage();

  const statusSteps = [
    { key: "pending", label: t("statusPending") },
    { key: "logging_in", label: t("statusLoggingIn") },
    { key: "scrolling", label: t("statusScrolling") },
    { key: "extracting", label: t("statusExtracting") },
    { key: "checking_followers", label: t("statusCheckingFollowers") },
    { key: "completed", label: t("statusCompleted") },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === status);
  const isError = status === "failed";
  const isCompleted = status === "completed";

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
      {/* 진행 상태 바 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{t("progress")}</span>
          <span className="text-sm font-bold text-[var(--primary)]">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isError
                ? "bg-[var(--error)]"
                : isCompleted
                ? "bg-[var(--success)]"
                : "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 단계 표시 */}
      <div className="flex justify-between mb-6">
        {statusSteps.slice(0, -1).map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const isFailed = isError && index === currentStepIndex;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isFailed
                    ? "bg-[var(--error)] text-white"
                    : isPast || (isCompleted && index <= 4)
                    ? "bg-[var(--success)] text-white"
                    : isActive
                    ? "bg-[var(--primary)] text-white animate-pulse"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {isPast || isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : isFailed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`mt-1 text-xs ${isActive ? "text-[var(--primary)] font-medium" : "text-gray-500"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 현재 상태 메시지 */}
      <div className={`p-4 rounded-lg ${isError ? "bg-red-50 dark:bg-red-900/20" : "bg-gray-50 dark:bg-gray-800"}`}>
        <div className="flex items-center gap-3">
          {!isError && !isCompleted && (
            <svg className="animate-spin h-5 w-5 text-[var(--primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isCompleted && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[var(--success)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {isError && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[var(--error)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          <div>
            <p className={`font-medium ${isError ? "text-[var(--error)]" : ""}`}>{message}</p>
            {commentsCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">{t("collectedComments")}: {commentsCount}</p>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--error)]">{error}</p>
        )}
      </div>
    </div>
  );
}
