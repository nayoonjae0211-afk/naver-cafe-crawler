FROM mcr.microsoft.com/playwright/python:v1.41.0-jammy

WORKDIR /app

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Playwright 브라우저 및 시스템 의존성 설치
RUN playwright install --with-deps chromium

# 앱 복사
COPY . .

# 포트 노출
EXPOSE 8000

# 실행
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
