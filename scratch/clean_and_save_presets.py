#!/usr/bin/env python3
import json
import os

SEGMENTS_PATH = "scratch/user_segments.json"
CONFIG_PATH = "scratch/merge_config.json"
PRESET_PATH = "scratch/n8n_rag_agent_preset.json"

def main():
    if not os.path.exists(SEGMENTS_PATH):
        print(f"❌ Error: {SEGMENTS_PATH} not found!")
        return

    with open(SEGMENTS_PATH, "r", encoding="utf-8") as f:
        seg_data = json.load(f)

    segments = seg_data.get("segments", [])
    video_id = seg_data.get("video_id", "ZHH3sr234zY")
    
    # All segment start times for this video
    seg_starts = sorted([seg["start"] for seg in segments])
    print(f"Detected {len(seg_starts)} segment starts for video {video_id}.")

    # These are the 2 boundaries we want to KEEP (they are NOT in removed_boundary_times)
    # 36:55 (What is RAG? -> 2215s) and 1:02:31 (n8n Workflows as Tools -> 3751s)
    # The first boundary 0.0 is naturally kept.
    keep_boundaries = [2215.0, 3751.0]

    # Find the actual matching starts in segments
    matched_keeps = []
    for keep in keep_boundaries:
        match = None
        for start in seg_starts:
            if abs(start - keep) <= 2.0:
                match = start
                break
        if match is not None:
            matched_keeps.append(match)
        else:
            print(f"⚠️ Warning: Could not find segment start matching {keep}s")

    print(f"Boundaries to KEEP (starts of Range 2 and Range 3): {matched_keeps}")

    # The removed boundaries are all segment starts except 0.0 and the kept boundaries
    removed_boundaries = [start for start in seg_starts if start > 0.0 and start not in matched_keeps]
    print(f"Calculated removed boundaries ({len(removed_boundaries)} points): {removed_boundaries}")

    # 1. Update merge_config.json
    config = {
        "video_id": video_id,
        "chapters_input": "00:00 What is n8n?\n02:50 Why Should You Learn n8n?\n04:53 Part 1: Getting Started\n05:09 Self-Hosted vs Cloud\n08:25 Workflows, Nodes, Executions\n09:45 n8n Interface\n16:05 Part 2: Core Concepts\n16:28 Types of Nodes\n19:00 Building Example Workflow\n36:28 Part 3: RAG and Vector Databases\n36:55 What is RAG?\n38:23 What are Vector Databases?\n44:07 Building RAG AI Agent\n1:01:56 Part 4: Expanding Agents\n1:02:31 n8n Workflows as Tools\n1:05:23 Showcasing Agent Examples\n1:10:20 Part 5: APIs & HTTP Requests\n1:11:33 What is an API?\n1:12:49 What is an HTTP Request?\n1:13:14 How They Work Together\n1:15:04 HTTP Request Examples in n8n\n1:21:42 Part 6: The Final Part\n1:22:24 Error Workflows\n1:26:20 Best Practices\n1:28:30 Next Steps",
        "removed_boundary_times": sorted(removed_boundaries),
        "saved_at": "2026-06-13T07:27:00",
        "merged_count": len(removed_boundaries)
    }

    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print(f"✅ Updated {CONFIG_PATH}")

    # 2. Update n8n_rag_agent_preset.json
    preset = {
        "video_title": "n8n AI Agent Masterclass: RAG, Vector DBs, APIs & Best Practices",
        "youtube_url": "https://www.youtube.com/watch?v=ZHH3sr234zY",
        "video_id": video_id,
        "saved_at": "2026-06-13T07:27:00",
        "removed_boundary_times": sorted(removed_boundaries),
        "merged_count": len(removed_boundaries),
        "expected_note_count": 3,
        "notes_structure_description": [
          "1. Range 1: Basic Automations & Core Concepts (Merged: 00:00 ~ 36:55)",
          "2. Range 2: RAG & AI Agent Implementation (Merged: 36:55 ~ 1:02:31)",
          "3. Range 3: Custom Tools, APIs, HTTP Requests & Best Practices (Merged: 1:02:31 ~ End)"
        ]
    }

    with open(PRESET_PATH, "w", encoding="utf-8") as f:
        json.dump(preset, f, ensure_ascii=False, indent=2)
    print(f"✅ Created {PRESET_PATH}")

    # 3. Trigger auto_update_plan.py
    print("Running auto_update_plan.py to refresh Markdown plan...")
    os.system("python3 scratch/auto_update_plan.py")

if __name__ == "__main__":
    main()
