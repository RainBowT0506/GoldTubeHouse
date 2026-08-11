import os
import re
import glob
import tempfile
import concurrent.futures
import requests
import json
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from subtitle_extractor import SubtitleManager

# --- Pydantic Request Models ---
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

class BlockAnalysisRequest(BaseModel):
    api_key: str
    model: str
    title: str
    text: str
    current_title: Optional[str] = None
    full_chapters: Optional[str] = None

class SaveSegmentsRequest(BaseModel):
    video_id: str
    segments: list[SegmentData]
    removed_boundary_times: list[float] = []
    chapters_input: str = ""

class ClientErrorRequest(BaseModel):
    message: str
    stack: Optional[str] = None
    url: Optional[str] = None



# --- OOP Service Modules ---

class AIService:
    def call_openai_api(self, api_key: str, model: str, prompt: str, system_msg: str = "You are a helpful study and note-taking assistant."):
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

    def get_prompt_template(self, file_path: str) -> str:
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=500,
                detail=f"找不到提示詞檔案 {file_path}，請確保 prompts/ 目錄下有該檔案。"
            )
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"讀取提示詞檔案 {file_path} 失敗，錯誤: {str(e)}"
            )

    def format_prompt(self, template: str, text: str, current_title: str, full_chapters: str) -> str:
        res = template
        res = res.replace("{text}", text)
        res = res.replace("{current_title}", current_title)
        res = res.replace("{full_chapters}", full_chapters)
        return res

    def flatten_markdown_lists(self, text: str) -> str:
        if not text:
            return text
        lines = text.split('\n')
        flattened = []
        for line in lines:
            match_header = re.match(r'^\s*[-*+]\s*(.*[:：]\s*)$', line)
            if match_header:
                header_content = match_header.group(1).strip()
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

            match_indented = re.match(r'^(\s+)([-*+])\s*(.*)', line)
            if match_indented:
                marker = match_indented.group(2)
                content = match_indented.group(3)
                flattened.append(f"{marker} {content}")
            else:
                flattened.append(line)

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
                        continue
            final_lines.append(line)

        return '\n'.join(final_lines)

    def log_ai_request_response(self, model: str, segments: list, p1_logs: list, p2_logs: list, final_output: dict):
        log_dir = "ai_logs"
        os.makedirs(log_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = os.path.join(log_dir, f"ai_call_{timestamp}.json")
        
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


class SegmentHelper:
    @staticmethod
    def format_seconds_to_time(secs: float) -> str:
        h = int(secs // 3600)
        m = int((secs % 3600) // 60)
        s = int(secs % 60)
        if h > 0:
            return f"{h:02d}:{m:02d}:{s:02d}"
        return f"{m:02d}:{s:02d}"

    @staticmethod
    def group_segments_by_duration(segments: list, interval_seconds: int) -> dict:
        groups = {}
        for seg in segments:
            b_idx = int(seg.start // interval_seconds)
            if b_idx not in groups:
                groups[b_idx] = []
            groups[b_idx].append(seg)
        return groups


# --- FastAPI OOP Application Coordinator ---

class GoldTubeApp:
    def __init__(self, subtitle_manager: Optional[SubtitleManager] = None):
        self.app = FastAPI(title="YouTube Subtitle Segmenter API")
        self.subtitle_manager = subtitle_manager or SubtitleManager()
        self.ai_service = AIService()
        self.setup_routes()
        self.mount_static()

    def setup_routes(self):
        @self.app.get("/", response_class=HTMLResponse)
        async def serve_index():
            react_index = os.path.join("frontend", "dist", "index.html")
            if os.path.exists(react_index):
                with open(react_index, "r", encoding="utf-8") as f:
                    return HTMLResponse(content=f.read())
            index_path = os.path.join("templates", "index.html")
            if os.path.exists(index_path):
                with open(index_path, "r", encoding="utf-8") as f:
                    return HTMLResponse(content=f.read())
            return HTMLResponse(
                content="<h1>找不到前端模板，請確保 frontend/dist/index.html 或 templates/index.html 存在。</h1>",
                status_code=404
            )

        @self.app.post("/api/process-video")
        def process_video(request: VideoRequest):
            video_id = self.subtitle_manager.metadata_service.get_video_id(request.url)
            if not video_id:
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": "請輸入有效的 YouTube 影片網址或 ID。"}
                )
                
            print(f"開始處理影片 (ID: {video_id})...")
            subtitles = self.subtitle_manager.fetch_video_subtitles(video_id)
            
            if not subtitles:
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": "無法取得該影片的字幕。請確認該影片是否有提供字幕或自動字幕。"}
                )
                
            metadata = self.subtitle_manager.metadata_service.get_video_metadata(video_id)
            
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

        @self.app.post("/api/playlist-metadata")
        def playlist_metadata(request: VideoRequest):
            playlist_url = request.url.strip()
            if not playlist_url:
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": "請輸入有效的 YouTube 播放清單網址。"}
                )
                
            print(f"開始解析播放清單 metadata (URL: {playlist_url})...")
            playlist_info = self.subtitle_manager.metadata_service.get_playlist_metadata(playlist_url)
            if not playlist_info or not playlist_info.get('videos'):
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": "無法解析該播放清單。請確認是否為公開的播放清單。"}
                )
                
            return {
                "status": "success",
                "title": playlist_info['title'],
                "channel": playlist_info.get('channel') or '未知頻道',
                "is_playlist": True,
                "videos": playlist_info['videos']
            }

        @self.app.post("/api/process-playlist")
        def process_playlist(request: VideoRequest):
            playlist_url = request.url.strip()
            if not playlist_url:
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": "請輸入有效的 YouTube 播放清單網址。"}
                )
                
            print(f"開始解析播放清單 (URL: {playlist_url})...")
            playlist_info = self.subtitle_manager.metadata_service.get_playlist_metadata(playlist_url)
            if not playlist_info or not playlist_info.get('videos'):
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": "無法解析該播放清單。請確認是否為公開的播放清單。"}
                )
                
            videos = playlist_info['videos']
            title = playlist_info['title']
            print(f"成功解析播放清單 '{title}'，共包含 {len(videos)} 部影片。開始併發下載字幕與 metadata...")
            
            processed_videos = self.subtitle_manager.fetch_playlist_subtitles_parallel(videos)
            
            # Sort back to original playlist order
            video_id_to_index = {v['video_id']: idx for idx, v in enumerate(videos)}
            processed_videos.sort(key=lambda x: video_id_to_index.get(x['video_id'], 999))
            
            channel = playlist_info.get('channel') or '未知頻道'
            print(f"播放清單 '{title}' (頻道: {channel}) 處理完成！已完成 {len(processed_videos)} 部影片下載。")
            
            return {
                "status": "success",
                "title": title,
                "channel": channel,
                "is_playlist": True,
                "videos": processed_videos
            }

        @self.app.get("/api/check-env")
        async def check_env():
            has_key = "OPENAI_API_KEY" in os.environ and bool(os.environ.get("OPENAI_API_KEY").strip())
            return {"status": "success", "has_key": has_key}

        @self.app.post("/api/get-env-key")
        async def get_env_key():
            key = os.environ.get("OPENAI_API_KEY", "").strip()
            if not key:
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": "環境變數中未設定 OPENAI_API_KEY"}
                )
            return {"status": "success", "api_key": key}

        @self.app.post("/api/generate-block-note")
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

            prompt_path = os.path.join("prompts", "prompt_note.txt")
            prompt_template = self.ai_service.get_prompt_template(prompt_path)
            prompt = self.ai_service.format_prompt(prompt_template, text, current_title, full_chapters)
            raw_response = self.ai_service.call_openai_api(api_key, model, prompt)
            
            processed_response = self.ai_service.flatten_markdown_lists(raw_response)

            self.ai_service.log_ai_request_response(
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

        @self.app.post("/api/generate-block-terms")
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

            prompt_path = os.path.join("prompts", "prompt_terms.txt")
            prompt_template = self.ai_service.get_prompt_template(prompt_path)
            prompt = self.ai_service.format_prompt(prompt_template, text, current_title, full_chapters)
            raw_response = self.ai_service.call_openai_api(api_key, model, prompt)
            
            processed_response = self.ai_service.flatten_markdown_lists(raw_response)

            self.ai_service.log_ai_request_response(
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

        @self.app.post("/api/generate-block-analysis")
        def generate_block_analysis(request: BlockAnalysisRequest):
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

            print(f"正在為 block '{title}' 同時生成 AI 筆記與專業術語...")

            prompt_path = os.path.join("prompts", "prompt_analysis.txt")
            prompt_template = self.ai_service.get_prompt_template(prompt_path)
            prompt = self.ai_service.format_prompt(prompt_template, text, current_title, full_chapters)
            raw_response = self.ai_service.call_openai_api(api_key, model, prompt)

            parts = raw_response.split("===== TERMS_SECTION =====")
            raw_notes = parts[0].strip()
            raw_terms = parts[1].strip() if len(parts) > 1 else ""

            processed_notes = self.ai_service.flatten_markdown_lists(raw_notes)
            processed_terms = self.ai_service.flatten_markdown_lists(raw_terms)

            self.ai_service.log_ai_request_response(
                model=model,
                segments=[],
                p1_logs=[{"title": title, "prompt": prompt, "response": raw_response, "processed": f"Notes:\n{processed_notes}\n\nTerms:\n{processed_terms}"}],
                p2_logs=[],
                final_output={"title": title, "notes": processed_notes, "terms": processed_terms}
            )

            return {
                "status": "success",
                "title": title,
                "notes": processed_notes,
                "terms": processed_terms
            }

        @self.app.get("/api/proxy-image")
        def proxy_image(url: str):
            try:
                r = requests.get(url, stream=True, timeout=10)
                if r.status_code != 200:
                    raise HTTPException(status_code=r.status_code, detail="Failed to fetch image")
                content_type = r.headers.get("content-type", "image/jpeg")
                return StreamingResponse(r.iter_content(chunk_size=8192), media_type=content_type)
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/api/save-segments")
        def save_segments(request: SaveSegmentsRequest):
            os.makedirs("scratch", exist_ok=True)

            with open("scratch/user_segments.json", "w", encoding="utf-8") as f:
                data = {
                    "video_id": request.video_id,
                    "segments": [seg.model_dump() for seg in request.segments]
                }
                json.dump(data, f, ensure_ascii=False, indent=2)

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

        @self.app.post("/api/log-client-error")
        def log_client_error(request: ClientErrorRequest):
            print(f"\n[Client Error] {request.message}")
            if request.stack:
                print(f"Stack Trace:\n{request.stack}")
            if request.url:
                print(f"Client URL: {request.url}")
            print("----------------------------------------\n")
            return {"status": "logged"}

    def mount_static(self):
        dist_dir = os.path.join("frontend", "dist")
        if os.path.exists(dist_dir):
            self.app.mount("/", StaticFiles(directory=dist_dir, html=False), name="static")


# --- Module Entry Point for Uvicorn ---

gold_tube_app = GoldTubeApp()
app = gold_tube_app.app

# Backward compatibility wrappers for module level functions (useful for unittests)
def format_seconds_to_time(secs: float) -> str:
    return SegmentHelper.format_seconds_to_time(secs)

def group_segments_by_duration(segments: list, interval_seconds: int) -> dict:
    return SegmentHelper.group_segments_by_duration(segments, interval_seconds)

def flatten_markdown_lists(text: str) -> str:
    ai_service = AIService()
    return ai_service.flatten_markdown_lists(text)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
