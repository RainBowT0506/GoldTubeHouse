import os
import re

def time_to_seconds(time_str: str) -> float:
    """將 HH:MM:SS 或 MM:SS 轉換為秒數"""
    parts = time_str.split(':')
    if len(parts) == 2:
        return int(parts[0]) * 60 + int(parts[1])
    elif len(parts) == 3:
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    return 0.0

def vtt_time_to_seconds(t_str: str) -> float:
    """將 VTT 的時間格式 (HH:MM:SS.mmm 或 MM:SS.mmm) 轉換為秒數"""
    parts = t_str.split(':')
    if len(parts) == 3:  # HH:MM:SS.mmm
        h = int(parts[0])
        m = int(parts[1])
        s_ms = parts[2].split('.')
        s = int(s_ms[0])
        ms = int(s_ms[1]) if len(s_ms) > 1 else 0
        return h * 3600 + m * 60 + s + ms / 1000.0
    elif len(parts) == 2:  # MM:SS.mmm
        m = int(parts[0])
        s_ms = parts[1].split('.')
        s = int(s_ms[0])
        ms = int(s_ms[1]) if len(s_ms) > 1 else 0
        return m * 60 + s + ms / 1000.0
    return 0.0

def srt_time_to_seconds(h: str, m: str, s: str, ms: str) -> float:
    """將 SRT 時間組件轉換為秒數"""
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0

def clean_vtt_text(text: str) -> str:
    """清理 VTT 字幕中的 HTML 標籤與多餘空格"""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def clean_vtt_content(vtt_text: str) -> list[str]:
    """
    清理 VTT 內容，移除時間軸、標籤，並處理重複累加行（適用於 processor.py）
    """
    lines = vtt_text.splitlines()
    cleaned_lines = []
    timestamp_pattern = re.compile(r'\d{2}:\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}:\d{2}.\d{3}')
    
    for line in lines:
        line = line.strip()
        if not line or 'WEBVTT' in line or 'Kind:' in line or 'Language:' in line or timestamp_pattern.match(line):
            continue
        
        line = clean_vtt_text(line)
        
        if not cleaned_lines or line not in cleaned_lines[-1]:
            if cleaned_lines and cleaned_lines[-1] in line:
                cleaned_lines[-1] = line
            else:
                cleaned_lines.append(line)
            
    return cleaned_lines

def parse_vtt_file(file_path: str) -> list[dict]:
    """解析 VTT 檔案，回傳 [{'text': str, 'start': float, 'duration': float}] 列表"""
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
            
            start = vtt_time_to_seconds(start_str)
            end = vtt_time_to_seconds(end_str)
            duration = max(0.0, end - start)
            text = " ".join(text_lines)
            text = clean_vtt_text(text)
            
            if text:
                subtitles.append({
                    'text': text,
                    'start': start,
                    'duration': duration
                })
    return subtitles

def parse_srt_content(content: str) -> list[dict]:
    """解析 SRT 格式字串內容，回傳 [{'text': str, 'start': float, 'duration': float}] 列表"""
    subtitles = []
    blocks = re.split(r'\n\s*\n', content.strip())
    timestamp_re = re.compile(r'(\d{2}):(\d{2}):(\d{2})[,\.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,\.](\d{3})')

    for block in blocks:
        lines = block.strip().split('\n')
        if not lines:
            continue
        match = None
        text_lines = []
        for line in lines:
            m = timestamp_re.search(line)
            if m:
                match = m
            elif line.strip() and not line.strip().isdigit():
                text_lines.append(line.strip())
        if match and text_lines:
            start = srt_time_to_seconds(match.group(1), match.group(2), match.group(3), match.group(4))
            end   = srt_time_to_seconds(match.group(5), match.group(6), match.group(7), match.group(8))
            duration = max(0.0, end - start)
            text = ' '.join(text_lines)
            text = clean_vtt_text(text)
            if text:
                subtitles.append({'text': text, 'start': start, 'duration': duration})
    return subtitles
