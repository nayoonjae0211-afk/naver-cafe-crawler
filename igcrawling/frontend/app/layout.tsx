import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram Comment Crawler - 인스타그램 댓글 크롤러",
  description: "Instagram 게시물의 댓글을 수집하고 팔로워 여부를 분석합니다. Collect comments from Instagram posts and analyze follower status.",
  keywords: ["Instagram", "crawler", "comments", "follower", "크롤러", "댓글", "인스타그램", "팔로워"],
  authors: [{ url: "mailto:nayoonjae0211@gmail.com" }],
  openGraph: {
    title: "Instagram Comment Crawler",
    description: "Collect comments from Instagram posts and analyze follower status.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
