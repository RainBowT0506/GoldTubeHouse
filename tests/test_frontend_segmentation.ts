import { generateSegments } from '../frontend/src/utils.ts';

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
const segments25m = generateSegments(mockSubtitlesBasic, 1500, [], 1200, 1800, 1800);
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
const segments40m = generateSegments(mockSubtitlesBasic, 2400, [], 1200, 1800, 1800);
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
const segmentsLong = generateSegments(mockSubtitlesLong, 3546, splits, 1200, 1800, 1800);

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
const generatedSegments = generateSegments(updatedSubtitles, 3546, testSplits, 1200, 1800, 1800);

console.log(`- Generated segments count: ${generatedSegments.length}`);
const seg1 = generatedSegments[0];
const seg2 = generatedSegments[1];

const seg1CleanText = seg1.subtitles.map(s => s.text).join(' ');

// If Segment 2 is a Group, collect subtitles from its sub-segments
let seg2CleanText = "";
if (seg2.isGroup && seg2.subSegments) {
  seg2CleanText = seg2.subSegments[0].subtitles.map(s => s.text).join(' ');
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
const segments35m = generateSegments(mockSubtitles35m, 2100, [], 1200, 1800, 1800);
console.log(`- Generated segments count: ${segments35m.length}`);
if (segments35m.length === 2) {
  console.log("✅ PASS: 35 minutes video splits initially into two segments (20m + 15m).");
} else {
  console.error(`❌ FAIL: 35 minutes video should split into 2 segments initially, but got ${segments35m.length}!`);
  process.exit(1);
}

console.log("\n🎉 All frontend segmentation, boundary, and entry-split tests passed!");
