import os
import re
import glob
import tempfile
import concurrent.futures
import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp

app = FastAPI(title="YouTube Subtitle Segmenter API")

# 請求模型定義
class VideoRequest(BaseModel):
    url: str

class SegmentData(BaseModel):
    title: str
    text: str
    start: float
    end: float

class GenerateRequest(BaseModel):
    api_key: str
    model: str
    segments: list[SegmentData]

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
    if len(url) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', url):
        return url
    return None

# 剖析下載之 VTT 內容
def parse_vtt_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    blocks = re.split(r'\n\s*\n', content)
    subtitles = []
    
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
        transcript_list = api.list(video_id)
        
        try:
            transcript = transcript_list.find_transcript(['zh-TW', 'zh-CN', 'en'])
        except:
            try:
                transcript = transcript_list.find_generated_transcript(['zh-TW', 'zh-CN', 'en'])
            except:
                transcript = next(iter(transcript_list))
        
        data = transcript.fetch()
        subtitles = []
        for entry in data:
            # 相容 dictionary 與物件型態的 entry 存取方式
            if isinstance(entry, dict):
                text = entry.get('text', '')
                start = entry.get('start', 0.0)
                duration = entry.get('duration', 0.0)
            else:
                text = getattr(entry, 'text', '')
                start = getattr(entry, 'start', 0.0)
                duration = getattr(entry, 'duration', 0.0)
                
            subtitles.append({
                'text': text,
                'start': start,
                'duration': duration
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

# 呼叫 OpenAI API 的共用函式 (直接發送 HTTP 請求)
def call_openai_api(api_key: str, model: str, prompt: str, system_msg: str = "You are a helpful study and note-taking assistant."):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=120
        )
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        else:
            return f"❌ OpenAI API 錯誤 (HTTP {response.status_code}): {response.text}"
    except Exception as e:
        return f"❌ 呼叫 AI 失敗: {str(e)}"

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
    
    subtitles = fetch_subtitles_api(video_id)
    if not subtitles:
        print("API 讀取失敗，降級使用 yt-dlp 擷取字幕中...")
        subtitles = fetch_subtitles_ytdlp(video_id)
        
    if not subtitles:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "無法取得該影片的字幕。請確認該影片是否有提供字幕或自動字幕。"}
        )
        
    metadata = get_video_metadata(video_id)
    
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

# API 路由：呼叫 AI 整理筆記與專業術語
@app.post("/api/generate-notes")
async def generate_notes(request: GenerateRequest):
    api_key = request.api_key.strip()
    model = request.model
    segments = request.segments

    if not api_key:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "請提供有效的 OpenAI API Key"}
        )
    if not segments:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "無分段內容可供處理"}
        )

    print(f"開始為 {len(segments)} 個分段生成 AI 筆記 (模型: {model})...")

    # Prompt 1 範本：針對單一分段
    prompt_1_template = """幫我分多個段落作重點整理
段落用標題(#)
每個段落下的內容重點整理用無序清單，
注意：重點只需要一層，不要有第二層無序清單，清單不要標籤文字。
不需幫我做總結
不需花俏的圖示而是專注於筆記內容
不要提供額外協助的建議
如果有專業術語幫我附上英文
Ex.中文專業術語（英文）
繁體中文回答

以下是字幕內容：
{text}"""

    # Prompt 2 範本：針對合併的三個分段 (代表 60 分鐘)
    prompt_2_template = """針對以下字幕內容，
給 50 個專業術語，用無序清單
格式：* 中文專業術語（英文）：解釋
不用額外的話，只給專業術語與解釋 
不需要空行 
繁體中文回答

字幕內容：
{text}"""

    # 使用 ThreadPoolExecutor 在背景同時呼叫 API 以加速執行
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        # 1. 提交所有單一分段的 Prompt 1 筆記整理任務
        p1_futures = []
        for seg in segments:
            p1_prompt = prompt_1_template.format(text=seg.text)
            p1_futures.append(executor.submit(call_openai_api, api_key, model, p1_prompt))

        # 2. 每 3 個分段 (一組) 提交一次 Prompt 2 專業術語整理任務
        p2_futures = []
        temp_group = []
        for idx, seg in enumerate(segments):
            temp_group.append(seg.text)
            # 若累積了 3 段，或已是最後一段，合併提交
            if (idx + 1) % 3 == 0 or (idx + 1) == len(segments):
                combined_text = "\n".join(temp_group)
                p2_prompt = prompt_2_template.format(text=combined_text)
                p2_futures.append(executor.submit(call_openai_api, api_key, model, p2_prompt))
                temp_group = []

        # 3. 收集所有執行結果
        p1_results = [f.result() for f in p1_futures]
        p2_results = [f.result() for f in p2_futures]

    # 格式化輸出
    formatted_notes = []
    for idx, seg in enumerate(segments):
        formatted_notes.append({
            "title": seg.title,
            "content": p1_results[idx]
        })

    # 合併專業術語
    merged_terms = "\n".join(p2_results)

    print("AI 筆記與專業術語生成完成！")

    return {
        "status": "success",
        "notes": formatted_notes,
        "terminologies": merged_terms
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
