"use client";

import { useState, useMemo } from "react";

interface Comment {
  username: string;
  content: string;
  datetime?: string;
  is_reply: boolean;
  is_follower?: boolean;
}

interface ResultsTableProps {
  comments: Comment[];
  followerCount: number;
  nonFollowerCount: number;
  onDownload: () => void;
}

type SortKey = "username" | "datetime" | "is_follower";
type SortOrder = "asc" | "desc";
type FilterType = "all" | "follower" | "non_follower";

export default function ResultsTable({
  comments,
  followerCount,
  nonFollowerCount,
  onDownload,
}: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("datetime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredAndSortedComments = useMemo(() => {
    let result = [...comments];

    // 필터링
    if (filter === "follower") {
      result = result.filter((c) => c.is_follower);
    } else if (filter === "non_follower") {
      result = result.filter((c) => !c.is_follower);
    }

    // 검색
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.username.toLowerCase().includes(term) ||
          c.content.toLowerCase().includes(term)
      );
    }

    // 정렬
    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === "username") {
        comparison = a.username.localeCompare(b.username);
      } else if (sortKey === "datetime") {
        comparison = (a.datetime || "").localeCompare(b.datetime || "");
      } else if (sortKey === "is_follower") {
        comparison = (a.is_follower ? 1 : 0) - (b.is_follower ? 1 : 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [comments, filter, searchTerm, sortKey, sortOrder]);

  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedComments.slice(start, start + itemsPerPage);
  }, [filteredAndSortedComments, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedComments.length / itemsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`w-4 h-4 inline-block ml-1 ${active ? "text-[var(--primary)]" : "text-gray-400"}`}
    >
      {order === "asc" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      )}
    </svg>
  );

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-[var(--card-border)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">크롤링 결과</h2>
            <p className="text-sm text-gray-500">
              총 {comments.length}개 댓글 | 팔로워 {followerCount}명 | 비팔로워 {nonFollowerCount}명
            </p>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--success)] text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Excel 다운로드
          </button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="p-4 border-b border-[var(--card-border)] flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setFilter("all"); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-[var(--primary)] text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            전체 ({comments.length})
          </button>
          <button
            onClick={() => { setFilter("follower"); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "follower"
                ? "bg-[var(--success)] text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            팔로워 ({followerCount})
          </button>
          <button
            onClick={() => { setFilter("non_follower"); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "non_follower"
                ? "bg-[var(--warning)] text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            비팔로워 ({nonFollowerCount})
          </button>
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="닉네임 또는 댓글 내용 검색..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold w-12">#</th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:text-[var(--primary)]"
                onClick={() => handleSort("username")}
              >
                닉네임
                <SortIcon active={sortKey === "username"} order={sortOrder} />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">댓글 내용</th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:text-[var(--primary)]"
                onClick={() => handleSort("datetime")}
              >
                작성시간
                <SortIcon active={sortKey === "datetime"} order={sortOrder} />
              </th>
              <th
                className="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:text-[var(--primary)]"
                onClick={() => handleSort("is_follower")}
              >
                팔로우
                <SortIcon active={sortKey === "is_follower"} order={sortOrder} />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedComments.map((comment, index) => (
              <tr
                key={`${comment.username}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://instagram.com/${comment.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    @{comment.username}
                  </a>
                </td>
                <td className="px-4 py-3 max-w-md">
                  <p className="truncate" title={comment.content}>
                    {comment.content}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {comment.datetime || "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  {comment.is_follower ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      O
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      X
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[var(--card-border)] flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-[var(--card-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            이전
          </button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-[var(--card-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            다음
          </button>
        </div>
      )}

      {/* 빈 상태 */}
      {filteredAndSortedComments.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {searchTerm ? "검색 결과가 없습니다." : "표시할 댓글이 없습니다."}
        </div>
      )}
    </div>
  );
}
