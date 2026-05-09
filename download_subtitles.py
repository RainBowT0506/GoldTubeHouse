import yt_dlp
import os

def download_youtube_subtitles(url, output_path='./subtitles'):
    """
    下載 YouTube 影片或播放清單的所有字幕
    """
    # 確保輸出目錄存在
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    ydl_opts = {
        # 只下載字幕，不下載影片
        'writesubtitles': True,
        'writeautomaticsub': True,
        'skip_download': True,
        
        # 字幕語言：'all' 代表所有語言
        # 如果只想下載特定語言，可以改為 ['zh-Hant', 'en', 'ja']
        'subtitleslangs': ['en'],
        
        # 輸出路徑與檔名格式
        # %(playlist_title)s 會在是播放清單時建立子目錄
        'outtmpl': f'{output_path}/%(playlist_index)s - %(title)s.%(ext)s',
        
        # 忽略錯誤 (例如某個影片沒有字幕時繼續下一個)
        'ignoreerrors': True,
        'quiet': False,
        'no_warnings': False,
    }

    print(f"正在處理: {url}")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print(f"\n完成！字幕已儲存至: {os.path.abspath(output_path)}")
    except Exception as e:
        print(f"發生錯誤: {e}")

if __name__ == "__main__":
    import sys
    
    # 支援從命令列參數輸入網址，或是執行後再輸入
    if len(sys.argv) > 1:
        target_url = sys.argv[1]
    else:
        target_url = input("請輸入 YouTube 影片或播放清單網址: ").strip()
    
    if target_url:
        download_youtube_subtitles(target_url)
    else:
        print("未輸入網址，程式結束。")
