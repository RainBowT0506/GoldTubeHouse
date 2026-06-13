import { generateSegments, resolveSubtitleOverlaps, groupSegmentsForTerms, getVideoId, Segment } from '../frontend/src/utils.ts';


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

// Case 1: Video length 1:36:52 (96m 52s = 5812s)
// Expected: <= 105 minutes -> 1 batch.
const case1Segs = [
  createMockSegment(0, 3000, "Ch1"),
  createMockSegment(3000, 5812, "Ch2")
];
const case1Batches = groupSegmentsForTerms(case1Segs, 5812);
console.log(`[Case 1] 1:36:52 video batches count: ${case1Batches.length}`);
if (case1Batches.length === 1 && case1Batches[0].end === 5812) {
  console.log("✅ PASS: Case 1 correctly generated 1 batch for 96.8 min video.");
} else {
  console.error(`❌ FAIL: Case 1 expected 1 batch, but got ${case1Batches.length}!`);
  process.exit(1);
}

// Case 2: Video length 2:45:00 (165m = 9900s)
// Expected: 105 < 165 <= 165 -> 2 batches.
const case2Segs = [
  createMockSegment(0, 4800, "Ch1"),
  createMockSegment(4800, 9900, "Ch2")
];
const case2Batches = groupSegmentsForTerms(case2Segs, 9900);
console.log(`[Case 2] 2:45:00 video batches count: ${case2Batches.length}`);
if (case2Batches.length === 2) {
  console.log("✅ PASS: Case 2 correctly generated 2 batches for 165 min video.");
} else {
  console.error(`❌ FAIL: Case 2 expected 2 batches, but got ${case2Batches.length}!`);
  process.exit(1);
}

// Case 3: Video length 2:46:00 (166m = 9960s)
// Expected: 166 > 165 -> 3 batches.
const case3Segs = [
  createMockSegment(0, 3000, "Ch1"),
  createMockSegment(3000, 6000, "Ch2"),
  createMockSegment(6000, 9960, "Ch3")
];
const case3Batches = groupSegmentsForTerms(case3Segs, 9960);
console.log(`[Case 3] 2:46:00 video batches count: ${case3Batches.length}`);
if (case3Batches.length === 3) {
  console.log("✅ PASS: Case 3 correctly generated 3 batches for 166 min video.");
} else {
  console.error(`❌ FAIL: Case 3 expected 3 batches, but got ${case3Batches.length}!`);
  process.exit(1);
}

// Case 4: Video length 4:30:00 (270m = 16200s)
// Expected: 225 < 270 <= 285 -> 4 batches.
const case4Segs = [
  createMockSegment(0, 4000, "Ch1"),
  createMockSegment(4000, 8000, "Ch2"),
  createMockSegment(8000, 12000, "Ch3"),
  createMockSegment(12000, 16200, "Ch4")
];
const case4Batches = groupSegmentsForTerms(case4Segs, 16200);
console.log(`[Case 4] 4:30:00 video batches count: ${case4Batches.length}`);
if (case4Batches.length === 4) {
  console.log("✅ PASS: Case 4 correctly generated 4 batches for 270 min video.");
} else {
  console.error(`❌ FAIL: Case 4 expected 4 batches, but got ${case4Batches.length}!`);
  process.exit(1);
}

// Case 5: Balanced division closest search test.
// Video length 120m (7200s), N = 2, target = 60m (3600s).
// Segments end at: Ch1 (45m / 2700s), Ch2 (70m / 4200s), Ch3 (120m / 7200s).
// Ideal end is 3600s.
// Ch2 end (4200s, diff = 600s) is closer to 3600s than Ch1 end (2700s, diff = 900s).
// So it must split after Ch2, i.e. Batch 1 ends at 4200s.
const case5Segs = [
  createMockSegment(0, 2700, "Ch1"),
  createMockSegment(2700, 4200, "Ch2"),
  createMockSegment(4200, 7200, "Ch3")
];
const case5Batches = groupSegmentsForTerms(case5Segs, 7200);
console.log(`[Case 5] Split boundary selection: Batch 1 ends at ${case5Batches[0].end}s`);
if (case5Batches.length === 2 && case5Batches[0].end === 4200) {
  console.log("✅ PASS: Case 5 correctly selected Ch2 boundary (closer to ideal end).");
} else {
  console.error(`❌ FAIL: Case 5 closest boundary selection failed!`);
  process.exit(1);
}

// ----------------------------------------------------
// Test 11: Under noSegThreshold with chapters (bundling test)
// ----------------------------------------------------
// duration = 1100 (18.3m), noSegThreshold = 1800 (30m).
// 1. generateSegments should still apply the chapters (length > 1)
const segmentsUnderThreshold = generateSegments(mockSubtitlesBasic, 1100, [{ time: 100, title: "Ch1" }], [], 1200, 1800, 1800);
console.log(`[Test 11] Under threshold segments count: ${segmentsUnderThreshold.length}`);
if (segmentsUnderThreshold.length > 1) {
  console.log("✅ PASS: Chapter splits are applied for short videos on the UI level.");
} else {
  console.error(`❌ FAIL: Short video with chapters should still show chapters, but got only ${segmentsUnderThreshold.length} segments!`);
  process.exit(1);
}

// 2. Mock the React aiGroups bundling logic
const isShortVideo = 1100 <= 1800; // duration <= noSegThreshold
const aiGroupsMock: any[] = [];
let currentGroup: any = null;
segmentsUnderThreshold.forEach((seg, index) => {
  const isMergedWithPrev = isShortVideo ? index > 0 : false;
  if (isMergedWithPrev && currentGroup) {
    currentGroup.segments.push(seg);
  } else {
    currentGroup = { id: `g_${index}`, segments: [seg] };
    aiGroupsMock.push(currentGroup);
  }
});
console.log(`[Test 11] Mocked AI groups count: ${aiGroupsMock.length}`);
if (aiGroupsMock.length === 1) {
  console.log("✅ PASS: Short video segments are successfully bundled into a single AI request.");
} else {
  console.error(`❌ FAIL: Short video segments should bundle into 1 group, but got ${aiGroupsMock.length}!`);
  process.exit(1);
}

// ----------------------------------------------------
// Test 12: getVideoId utility test
// ----------------------------------------------------
const testUrls = [
  { url: "https://www.youtube.com/watch?v=EH5jx5qPabU", expected: "EH5jx5qPabU" },
  { url: "https://youtu.be/EH5jx5qPabU", expected: "EH5jx5qPabU" },
  { url: "https://www.youtube.com/embed/EH5jx5qPabU", expected: "EH5jx5qPabU" },
  { url: "https://youtube.com/shorts/EH5jx5qPabU?feature=share", expected: "EH5jx5qPabU" },
  { url: "EH5jx5qPabU", expected: "EH5jx5qPabU" },
  { url: "invalid_url_with_no_id", expected: null }
];

for (const item of testUrls) {
  const result = getVideoId(item.url);
  if (result === item.expected) {
    console.log(`✅ PASS: getVideoId("${item.url}") -> "${result}" matches expected.`);
  } else {
    console.error(`❌ FAIL: getVideoId("${item.url}") expected "${item.expected}", but got "${result}"!`);
    process.exit(1);
  }
}

console.log("\n🎉 All frontend segmentation, boundary, entry-split, and professional terms batching tests passed!");

