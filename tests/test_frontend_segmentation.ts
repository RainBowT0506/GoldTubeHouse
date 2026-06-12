import { generateSegments, resolveSubtitleOverlaps, groupSegmentsForTerms, Segment } from '../frontend/src/utils.ts';


// Mock subtitles for basic tests (realistically distributed)
const mockSubtitlesBasic = [
  { start: 0, duration: 10, text: "Hello" },
  { start: 100, duration: 10, text: "World" },
  { start: 600, duration: 10, text: "Sentence end." },
  { start: 1100, duration: 10, text: "Another sentence." },
  { start: 1200, duration: 10, text: "Middle segment." },
  { start: 1500, duration: 10, text: "Intermediate segment." },
  { start: 1800, duration: 10, text: "Almost end." },
  { start: 2300, duration: 10, text: "End." }
];

console.log("🧪 Running Frontend Segmentation Logic Tests...\n");

// ----------------------------------------------------
// Test 1: 25 minutes video (1500 seconds)
// ----------------------------------------------------
// duration = 1500, interval = 1200 (20m), noSegThreshold = 1800 (30m), subSegThreshold = 1800 (30m)
// Since duration (25m) <= noSegThreshold (30m), it is kept as 1 segment directly.
const segments25m = generateSegments(mockSubtitlesBasic, 1500, [], [], 1200, 1800, 1800);
console.log(`[Test 1] 25 min video segments count: ${segments25m.length}`);
if (segments25m.length === 1) {
  console.log("✅ PASS: 25 minutes video is kept as a single segment (only 1 API request will be sent).");
} else {
  console.error(`❌ FAIL: 25 minutes video should not be split, but got ${segments25m.length} segments!`);
  process.exit(1);
}

// ----------------------------------------------------
// Test 2: 40 minutes video (2400 seconds)
// ----------------------------------------------------
// duration = 2400, interval = 1200 (20m), noSegThreshold = 1800 (30m)
// Splitting at 1200 leaves 1200s (20m) >= 360s, so it splits into two segments.
const segments40m = generateSegments(mockSubtitlesBasic, 2400, [], [], 1200, 1800, 1800);
console.log(`[Test 2] 40 min video segments count: ${segments40m.length}`);
if (segments40m.length === 2) {
  console.log("✅ PASS: 40 minutes video is split into two segments.");
} else {
  console.error(`❌ FAIL: 40 minutes video should be split into 2 segments, but got ${segments40m.length} segments!`);
  process.exit(1);
}

// ----------------------------------------------------
// Test 3: Trailing Segment Merging (User's 3546s video example)
// ----------------------------------------------------
const mockSubtitlesLong = [];
for (let s = 0; s < 3546; s += 30) {
  mockSubtitlesLong.push({ start: s, duration: 10, text: `Subtitle at ${s}s.` });
}
const splits = [{ time: 810, title: "Custom Split" }];
const segmentsLong = generateSegments(mockSubtitlesLong, 3546, splits, [], 1200, 1800, 1800);

console.log(`[Test 3] Segments for 3546s video with split at 810s:`);
console.log(`- Total top-level segments: ${segmentsLong.length}`);

const segment2 = segmentsLong[1];
if (segment2 && segment2.isGroup && segment2.subSegments) {
  console.log(`- Segment 2 sub-segments count: ${segment2.subSegments.length}`);
  segment2.subSegments.forEach((sub, idx) => {
    console.log(`  - Sub-segment ${idx + 1}: ${sub.subTitle} (duration: ${sub.end - sub.start}s)`);
  });

  if (segment2.subSegments.length === 2) {
    console.log("✅ PASS: The last 5.6 minutes trailing portion was successfully merged, resulting in two subsegments instead of three.");
  } else {
    console.error(`❌ FAIL: Sub-segment count in segment 2 should be 2, but got ${segment2.subSegments.length}!`);
    process.exit(1);
  }
} else {
  console.error("❌ FAIL: Segment 2 is not grouped or has no sub-segments!");
  process.exit(1);
}

// ----------------------------------------------------
// Test 4: Subtitle Entry Splitting (User's exact scenario)
// ----------------------------------------------------
// Subtitle 1: "Intro content " (length = 14)
// Subtitle 2: "the back to clean that up. So the next" (offset boundary right before "So the next" is at 14 + 27 = 41)
// Cursor is right before "So the next" (caretOffset = 41)
console.log("\n[Test 4] Subtitle entry splitting simulation:");
const subtitlesList = [
  { start: 0, duration: 10, text: "Intro content" },
  { start: 810.959, duration: 3.841, text: "the back to clean that up. So the next" },
  { start: 814.8, duration: 3.68, text: "thing we need, which is the meat of this automation as well," }
];

const caretOffset = 41; // Before "So the next" (14 chars of Intro + 27 chars of Subtitle 2 before "So")
let currentOffset = 0;
let targetLocalIdx = -1;
let targetCharOffset = 0;

for (let i = 0; i < subtitlesList.length; i++) {
  const entry = subtitlesList[i];
  const entryText = entry.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() + ' ';
  if (currentOffset + entryText.length > caretOffset) {
    targetLocalIdx = i;
    targetCharOffset = caretOffset - currentOffset;
    break;
  }
  currentOffset += entryText.length;
}

console.log(`- targetLocalIdx matched: ${targetLocalIdx} (expected: 1)`);
console.log(`- targetCharOffset inside entry: ${targetCharOffset} (expected: 27)`);

if (targetLocalIdx !== 1 || targetCharOffset !== 27) {
  console.error("❌ FAIL: Matching entry or caret offset calculation failed!");
  process.exit(1);
}

const targetEntry = subtitlesList[targetLocalIdx];
const cleanText = targetEntry.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

let splitTime = targetEntry.start;
let updatedSubtitles = [...subtitlesList];

if (targetCharOffset > 0 && targetCharOffset < cleanText.length) {
  const part1 = cleanText.substring(0, targetCharOffset).trim();
  const part2 = cleanText.substring(targetCharOffset).trim();

  const ratio = part1.length / cleanText.length;
  const duration1 = targetEntry.duration * ratio;
  const duration2 = targetEntry.duration * (1 - ratio);
  const start2 = targetEntry.start + duration1;

  const entry1 = { start: targetEntry.start, duration: duration1, text: part1 };
  const entry2 = { start: start2, duration: duration2, text: part2 };

  updatedSubtitles.splice(targetLocalIdx, 1, entry1, entry2);
  splitTime = start2;

  console.log(`- Entry successfully split into:`);
  console.log(`  - Part 1: '${part1}' (start: ${entry1.start}s, duration: ${entry1.duration.toFixed(3)}s)`);
  console.log(`  - Part 2: '${part2}' (start: ${entry2.start}s, duration: ${entry2.duration.toFixed(3)}s)`);
  console.log(`  - splitTime resolved: ${splitTime}s`);
}

// Now generate segments with the split list
const testSplits = [{ time: splitTime, title: "Custom Split" }];
const generatedSegments = generateSegments(updatedSubtitles, 3546, testSplits, [], 1200, 1800, 1800);

console.log(`- Generated segments count: ${generatedSegments.length}`);
const seg1 = generatedSegments[0];
const seg2 = generatedSegments[1];

let seg1CleanText = "";
if (seg1.isGroup && seg1.subSegments) {
  seg1CleanText = seg1.subSegments.flatMap(sub => sub.subtitles.map(s => s.text)).join(' ');
} else {
  seg1CleanText = seg1.subtitles.map(s => s.text).join(' ');
}

let seg2CleanText = "";
if (seg2.isGroup && seg2.subSegments) {
  seg2CleanText = seg2.subSegments.flatMap(sub => sub.subtitles.map(s => s.text)).join(' ');
} else {
  seg2CleanText = seg2.subtitles.map(s => s.text).join(' ');
}

console.log(`- Segment 1 ends with: '${seg1CleanText}'`);
console.log(`- Segment 2 starts with: '${seg2CleanText}'`);

if (seg1CleanText.endsWith("the back to clean that up.") && seg2CleanText.startsWith("So the next")) {
  console.log("✅ PASS: The single subtitle entry was successfully split. 'the back to clean that up.' stays in Segment 1, and 'So the next' correctly starts Segment 2!");
} else {
  console.error("❌ FAIL: Segmentation did not split the text correctly!");
  process.exit(1);
}

// ----------------------------------------------------
// Test 5: 35 minutes video (2100 seconds) - Initial Segment Splitting
// ----------------------------------------------------
// duration = 2100, interval = 1200 (20m), noSegThreshold = 1800 (30m)
// Since 2100 > 1800, it splits! First segment target is 1200 (20m), tail is 900 (15m).
// Since 15m >= 6m (360s) merge threshold, it does NOT merge. So 2 segments.
console.log("\n[Test 5] 35 min video initial segments simulation:");
const mockSubtitles35m = [];
for (let s = 0; s < 2100; s += 30) {
  mockSubtitles35m.push({ start: s, duration: 10, text: `Subtitle at ${s}s.` });
}
const segments35m = generateSegments(mockSubtitles35m, 2100, [], [], 1200, 1800, 1800);
console.log(`- Generated segments count: ${segments35m.length}`);
if (segments35m.length === 2) {
  console.log("✅ PASS: 35 minutes video splits initially into two segments (20m + 15m).");
} else {
  console.error(`❌ FAIL: 35 minutes video should split into 2 segments initially, but got ${segments35m.length}!`);
  process.exit(1);
}

// ----------------------------------------------------
// Test 6: Overlapping Timelines Split Resolution (n8n Video exact bug)
// ----------------------------------------------------
console.log("\n[Test 6] Overlapping timelines split simulation:");
const overlappingSubtitles = [
  { start: 810.959, duration: 3.841, text: "the back to clean that up. So the next" },
  { start: 812.8, duration: 3.839, text: "thing we need, which is the meat of this" }
];

// Cleaned / resolved subtitles
const resolvedSubtitles = resolveSubtitleOverlaps(overlappingSubtitles);

// Test splitting before "So the next" (offset 26 inside resolvedSubtitles[0])
const targetEntryP6 = resolvedSubtitles[0];
const cleanTextP6 = targetEntryP6.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const targetCharOffsetP6 = 26; // index of "So the next"

const ratioP6 = targetCharOffsetP6 / cleanTextP6.length;
const duration1P6 = targetEntryP6.duration * ratioP6;
const duration2P6 = targetEntryP6.duration * (1 - ratioP6);
const start2P6 = targetEntryP6.start + duration1P6;

const entry1P6 = { start: targetEntryP6.start, duration: duration1P6, text: cleanTextP6.substring(0, targetCharOffsetP6).trim() };
const entry2P6 = { start: start2P6, duration: duration2P6, text: cleanTextP6.substring(targetCharOffsetP6).trim() };

const updatedSubtitlesP6 = [entry1P6, entry2P6, resolvedSubtitles[1]];
const testSplitsP6 = [{ time: start2P6, title: "Custom Split" }];
const segmentsP6 = generateSegments(updatedSubtitlesP6, 2149, testSplitsP6, [], 1200, 1800, 1800);

console.log(`- Generated segments count: ${segmentsP6.length}`);
let finalSeg1 = "";
if (segmentsP6[0].isGroup && segmentsP6[0].subSegments) {
  finalSeg1 = segmentsP6[0].subSegments.flatMap(sub => sub.subtitles.map(s => s.text)).join(' ');
} else {
  finalSeg1 = segmentsP6[0].subtitles.map(s => s.text).join(' ');
}

let finalSeg2 = "";
if (segmentsP6[1].isGroup && segmentsP6[1].subSegments) {
  finalSeg2 = segmentsP6[1].subSegments.flatMap(sub => sub.subtitles.map(s => s.text)).join(' ');
} else {
  finalSeg2 = segmentsP6[1].subtitles.map(s => s.text).join(' ');
}

console.log(`- Segment 1: '${finalSeg1}'`);
console.log(`- Segment 2: '${finalSeg2}'`);

if (finalSeg1.endsWith("the back to clean that up.") && finalSeg2.startsWith("So the next thing we need")) {
  console.log("✅ PASS: Overlapping timeline was successfully resolved and split accurately!");
} else {
  console.error("❌ FAIL: Overlapping split failed!");
  process.exit(1);
}

// ----------------------------------------------------
// Test 7: Professional Terms Partitioning (Cases 1 to 9)
// ----------------------------------------------------
console.log("\n🧪 Running Professional Terms Partitioning Tests (Cases 1 to 9)...");

const createMockSegment = (start: number, end: number, chapterTitle: string): Segment => ({
  start,
  end,
  chapterTitle,
  subtitles: [{ text: `Mock content for ${chapterTitle}`, start, duration: end - start }]
});

// Case 1: Video length 3:30. Chapters: 0~1:10 (4200s), 1:10~2:20 (4200s), 2:20~3:30 (4200s)
// Expected: 3 batches, individual (no merge/redistribute).
const case1Segs = [
  createMockSegment(0, 4200, "Ch1"),
  createMockSegment(4200, 8400, "Ch2"),
  createMockSegment(8400, 12600, "Ch3")
];
const case1Batches = groupSegmentsForTerms(case1Segs, 12600);
console.log(`[Case 1] Batches count: ${case1Batches.length}`);
if (case1Batches.length === 3 &&
    case1Batches[0].end === 4200 &&
    case1Batches[1].end === 8400 &&
    case1Batches[2].end === 12600) {
  console.log("✅ PASS: Case 1 correctly generated 3 individual batches.");
} else {
  console.error("❌ FAIL: Case 1 grouping failed!");
  process.exit(1);
}

// Case 2: Video length 3:30. Chapters: 0~45m (2700s), 45m~1:10 (1500s), 1:10~2:20 (4200s), 2:20~3:30 (4200s)
// Expected: Ch1+Ch2 merged into Batch 1 (0~70m), Ch3 and Ch4 individual. Total 3 batches.
const case2Segs = [
  createMockSegment(0, 2700, "Ch1"),
  createMockSegment(2700, 4200, "Ch2"),
  createMockSegment(4200, 8400, "Ch3"),
  createMockSegment(8400, 12600, "Ch4")
];
const case2Batches = groupSegmentsForTerms(case2Segs, 12600);
console.log(`[Case 2] Batches count: ${case2Batches.length}`);
if (case2Batches.length === 3 &&
    case2Batches[0].end === 4200 &&
    case2Batches[1].end === 8400 &&
    case2Batches[2].end === 12600) {
  console.log("✅ PASS: Case 2 correctly merged Ch1 and Ch2, leaving Ch3 and Ch4 individual.");
} else {
  console.error("❌ FAIL: Case 2 grouping failed!");
  process.exit(1);
}

// Case 3: Video length 3:30. Chapters: 0~45m (2700s), 45m~1:45 (3600s), 1:45~3:00 (4500s), 3:00~3:30 (1800s)
// Expected: Ch1+Ch2 merged into Batch 1 (0~105m), Ch3 (1h15m) and Ch4 (30m) individual. Total 3 batches.
const case3Segs = [
  createMockSegment(0, 2700, "Ch1"),
  createMockSegment(2700, 6300, "Ch2"),
  createMockSegment(6300, 10800, "Ch3"),
  createMockSegment(10800, 12600, "Ch4")
];
const case3Batches = groupSegmentsForTerms(case3Segs, 12600);
console.log(`[Case 3] Batches count: ${case3Batches.length}`);
if (case3Batches.length === 3 &&
    case3Batches[0].end === 6300 &&
    case3Batches[1].end === 10800 &&
    case3Batches[2].end === 12600) {
  console.log("✅ PASS: Case 3 correctly merged Ch1 and Ch2, and left Ch3 and Ch4 individual.");
} else {
  console.error("❌ FAIL: Case 3 grouping failed!");
  process.exit(1);
}

// Case 4: Video length 3:45. Chapters: 0~45m (2700s), 45m~1:45 (3600s), 1:45~3:30 (6300s), 3:30~3:45 (900s)
// Expected: Ch1+Ch2 merged into Batch 1 (0~105m). Ch3+Ch4 merged into Batch 2 (1h45m~3h45m) because Ch4 is only 15m. Total 2 batches.
const case4Segs = [
  createMockSegment(0, 2700, "Ch1"),
  createMockSegment(2700, 6300, "Ch2"),
  createMockSegment(6300, 12600, "Ch3"),
  createMockSegment(12600, 13500, "Ch4")
];
const case4Batches = groupSegmentsForTerms(case4Segs, 13500);
console.log(`[Case 4] Batches count: ${case4Batches.length}`);
if (case4Batches.length === 2 &&
    case4Batches[0].end === 6300 &&
    case4Batches[1].end === 13500) {
  console.log("✅ PASS: Case 4 correctly merged Ch3 and Ch4 to prevent the last batch from falling below 30 minutes.");
} else {
  console.error("❌ FAIL: Case 4 grouping failed!");
  process.exit(1);
}

// Case 5: Video length 3:30. Chapters: 0~50m (3000s), 50m~1:40 (3000s), 1:40~3:30 (6600s)
// Expected: Ch1+Ch2 merged into Batch 1 (0~100m), Ch3 individual (1h40m~3h30m, 110m). Total 2 batches.
const case5Segs = [
  createMockSegment(0, 3000, "Ch1"),
  createMockSegment(3000, 6000, "Ch2"),
  createMockSegment(6000, 12600, "Ch3")
];
const case5Batches = groupSegmentsForTerms(case5Segs, 12600);
console.log(`[Case 5] Batches count: ${case5Batches.length}`);
if (case5Batches.length === 2 &&
    case5Batches[0].end === 6000 &&
    case5Batches[1].end === 12600) {
  console.log("✅ PASS: Case 5 correctly generated 2 batches.");
} else {
  console.error("❌ FAIL: Case 5 grouping failed!");
  process.exit(1);
}

// Case 6: Video length 1:20 (4800s). Chapters: 0~45m (2700s), 45m~1:20 (2100s)
// Expected: 1 batch containing both (0~80m) since splitting would violate either >=1h for Batch 1 or >=30m for Batch 2.
const case6Segs = [
  createMockSegment(0, 2700, "Ch1"),
  createMockSegment(2700, 4800, "Ch2")
];
const case6Batches = groupSegmentsForTerms(case6Segs, 4800);
console.log(`[Case 6] Batches count: ${case6Batches.length}`);
if (case6Batches.length === 1 &&
    case6Batches[0].end === 4800) {
  console.log("✅ PASS: Case 6 correctly generated a single batch for 1h20m video with 45m/35m chapters.");
} else {
  console.error("❌ FAIL: Case 6 grouping failed!");
  process.exit(1);
}

// Case 7: Video length 2:05 (7500s). Chapters: 0~40m (2400s), 40m~1h15m (2100s, end=4500s), 1h15m~2:05 (3000s, end=7500s)
// Expected: Ch1+Ch2 merged into Batch 1 (0~1h15m = 75m), Ch3 is Batch 2 (1h15m~2h05m = 50m >= 30m). Total 2 batches.
const case7Segs = [
  createMockSegment(0, 2400, "Ch1"),
  createMockSegment(2400, 4500, "Ch2"),
  createMockSegment(4500, 7500, "Ch3")
];
const case7Batches = groupSegmentsForTerms(case7Segs, 7500);
console.log(`[Case 7] Batches count: ${case7Batches.length}`);
if (case7Batches.length === 2 &&
    case7Batches[0].end === 4500 &&
    case7Batches[1].end === 7500) {
  console.log("✅ PASS: Case 7 correctly generated 2 batches (75m and 50m).");
} else {
  console.error("❌ FAIL: Case 7 grouping failed!");
  process.exit(1);
}

// Case 8: Video length 2:20 (8400s). Chapters: 0~1:10 (4200s), 1:10~2:05 (3300s, end=7500s), 2:05~2:20 (900s, end=8400s)
// Expected: Ch1 is Batch 1 (0~1h10m). Ch2+Ch3 merged into Batch 2 (1h10m~2h20m) because Ch3 is only 15m. Total 2 batches.
const case8Segs = [
  createMockSegment(0, 4200, "Ch1"),
  createMockSegment(4200, 7500, "Ch2"),
  createMockSegment(7500, 8400, "Ch3")
];
const case8Batches = groupSegmentsForTerms(case8Segs, 8400);
console.log(`[Case 8] Batches count: ${case8Batches.length}`);
if (case8Batches.length === 2 &&
    case8Batches[0].end === 4200 &&
    case8Batches[1].end === 8400) {
  console.log("✅ PASS: Case 8 correctly merged Ch2 and Ch3 into a single 70m batch.");
} else {
  console.error("❌ FAIL: Case 8 grouping failed!");
  process.exit(1);
}

// Case 9: Video length 2:05 (7500s). Chapters: 0~1:10 (4200s), 1:10~1:50 (2400s, end=6600s), 1:50~2:05 (900s, end=7500s)
// Expected: Ch1 is Batch 1 (0~1h10m). Ch2+Ch3 merged into Batch 2 (1h10m~2h05m) because Ch3 is only 15m. Total 2 batches.
const case9Segs = [
  createMockSegment(0, 4200, "Ch1"),
  createMockSegment(4200, 6600, "Ch2"),
  createMockSegment(6600, 7500, "Ch3")
];
const case9Batches = groupSegmentsForTerms(case9Segs, 7500);
console.log(`[Case 9] Batches count: ${case9Batches.length}`);
if (case9Batches.length === 2 &&
    case9Batches[0].end === 4200 &&
    case9Batches[1].end === 7500) {
  console.log("✅ PASS: Case 9 correctly merged Ch2 and Ch3 into a single 55m batch.");
} else {
  console.error("❌ FAIL: Case 9 grouping failed!");
  process.exit(1);
}

// Case 10: Video length 7.5 hours (27000s). Chapters: 8 chapters of 3375s each.
// Expected: Since totalDuration / 7 = 3857s > 3600s, targetDuration scales up.
// Therefore, the 8 segments are grouped into at most 7 batches.
const case10Segs = [
  createMockSegment(0, 3375, "Ch1"),
  createMockSegment(3375, 6750, "Ch2"),
  createMockSegment(6750, 10125, "Ch3"),
  createMockSegment(10125, 13500, "Ch4"),
  createMockSegment(13500, 16875, "Ch5"),
  createMockSegment(16875, 20250, "Ch6"),
  createMockSegment(20250, 23625, "Ch7"),
  createMockSegment(23625, 27000, "Ch8")
];
const case10Batches = groupSegmentsForTerms(case10Segs, 27000);
console.log(`[Case 10] Batches count: ${case10Batches.length} (expected: <= 7)`);
if (case10Batches.length <= 7) {
  console.log("✅ PASS: Case 10 correctly limited the total batches count to 7 or less via dynamic scaling.");
} else {
  console.error(`❌ FAIL: Case 10 generated ${case10Batches.length} batches, exceeding the maximum allowed limit of 7!`);
  process.exit(1);
}

console.log("\n🎉 All frontend segmentation, boundary, entry-split, and professional terms batching tests passed!");

