#!/usr/bin/env python3
import json
import os

SEGMENTS_PATH = "scratch/user_segments.json"
CONFIG_PATH = "scratch/merge_config.json"

# Target merge points based on user request (represented in H:M:S or M:S strings)
TARGET_REMOVE_BOUNDARIES = [
    "00:43",     # Intro & Automations vs Agents
    "01:18:08",  # Automation 1 & Automation 1 Indepth 1
    "02:15:45",  # JSON in n8n (middle boundary, since n8n Foundations is split into 2)
    "02:40:41",  # API Walkthrough & Automation 2 1
    "03:20:48",  # Automation 2 2 & Automation 2 3
    "04:13:24",  # AI Automation and Agents 2 & AI Automation and Agents 3
    "04:47:38",  # Gmail Reply Agent 1 & Gmail Reply Agent 2
    "05:13:08",  # Telegram Personal Assistant & Telegram Single Agent 1
    "05:53:47",  # Telegram Single Agent 2 & Telegram Single Agent 3
    "06:23:28",  # Multi Agent System 1 & Multi Agent System 2
    "07:05:17",  # Outro merge part 2
    "07:18:15",  # Outro merge part 3
    "07:28:08",  # Outro merge part 4
    "07:29:48",  # Outro merge part 5
]

def parse_time_str(t: str) -> float:
    parts = t.split(":")
    if len(parts) == 2:
        return int(parts[0]) * 60 + int(parts[1])
    elif len(parts) == 3:
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    return 0.0

def main():
    if not os.path.exists(SEGMENTS_PATH):
        print(f"❌ Error: {SEGMENTS_PATH} not found!")
        return

    with open(SEGMENTS_PATH, "r", encoding="utf-8") as f:
        seg_data = json.load(f)

    segments = seg_data.get("segments", [])
    print(f"Loaded {len(segments)} segments from {SEGMENTS_PATH}")

    # List all segment start times for inspection
    seg_starts = [seg["start"] for seg in segments]
    print(f"Available segment start times (seconds): {seg_starts}")

    removed_times = []
    for target in TARGET_REMOVE_BOUNDARIES:
        target_sec = parse_time_str(target)
        # Find closest match within 2 seconds
        match = None
        for start in seg_starts:
            if abs(start - target_sec) <= 2.0:
                match = start
                break
        if match is not None:
            removed_times.append(match)
            print(f"Matched target {target} ({target_sec}s) -> Actual segment start {match}s")
        else:
            print(f"⚠️ Warning: Could not match target {target} ({target_sec}s) to any segment start!")

    print(f"\nConstructed removed boundary times ({len(removed_times)} points): {sorted(removed_times)}")

    # Update merge_config.json
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            config = json.load(f)
    else:
        config = {
            "video_id": seg_data.get("video_id", "DkV7ztrhLh8"),
            "chapters_input": ""
        }

    config["removed_boundary_times"] = sorted(removed_times)
    config["merged_count"] = len(removed_times)
    config["video_id"] = seg_data.get("video_id", "DkV7ztrhLh8")

    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Updated {CONFIG_PATH} successfully!")

if __name__ == "__main__":
    main()
