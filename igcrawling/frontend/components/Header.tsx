"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageDropdown from "./LanguageDropdown";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--card-border)]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <span className="font-semibold text-sm hidden sm:inline">{t("title")}</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            {t("about")}
          </Link>
          <LanguageDropdown />
        </nav>
      </div>
    </header>
  );
}
