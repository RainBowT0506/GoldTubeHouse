import os
import json
import sys

# Import functions from server.py
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from server import fetch_subtitles_api, fetch_subtitles_ytdlp, get_video_metadata

video_id = "ivty6t0lUkQ"
print("Fetching metadata...")
metadata = get_video_metadata(video_id)
print("Metadata fetched:", metadata)

print("Fetching subtitles...")
subtitles = fetch_subtitles_api(video_id)
if not subtitles:
    subtitles = fetch_subtitles_ytdlp(video_id)

if not subtitles:
    print("Could not fetch subtitles!")
    sys.exit(1)

print(f"Fetched {len(subtitles)} subtitle entries.")

data = {
    "title": metadata.get("title"),
    "duration": metadata.get("duration"),
    "subtitles": subtitles
}

os.makedirs(os.path.dirname(__file__), exist_ok=True)
output_path = os.path.join(os.path.dirname(__file__), "ivty_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Saved to {output_path}")
