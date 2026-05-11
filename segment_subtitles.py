import os
import re
import yt_dlp
from datetime import datetime, timedelta

def time_to_seconds(time_str):
    """將 HH:MM:SS 或 MM:SS 轉換為秒數"""
    parts = time_str.split(':')
    if len(parts) == 2:
        return int(parts[0]) * 60 + int(parts[1])
    elif len(parts) == 3:
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    return 0

def vtt_time_to_seconds(vtt_time):
    """將 VTT 的時間格式 (HH:MM:SS.mmm) 轉換為秒數"""
    # 格式可能為 00:00:00.000 或 00:00.000
    parts = re.split('[:.]', vtt_time)
    if len(parts) == 4: # HH:MM:SS.mmm
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2]) + int(parts[3]) / 1000.0
    elif len(parts) == 3: # MM:SS.mmm
        return int(parts[0]) * 60 + int(parts[1]) + int(parts[2]) / 1000.0
    return 0

def clean_vtt_text(text):
    """清理 VTT 中的標籤與重複內容"""
    # 移除 HTML 標籤
    text = re.sub(r'<[^>]+>', '', text)
    # 移除多餘空格
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def download_subtitles(url, lang='zh-TW'):
    """下載指定語言的字幕"""
    ydl_opts = {
        'skip_download': True,
        'writesubtitles': True,
        'subtitleslangs': [lang],
        'outtmpl': 'temp_subtitles.%(ext)s',
        'quiet': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    
    filename = f'temp_subtitles.{lang}.vtt'
    if os.path.exists(filename):
        return filename
    return None

def parse_vtt(filename):
    """解析 VTT 檔案，回傳 (start_time, text) 的列表"""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 簡單的正則表達式來抓取時間軸與後續文字
    # 格式: 00:00:00.000 --> 00:00:00.000
    blocks = re.split(r'\n\s*\n', content)
    entries = []
    
    timestamp_re = re.compile(r'(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})')
    
    for block in blocks:
        lines = block.strip().split('\n')
        if not lines: continue
        
        match = timestamp_re.search(lines[0])
        if match:
            start_time = vtt_time_to_seconds(match.group(1))
            text = " ".join(lines[1:])
            text = clean_vtt_text(text)
            if text:
                entries.append({'start': start_time, 'text': text})
    
    return entries

def segment_and_save(entries, chapters, output_file):
    """根據章節時間分段並存檔"""
    # 排序章節以確保時間順序
    sorted_chapters = sorted(chapters, key=lambda x: x['time'])
    
    with open(output_file, 'w', encoding='utf-8') as f:
        current_chapter_idx = 0
        current_chapter_text = []
        
        for entry in entries:
            # 檢查是否進入下一個章節
            while (current_chapter_idx + 1 < len(sorted_chapters) and 
                   entry['start'] >= sorted_chapters[current_chapter_idx + 1]['time']):
                
                # 寫入目前章節內容
                if current_chapter_text:
                    f.write("\n" + " ".join(current_chapter_text) + "\n\n")
                    current_chapter_text = []
                
                current_chapter_idx += 1
                chapter_title = sorted_chapters[current_chapter_idx]['title']
                chapter_time_str = sorted_chapters[current_chapter_idx]['time_str']
                f.write(f"## {chapter_time_str} {chapter_title}\n")
            
            # 如果是第一個章節之前
            if current_chapter_idx == 0 and not current_chapter_text:
                chapter_title = sorted_chapters[0]['title']
                chapter_time_str = sorted_chapters[0]['time_str']
                f.write(f"## {chapter_time_str} {chapter_title}\n")
                
            # 處理重複行（VTT 常見問題）
            if entry['text']:
                if not current_chapter_text or entry['text'] not in current_chapter_text[-1]:
                    # 檢查最後一行是否是當前行的前綴（逐字稿常見）
                    if current_chapter_text and current_chapter_text[-1] in entry['text']:
                        current_chapter_text[-1] = entry['text']
                    else:
                        current_chapter_text.append(entry['text'])
        
        # 寫入最後一個章節
        if current_chapter_text:
            f.write("\n" + " ".join(current_chapter_text) + "\n")

if __name__ == "__main__":
    video_url = "https://www.youtube.com/watch?v=lie9zRW2P6A"
    
    raw_chapters = """
00:00 台灣身處 AI 暴風眼中心，我們該如何生存？ 
01:34 AI 正在吃掉軟體，引爆下一波生產力革命嗎？ 
03:21 AI 智商已達博士級，死讀書的人將被徹底淘汰？ 
04:46 全球只剩「兩國九企」玩得起 AI？ 
05:48 SaaS 股價暴跌，軟體服務業正面臨毀滅性打擊？ 
07:18 文科生也能寫程式，工程師的護城河還在嗎？ 
10:35 OpenAI 在幫 Google 練兵？這場算力戰誰會贏？ 
12:41 自動販賣機自己會賺錢，AI 代理人時代來了？ 
14:15 雲端太強殺死邊緣，蘋果在 AI 時代陷入大麻煩？ 
16:05 放棄軟體夢，台灣靠「硬體載體」才是唯一活路？ 
18:23 Google 擁有「地球級基建」，後進者想追上是不可能的任務？ 
20:05 學生佔了八成流量，ChatGPT 的商業模式出現危機？ 
22:56 科技業賺翻你卻沒加薪，這就是經濟學人說的「台灣病」？ 
27:00 年輕人才憑空消失，台灣正面臨最嚴重的國安危機？ 
31:22 老闆一人抵三人用，「一人公司」將取代傳統企業？ 
37:41 別做模型了，幫客戶「接水管」才是真正的暴利藍海？ 
41:15 智育變得最不值錢，孩子未來該學哪兩種保命能力？ 
45:24 只會寫 Code 沒用，軟體工程師若不轉型價值將歸零？ 
51:43 這不是海嘯是隧道，如何衝過黑暗變身 AI 超級人類？
"""
    
    # 解析章節
    chapters = []
    for line in raw_chapters.strip().split('\n'):
        match = re.match(r'(\d{1,2}:\d{2}(?::\d{2})?)\s+(.*)', line.strip())
        if match:
            time_str = match.group(1)
            title = match.group(2)
            chapters.append({
                'time': time_to_seconds(time_str),
                'time_str': time_str,
                'title': title
            })
    
    print("正在下載字幕...")
    vtt_file = download_subtitles(video_url)
    
    if vtt_file:
        print(f"成功下載: {vtt_file}")
        print("正在解析並分段...")
        entries = parse_vtt(vtt_file)
        
        output_name = "AI_Storm_Subtitles.md"
        segment_and_save(entries, chapters, output_name)
        print(f"✅ 處理完成！結果已存至: {output_name}")
        
        # 移除暫存檔
        # os.remove(vtt_file)
    else:
        print("❌ 下載字幕失敗。請確認影片是否有 zh-TW 字幕。")
