import os
import re

def clean_vtt_content(vtt_text):
    """
    清理 VTT 內容，移除時間軸、標籤，並處理重複累加行
    """
    lines = vtt_text.splitlines()
    cleaned_lines = []
    timestamp_pattern = re.compile(r'\d{2}:\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}:\d{2}.\d{3}')
    
    for line in lines:
        line = line.strip()
        if not line or 'WEBVTT' in line or 'Kind:' in line or 'Language:' in line or timestamp_pattern.match(line):
            continue
        
        line = re.sub(r'<[^>]+>', '', line)
        
        if not cleaned_lines or line not in cleaned_lines[-1]:
            if cleaned_lines and cleaned_lines[-1] in line:
                cleaned_lines[-1] = line
            else:
                cleaned_lines.append(line)
            
    return cleaned_lines

def format_directory_to_markdown(input_dir, indent_size=4):
    """
    將 VTT 轉換為 Markdown，移除內部換行並合併為單一縮排段落
    """
    if not os.path.isdir(input_dir):
        print(f"錯誤：找不到目錄 '{input_dir}'")
        return

    md_content = []
    files = [f for f in os.listdir(input_dir) if f.endswith('.vtt')]
    
    try:
        files.sort(key=lambda x: int(re.search(r'^(\d+)', x).group(1)) if re.search(r'^(\d+)', x) else 999)
    except:
        files.sort()

    indent = " " * indent_size
    print(f"正在處理資料夾中的字幕並合併段落：{input_dir}")

    for filename in files:
        file_path = os.path.join(input_dir, filename)
        
        # 標題格式化
        clean_name = re.sub(r'\.en\.vtt$|\.vtt$', '', filename)
        parts = clean_name.split(' - ', 1)
        if len(parts) == 2:
            num = parts[0].lstrip('0') or '0'
            title = parts[1]
            title = re.sub(r'#\d+\s*-\s*', '', title)
            header = f"# {num} - {title}"
        else:
            header = f"# {clean_name}"
            
        md_content.append(header)
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = clean_vtt_content(f.read())
                if lines:
                    # 【核心修改】：將所有行合併成一個字串，中間用空格隔開
                    single_paragraph = " ".join(lines)
                    # 移除多餘的連續空格
                    single_paragraph = re.sub(r'\s+', ' ', single_paragraph).strip()
                    # 加上縮排
                    md_content.append(f"{indent}{single_paragraph}")
                else:
                    md_content.append(f"{indent}(無內容)")
        except Exception as e:
            md_content.append(f"{indent}讀取失敗: {e}")
            
        md_content.append("")
            
    return "\n".join(md_content)

if __name__ == "__main__":
    path = input("請輸入字幕資料夾路徑 (預設 ./subtitles): ").strip() or "./subtitles"
    result = format_directory_to_markdown(path, indent_size=4)
    
    if result:
        output_name = "Flutter Tutorial for Beginners.md"
        with open(output_name, "w", encoding="utf-8") as f:
            f.write(result)
        print(f"\n✅ 處理完成！所有段落已合併並縮排，結果已存至: {output_name}")
