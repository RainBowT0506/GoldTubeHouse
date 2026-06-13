import os
import re
import glob
import tempfile
import concurrent.futures
import requests
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp

from typing import Optional

app = FastAPI(title="YouTube Subtitle Segmenter API")

# 請求模型定義
class VideoRequest(BaseModel):
    url: str

class SegmentData(BaseModel):
    title: str
    text: str
    start: float
    end: float

class BlockNoteRequest(BaseModel):
    api_key: str
    model: str
    title: str
    text: str
    current_title: Optional[str] = None
    full_chapters: Optional[str] = None

class BlockTermsRequest(BaseModel):
    api_key: str
    model: str
    text: str
    current_title: Optional[str] = None
    full_chapters: Optional[str] = None

class SaveSegmentsRequest(BaseModel):
    video_id: str
    segments: list[SegmentData]
    removed_boundary_times: list[float] = []  # 已移除的邊界時間點（秒），代表合併設定
    chapters_input: str = ""                   # 使用者貼入的章節文字（原始格式）

# 引入擷取與解析模組
from subtitle_extractor import (
    get_video_id,
    fetch_subtitles_api,
    fetch_subtitles_ytdlp,
    fetch_subtitles_downsub,
    get_video_metadata
)
from subtitle_utils import parse_vtt_file, parse_srt_content

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
    react_index = os.path.join("frontend", "dist", "index.html")
    if os.path.exists(react_index):
        with open(react_index, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    index_path = os.path.join("templates", "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>找不到前端模板，請確保 frontend/dist/index.html 或 templates/index.html 存在。</h1>", status_code=404)

# API 路由：下載並剖析影片與字幕
@app.post("/api/process-video")
def process_video(request: VideoRequest):
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
        print("yt-dlp 擷取失敗，降級使用 DownSub 擷取字幕中...")
        subtitles = fetch_subtitles_downsub(video_id)
        
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
        "channel": metadata.get('channel', '未知頻道'),
        "subtitles": subtitles
    }

# API 路由：檢查本地端環境變數是否有 API Key
@app.get("/api/check-env")
async def check_env():
    has_key = "OPENAI_API_KEY" in os.environ and bool(os.environ.get("OPENAI_API_KEY").strip())
    return {"status": "success", "has_key": has_key}

# API 路由：獲取本地端環境變數的 API Key
@app.post("/api/get-env-key")
async def get_env_key():
    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        return JSONResponse(status_code=400, content={"status": "error", "message": "環境變數中未設定 OPENAI_API_KEY"})
    return {"status": "success", "api_key": key}

# API 路由：呼叫 AI 整理筆記與專業術語
def format_seconds_to_time(secs: float) -> str:
    h = int(secs // 3600)
    m = int((secs % 3600) // 60)
    s = int(secs % 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def group_segments_by_duration(segments: list, interval_seconds: int) -> dict:
    groups = {}
    for seg in segments:
        b_idx = int(seg.start // interval_seconds)
        if b_idx not in groups:
            groups[b_idx] = []
        groups[b_idx].append(seg)
    return groups

# API 路由：呼叫 AI 整理筆記與專業術語
def log_ai_request_response(model: str, segments: list, p1_logs: list, p2_logs: list, final_output: dict):
    # 確保 ai_logs 資料夾存在於工作目錄中
    log_dir = "ai_logs"
    os.makedirs(log_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = os.path.join(log_dir, f"ai_call_{timestamp}.json")
    
    # 將 SegmentData 轉為可序列化的 dictionary
    serializable_segments = []
    for s in segments:
        if hasattr(s, "model_dump"):
            serializable_segments.append(s.model_dump())
        elif hasattr(s, "dict"):
            serializable_segments.append(s.dict())
        elif isinstance(s, dict):
            serializable_segments.append(s)
        else:
            serializable_segments.append({
                "title": getattr(s, "title", ""),
                "text": getattr(s, "text", ""),
                "start": getattr(s, "start", 0.0),
                "end": getattr(s, "end", 0.0)
            })

    log_data = {
        "timestamp": datetime.now().isoformat(),
        "model": model,
        "segments": serializable_segments,
        "prompt_1_calls": p1_logs,
        "prompt_2_calls": p2_logs,
        "final_output": final_output
    }
    
    try:
        with open(log_file, "w", encoding="utf-8") as f:
            json.dump(log_data, f, ensure_ascii=False, indent=2)
        print(f"[Logger] AI 請求與回應紀錄已成功儲存至 {log_file}")
    except Exception as e:
        print(f"[Logger] 儲存 AI 請求回應日誌遭遇錯誤: {e}")

def flatten_markdown_lists(text: str) -> str:
    if not text:
        return text
    lines = text.split('\n')
    flattened = []
    for line in lines:
        # 1. 檢查是否是以清單標記開頭，且以冒號（中英文）結尾的分類引言標題
        match_header = re.match(r'^\s*[-*+]\s*(.*[:：]\s*)$', line)
        if match_header:
            header_content = match_header.group(1).strip()
            # 檢查前一行是否為清單項目，如果是且中間沒有空行，則插入空行以形成段落分割
            if len(flattened) > 0:
                prev_non_empty = None
                for item in reversed(flattened):
                    if item.strip() != "":
                        prev_non_empty = item.strip()
                        break
                if prev_non_empty and prev_non_empty.startswith(('-', '*', '+')):
                    if flattened[-1].strip() != "":
                        flattened.append("")
            flattened.append(header_content)
            continue

        # 2. 尋找前面有空白/縮排並以無序清單標記（-, *, +）開頭的行
        match_indented = re.match(r'^(\s+)([-*+])\s*(.*)', line)
        if match_indented:
            marker = match_indented.group(2)
            content = match_indented.group(3)
            # 移除縮排空白，將其拉回第一層無序清單
            flattened.append(f"{marker} {content}")
        else:
            flattened.append(line)

    # 3. 額外處理：移除夾在無序清單項目之間的空行，以及分類標題與其下方清單項目之間的空行，避免造成清單視覺間隙過大
    final_lines = []
    for i, line in enumerate(flattened):
        if line.strip() == "":
            prev_item = None
            for j in range(i - 1, -1, -1):
                if flattened[j].strip() != "":
                    prev_item = flattened[j].strip()
                    break
            next_item = None
            for j in range(i + 1, len(flattened)):
                if flattened[j].strip() != "":
                    next_item = flattened[j].strip()
                    break
            
            if prev_item and next_item:
                is_prev_list = prev_item.startswith(('-', '*', '+')) or prev_item.endswith((':', '：'))
                is_next_list = next_item.startswith(('-', '*', '+'))
                if is_prev_list and is_next_list:
                    # 這是夾在清單項目之間，或分類標題與清單項目之間的空行，將其濾除
                    continue
        final_lines.append(line)

    return '\n'.join(final_lines)

def get_prompt_template(file_path: str, default_template: str) -> str:
    try:
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
    except Exception as e:
        print(f"讀取提示詞檔案 {file_path} 失敗，使用預設值。錯誤: {e}")
    return default_template

def format_prompt(template: str, text: str, current_title: str, full_chapters: str) -> str:
    res = template
    res = res.replace("{text}", text)
    res = res.replace("{current_title}", current_title)
    res = res.replace("{full_chapters}", full_chapters)
    return res

@app.post("/api/generate-block-note")
def generate_block_note(request: BlockNoteRequest):
    api_key = request.api_key.strip()
    model = request.model
    title = request.title
    text = request.text
    current_title = request.current_title or title or ""
    full_chapters = request.full_chapters or ""

    if not api_key:
        raise HTTPException(status_code=400, detail="請提供有效的 OpenAI API Key")
    if not text:
        raise HTTPException(status_code=400, detail="無內容可供處理")

    print(f"正在為 block '{title}' 生成 AI 筆記...")

    # Default Prompt 1
    default_prompt_1 = """幫我分段落作重點整理。請嚴格遵守以下格式規範：
1. 筆記標題層級與分隔規範：
   - 每個影片原始章節請用一級標題表示，格式為 `# [原章節名稱]`。
     例如：當目前整理的章節為「Intro ➔ Automations vs Agents」時，必須分別建立 `# Intro` 與 `# Automations vs Agents` 這兩個一級標題。
   - 在每個一級標題底下，根據字幕內容劃分多個具體的內容子主題，並使用二級標題表示，格式為 `## [子主題名稱]` (例如 `## Webhook 觸發器設定`)，絕對不要直接使用章節時間。
   - 若【目前正在整理的章節】中列出了多個以 `*` 開頭的原始章節（代表它們已被合併整理），則必須在不同一級標題（`#`）的內容之間，使用 `---`（三個減號組成的水平分隔線）進行明確的區隔。
2. 每個二級標題底下的重點整理只允許使用單一層級的無序清單（全部使用 `-` 開頭），絕對不要出現縮排的第二層清單。
3. 分類標題、組別標題或段落引言標題規範（非常重要，絕對不可違反）：
   - 任何作為分類、步驟、小組的「引言/分類標題」（例如「核心訊息：」、「問題描述：」、「解法方向：」等，通常以冒號「：」結尾），**絕對不要**在前面加上 `-`、`*` 或 `+` 等任何清單符號。
   - 必須將這些標題寫成「一般的段落文字（直接以中文文字開頭，不加任何清單符號與縮排）」，然後在下一行直接使用單層的 `-` 清單列出具體子項目。
   - 正確範例：
     核心訊息：
     - 基礎 workflow 能力不會消失...
     - 及早學會同時運用傳統工具...
   - 錯誤範例 1（絕對禁止）：
     - 核心訊息：
       - 基礎 workflow 能力不會消失...
   - 錯誤範例 2（絕對禁止）：
     - 核心訊息：
     - 基礎 workflow 能力不會消失...
4. 清單項目與空行規範：
   - 清單項目（即以 `-` 開頭的行）之間**絕對不要留空行**。
   - 分類標題與下方的清單項目之間也**絕對不要留空行**。
   - 二級標題與其下方內容之間也**絕對不要留空行**。
5. 清單的內容文字中不要有額外的分類標籤或前綴文字。
6. 不需幫我做總結，不要提供額外協助的建議，不需花俏的圖示，請專注於筆記內容。
7. 如果有專業術語，請嚴格遵守「中文專業術語（英文）」的順序與格式。
   例如：必須寫成「網頁應用程式（Web application）」、「用戶端識別碼（Client ID）」、「啟用（Enable）」，絕對不能寫成「Web application（網頁應用程式）」、「Client ID（用戶端識別碼）」或直接只寫英文。所有的專業名詞首要呈現必須是繁體中文。
8. 請以繁體中文回答。

【整體影片章節結構（上下文參考）】：
{full_chapters}

【目前正在整理的章節】：
{current_title}

以下是字幕內容：
{text}"""

    prompt_path = os.path.join("prompts", "prompt_note.txt")
    prompt_template = get_prompt_template(prompt_path, default_prompt_1)
    prompt = format_prompt(prompt_template, text, current_title, full_chapters)
    raw_response = call_openai_api(api_key, model, prompt)
    
    # 進行清單扁平化處理，確保僅有一層無序清單
    processed_response = flatten_markdown_lists(raw_response)

    # 紀錄該 Block 的日誌
    log_ai_request_response(
        model=model,
        segments=[],
        p1_logs=[{"title": title, "prompt": prompt, "response": raw_response, "processed": processed_response}],
        p2_logs=[],
        final_output={"title": title, "content": processed_response}
    )

    return {
        "status": "success",
        "title": title,
        "content": processed_response
    }

@app.post("/api/generate-block-terms")
def generate_block_terms(request: BlockTermsRequest):
    api_key = request.api_key.strip()
    model = request.model
    text = request.text
    current_title = request.current_title or ""
    full_chapters = request.full_chapters or ""

    if not api_key:
        raise HTTPException(status_code=400, detail="請提供有效的 OpenAI API Key")
    if not text:
        raise HTTPException(status_code=400, detail="無內容可供處理")

    print("正在為區間生成 AI 專業術語...")

    # Default Prompt 2
    default_prompt_2 = """從內容中挑選最重要且值得記憶的專業術語，最多 50 個。
寧多勿少，不限制數量，不要因為重要性而省略，並按照重要性排序。
格式：
* 中文專業術語（英文）：解釋
只輸出術語清單，不要額外說明。
繁體中文。

【整體影片章節結構（上下文參考）】：
{full_chapters}

【目前正在整理的區間】：
{current_title}

字幕內容：
{text}"""

    prompt_path = os.path.join("prompts", "prompt_terms.txt")
    prompt_template = get_prompt_template(prompt_path, default_prompt_2)
    prompt = format_prompt(prompt_template, text, current_title, full_chapters)
    raw_response = call_openai_api(api_key, model, prompt)
    
    # 清單扁平化
    processed_response = flatten_markdown_lists(raw_response)

    # 紀錄該 Block 的日誌
    log_ai_request_response(
        model=model,
        segments=[],
        p1_logs=[],
        p2_logs=[{"prompt": prompt, "response": raw_response, "processed": processed_response}],
        final_output={"content": processed_response}
    )

    return {
        "status": "success",
        "content": processed_response
    }

@app.get("/api/proxy-image")
def proxy_image(url: str):
    try:
        r = requests.get(url, stream=True, timeout=10)
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail="Failed to fetch image")
        content_type = r.headers.get("content-type", "image/jpeg")
        return StreamingResponse(r.iter_content(chunk_size=8192), media_type=content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save-segments")
def save_segments(request: SaveSegmentsRequest):
    import os
    import json
    os.makedirs("scratch", exist_ok=True)

    # 儲存分段資料
    with open("scratch/user_segments.json", "w", encoding="utf-8") as f:
        data = {
            "video_id": request.video_id,
            "segments": [seg.model_dump() for seg in request.segments]
        }
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 同步儲存合併設定（AI 整合範圍合併紀錄）
    merge_config = {
        "video_id": request.video_id,
        "chapters_input": request.chapters_input,
        "removed_boundary_times": request.removed_boundary_times,
        "saved_at": datetime.now().isoformat(),
        "merged_count": len(request.removed_boundary_times)
    }
    with open("scratch/merge_config.json", "w", encoding="utf-8") as f:
        json.dump(merge_config, f, ensure_ascii=False, indent=2)

    print(f"已儲存用戶分段資料 (Video ID: {request.video_id})，合併邊界數量: {len(request.removed_boundary_times)}")
    return {"status": "success"}

# 掛載靜態檔案目錄 (用於 React 構建的靜態資源)
dist_dir = os.path.join("frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=False), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
