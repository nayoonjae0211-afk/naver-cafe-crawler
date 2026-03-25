import ctypes
import subprocess
import time

# 화면 해상도 자동 감지
try:
    screen_w = ctypes.windll.user32.GetSystemMetrics(0)
    screen_h = ctypes.windll.user32.GetSystemMetrics(1)
except Exception:
    screen_w, screen_h = 1920, 1080

win_w = screen_w // 2
win_h = screen_h // 2

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print(f"화면 해상도: {screen_w}x{screen_h}, 창 크기: {win_w}x{win_h}")
print()

print("[nayoonjae] 포트 9222 - 좌측상단")
subprocess.Popen([
    chrome,
    "--remote-debugging-port=9222",
    "--user-data-dir=C:\\temp\\chrome_nayoonjae",
    "--no-first-run",
    "--no-default-browser-check",
    f"--window-position=0,0",
    f"--window-size={win_w},{win_h}"
])

time.sleep(2)

print("[kimyoonj319] 포트 9223 - 우측상단")
subprocess.Popen([
    chrome,
    "--remote-debugging-port=9223",
    "--user-data-dir=C:\\temp\\chrome_kimyoonj319",
    "--no-first-run",
    "--no-default-browser-check",
    f"--window-position={win_w},0",
    f"--window-size={win_w},{win_h}"
])

print()
print("두 Chrome 창이 열렸습니다.")
print("각 창에서 네이버 로그인 후, python crawler.py 를 실행하세요.")
