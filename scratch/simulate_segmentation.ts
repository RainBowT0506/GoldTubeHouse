import fs from 'fs';
import path from 'path';
import { generateSegments } from '../frontend/src/utils.ts';

const dataPath = path.join(import.meta.dirname, 'ivty_data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

console.log("=== Video Info ===");
console.log("Title:", data.title);
console.log("Duration:", data.duration, "seconds (", data.duration / 60, "minutes )");
console.log("Subtitles count:", data.subtitles.length);

console.log("\n=== Simulation with EMPTY splits (no chapters / custom splits) ===");
console.log("Running generateSegments(subtitles, duration, [], 1200, 1800, 1800):");
const segmentsNoSplits = generateSegments(data.subtitles, data.duration, [], 1200, 1800, 1800);
console.log("Segments count:", segmentsNoSplits.length);
segmentsNoSplits.forEach((seg, idx) => {
  console.log(`- Segment ${idx + 1}: ${seg.subTitle} (subtitles: ${seg.subtitles.length}, duration: ${seg.end - seg.start}s)`);
});
