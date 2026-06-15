import os
import re
import tempfile
import requests
import subprocess
import concurrent.futures
from http.cookiejar import MozillaCookieJar
from youtube_transcript_api import YouTubeTranscriptApi
import yt_dlp

from subtitle_utils import parse_vtt_file, parse_srt_content

class BaseSubtitleProvider:
    def fetch_subtitles(self, video_id: str) -> list[dict] or None:
        raise NotImplementedError


class APISubtitleProvider(BaseSubtitleProvider):
    def __init__(self, cookie_file: str = "cookies.txt"):
        self.cookie_file = cookie_file

    def fetch_subtitles(self, video_id: str) -> list[dict] or None:
        if os.path.exists(self.cookie_file):
            try:
                session = requests.Session()
                cj = MozillaCookieJar(self.cookie_file)
                cj.load(ignore_discard=True, ignore_expires=True)
                session.cookies = cj
                api = YouTubeTranscriptApi(http_client=session)
                print(f"[API] 偵測到 {self.cookie_file}，已成功載入 Cookie 快取進行請求。")
            except Exception as e:
                print(f"[API] 載入 {self.cookie_file} 失敗: {e}")
                api = YouTubeTranscriptApi()
        else:
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


class YtdlpSubtitleProvider(BaseSubtitleProvider):
    def __init__(self, cookie_file: str = "cookies.txt"):
        self.cookie_file = cookie_file

    def fetch_subtitles(self, video_id: str) -> list[dict] or None:
        url = f"https://www.youtube.com/watch?v={video_id}"
        
        ydl_opts = {
            'skip_download': True,
            'quiet': True,
            'no_warnings': True,
            'ignoreerrors': True,
        }
        
        if os.path.exists(self.cookie_file):
            ydl_opts['cookiefile'] = self.cookie_file
            print(f"[yt-dlp] 偵測到 {self.cookie_file}，已啟用 Cookie 快取。")
        else:
            try:
                ydl_opts['cookiesfrombrowser'] = ('chrome',)
                print("[yt-dlp] 未偵測到 cookies.txt，已啟用自動載入 Chrome 瀏覽器 Cookie 模式。")
            except Exception as e:
                print(f"[yt-dlp] 自動載入 Chrome Cookie 失敗: {e}")
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
        except Exception as e:
            print(f"[yt-dlp] 擷取影片資訊失敗: {e}")
            return None
        
        if not info:
            return None

        manual_subs = info.get('subtitles', {}) or {}
        auto_subs = info.get('automatic_captions', {}) or {}
        
        preferred_langs = ['zh-TW', 'zh-Hant', 'zh-CN', 'zh-Hans', 'zh', 'en']
        
        selected_url = None
        selected_lang = None
        
        for lang in preferred_langs:
            if lang in manual_subs:
                for fmt in manual_subs[lang]:
                    if fmt.get('ext') in ('vtt', 'json3') or fmt.get('ext') is None:
                        selected_url = fmt.get('url')
                        selected_lang = lang
                        break
                if selected_url:
                    break
        
        if not selected_url:
            for lang in preferred_langs:
                if lang in auto_subs:
                    for fmt in auto_subs[lang]:
                        if fmt.get('ext') in ('vtt', 'json3') or fmt.get('ext') is None:
                            selected_url = fmt.get('url')
                            selected_lang = lang
                            break
                    if selected_url:
                        break
        
        if not selected_url:
            for lang, fmts in list(auto_subs.items())[:3]:
                for fmt in fmts:
                    if fmt.get('url'):
                        selected_url = fmt.get('url')
                        selected_lang = lang
                        break
                if selected_url:
                    break
        
        if not selected_url:
            print("[yt-dlp] 找不到任何可用的字幕 URL。")
            return None
        
        print(f"[yt-dlp] 找到字幕語言: {selected_lang}，嘗試下載...")
        
        if '?' in selected_url:
            vtt_url = selected_url + '&fmt=vtt'
        else:
            vtt_url = selected_url + '?fmt=vtt'
        
        try:
            session = requests.Session()
            session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            })
            if os.path.exists(self.cookie_file):
                cj = MozillaCookieJar(self.cookie_file)
                cj.load(ignore_discard=True, ignore_expires=True)
                session.cookies = cj
            
            r = session.get(vtt_url, timeout=20)
            if r.status_code == 200 and 'WEBVTT' in r.text:
                with tempfile.NamedTemporaryFile(mode='w', suffix='.vtt', delete=False, encoding='utf-8') as tf:
                    tf.write(r.text)
                    temp_name = tf.name
                try:
                    subs = parse_vtt_file(temp_name)
                    print(f"[yt-dlp] 成功下載並解析字幕！(共 {len(subs)} 筆)")
                    return subs
                finally:
                    try:
                        os.remove(temp_name)
                    except:
                        pass
            else:
                print(f"[yt-dlp] 下載字幕失敗，HTTP {r.status_code}")
                return None
        except Exception as e:
            print(f"[yt-dlp] 下載字幕遭遇例外: {e}")
            return None


class DownsubSubtitleProvider(BaseSubtitleProvider):
    def fetch_subtitles(self, video_id: str) -> list[dict] or None:
        url = f"https://www.youtube.com/watch?v={video_id}"
        
        print(f"[DownSub] 嘗試使用 DownSub 管道下載影片字幕 (ID: {video_id})...")
        try:
            project_dir = os.path.dirname(os.path.abspath(__file__))
            script_path = os.path.join(project_dir, "downsub_fetcher.js")
            
            if not os.path.exists(script_path):
                print("[DownSub] 找不到 downsub_fetcher.js 腳本。")
                return None
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.srt', delete=False, encoding='utf-8') as tf:
                temp_srt_path = tf.name
            
            try:
                res = subprocess.run(
                    ["node", script_path, url, temp_srt_path],
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                
                if res.returncode == 0 and os.path.exists(temp_srt_path):
                    with open(temp_srt_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if not content.strip():
                        print("[DownSub] 字幕檔案為空。")
                        return None
                    
                    first_line = content.strip().split('\n')[0].strip()
                    if first_line.isdigit():
                        subs = parse_srt_content(content)
                        print(f"[DownSub] 成功獲取 SRT 字幕！(共 {len(subs)} 筆)")
                        return subs
                    elif "WEBVTT" in content:
                        vtt_tmp = temp_srt_path.replace('.srt', '.vtt')
                        with open(vtt_tmp, 'w', encoding='utf-8') as f:
                            f.write(content)
                        try:
                            subs = parse_vtt_file(vtt_tmp)
                            print(f"[DownSub] 成功獲取 VTT 字幕！(共 {len(subs)} 筆)")
                            return subs
                        except:
                            pass
                        finally:
                            try: os.remove(vtt_tmp)
                            except: pass
                    else:
                        print("[DownSub] 回傳內容格式無法識別。")
                else:
                    err_msg = res.stderr.strip() if res.stderr else '未知錯誤'
                    print(f"[DownSub] 抓取失敗: {err_msg}")
            finally:
                try: os.remove(temp_srt_path)
                except: pass
                    
        except Exception as e:
            print(f"[DownSub] 執行 DownSub 抓取時遭遇例外: {e}")
        return None


class YouTubeMetadataService:
    def __init__(self, cookie_file: str = "cookies.txt"):
        self.cookie_file = cookie_file

    def get_video_id(self, url: str) -> str or None:
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

    def get_video_metadata(self, video_id: str) -> dict:
        url = f"https://www.youtube.com/watch?v={video_id}"
        ydl_opts = {
            'skip_download': True,
            'quiet': True,
            'no_warnings': True,
        }
        if os.path.exists(self.cookie_file):
            ydl_opts['cookiefile'] = self.cookie_file
        else:
            try:
                ydl_opts['cookiesfrombrowser'] = ('chrome',)
            except Exception as e:
                print(f"[yt-dlp Metadata] 自動載入 Chrome Cookie 失敗: {e}")
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                return {
                    'title': info.get('title', '未命名影片'),
                    'duration': info.get('duration', 0),
                    'thumbnail': info.get('thumbnail', f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"),
                    'video_id': video_id,
                    'channel': info.get('uploader', info.get('channel', '未知頻道'))
                }
        except Exception as e:
            print(f"[yt-dlp] 擷取 metadata 失敗: {e}")
            return {
                'title': f"YouTube 影片 (ID: {video_id})",
                'duration': 0,
                'thumbnail': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                'video_id': video_id,
                'channel': '未知頻道'
            }

    def get_playlist_metadata(self, playlist_url: str) -> dict or None:
        match = re.search(r'[&?]list=([a-zA-Z0-9_-]+)', playlist_url)
        if match:
            playlist_id = match.group(1)
            playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}"

        ydl_opts = {
            'extract_flat': True,
            'skip_download': True,
            'quiet': True,
            'no_warnings': True,
        }
        if os.path.exists(self.cookie_file):
            ydl_opts['cookiefile'] = self.cookie_file
            print(f"[yt-dlp Playlist] 偵測到 {self.cookie_file}，已啟用 Cookie 快取。")
        else:
            try:
                ydl_opts['cookiesfrombrowser'] = ('chrome',)
                print("[yt-dlp Playlist] 未偵測到 cookies.txt，已啟用自動載入 Chrome 瀏覽器 Cookie 模式。")
            except Exception as e:
                print(f"[yt-dlp Playlist] 自動載入 Chrome Cookie 失敗: {e}")
                
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(playlist_url, download=False)
                if not info:
                    return None
                
                if info.get('_type') == 'url':
                    resolved_url = info.get('url')
                    if resolved_url:
                        info = ydl.extract_info(resolved_url, download=False)
                        if not info:
                            return None

                if info.get('_type') == 'playlist' or 'entries' in info:
                    entries = info.get('entries', [])
                    videos = []
                    for entry in entries:
                        if not entry:
                            continue
                        video_id = entry.get('id') or self.get_video_id(entry.get('url', ''))
                        if not video_id:
                            continue
                        videos.append({
                            'video_id': video_id,
                            'title': entry.get('title') or f"YouTube Video (ID: {video_id})",
                            'duration': entry.get('duration') or 0,
                            'thumbnail': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
                        })
                    return {
                        'title': info.get('title') or '未命名播放清單',
                        'channel': info.get('uploader') or info.get('channel') or info.get('uploader_id') or '未知頻道',
                        'videos': videos
                    }
        except Exception as e:
            print(f"[yt-dlp Playlist] 擷取播放清單 metadata 失敗: {e}")
        return None


class SubtitleManager:
    def __init__(self, cookie_file: str = "cookies.txt"):
        self.cookie_file = cookie_file
        self.metadata_service = YouTubeMetadataService(cookie_file)
        self.providers = [
            APISubtitleProvider(cookie_file),
            YtdlpSubtitleProvider(cookie_file),
            DownsubSubtitleProvider()
        ]

    def fetch_video_subtitles(self, video_id: str) -> list[dict] or None:
        for provider in self.providers:
            try:
                subtitles = provider.fetch_subtitles(video_id)
                if subtitles:
                    return subtitles
            except Exception as e:
                print(f"[SubtitleManager] Provider {provider.__class__.__name__} failed: {e}")
        return None

    def fetch_video_subtitles_and_meta(self, video: dict) -> dict:
        video_id = video['video_id']
        title = video.get('title') or f"YouTube Video (ID: {video_id})"
        
        subtitles = self.fetch_video_subtitles(video_id)
        duration = video.get('duration') or 0
        
        if not subtitles:
            if duration == 0:
                meta = self.metadata_service.get_video_metadata(video_id)
                duration = meta.get('duration') or 600
            subtitles = [{
                "text": "(此影片無字幕文字)",
                "start": 0.0,
                "duration": float(duration)
            }]
        else:
            if duration == 0:
                last_sub = subtitles[-1]
                duration = int(last_sub['start'] + last_sub['duration'])
                
        return {
            "video_id": video_id,
            "title": title,
            "duration": duration,
            "thumbnail": video.get('thumbnail') or f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            "subtitles": subtitles
        }

    def fetch_playlist_subtitles_parallel(self, videos: list[dict], max_workers: int = 5) -> list[dict]:
        processed_videos = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_video = {executor.submit(self.fetch_video_subtitles_and_meta, v): v for v in videos}
            for future in concurrent.futures.as_completed(future_to_video):
                v_info = future_to_video[future]
                try:
                    data = future.result()
                    processed_videos.append(data)
                except Exception as exc:
                    print(f"處理影片 {v_info['video_id']} 時發生異常: {exc}")
                    duration = v_info.get('duration') or 600
                    processed_videos.append({
                        "video_id": v_info['video_id'],
                        "title": v_info.get('title') or f"YouTube Video (ID: {v_info['video_id']})",
                        "duration": duration,
                        "thumbnail": v_info.get('thumbnail') or f"https://img.youtube.com/vi/{v_info['video_id']}/maxresdefault.jpg",
                        "subtitles": [{
                            "text": "(此影片載入失敗，無字幕文字)",
                            "start": 0.0,
                            "duration": float(duration)
                        }]
                    })
        return processed_videos


# Backward compatibility wrappers
_shared_manager = SubtitleManager()

def get_video_id(url: str):
    return _shared_manager.metadata_service.get_video_id(url)

def fetch_subtitles_api(video_id: str):
    provider = APISubtitleProvider()
    return provider.fetch_subtitles(video_id)

def fetch_subtitles_ytdlp(video_id: str):
    provider = YtdlpSubtitleProvider()
    return provider.fetch_subtitles(video_id)

def fetch_subtitles_downsub(video_id: str):
    provider = DownsubSubtitleProvider()
    return provider.fetch_subtitles(video_id)

def get_video_metadata(video_id: str):
    return _shared_manager.metadata_service.get_video_metadata(video_id)

def get_playlist_metadata(playlist_url: str):
    return _shared_manager.metadata_service.get_playlist_metadata(playlist_url)

def fetch_video_subtitles_and_meta(video: dict):
    return _shared_manager.fetch_video_subtitles_and_meta(video)
