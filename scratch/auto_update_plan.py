#!/usr/bin/env python3
import json
import os
from datetime import datetime

SEGMENTS_PATH = "scratch/user_segments.json"
CONFIG_PATH = "scratch/merge_config.json"
PLAN_PATH = "/Users/linchengyi/.gemini/antigravity/brain/f7b27728-43d0-44b3-b20a-a580547fc4a5/N8N章節合併計畫表.md"

def format_seconds(secs: float) -> str:
    h = int(secs // 3600)
    m = int((secs % 3600) // 60)
    s = int(secs % 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def format_duration(secs: float) -> str:
    m = int(secs // 60)
    s = int(secs % 60)
    if m > 0:
        return f"{m}分{s}秒"
    return f"{s}秒"

def main():
    if not os.path.exists(SEGMENTS_PATH):
        print(f"❌ Error: {SEGMENTS_PATH} not found!")
        return
    if not os.path.exists(CONFIG_PATH):
        print(f"❌ Error: {CONFIG_PATH} not found!")
        return

    with open(SEGMENTS_PATH, "r", encoding="utf-8") as f:
        seg_data = json.load(f)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)

    video_id = seg_data.get("video_id", "未知")
    segments = seg_data.get("segments", [])
    removed_boundaries = set(config.get("removed_boundary_times", []))
    saved_at = config.get("saved_at", datetime.now().isoformat())

    print(f"Loaded {len(segments)} segments and {len(removed_boundaries)} removed boundaries.")

    # Parse and construct segment records
    parsed_segs = []
    for i, seg in enumerate(segments):
        start = seg["start"]
        end = seg["end"]
        duration = end - start
        
        # Clean up title (remove trailing time range if present)
        title = seg["title"]
        title_clean = title.split(" (")[0]
        
        parsed_segs.append({
            "index": i + 1,
            "title": title_clean,
            "start": start,
            "end": end,
            "duration": duration,
            "duration_str": format_duration(duration),
            "start_str": format_seconds(start),
            "end_str": format_seconds(end)
        })

    # Group segments
    groups = []
    current_group = []
    for seg in parsed_segs:
        # Check if segment start is in removed boundary times
        # Allow a small threshold of 1.0s for floating point matching
        is_merged = seg["start"] in removed_boundaries or any(abs(seg["start"] - r) < 1.0 for r in removed_boundaries)
        
        if is_merged and current_group:
            current_group.append(seg)
        else:
            if current_group:
                groups.append(current_group)
            current_group = [seg]
    if current_group:
        groups.append(current_group)

    # Assign group labels
    group_labels = {}
    label_idx = 65  # ASCII 'A'
    for g in groups:
        if len(g) > 1:
            label = chr(label_idx)
            label_idx += 1
            for seg in g:
                group_labels[seg["index"]] = label

    # Generate Plan Markdown
    md = []
    md.append("# 🎬 N8N 全課程章節合併計畫表\n")
    md.append(f"> **影片 ID**：`{video_id}`  \n> **更新時間**：{saved_at}  \n> **總段落數**：{len(parsed_segs)} 個  \n")
    md.append("---\n")
    md.append("## 📊 細分段落 × 合併狀態\n")
    md.append("| # | 時間區間 | 段落名稱 | 長度 | 處理方式 | 備註 |")
    md.append("|---|------|---------|------|---------|------|")

    for seg in parsed_segs:
        idx = seg["index"]
        time_range = f"`{seg['start_str']} ~ {seg['end_str']}`"
        name = seg["title"]
        dur = seg["duration_str"]
        
        if idx in group_labels:
            label = group_labels[idx]
            # Find position in group
            for g in groups:
                indices = [item["index"] for item in g]
                if idx in indices:
                    if idx == indices[0]:
                        note = "↓ 首段合併"
                    elif idx == indices[-1]:
                        note = "↑ 尾段合併"
                    else:
                        note = "↕ 中間合併"
                    break
            status = f"🔗 **合併組 {label}**"
        else:
            status = "⬜ **獨立**"
            note = "獨立生成筆記"
            
        md.append(f"| {idx} | {time_range} | {name} | {dur} | {status} | {note} |")

    md.append("\n---\n")
    md.append("## 🧩 合併群組摘要\n")

    has_groups = False
    for g in groups:
        if len(g) > 1:
            has_groups = True
            first_idx = g[0]["index"]
            label = group_labels[first_idx]
            start_t = g[0]["start_str"]
            end_t = g[-1]["end_str"]
            total_dur_sec = sum(item["duration"] for item in g)
            total_dur_min = int(total_dur_sec // 60)
            
            names_with_times = [f"{item['title']} ({item['start_str']}~{item['end_str']})" for item in g]
            
            md.append(f"### 🔗 合併組 {label}（{start_t} ~ {end_t}，共 ~{total_dur_min} 分鐘）")
            md.append("```")
            md.append(" ➔\n".join(names_with_times))
            md.append("```\n")

    if not has_groups:
        md.append("目前所有段落皆為獨立分段，無合併組。\n")

    md.append("---\n")
    md.append("## 💡 圖例與控制說明\n")
    md.append("- 🔗 **合併組 X**：多個相鄰區塊在送至 AI 時，其文字會自動串連（合併為單一 AI 請求），以產生語意連貫的大區段筆記。")
    md.append("- ⬜ **獨立**：單獨作為一個 AI 請求（單次計費與筆記生成）。")

    with open(PLAN_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(md))

    print(f"✅ Successfully wrote plan to {PLAN_PATH}")

if __name__ == "__main__":
    main()
