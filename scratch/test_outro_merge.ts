import { generateSegments, parseTimeToSeconds } from '../frontend/src/utils.js';

async function test() {
  const url = 'https://www.youtube.com/watch?v=2GZ2SNXWK-c';
  console.log("Fetching video data from local server...");
  const res = await fetch('http://127.0.0.1:8000/api/process-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  const data = await res.json();
  if (data.status !== 'success') {
    console.error("Failed to fetch video data:", data);
    return;
  }

  const chaptersInput = `00:00:00 Introduction
00:01:25 The n8n basics
01:11:41 Foundational concepts
03:11:09 Javascript functions
05:04:47 Setting up self-hosting
05:28:07 Comparing n8n vs make & which to use when
05:55:27 Outro`;

  const parsedChapters = [];
  const lines = chaptersInput.split('\n');
  const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/;
  for (let line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      parsedChapters.push({
        time: parseTimeToSeconds(match[1]),
        title: line.replace(match[1], '').replace(/^\s*[-–—]\s*/, '').trim()
      });
    }
  }

  console.log("Parsed chapters:", parsedChapters);

  // Scenario 1: Without merging Outro
  console.log("\n--- SCENARIO 1: BEFORE MERGING OUTRO ---");
  const segments1 = generateSegments(
    data.subtitles,
    data.duration,
    parsedChapters,
    [],
    20 * 60,
    1800,
    1800
  );
  console.log("Total groups:", segments1.length);
  segments1.forEach((seg, idx) => {
    console.log(`Group ${idx}: ${seg.chapterTitle} (start: ${seg.start}, end: ${seg.end}, isGroup: ${seg.isGroup})`);
    if (seg.subSegments) {
      seg.subSegments.forEach((sub, sIdx) => {
        console.log(`  -> Sub ${sIdx}: ${sub.subTitle} (start: ${sub.start}, end: ${sub.end}, subs count: ${sub.subtitles.length})`);
      });
    }
  });

  // Scenario 2: With merging Outro (remove 21327)
  console.log("\n--- SCENARIO 2: AFTER MERGING OUTRO ---");
  const filteredChapters = parsedChapters.filter(ch => ch.time !== 21327);
  const segments2 = generateSegments(
    data.subtitles,
    data.duration,
    filteredChapters,
    [],
    20 * 60,
    1800,
    1800
  );
  console.log("Total groups:", segments2.length);
  segments2.forEach((seg, idx) => {
    console.log(`Group ${idx}: ${seg.chapterTitle} (start: ${seg.start}, end: ${seg.end}, isGroup: ${seg.isGroup})`);
    if (seg.subSegments) {
      seg.subSegments.forEach((sub, sIdx) => {
        console.log(`  -> Sub ${sIdx}: ${sub.subTitle} (start: ${sub.start}, end: ${sub.end}, subs count: ${sub.subtitles.length})`);
      });
    }
  });
}

test().catch(console.error);
