"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--card-border)] mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            <p>{t("footer")}</p>
            <p className="mt-1">Instagram Comment Crawler {t("version")}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              {t("terms")}
            </Link>
            <Link href="/about" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              {t("about")}
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              {t("contact")}
            </Link>
          </nav>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--card-border)] text-center text-xs text-gray-400">
          <p>{t("email")}: nayoonjae0211@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
