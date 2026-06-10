import os
import re
import glob
import tempfile
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp

app = FastAPI(title="YouTube Subtitle Segmenter API")

# 請求模型的 Pydantic 定義
class VideoRequest(BaseModel):
    url: str

# 剖析影片 ID
def get_video_id(url: str):
    patterns = [
        r'(?:v=|\/v\/|embed\/|shorts\/|youtu\.be\/|\/embed\/|\/v\/|watch\?v=|&v=)([^#\&\?]+)'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            candidate = match.group(1)
            if len(candidate) == 11:
                return candidate
    # 備用：若輸入本身就是符合長度與格式的 ID
    if len(url) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', url):
        return url
    return None

# 剖析下載之 VTT 內容
def parse_vtt_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 使用雙換行切分區塊
    blocks = re.split(r'\n\s*\n', content)
    subtitles = []
    
    # 標準 VTT 時間軸正則
    timestamp_re = re.compile(r'(\d{2}:)?(\d{2}):(\d{2})\.(\d{3}) --> (\d{2}:)?(\d{2}):(\d{2})\.(\d{3})')
    
    for block in blocks:
        lines = block.strip().split('\n')
        if not lines:
            continue
        
        match = None
        text_lines = []
        for line in lines:
            if timestamp_re.search(line):
                match = timestamp_re.search(line)
            elif line.strip() and not any(tag in line for tag in ['WEBVTT', 'Note', 'Kind:', 'Language:']):
                text_lines.append(line)
        
        if match:
            start_str = match.group(0).split(' --> ')[0]
            end_str = match.group(0).split(' --> ')[1]
            
            def vtt_time_to_seconds(t_str):
                parts = t_str.split(':')
                if len(parts) == 3: # HH:MM:SS.mmm
                    h = int(parts[0])
                    m = int(parts[1])
                    s_ms = parts[2].split('.')
                    s = int(s_ms[0])
                    ms = int(s_ms[1]) if len(s_ms) > 1 else 0
                    return h * 3600 + m * 60 + s + ms / 1000.0
                elif len(parts) == 2: # MM:SS.mmm
                    m = int(parts[0])
                    s_ms = parts[1].split('.')
                    s = int(s_ms[0])
                    ms = int(s_ms[1]) if len(s_ms) > 1 else 0
                    return m * 60 + s + ms / 1000.0
                return 0
                
            start = vtt_time_to_seconds(start_str)
            end = vtt_time_to_seconds(end_str)
            duration = max(0.0, end - start)
            text = " ".join(text_lines)
            
            # 清理 XML/HTML tags
            text = re.sub(r'<[^>]+>', '', text)
            text = re.sub(r'\s+', ' ', text).strip()
            
            if text:
                subtitles.append({
                    'text': text,
                    'start': start,
                    'duration': duration
                })
    return subtitles

# 使用 API 取得字幕
def fetch_subtitles_api(video_id: str):
    api = YouTubeTranscriptApi()
    try:
        # 取得影片所有的字幕清單
        transcript_list = api.list(video_id)
        
        # 優先順序：繁體中文、簡體中文、英文
        try:
            transcript = transcript_list.find_transcript(['zh-TW', 'zh-CN', 'en'])
        except:
            # 若無手動字幕，尋找對應的自動翻譯或自動生成字幕
            try:
                transcript = transcript_list.find_generated_transcript(['zh-TW', 'zh-CN', 'en'])
            except:
                # 若都沒有，直接拿清單中第一個可用的字幕
                transcript = next(iter(transcript_list))
        
        data = transcript.fetch()
        subtitles = []
        for entry in data:
            subtitles.append({
                'text': entry.get('text', ''),
                'start': entry.get('start', 0.0),
                'duration': entry.get('duration', 0.0)
            })
        return subtitles
    except Exception as e:
        print(f"[API] 取得字幕失敗 (ID: {video_id}): {e}")
        return None

# 使用 yt-dlp 備用下載與解析字幕
def fetch_subtitles_ytdlp(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    
    with tempfile.TemporaryDirectory() as temp_dir:
        ydl_opts = {
            'skip_download': True,
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['zh-TW', 'zh-CN', 'en'],
            'outtmpl': os.path.join(temp_dir, '%(id)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'ignoreerrors': True,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
        except Exception as e:
            print(f"[yt-dlp] 下載字幕遭遇錯誤: {e}")
            return None
            
        vtt_files = glob.glob(os.path.join(temp_dir, f"{video_id}.*.vtt"))
        if not vtt_files:
            print(f"[yt-dlp] 找不到下載的 VTT 檔案。")
            return None
            
        # 篩選最適語言
        selected_file = None
        for lang in ['.zh-TW.', '.zh-CN.', '.en.']:
            for f in vtt_files:
                if lang in f:
                    selected_file = f
                    break
            if selected_file:
                break
                
        if not selected_file:
            selected_file = vtt_files[0]
            
        try:
            return parse_vtt_file(selected_file)
        except Exception as e:
            print(f"[Parser] 解析 VTT 遭遇錯誤: {e}")
            return None

# 取得影片資訊 (Title, Duration, Thumbnail)
def get_video_metadata(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        'skip_download': True,
        'quiet': True,
        'no_warnings': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                'title': info.get('title', '未命名影片'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"),
                'video_id': video_id
            }
    except Exception as e:
        print(f"[yt-dlp] 擷取 metadata 失敗: {e}")
        return {
            'title': f"YouTube 影片 (ID: {video_id})",
            'duration': 0,
            'thumbnail': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            'video_id': video_id
        }

# 根路由：回傳前端網頁
@app.get("/", response_class=HTMLResponse)
async def serve_index():
    index_path = os.path.join("templates", "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>找不到前端模板，請確保 templates/index.html 存在。</h1>", status_code=404)

# API 路由：下載並剖析影片與字幕
@app.post("/api/process-video")
async def process_video(request: VideoRequest):
    video_id = get_video_id(request.url)
    if not video_id:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "請輸入有效的 YouTube 影片網址或 ID。"}
        )
        
    print(f"開始處理影片 (ID: {video_id})...")
    
    # 1. 優先嘗試 API 擷取字幕
    subtitles = fetch_subtitles_api(video_id)
    
    # 2. 備份方案：以 yt-dlp 下載解析
    if not subtitles:
        print("API 讀取失敗，降級使用 yt-dlp 擷取字幕中...")
        subtitles = fetch_subtitles_ytdlp(video_id)
        
    if not subtitles:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "無法取得該影片的字幕。請確認該影片是否有提供字幕或自動字幕。"}
        )
        
    # 3. 擷取影片資訊
    metadata = get_video_metadata(video_id)
    
    # 4. 若擷取出的 duration 為空或為 0，從最後一筆字幕起點估算
    if (not metadata.get('duration') or metadata.get('duration') == 0) and subtitles:
        last_sub = subtitles[-1]
        metadata['duration'] = int(last_sub['start'] + last_sub['duration'])
        
    print(f"處理完成！影片標題: {metadata['title']}")
    
    return {
        "status": "success",
        "video_id": video_id,
        "title": metadata['title'],
        "duration": metadata['duration'],
        "thumbnail": metadata['thumbnail'],
        "subtitles": subtitles
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
