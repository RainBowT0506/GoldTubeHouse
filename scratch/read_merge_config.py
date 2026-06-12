#!/usr/bin/env python3
"""
讀取並顯示當前 AI 整合範圍合併設定
使用方式：python3 scratch/read_merge_config.py
"""

import json
import os

CONFIG_PATH = "scratch/merge_config.json"
CHAPTERS = [
    ("00:00",    "Intro"),
    ("00:43",    "Automations vs Agents"),
    ("16:38",    "n8n Foundations"),
    ("53:07",    "Nodes in n8n"),
    ("01:13:20", "Automation 1"),
    ("01:18:08", "Automation 1 Indepth"),
    ("01:55:56", "JSON in n8n"),
    ("02:27:32", "API Walkthrough"),
    ("02:40:41", "Automation 2"),
    ("03:31:37", "AI Automation and Agents"),
    ("04:27:29", "Gmail Reply Agent"),
    ("05:01:32", "Telegram Personal Assistant"),
    ("05:13:08", "Telegram Single Agent"),
    ("06:03:19", "Multi Agent System"),
    ("06:35:19", "AI to Application"),
    ("07:04:03", "Automation Outro"),
    ("07:05:17", "Hosting n8n Locally + Cloud"),
    ("07:18:15", "Hosting on Cloud"),
    ("07:28:08", "Hosting Outro"),
    ("07:29:48", "Thanks you and Subscribe"),
]

def parse_time(t: str) -> float:
    parts = t.split(":")
    if len(parts) == 2:
        return int(parts[0]) * 60 + int(parts[1])
    elif len(parts) == 3:
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    return 0

def format_seconds(secs: float) -> str:
    h = int(secs // 3600)
    m = int((secs % 3600) // 60)
    s = int(secs % 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def main():
    if not os.path.exists(CONFIG_PATH):
        print("⚠️  尚無合併設定記錄（scratch/merge_config.json 不存在）")
        print("   → 請在 UI 上操作後按「鎖定分段」，即可同步到此處。")
        return

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)

    removed = set(config.get("removed_boundary_times", []))
    saved_at = config.get("saved_at", "未知")
    video_id = config.get("video_id", "未知")
    merged_count = config.get("merged_count", 0)

    print(f"\n{'='*60}")
    print(f"🔗 AI 整合範圍合併 — 當前設定")
    print(f"{'='*60}")
    print(f"  影片 ID   : {video_id}")
    print(f"  更新時間  : {saved_at}")
    print(f"  合併邊界數: {merged_count} 個")
    print(f"{'='*60}\n")

    # 對照章節時間與 removedBoundaryTimes
    chapter_times = [(parse_time(t), name) for t, name in CHAPTERS]

    print(f"{'#':>2}  {'時間':>8}  {'章節名稱':<35}  狀態")
    print(f"{'-'*75}")

    group_id = 0
    merge_groups = []
    current_group = []

    for i, (secs, name) in enumerate(chapter_times):
        is_merged_with_prev = secs in removed or any(abs(secs - r) < 1.0 for r in removed)

        if is_merged_with_prev and current_group:
            current_group.append((i + 1, format_seconds(secs), name))
        else:
            if current_group:
                merge_groups.append(current_group)
            current_group = [(i + 1, format_seconds(secs), name)]

    if current_group:
        merge_groups.append(current_group)

    # 顯示
    group_label = 65  # ASCII code for 'A'
    merge_group_idx = {}
    for group in merge_groups:
        if len(group) > 1:
            label = chr(group_label)
            group_label += 1
            for idx, ts, name in group:
                merge_group_idx[idx] = label

    for i, (secs, name) in enumerate(chapter_times):
        num = i + 1
        ts = format_seconds(secs)
        in_merge = num in merge_group_idx

        if in_merge:
            label = merge_group_idx[num]
            # 找出 group 中第一個元素判斷是否為首
            for group in merge_groups:
                nums = [g[0] for g in group]
                if num in nums:
                    if num == nums[0]:
                        status = f"🔗 合併組 {label} ┐"
                    elif num == nums[-1]:
                        status = f"🔗 合併組 {label} ┘"
                    else:
                        status = f"🔗 合併組 {label} │"
                    break
        else:
            status = "⬜ 獨立"

        print(f"{num:>2}  {ts:>8}  {name:<35}  {status}")

    print(f"\n{'='*60}")
    print(f"合併邊界時間點（秒）: {sorted(removed)}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
