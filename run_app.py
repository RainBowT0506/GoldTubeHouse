import subprocess
import time
import webbrowser
import sys
import os

def main():
    print("🚀 正在啟動 YouTube 字幕分段整理工具...")
    port = 8000
    host = "127.0.0.1"
    url = f"http://{host}:{port}"
    
    # 確保當前工作目錄為專案根目錄
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    # 啟動 uvicorn 子程序
    cmd = [sys.executable, "-m", "uvicorn", "server:app", "--host", host, "--port", str(port)]
    process = None
    try:
        process = subprocess.Popen(cmd)
        # 稍等 1.5 秒讓伺服器啟動完成
        time.sleep(1.5)
        print(f"\n🌐 伺服器已在本地啟動！網址：{url}")
        print("🔍 正在自動為您開啟瀏覽器...")
        webbrowser.open(url)
        
        # 持續等待伺服器進程結束 (使用者按 Ctrl+C 結束)
        process.wait()
    except KeyboardInterrupt:
        print("\n👋 正在終止伺服器...")
        if process:
            process.terminate()
            process.wait()
        print("✨ 伺服器已成功關閉。")
    except Exception as e:
        print(f"❌ 啟動伺服器時發生錯誤: {e}")
        if process:
            process.terminate()

if __name__ == "__main__":
    main()
