export interface SubtitleEntry {
  text: string;
  start: number;
  duration: number;
  globalIndex?: number;
}

export interface ChapterSplit {
  time: number;
  title: string;
}

export interface Segment {
  id?: string;
  chapterTitle: string;
  subTitle?: string;
  isSubSegment?: boolean;
  start: number;
  end: number;
  subtitles: SubtitleEntry[];
  isGroup?: boolean;
  subSegments?: Segment[];
}

// Convert H:MM:SS or MM:SS to seconds
export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Convert seconds to H:MM:SS or MM:SS
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (num: number) => String(num).padStart(2, '0');
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

// Check if a line ends with punctuation
export function isSentenceEnd(text: string): boolean {
  if (!text) return false;
  const cleanText = text.trim();
  if (cleanText.length === 0) return false;
  const lastChar = cleanText.slice(-1);
  return /[。！？.!?]/.test(lastChar);
}

// Find best split index matching sentence endings
export function findBestSplitIndex(subtitles: SubtitleEntry[], targetTime: number, maxOffsetSecs = 120): number {
  let closestIndex = -1;
  let minDiff = Infinity;

  for (let i = 0; i < subtitles.length; i++) {
    const diff = Math.abs(subtitles[i].start - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  if (closestIndex === -1) return subtitles.length;

  let bestIndex = closestIndex;
  let searchRadius = 0;
  while (true) {
    const beforeIndex = closestIndex - searchRadius;
    const afterIndex = closestIndex + searchRadius;
    const beforeValid = beforeIndex >= 0 && Math.abs(subtitles[beforeIndex].start - targetTime) <= maxOffsetSecs;
    const afterValid = afterIndex < subtitles.length && Math.abs(subtitles[afterIndex].start - targetTime) <= maxOffsetSecs;

    if (!beforeValid && !afterValid) break;

    if (afterValid && isSentenceEnd(subtitles[afterIndex].text)) {
      bestIndex = afterIndex + 1;
      break;
    }
    if (beforeValid && isSentenceEnd(subtitles[beforeIndex].text)) {
      bestIndex = beforeIndex + 1;
      break;
    }
    searchRadius++;
  }
  return bestIndex;
}

export interface SubtitleMapping {
  entryIndex: number;
  textStart: number;
  textEnd: number;
}

// Clean, deduplicate, and map subtitles to their source entries
export function getCleanedSubtitlesAndMappings(entries: SubtitleEntry[]): {
  text: string;
  mappings: SubtitleMapping[];
} {
  if (!entries || entries.length === 0) {
    return { text: "(此時間段內無字幕文字)", mappings: [] };
  }

  const mappedEntries: { entryIndex: number; text: string }[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    let text = entry.text.trim();
    text = text.replace(/<[^>]+>/g, ''); // Remove XML
    text = text.replace(/\s+/g, ' '); // Compress spaces
    if (!text) continue;

    if (mappedEntries.length > 0) {
      const lastItem = mappedEntries[mappedEntries.length - 1];
      const lastText = lastItem.text;
      if (lastText === text) {
        lastItem.entryIndex = i;
        continue;
      }
      if (text.startsWith(lastText) || text.includes(lastText)) {
        lastItem.text = text;
        lastItem.entryIndex = i;
        continue;
      }
      if (lastText.includes(text)) {
        continue;
      }
    }
    mappedEntries.push({ entryIndex: i, text: text });
  }

  let joinedText = "";
  const mappings: SubtitleMapping[] = [];

  for (let i = 0; i < mappedEntries.length; i++) {
    const item = mappedEntries[i];
    const textStart = joinedText.length;
    joinedText += item.text;
    const textEnd = joinedText.length;
    
    mappings.push({
      entryIndex: item.entryIndex,
      textStart: textStart,
      textEnd: textEnd
    });

    if (i < mappedEntries.length - 1) {
      joinedText += " ";
    }
  }

  return { text: joinedText, mappings };
}

// Clean and join subtitles text
export function cleanAndJoinSubtitles(entries: SubtitleEntry[]): string {
  return getCleanedSubtitlesAndMappings(entries).text;
}

// Main segmentation engine
export function generateSegments(
  subtitles: SubtitleEntry[],
  duration: number,
  splits: ChapterSplit[],
  interval: number,
  noSegThreshold: number,
  subSegThreshold: number
): Segment[] {
  const segments: Segment[] = [];

  // Scenario 1: No split points
  if (splits.length === 0) {
    if (duration <= noSegThreshold) {
      segments.push({
        id: 'seg_all',
        chapterTitle: '完整影片字幕',
        subTitle: `00:00 ~ ${formatTime(duration)}`,
        isSubSegment: false,
        start: 0,
        end: duration,
        subtitles: subtitles
      });
    } else {
      let t = 0;
      let idx = 0;
      while (t < duration) {
        const target = t + interval;
        if (target >= duration) {
          const sub = subtitles.filter(s => s.start >= t);
          segments.push({
            id: `seg_time_${idx}`,
            chapterTitle: `分段區塊 ${idx + 1}`,
            subTitle: `${formatTime(t)} ~ ${formatTime(duration)}`,
            isSubSegment: false,
            start: t,
            end: duration,
            subtitles: sub
          });
          break;
        }

        const bestIdx = findBestSplitIndex(subtitles, target, 120);
        let nextT = (bestIdx < subtitles.length) ? subtitles[bestIdx].start : duration;
        if (nextT <= t) nextT = t + interval; // Avoid infinite loop

        // If the remaining duration after nextT is too short, merge it into the current segment
        if (duration - nextT < Math.min(360, interval * 0.5)) {
          nextT = duration;
        }

        const sub = subtitles.filter(s => s.start >= t && s.start < nextT);
        segments.push({
          id: `seg_time_${idx}`,
          chapterTitle: `分段區塊 ${idx + 1}`,
          subTitle: `${formatTime(t)} ~ ${formatTime(nextT)}`,
          isSubSegment: false,
          start: t,
          end: nextT,
          subtitles: sub
        });
        t = nextT;
        idx++;
      }
    }
  } else {
    // Scenario 2: With split points (chapters or custom splits)
    // Make sure it starts from 0
    const localSplits = [...splits];
    if (localSplits.length > 0 && localSplits[0].time > 0) {
      localSplits.unshift({ time: 0, title: '影片開始' });
    } else if (localSplits.length === 0) {
      localSplits.unshift({ time: 0, title: '影片開始' });
    }

    for (let i = 0; i < localSplits.length; i++) {
      const start = localSplits[i].time;
      const end = (i + 1 < localSplits.length) ? localSplits[i + 1].time : duration;
      const chapterTitle = localSplits[i].title || `自訂分段 ${i}`;
      const chapterDuration = end - start;

      if (chapterDuration > subSegThreshold) {
        let t = start;
        let subIdx = 0;
        const chapterSubtitles = subtitles.filter(s => s.start >= start && s.start < end);
        const subSegments: Segment[] = [];

        while (t < end) {
          const target = t + interval;
          if (target >= end) {
            const sub = chapterSubtitles.filter(s => s.start >= t);
            subSegments.push({
              id: `seg_chap_${i}_sub_${subIdx}`,
              chapterTitle: chapterTitle,
              subTitle: `${formatTime(t)} ~ ${formatTime(end)}`,
              isSubSegment: true,
              start: t,
              end: end,
              subtitles: sub
            });
            break;
          }
          const bestIdx = findBestSplitIndex(chapterSubtitles, target, 120);
          let nextT = (bestIdx < chapterSubtitles.length) ? chapterSubtitles[bestIdx].start : end;
          if (nextT <= t) nextT = t + interval;

          // If the remaining duration in this chapter after nextT is too short, merge it into the current sub-segment
          if (end - nextT < Math.min(360, interval * 0.5)) {
            nextT = end;
          }

          const sub = chapterSubtitles.filter(s => s.start >= t && s.start < nextT);
          subSegments.push({
            id: `seg_chap_${i}_sub_${subIdx}`,
            chapterTitle: chapterTitle,
            subTitle: `${formatTime(t)} ~ ${formatTime(nextT)}`,
            isSubSegment: true,
            start: t,
            end: nextT,
            subtitles: sub
          });
          t = nextT;
          subIdx++;
        }

        segments.push({
          isGroup: true,
          chapterTitle: chapterTitle,
          start: start,
          end: end,
          subtitles: [],
          subSegments: subSegments
        });
      } else {
        const sub = subtitles.filter(s => s.start >= start && s.start < end);
        segments.push({
          isGroup: false,
          id: `seg_chap_${i}`,
          chapterTitle: chapterTitle,
          subTitle: `${formatTime(start)} ~ ${formatTime(end)}`,
          isSubSegment: false,
          start: start,
          end: end,
          subtitles: sub
        });
      }
    }
  }

  return segments;
}
