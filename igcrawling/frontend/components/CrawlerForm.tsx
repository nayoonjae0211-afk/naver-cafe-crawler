"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface CrawlerFormProps {
  onSubmit: (data: CrawlFormData) => void;
  isLoading: boolean;
}

export interface CrawlFormData {
  post_url: string;
  post_author: string;
  instagram_id: string;
  instagram_password: string;
  check_followers: boolean;
}

export default function CrawlerForm({ onSubmit, isLoading }: CrawlerFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CrawlFormData>({
    post_url: "",
    post_author: "",
    instagram_id: "",
    instagram_password: "",
    check_followers: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const extractAuthor = (url: string): string => {
    const match = url.match(/instagram\.com\/p\/[^/]+\/.*|instagram\.com\/([^/]+)\/p\//);
    if (match && match[1]) {
      return match[1];
    }
    const reelMatch = url.match(/instagram\.com\/reel\/[^/]+\/.*|instagram\.com\/([^/]+)\/reel\//);
    if (reelMatch && reelMatch[1]) {
      return reelMatch[1];
    }
    return "";
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      post_url: url,
      post_author: prev.post_author || extractAuthor(url),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.post_url || !formData.post_author || !formData.instagram_id || !formData.instagram_password) {
      alert(t("fillAllFields"));
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Instagram 게시물 URL */}
      <div>
        <label htmlFor="post_url" className="block text-sm font-medium mb-2">
          {t("postUrl")} {t("required")}
        </label>
        <input
          type="url"
          id="post_url"
          name="post_url"
          value={formData.post_url}
          onChange={handleUrlChange}
          placeholder={t("postUrlPlaceholder") as string}
          className="w-full px-4 py-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] focus:ring-2 focus:ring-[var(--primary)]"
          required
          disabled={isLoading}
        />
      </div>

      {/* 게시물 작성자 */}
      <div>
        <label htmlFor="post_author" className="block text-sm font-medium mb-2">
          {t("postAuthor")} {t("required")}
        </label>
        <input
          type="text"
          id="post_author"
          name="post_author"
          value={formData.post_author}
          onChange={handleChange}
          placeholder={t("postAuthorPlaceholder") as string}
          className="w-full px-4 py-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t("postAuthorHelper")}
        </p>
      </div>

      {/* 구분선 */}
      <div className="border-t border-[var(--card-border)] pt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">{t("loginInfoSection")}</h3>
      </div>

      {/* Instagram 아이디 */}
      <div>
        <label htmlFor="instagram_id" className="block text-sm font-medium mb-2">
          {t("instagramId")} {t("required")}
        </label>
        <input
          type="text"
          id="instagram_id"
          name="instagram_id"
          value={formData.instagram_id}
          onChange={handleChange}
          placeholder={t("instagramIdPlaceholder") as string}
          className="w-full px-4 py-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
          required
          disabled={isLoading}
        />
      </div>

      {/* Instagram 비밀번호 */}
      <div>
        <label htmlFor="instagram_password" className="block text-sm font-medium mb-2">
          {t("instagramPassword")} {t("required")}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="instagram_password"
            name="instagram_password"
            value={formData.instagram_password}
            onChange={handleChange}
            placeholder="********"
            className="w-full px-4 py-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] pr-12"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {t("passwordHelper")}
        </p>
      </div>

      {/* 팔로워 확인 옵션 */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="check_followers"
          name="check_followers"
          checked={formData.check_followers}
          onChange={handleChange}
          className="w-5 h-5 rounded border-[var(--card-border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          disabled={isLoading}
        />
        <label htmlFor="check_followers" className="text-sm">
          {t("checkFollowersDesc")}
        </label>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t("crawling")}
          </span>
        ) : (
          t("startCrawling")
        )}
      </button>
    </form>
  );
}
