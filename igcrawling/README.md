# Instagram Comment Crawler

Instagram 게시물 댓글 크롤러 웹 서비스

## 구조

```
igcrawling/
├── frontend/                    # Next.js 프론트엔드
│   ├── app/
│   │   ├── page.tsx            # 메인 페이지
│   │   ├── layout.tsx          # 레이아웃
│   │   └── globals.css         # 스타일
│   ├── components/
│   │   ├── CrawlerForm.tsx     # 입력 폼
│   │   ├── ResultsTable.tsx    # 결과 테이블
│   │   └── StatusDisplay.tsx   # 진행 상태
│   ├── package.json
│   └── vercel.json
│
├── backend/                     # FastAPI 백엔드
│   ├── main.py                 # FastAPI 앱
│   ├── crawler.py              # 비동기 크롤러
│   ├── models.py               # Pydantic 모델
│   ├── requirements.txt
│   ├── Dockerfile              # Railway 배포용
│   └── railway.json
│
└── instagram_crawler.py        # 기존 데스크톱 버전
```

## 기능

- Instagram 게시물 댓글 수집
- 댓글 작성자의 팔로우 여부 확인
- 실시간 진행 상태 표시
- Excel 파일 다운로드
- 다크/라이트 모드 지원

## 로컬 실행

### 백엔드

```bash
cd backend

# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# Playwright 브라우저 설치
playwright install chromium

# 서버 실행
uvicorn main:app --reload
```

### 프론트엔드

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 배포

### Railway (백엔드)

1. Railway에서 새 프로젝트 생성
2. GitHub 연결 또는 CLI로 배포
3. `backend/` 디렉토리 지정
4. 환경변수 설정 (필요 시)

### Vercel (프론트엔드)

1. Vercel에서 새 프로젝트 생성
2. GitHub 연결
3. `frontend/` 디렉토리 지정
4. 환경변수 설정:
   - `NEXT_PUBLIC_API_URL`: Railway 백엔드 URL

`vercel.json`의 rewrite URL을 실제 Railway URL로 변경

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/` | API 상태 확인 |
| POST | `/api/crawl` | 크롤링 시작 |
| GET | `/api/status/{task_id}` | 진행 상태 조회 |
| GET | `/api/result/{task_id}` | 결과 조회 (JSON) |
| GET | `/api/result/{task_id}/excel` | 결과 다운로드 (Excel) |
| DELETE | `/api/task/{task_id}` | 작업 삭제 |

## 주의사항

- 로그인 정보는 서버에 저장되지 않음
- 시간당 5회 크롤링 제한 (Rate Limiting)
- 과도한 사용 시 Instagram 계정 제한 가능
- 개인 용도로만 사용
