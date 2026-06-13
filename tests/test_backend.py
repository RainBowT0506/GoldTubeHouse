import unittest
import os
import sys
import tempfile

# Add project root to path so we can import server.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import (
    format_seconds_to_time,
    group_segments_by_duration,
    flatten_markdown_lists
)
from subtitle_extractor import get_video_id
from subtitle_utils import parse_vtt_file

class SegmentMock:
    def __init__(self, start, end, title, text):
        self.start = start
        self.end = end
        self.title = title
        self.text = text

class TestBackendLogic(unittest.TestCase):
    def test_get_video_id(self):
        urls = [
            ("https://www.youtube.com/watch?v=EH5jx5qPabU", "EH5jx5qPabU"),
            ("https://youtu.be/EH5jx5qPabU", "EH5jx5qPabU"),
            ("https://www.youtube.com/embed/EH5jx5qPabU", "EH5jx5qPabU"),
            ("https://youtube.com/shorts/EH5jx5qPabU?feature=share", "EH5jx5qPabU"),
            ("EH5jx5qPabU", "EH5jx5qPabU"),
            ("invalid_url_with_no_id", None)
        ]
        for url, expected in urls:
            with self.subTest(url=url):
                self.assertEqual(get_video_id(url), expected)

    def test_format_seconds_to_time(self):
        self.assertEqual(format_seconds_to_time(0), "00:00")
        self.assertEqual(format_seconds_to_time(25), "00:25")
        self.assertEqual(format_seconds_to_time(65), "01:05")
        self.assertEqual(format_seconds_to_time(3600), "01:00:00")
        self.assertEqual(format_seconds_to_time(3665), "01:01:05")

    def test_group_segments_by_duration(self):
        segments = [
            SegmentMock(start=0, end=100, title="Intro", text="Hello"),
            SegmentMock(start=500, end=600, title="Basics", text="World"),
            SegmentMock(start=1200, end=1300, title="Concept 1", text="Foo"),
            SegmentMock(start=2399, end=2500, title="Concept 2", text="Bar"),
            SegmentMock(start=2400, end=2600, title="Advanced", text="Baz"),
        ]
        
        # Test 20-minute grouping (1200 seconds)
        p1_groups = group_segments_by_duration(segments, 1200)
        self.assertIn(0, p1_groups) # 0 to 1199s (Intro, Basics)
        self.assertIn(1, p1_groups) # 1200 to 2399s (Concept 1, Concept 2)
        self.assertIn(2, p1_groups) # 2400 to 3599s (Advanced)
        self.assertEqual(len(p1_groups[0]), 2)
        self.assertEqual(len(p1_groups[1]), 2)
        self.assertEqual(len(p1_groups[2]), 1)
        
        # Test 60-minute grouping (3600 seconds)
        p2_groups = group_segments_by_duration(segments, 3600)
        self.assertIn(0, p2_groups) # 0 to 3599s (all segments in this mock)
        self.assertEqual(len(p2_groups[0]), 5)

    def test_parse_vtt_file(self):
        vtt_content = """WEBVTT
Kind: captions
Language: zh-TW

00:00:00.000 --> 00:00:03.120
大家好

00:00:03.120 --> 00:00:06.500
今天我們要來介紹 AI Agent
"""
        with tempfile.NamedTemporaryFile(suffix=".vtt", delete=False, mode="w", encoding="utf-8") as f:
            f.write(vtt_content)
            temp_path = f.name

        try:
            subtitles = parse_vtt_file(temp_path)
            self.assertEqual(len(subtitles), 2)
            self.assertEqual(subtitles[0]["text"], "大家好")
            self.assertAlmostEqual(subtitles[0]["start"], 0.0)
            self.assertAlmostEqual(subtitles[0]["duration"], 3.12)
            
            self.assertEqual(subtitles[1]["text"], "今天我們要來介紹 AI Agent")
            self.assertAlmostEqual(subtitles[1]["start"], 3.12)
            self.assertAlmostEqual(subtitles[1]["duration"], 3.38)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def test_flatten_markdown_lists(self):
        raw_markdown = """# Title
* Item 1
  * Sub-item 1
    * Sub-sub-item 1
* Item 2
  - Sub-item 2
  + Sub-item 3
Normal paragraph.

- 核心訊息：

  - 基礎 workflow 能力不會消失，只會在 agentic 時代變得更有價值

  - 及早學會同時運用傳統工具與 agentic 工具，才能在這波轉變中保持領先

- 過去無程式工具（no-code tools）提供的是「視覺化」搭建流程，但仍需人工連線、排錯
- 正確設定 Claude Code 後，只需用自然語言描述需求，Claude Code 會：
- 自行決定實作方式
- 產生所有程式碼
- 執行並在遇到錯誤時自我修正
"""
        expected_markdown = """# Title
* Item 1
* Sub-item 1
* Sub-sub-item 1
* Item 2
- Sub-item 2
+ Sub-item 3
Normal paragraph.

核心訊息：
- 基礎 workflow 能力不會消失，只會在 agentic 時代變得更有價值
- 及早學會同時運用傳統工具與 agentic 工具，才能在這波轉變中保持領先
- 過去無程式工具（no-code tools）提供的是「視覺化」搭建流程，但仍需人工連線、排錯

正確設定 Claude Code 後，只需用自然語言描述需求，Claude Code 會：
- 自行決定實作方式
- 產生所有程式碼
- 執行並在遇到錯誤時自我修正
"""
        self.assertEqual(flatten_markdown_lists(raw_markdown), expected_markdown)

if __name__ == "__main__":
    unittest.main()
