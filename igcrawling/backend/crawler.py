"""
Instagram 댓글 크롤러
- playwright.sync_api 사용 (스레드에서 실행)
- 진행 상태 콜백 지원
- 서버 환경용 headless 모드
"""

import asyncio
import random
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Callable, Awaitable
from playwright.sync_api import sync_playwright, Page, Browser, BrowserContext

from models import TaskStatus, CommentData, CrawlProgress

# 스레드 풀 (크롤러 실행용)
executor = ThreadPoolExecutor(max_workers=2)


class InstagramCrawler:
    """동기 Instagram 댓글 크롤러"""

    def __init__(
        self,
        post_url: str,
        post_author: str,
        instagram_id: str,
        instagram_password: str,
        check_followers: bool = True,
        progress_callback: Optional[Callable[[CrawlProgress], None]] = None,
        task_id: str = ""
    ):
        self.post_url = post_url
        self.post_author = post_author
        self.instagram_id = instagram_id
        self.instagram_password = instagram_password
        self.check_followers = check_followers
        self.progress_callback = progress_callback
        self.task_id = task_id

        # 브라우저 관련
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None

        # 수집된 데이터
        self.comments: List[CommentData] = []
        self.follower_cache: Dict[str, bool] = {}

    def _update_progress(
        self,
        status: TaskStatus,
        message: str,
        progress: int = 0,
        comments_count: int = 0,
        current_step: Optional[str] = None,
        error: Optional[str] = None
    ):
        """진행 상태 업데이트"""
        if self.progress_callback:
            self.progress_callback(CrawlProgress(
                task_id=self.task_id,
                status=status,
                message=message,
                progress=progress,
                comments_count=comments_count,
                current_step=current_step,
                error=error
            ))

    def _wait(self, seconds: float):
        """대기"""
        time.sleep(seconds)

    def _start_browser(self):
        """브라우저 시작"""
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(
            headless=True,  # 서버 환경: headless 모드
            args=[
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
            ]
        )

        self.context = self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        self.page = self.context.new_page()

    def _close_browser(self):
        """브라우저 종료"""
        try:
            if self.context:
                self.context.close()
            if self.browser:
                self.browser.close()
            if self.playwright:
                self.playwright.stop()
        except Exception:
            pass

    def _login(self) -> bool:
        """Instagram 로그인"""
        self._update_progress(
            TaskStatus.LOGGING_IN,
            "Instagram 로그인 중...",
            progress=5,
            current_step="login"
        )

        try:
            self.page.goto('https://www.instagram.com/accounts/login/', wait_until='domcontentloaded', timeout=60000)
            self._wait(3)

            # 아이디 입력 (username 또는 email)
            username_input = self.page.locator('input[name="username"], input[name="email"]').first
            username_input.fill(self.instagram_id)
            self._wait(0.5)

            # 비밀번호 입력 (password 또는 pass)
            password_input = self.page.locator('input[name="password"], input[name="pass"]').first
            password_input.fill(self.instagram_password)
            self._wait(0.5)

            # 로그인 버튼 클릭
            login_button = self.page.locator('button[type="submit"], div[role="button"]:has-text("로그인")').first
            login_button.click()

            self._update_progress(
                TaskStatus.LOGGING_IN,
                "로그인 처리 대기 중...",
                progress=10,
                current_step="login"
            )

            # 로그인 대기
            self._wait(10)

            # 게시물로 이동
            self.page.goto(self.post_url, wait_until='domcontentloaded', timeout=60000)
            self._wait(3)

            self._update_progress(
                TaskStatus.LOGGING_IN,
                "로그인 완료, 게시물 로드 중...",
                progress=15,
                current_step="login"
            )

            return True

        except Exception as e:
            self._update_progress(
                TaskStatus.FAILED,
                f"로그인 실패: {str(e)}",
                error=str(e)
            )
            return False

    def _scroll_until_hidden_comments(self):
        """숨겨진 댓글 보기 버튼까지 스크롤"""
        self._update_progress(
            TaskStatus.SCROLLING,
            "댓글 로딩 중...",
            progress=20,
            current_step="scroll"
        )

        scroll_count = 0
        max_scrolls = 500

        scroll_js = """
        () => {
            const container = document.querySelector('div.x5yr21d.xw2csxc.x1odjw0f.x1n2onr6');
            if (container) {
                container.scrollTop = container.scrollHeight;
                return true;
            }
            return false;
        }
        """

        while scroll_count < max_scrolls:
            # 숨겨진 댓글 버튼 확인
            try:
                hidden_btn = self.page.locator('svg[aria-label="숨겨진 댓글 보기"]').first
                if hidden_btn.count() > 0:
                    break
            except:
                pass

            self.page.evaluate(scroll_js)
            scroll_count += 1

            # 진행률 업데이트 (20-40%)
            progress = 20 + min(scroll_count // 25, 20)
            if scroll_count % 10 == 0:
                self._update_progress(
                    TaskStatus.SCROLLING,
                    f"댓글 로딩 중... (스크롤 {scroll_count}회)",
                    progress=progress,
                    current_step="scroll"
                )

            self._wait(1)

    def _click_hidden_comments(self):
        """숨겨진 댓글 보기 클릭"""
        try:
            hidden_btn = self.page.locator('svg[aria-label="숨겨진 댓글 보기"]').first
            if hidden_btn.count() > 0:
                hidden_btn.click()
                self._wait(2)
        except:
            pass

    def _click_reply_buttons(self):
        """답글 보기 버튼 클릭"""
        self._update_progress(
            TaskStatus.SCROLLING,
            "답글 펼치는 중...",
            progress=45,
            current_step="replies"
        )

        click_count = 0
        max_attempts = 200

        for _ in range(max_attempts):
            try:
                reply_buttons = self.page.locator('span.x1lliihq').filter(
                    has_text="답글"
                ).filter(has_text="모두 보기").all()

                if not reply_buttons:
                    break

                clicked = False
                for btn in reply_buttons:
                    try:
                        if btn.is_visible():
                            btn.click()
                            click_count += 1
                            self._wait(1)
                            clicked = True
                    except:
                        continue

                if not clicked:
                    break

            except:
                break

    def _extract_comments(self) -> List[CommentData]:
        """댓글 추출"""
        self._update_progress(
            TaskStatus.EXTRACTING,
            "댓글 추출 중...",
            progress=50,
            current_step="extract"
        )

        js_code = """
        () => {
            const results = [];
            const seen = new Set();

            document.querySelectorAll('span[dir="auto"]').forEach(span => {
                const text = span.textContent.trim();
                const style = span.getAttribute('style') || '';

                const isUsername = /^[a-zA-Z0-9_.]+$/.test(text);
                const uiTexts = ['Meta의 다른 앱', '좋아요', '답글 달기', '번역 보기', '탐색 탭', '더 보기', '메시지', '만들기', '프로필', '블로그', '채용 정보', '도움말', '개인정보처리방침', 'Meta AI', '한국어', 'Instagram Lite', 'Meta Verified'];
                const isUI = uiTexts.includes(text) || text.includes('연락처 업로드') || text.includes('© 2026') || text.includes('© 2025') || text.includes('Instagram from');
                const hasReply = (text.includes('답글') && text.includes('보기')) || (text.includes('답글') && text.includes('숨기기'));
                const isTime = /^\\d+[시분초주일개월년]/.test(text) || /^\\d+[시분초주일개월년]\\s*전?$/.test(text);
                const isLike = /^좋아요\\s*\\d*개?$/.test(text);

                if (text.length >= 3 && style.includes('line-clamp') && !isUsername && !isUI && !text.startsWith('@') && !hasReply && !isTime && !isLike) {
                    let username = '';
                    let datetime = '';
                    let el = span;

                    for (let level = 0; level < 15; level++) {
                        if (!el.parentElement) break;
                        el = el.parentElement;

                        if (!username) {
                            const links = el.querySelectorAll('a[href]');
                            for (const a of links) {
                                const href = a.getAttribute('href');
                                if (href && href.match(/^\\/[a-zA-Z0-9_.]+\\/$/) && !['reels', 'explore', ''].includes(href.replace(/\\//g, ''))) {
                                    username = href.replace(/\\//g, '');
                                    break;
                                }
                            }
                        }

                        if (!datetime) {
                            const timeTag = el.querySelector('time[datetime]');
                            if (timeTag) {
                                datetime = timeTag.getAttribute('datetime');
                            }
                        }

                        if (username && datetime) break;
                    }

                    const key = username + ':' + text.substring(0, 30);
                    if (username && !seen.has(key)) {
                        seen.add(key);
                        results.push({
                            username: username,
                            content: text,
                            datetime: datetime,
                            is_reply: false
                        });
                    }
                }
            });

            return results;
        }
        """

        try:
            raw_comments = self.page.evaluate(js_code)
            comments = [CommentData(**c) for c in raw_comments]

            self._update_progress(
                TaskStatus.EXTRACTING,
                f"{len(comments)}개 댓글 추출 완료",
                progress=55,
                comments_count=len(comments),
                current_step="extract"
            )

            return comments
        except Exception as e:
            return []

    def _check_follow_status(self, usernames: List[str]) -> Dict[str, bool]:
        """팔로우 여부 확인"""
        if not self.check_followers:
            return {u: False for u in usernames}

        self._update_progress(
            TaskStatus.CHECKING_FOLLOWERS,
            f"팔로우 여부 확인 중... (0/{len(usernames)})",
            progress=60,
            current_step="followers"
        )

        results = {}
        total = len(usernames)

        try:
            # 작성자 프로필로 이동
            self.page.goto(f'https://www.instagram.com/{self.post_author}/', wait_until='domcontentloaded')
            self._wait(2)

            # 팔로워 버튼 클릭
            follower_link = self.page.locator(f'a[href="/{self.post_author}/followers/"]').first
            if follower_link.count() == 0:
                follower_link = self.page.locator('a:has-text("팔로워")').first

            if follower_link.count() == 0:
                return {u: False for u in usernames}

            follower_link.click()
            self._wait(2)

            # 검색창 찾기
            search_input = self.page.locator('input[placeholder="검색"]').first
            if search_input.count() == 0:
                search_input = self.page.locator('input[type="text"]').first

            if search_input.count() == 0:
                self.page.keyboard.press('Escape')
                return {u: False for u in usernames}

            # 각 사용자 검색
            follower_count = 0
            non_follower_count = 0

            for i, username in enumerate(usernames, 1):
                if username in self.follower_cache:
                    results[username] = self.follower_cache[username]
                    if results[username]:
                        follower_count += 1
                    else:
                        non_follower_count += 1
                    continue

                try:
                    search_input.fill('')
                    self._wait(0.5)
                    search_input.fill(username)
                    wait_time = random.uniform(3, 5)
                    self._wait(wait_time)

                    result_link = self.page.locator(f'a[href="/{username}/"] span:has-text("{username}")').first
                    is_follower = result_link.count() > 0

                    results[username] = is_follower
                    self.follower_cache[username] = is_follower

                    if is_follower:
                        follower_count += 1
                    else:
                        non_follower_count += 1

                    # 진행률 업데이트 (60-95%)
                    progress = 60 + int((i / total) * 35)
                    if i % 5 == 0 or i == total:
                        self._update_progress(
                            TaskStatus.CHECKING_FOLLOWERS,
                            f"팔로우 여부 확인 중... ({i}/{total})",
                            progress=progress,
                            comments_count=len(self.comments),
                            current_step="followers"
                        )

                    # 10명마다 추가 대기
                    if i % 10 == 0 and i < total:
                        self._wait(15)

                except Exception:
                    results[username] = False
                    self.follower_cache[username] = False
                    non_follower_count += 1

            self.page.keyboard.press('Escape')
            self._wait(0.5)

        except Exception:
            for username in usernames:
                if username not in results:
                    results[username] = False

        return results

    def _convert_utc_to_kst(self, utc_str: str) -> str:
        """UTC -> KST 변환"""
        if not utc_str:
            return ""
        try:
            utc_str = utc_str.replace('Z', '+00:00')
            dt = datetime.fromisoformat(utc_str.replace('.000', ''))
            kst = dt + timedelta(hours=9)
            return kst.strftime('%Y-%m-%d %H:%M:%S')
        except Exception:
            return utc_str

    def run(self) -> Dict:
        """크롤링 실행 (동기)"""
        result = {
            "success": False,
            "comments": [],
            "follower_count": 0,
            "non_follower_count": 0,
            "error": None
        }

        try:
            self._update_progress(
                TaskStatus.PENDING,
                "크롤링 시작...",
                progress=0
            )

            # 1. 브라우저 시작
            self._start_browser()

            # 2. 로그인
            if not self._login():
                return result

            # 3. 스크롤
            self._scroll_until_hidden_comments()

            # 4. 숨겨진 댓글 보기
            self._click_hidden_comments()

            # 5. 답글 펼치기
            self._click_reply_buttons()

            # 6. 댓글 추출
            self.comments = self._extract_comments()

            if not self.comments:
                result["error"] = "댓글을 찾을 수 없습니다."
                self._update_progress(
                    TaskStatus.FAILED,
                    "댓글을 찾을 수 없습니다.",
                    error=result["error"]
                )
                return result

            # 7. 팔로우 여부 확인
            unique_usernames = list(set(c.username for c in self.comments))
            follow_status = self._check_follow_status(unique_usernames)

            # 결과에 팔로우 여부 추가
            for comment in self.comments:
                comment.is_follower = follow_status.get(comment.username, False)
                # 시간 변환
                if comment.datetime:
                    comment.datetime = self._convert_utc_to_kst(comment.datetime)

            follower_count = sum(1 for v in follow_status.values() if v)
            non_follower_count = len(follow_status) - follower_count

            result["success"] = True
            result["comments"] = self.comments
            result["follower_count"] = follower_count
            result["non_follower_count"] = non_follower_count

            self._update_progress(
                TaskStatus.COMPLETED,
                f"크롤링 완료! {len(self.comments)}개 댓글 수집",
                progress=100,
                comments_count=len(self.comments)
            )

        except Exception as e:
            result["error"] = str(e)
            self._update_progress(
                TaskStatus.FAILED,
                f"오류 발생: {str(e)}",
                error=str(e)
            )

        finally:
            self._close_browser()

        return result


def run_crawler_sync(
    post_url: str,
    post_author: str,
    instagram_id: str,
    instagram_password: str,
    check_followers: bool,
    progress_callback: Callable[[CrawlProgress], None],
    task_id: str
) -> Dict:
    """동기 크롤러 실행 (스레드에서 호출용)"""
    crawler = InstagramCrawler(
        post_url=post_url,
        post_author=post_author,
        instagram_id=instagram_id,
        instagram_password=instagram_password,
        check_followers=check_followers,
        progress_callback=progress_callback,
        task_id=task_id
    )
    return crawler.run()


async def run_crawler_in_thread(
    post_url: str,
    post_author: str,
    instagram_id: str,
    instagram_password: str,
    check_followers: bool,
    progress_callback: Callable[[CrawlProgress], Awaitable[None]],
    task_id: str
) -> Dict:
    """스레드에서 크롤러 실행 (비동기 래퍼)"""
    loop = asyncio.get_event_loop()

    # 동기 콜백 래퍼
    def sync_callback(progress: CrawlProgress):
        asyncio.run_coroutine_threadsafe(progress_callback(progress), loop)

    # 스레드에서 실행
    result = await loop.run_in_executor(
        executor,
        run_crawler_sync,
        post_url,
        post_author,
        instagram_id,
        instagram_password,
        check_followers,
        sync_callback,
        task_id
    )

    return result
