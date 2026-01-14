# 네이버 카페 크롤러

네이버 카페에서 특정 키워드가 포함된 게시글과 댓글을 자동으로 수집하는 크롤러입니다.

## 기능

- 여러 네이버 카페에서 키워드 기반 게시글 검색
- 게시글 본문 및 댓글 수집
- 멀티 계정 지원 (병렬 크롤링)
- 결과를 Excel 파일로 저장

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

`config.example.json`을 복사하여 `config.json`으로 저장한 후 수정합니다.

```bash
cp config.example.json config.json
```

## 설정

`config.json` 파일을 열어 아래 항목을 수정합니다:

| 항목 | 설명 |
|------|------|
| `naver_id` | 네이버 아이디 |
| `naver_password` | 네이버 비밀번호 |
| `assigned_cafes` | 해당 계정이 담당할 카페 이름 목록 |
| `cafes` | 크롤링할 카페 정보 (ID, 이름, URL) |
| `keywords` | 검색할 키워드 목록 |

## 사용법

```bash
python crawler.py
```

실행하면 브라우저 창이 열리고 네이버 로그인 페이지가 표시됩니다. 수동으로 로그인하면 자동 크롤링이 시작됩니다.

## 결과

- 크롤링 결과는 `results/` 폴더에 Excel 파일로 저장됩니다.
- 로그는 `logs/` 폴더에 저장됩니다.
