import os
import re
from subtitle_utils import SubtitleParser

class VttFolderCompiler:
    def __init__(self, indent_size: int = 4):
        self.indent_size = indent_size
        self.indent = " " * indent_size

    def compile_directory_to_markdown(self, input_dir: str) -> str or None:
        """
        將 VTT 轉換為 Markdown，移除內部換行並合併為單一縮排段落
        """
        if not os.path.isdir(input_dir):
            print(f"錯誤：找不到目錄 '{input_dir}'")
            return None

        md_content = []
        files = [f for f in os.listdir(input_dir) if f.endswith('.vtt')]
        
        try:
            files.sort(key=lambda x: int(re.search(r'^(\d+)', x).group(1)) if re.search(r'^(\d+)', x) else 999)
        except:
            files.sort()

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
                    lines = SubtitleParser.clean_vtt_content(f.read())
                    if lines:
                        single_paragraph = " ".join(lines)
                        single_paragraph = re.sub(r'\s+', ' ', single_paragraph).strip()
                        md_content.append(f"{self.indent}{single_paragraph}")
                    else:
                        md_content.append(f"{self.indent}(無內容)")
            except Exception as e:
                md_content.append(f"{self.indent}讀取失敗: {e}")
                
            md_content.append("")
                
        return "\n".join(md_content)


# Backward compatibility wrappers
def format_directory_to_markdown(input_dir, indent_size=4):
    compiler = VttFolderCompiler(indent_size)
    return compiler.compile_directory_to_markdown(input_dir)


if __name__ == "__main__":
    path = input("請輸入字幕資料夾路徑 (預設 ./subtitles): ").strip() or "./subtitles"
    result = format_directory_to_markdown(path, indent_size=4)
    
    if result:
        output_name = "Flutter Tutorial for Beginners.md"
        with open(output_name, "w", encoding="utf-8") as f:
            f.write(result)
        print(f"\n✅ 處理完成！所有段落已合併並縮排，結果已存至: {output_name}")
