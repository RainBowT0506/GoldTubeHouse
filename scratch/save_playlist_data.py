import json
import os
import sys
import concurrent.futures

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from subtitle_extractor import get_playlist_metadata, fetch_video_subtitles_and_meta

def main():
    url = "https://www.youtube.com/playlist?list=PLlET0GsrLUL5HKJk1rb7t32sAs_iAlpZe"
    print("開始抓取播放清單 metadata...")
    playlist_info = get_playlist_metadata(url)
    if not playlist_info:
        print("❌ 無法抓取播放清單資訊。")
        return
        
    videos = playlist_info['videos']
    print(f"成功取得播放清單資訊！共 {len(videos)} 部影片。開始抓取字幕...")
    
    processed_videos = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_video = {executor.submit(fetch_video_subtitles_and_meta, v): v for v in videos}
        for future in concurrent.futures.as_completed(future_to_video):
            v_info = future_to_video[future]
            try:
                data = future.result()
                processed_videos.append(data)
                print(f"✅ 成功下載: {data['title']}")
            except Exception as e:
                print(f"❌ 下載失敗 {v_info['video_id']}: {e}")
                processed_videos.append({
                    "video_id": v_info['video_id'],
                    "title": v_info.get('title'),
                    "duration": v_info.get('duration', 600),
                    "thumbnail": v_info.get('thumbnail'),
                    "subtitles": []
                })
                
    # 依原播放清單排序
    video_id_to_index = {v['video_id']: idx for idx, v in enumerate(videos)}
    processed_videos.sort(key=lambda x: video_id_to_index.get(x['video_id'], 999))
    
    result = {
        "status": "success",
        "title": playlist_info['title'],
        "channel": playlist_info.get('channel') or '未知頻道',
        "is_playlist": True,
        "videos": processed_videos
    }
    
    out_dir = "tests/mock_data"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "PLlET0GsrLUL5HKJk1rb7t32sAs_iAlpZe_playlist.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\n🎉 播放清單測試資料已儲存至: {out_path}")

if __name__ == "__main__":
    main()
