#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
iframe 구조 디버깅 스크립트
"""
import sys
import json
import time
from playwright.sync_api import sync_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def debug_iframe_structure():
    """iframe 구조와 요소 확인"""

    # config 로드
    with open('config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)

    test_url = "https://cafe.naver.com/f-e/cafes/25228091/articles/8435309"

    print("="*80)
    print("iframe 구조 디버깅")
    print("="*80)
    print(f"테스트 URL: {test_url}\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        context = browser.new_context(
            viewport=None,
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = context.new_page()

        try:
            # 로그인
            print("로그인 중...")
            page.goto('https://nid.naver.com/nidlogin.login')
            time.sleep(0.5)

            page.fill('#id', config['naver_id'])
            time.sleep(0.5)
            page.fill('#pw', config['naver_password'])
            time.sleep(0.5)

            try:
                page.click('#log\\.login')
            except:
                page.press('#pw', 'Enter')

            print("로그인 완료 대기 중... (최대 30초)")
            print("브라우저에서 보안인증을 완료해주세요.")

            for i in range(30):
                time.sleep(1)
                if 'nid.naver.com/nidlogin' not in page.url:
                    print(f"\n✅ 로그인 성공 ({i+1}초)\n")
                    break
            else:
                print("\n⚠️  타임아웃 - 계속 진행합니다.\n")

            # 게시글 페이지로 이동
            print(f"게시글 페이지 이동: {test_url}")
            page.goto(test_url, wait_until='domcontentloaded', timeout=30000)
            time.sleep(2)  # 동적 콘텐츠 로딩 대기

            # 모든 frame 나열
            frames = page.frames
            print(f"\n📊 총 {len(frames)}개 프레임 발견\n")

            for idx, frame in enumerate(frames):
                print(f"--- 프레임 {idx} ---")
                print(f"URL: {frame.url}")
                print(f"Name: {frame.name if frame.name else '(없음)'}")
                print()

            # 각 frame에서 요소 찾기
            print("\n" + "="*80)
            print("각 프레임에서 요소 검색")
            print("="*80 + "\n")

            selectors_to_test = {
                '제목': ['h3.title_text', '.title_text', '.title_area'],
                '닉네임': ['button.nickname', '.nickname', '.nick_name'],
                '날짜': ['span.date', '.date'],
                '내용': ['.article_viewer', '.se-main-container', '.content'],
                '좋아요': ['em.u_cnt._count', '.u_cnt._count', 'em.u_cnt', '.like_count']
            }

            for idx, frame in enumerate(frames):
                print(f"\n{'='*60}")
                print(f"프레임 {idx}: {frame.url[:80]}")
                print(f"{'='*60}")

                for element_name, selectors in selectors_to_test.items():
                    found = False
                    for selector in selectors:
                        try:
                            count = frame.locator(selector).count()
                            if count > 0:
                                elem = frame.locator(selector).first
                                text = elem.inner_text()[:100] if elem else "N/A"
                                print(f"✅ {element_name} ({selector}): {count}개 발견")
                                print(f"   텍스트: {text}")
                                found = True
                                break
                        except Exception as e:
                            pass

                    if not found:
                        print(f"❌ {element_name}: 찾을 수 없음")

            print("\n\n" + "="*80)
            print("10초 후 브라우저를 닫습니다. 화면을 확인하세요.")
            print("="*80)
            time.sleep(10)

        except Exception as e:
            print(f"\n❌ 오류 발생: {e}")
            import traceback
            traceback.print_exc()

        finally:
            browser.close()

if __name__ == "__main__":
    debug_iframe_structure()
