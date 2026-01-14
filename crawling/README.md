# 네이버 카페 크롤러

네이버 카페에서 특정 키워드가 포함된 게시글과 댓글을 자동으로 수집하는 크롤러입니다.

## 주요 기능

- 여러 네이버 카페에서 키워드 기반 게시글 검색
- 게시글 본문 및 댓글 자동 수집
- 멀티 계정/멀티 프로세스 지원 (병렬 크롤링)
- 결과를 Excel 파일로 저장
- 쿠키 기반 세션 유지 (재로그인 최소화)
- 메모리 최적화를 위한 자동 브라우저 재시작

## 기술 스택

- **Python 3.8+**
- **Playwright** - 브라우저 자동화
- **Pydantic** - 설정 검증
- **openpyxl** - Excel 파일 생성
- **tenacity** - 재시도 로직

## 설치

### 1. 의존성 설치

```bash
pip install -r requirements.txt
```

### 2. Playwright 브라우저 설치

```bash
playwright install chromium
```

### 3. 설정 파일 생성

`config.example.json`을 복사하여 `config.json`으로 저장 후 수정합니다.

```bash
cp config.example.json config.json
```

## 설정

`config.json` 파일 구조:

```json
{
  "accounts": [
    {
      "naver_id": "your_id",
      "naver_password": "your_password",
      "assigned_cafes": ["카페1", "카페2"],
      "group_name": "group1"
    }
  ],
  "cafes": [
    {
      "cafe_id": "12345678",
      "cafe_name": "카페1",
      "cafe_url": "https://cafe.naver.com/..."
    }
  ],
  "keywords": ["키워드1", "키워드2"]
}
```

| 항목 | 설명 |
|------|------|
| `accounts` | 크롤링에 사용할 네이버 계정 목록 |
| `cafes` | 크롤링 대상 카페 정보 |
| `keywords` | 검색할 키워드 목록 |

## 사용법

```bash
python crawler.py
```

실행 시 브라우저가 열리고 네이버 로그인이 필요합니다. 보안 인증(캡챠)이 있을 경우 수동으로 처리해 주세요.

## 출력

- `results/` - Excel 결과 파일
- `logs/` - 실행 로그 및 쿠키 파일

## 아키텍처

```
┌─────────────────┐     ┌─────────────────┐
│   Process 1     │     │   Process 2     │
│  (Account 1)    │     │  (Account 2)    │
│  ┌───────────┐  │     │  ┌───────────┐  │
│  │ Browser 1 │  │     │  │ Browser 2 │  │
│  └───────────┘  │     │  └───────────┘  │
│  Cafe A, B      │     │  Cafe C, D, E   │
└─────────────────┘     └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
              ┌─────────────┐
              │ Excel 저장  │
              └─────────────┘
```
