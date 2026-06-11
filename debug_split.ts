import { generateSegments } from './frontend/src/utils';

// Mock subtitles from ivty6t0lUkQ around 13:30 (810s)
const mockSubtitles = [
  { start: 0, duration: 10, text: "Intro content" },
  { start: 810.959, duration: 3.841, text: "the back to clean that up. So the next" },
  { start: 812.8, duration: 3.839, text: "thing we need, which is the meat of this" }
];

// Let's add some padding subtitles to make it a realistic 35.8 min video (2149s)
for (let s = 10; s < 2149; s += 30) {
  if (s !== 810 && s !== 812) {
    mockSubtitles.push({ start: s, duration: 10, text: `Subtitle at ${s}s.` });
  }
}
mockSubtitles.sort((a, b) => a.start - b.start);

console.log("Diagnostic splitting on 35.8m video (2149s):");
console.log("- interval: 1200s (20m)");
console.log("- noSegThreshold: 1800s (30m)");
console.log("- subSegThreshold: 1800s (30m)");

const segments = generateSegments(mockSubtitles, 2149, [], 1200, 1800, 1800);
console.log("Resulting Segments count:", segments.length);
segments.forEach((seg, idx) => {
  console.log(`- Segment ${idx + 1}: ${seg.subTitle} (subtitles count: ${seg.subtitles.length})`);
});
