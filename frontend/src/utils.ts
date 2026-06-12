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
  chapterSplits: ChapterSplit[],   // 來自 parsedChapters（Chapter 層級邊界）
  customSplits: ChapterSplit[],    // 來自 userCustomSplits（Chapter 內的自訂切分點）
  interval: number,
  noSegThreshold: number,
  subSegThreshold: number,
  removedBoundaryTimes: number[] = []
): Segment[] {
  const segments: Segment[] = [];

  // ── 情況 1：沒有任何分割點 → 自動依時間間隔分段 ──────────────────────────
  if (chapterSplits.length === 0 && customSplits.length === 0) {
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
          segments.push({
            id: `seg_time_${idx}`,
            chapterTitle: `分段區塊 ${idx + 1}`,
            subTitle: `${formatTime(t)} ~ ${formatTime(duration)}`,
            isSubSegment: false,
            start: t,
            end: duration,
            subtitles: subtitles.filter(s => s.start >= t)
          });
          break;
        }
        const bestIdx = findBestSplitIndex(subtitles, target, 120);
        let nextT = bestIdx < subtitles.length ? subtitles[bestIdx].start : duration;
        if (nextT <= t) nextT = t + interval;
        if (duration - nextT < Math.min(360, interval * 0.5)) nextT = duration;
        segments.push({
          id: `seg_time_${idx}`,
          chapterTitle: `分段區塊 ${idx + 1}`,
          subTitle: `${formatTime(t)} ~ ${formatTime(nextT)}`,
          isSubSegment: false,
          start: t,
          end: nextT,
          subtitles: subtitles.filter(s => s.start >= t && s.start < nextT)
        });
        t = nextT;
        idx++;
      }
    }
    return segments;
  }

  // ── 情況 2：只有自訂切分（沒有 Chapters）→ 平面清單 ──────────────────────
  if (chapterSplits.length === 0 && customSplits.length > 0) {
    const pts = [...customSplits].sort((a, b) => a.time - b.time);
    if (pts[0].time > 0) pts.unshift({ time: 0, title: '' });
    pts.forEach((sp, i) => {
      const start = sp.time;
      const end = i + 1 < pts.length ? pts[i + 1].time : duration;
      segments.push({
        isGroup: false,
        id: `seg_custom_${i}`,
        chapterTitle: sp.title || `自訂分段 ${i + 1}`,
        subTitle: `${formatTime(start)} ~ ${formatTime(end)}`,
        isSubSegment: false,
        start,
        end,
        subtitles: subtitles.filter(s => s.start >= start && s.start < end)
      });
    });
    return segments;
  }

  // ── 情況 3：有 Chapters → 層次結構（所有 Chapter 均顯示為資料夾）──────────
  const localChapters = [...chapterSplits].sort((a, b) => a.time - b.time);
  // 確保從 0 開始
  if (localChapters[0].time > 0) {
    localChapters.unshift({ time: 0, title: '影片開始' });
  }

  const isTimeRemoved = (time: number) => {
    return removedBoundaryTimes.some(r => Math.abs(r - time) < 0.05);
  };

  for (let ci = 0; ci < localChapters.length; ci++) {
    const chStart = localChapters[ci].time;
    const chEnd = ci + 1 < localChapters.length ? localChapters[ci + 1].time : duration;
    const chTitle = localChapters[ci].title || `章節 ${ci + 1}`;
    const chSubs = subtitles.filter(s => s.start >= chStart && s.start < chEnd);

    // 找出落在此 Chapter 範圍內的自訂切分點
    const inChCustom = customSplits
      .filter(cs => cs.time > chStart && cs.time < chEnd)
      .sort((a, b) => a.time - b.time);

    // 組成「本 Chapter 的分割點清單」，起點 + 自訂切分
    const subPts: ChapterSplit[] = [{ time: chStart, title: '' }, ...inChCustom];

    const subSegments: Segment[] = [];

    for (let si = 0; si < subPts.length; si++) {
      const segStart = subPts[si].time;
      const segEnd = si + 1 < subPts.length ? subPts[si + 1].time : chEnd;
      const segSubs = chSubs.filter(s => s.start >= segStart && s.start < segEnd);
      const segDur = segEnd - segStart;

      if (segDur > subSegThreshold) {
        // 還需要自動再切分
        let t = segStart;
        let autoIdx = 0;
        while (t < segEnd) {
          const target = t + interval;
          if (target >= segEnd) {
            subSegments.push({
              id: `seg_ch${ci}_sp${si}_a${autoIdx}`,
              chapterTitle: chTitle,
              subTitle: `${formatTime(t)} ~ ${formatTime(segEnd)}`,
              isSubSegment: true,
              start: t,
              end: segEnd,
              subtitles: segSubs.filter(s => s.start >= t)
            });
            break;
          }
          const bestIdx = findBestSplitIndex(segSubs, target, 120);
          let nextT = bestIdx < segSubs.length ? segSubs[bestIdx].start : segEnd;
          if (nextT <= t) nextT = t + interval;

          // 如果這個切分點被合併了，往後尋找下一個切分點
          while (isTimeRemoved(nextT) && nextT < segEnd) {
            const nextTarget = nextT + interval;
            if (nextTarget >= segEnd) {
              nextT = segEnd;
              break;
            }
            const nextBestIdx = findBestSplitIndex(segSubs, nextTarget, 120);
            let candidateT = nextBestIdx < segSubs.length ? segSubs[nextBestIdx].start : segEnd;
            if (candidateT <= nextT) candidateT = nextT + interval;
            nextT = candidateT;
          }

          if (segEnd - nextT < Math.min(360, interval * 0.5)) nextT = segEnd;
          subSegments.push({
            id: `seg_ch${ci}_sp${si}_a${autoIdx}`,
            chapterTitle: chTitle,
            subTitle: `${formatTime(t)} ~ ${formatTime(nextT)}`,
            isSubSegment: true,
            start: t,
            end: nextT,
            subtitles: segSubs.filter(s => s.start >= t && s.start < nextT)
          });
          t = nextT;
          autoIdx++;
        }
      } else {
        // 短到可以直接當一個子分段
        subSegments.push({
          id: `seg_ch${ci}_sp${si}`,
          chapterTitle: chTitle,
          subTitle: `${formatTime(segStart)} ~ ${formatTime(segEnd)}`,
          isSubSegment: true,
          start: segStart,
          end: segEnd,
          subtitles: segSubs
        });
      }
    }

    // 所有 Chapter 均以 isGroup: true 顯示為資料夾
    segments.push({
      isGroup: true,
      chapterTitle: chTitle,
      start: chStart,
      end: chEnd,
      subtitles: [],
      subSegments
    });
  }

  return segments;
}



export interface TermsBatch {
  id: string;
  title: string;
  text: string;
  start: number;
  end: number;
  segments: Segment[];
}

export function groupSegmentsForTerms(
  segments: Segment[],
  totalDuration: number
): TermsBatch[] {
  if (segments.length === 0) return [];

  // If total duration is less than 1 hour (3600 seconds), return all in one batch
  if (totalDuration < 3600) {
    const text = segments.map(s => cleanAndJoinSubtitles(s.subtitles)).join('\n');
    const start = segments[0].start;
    const end = segments[segments.length - 1].end;
    
    // Format title
    const lines = segments.map((s) => {
      const timeStr = formatTime(s.start);
      const rangeStr = s.subTitle ? ` (${s.subTitle})` : '';
      return `* [${timeStr}] ${s.chapterTitle}${rangeStr}`;
    });
    const title = lines.join('\n');

    return [{
      id: 'terms_batch_all',
      title,
      text,
      start,
      end,
      segments: [...segments]
    }];
  }

  const batches: TermsBatch[] = [];
  let startIdx = 0;

  while (startIdx < segments.length) {
    const startSeg = segments[startIdx];
    const startVal = startSeg.start;
    
    // Find the first segment boundary that is >= 3600 seconds from startVal
    // AND leaves at least 1800 seconds to the end of the video.
    let foundSplitIdx = -1;
    for (let i = startIdx; i < segments.length; i++) {
      const currentEnd = segments[i].end;
      const duration = currentEnd - startVal;
      const remaining = totalDuration - currentEnd;

      if (duration >= 3600) {
        if (remaining >= 1800 || remaining === 0) {
          foundSplitIdx = i;
          break;
        }
      }
    }

    if (foundSplitIdx !== -1) {
      const batchSegs = segments.slice(startIdx, foundSplitIdx + 1);
      const endVal = segments[foundSplitIdx].end;
      const text = batchSegs.map(s => cleanAndJoinSubtitles(s.subtitles)).join('\n');
      
      const lines = batchSegs.map((s) => {
        const timeStr = formatTime(s.start);
        const rangeStr = s.subTitle ? ` (${s.subTitle})` : '';
        return `* [${timeStr}] ${s.chapterTitle}${rangeStr}`;
      });
      const title = lines.join('\n');

      batches.push({
        id: `terms_batch_${batches.length}`,
        title,
        text,
        start: startVal,
        end: endVal,
        segments: batchSegs
      });
      
      startIdx = foundSplitIdx + 1;
    } else {
      // If no valid split point is found, we must merge all remaining segments into the current batch.
      const batchSegs = segments.slice(startIdx);
      const endVal = segments[segments.length - 1].end;
      const text = batchSegs.map(s => cleanAndJoinSubtitles(s.subtitles)).join('\n');

      const lines = batchSegs.map((s) => {
        const timeStr = formatTime(s.start);
        const rangeStr = s.subTitle ? ` (${s.subTitle})` : '';
        return `* [${timeStr}] ${s.chapterTitle}${rangeStr}`;
      });
      const title = lines.join('\n');

      batches.push({
        id: `terms_batch_${batches.length}`,
        title,
        text,
        start: startVal,
        end: endVal,
        segments: batchSegs
      });

      break;
    }
  }

  return batches;
}

export function resolveSubtitleOverlaps(entries: SubtitleEntry[]): SubtitleEntry[] {
  if (!entries || entries.length === 0) return [];
  // Sort by start time just to be sure
  const sorted = [...entries].sort((a, b) => a.start - b.start);
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const currentEnd = current.start + current.duration;
    if (currentEnd > next.start) {
      current.duration = Math.max(0.01, next.start - current.start);
    }
  }
  return sorted;
}

export function parseSubtitlesText(text: string): SubtitleEntry[] {
  const cleaned = text.trim();
  
  // 1. Try JSON
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        const subs: SubtitleEntry[] = [];
        for (const item of parsed) {
          const t = item.text || item.content || "";
          let start = 0;
          if (typeof item.start === 'number') start = item.start;
          else if (typeof item.start === 'string') start = parseTimeToSeconds(item.start);
          
          let duration = 2;
          if (typeof item.duration === 'number') {
            duration = item.duration;
          } else if (typeof item.end === 'number') {
            duration = Math.max(0, item.end - start);
          } else if (typeof item.end === 'string') {
            duration = Math.max(0, parseTimeToSeconds(item.end) - start);
          }
          subs.push({ text: t, start, duration });
        }
        if (subs.length > 0) return subs;
      }
    } catch (e) {
      console.warn("JSON parse failed, falling back to VTT/SRT", e);
    }
  }

  // 2. VTT / SRT parser
  const lines = text.split(/\r?\n/);
  const subs: SubtitleEntry[] = [];
  let currentStart = -1;
  let currentEnd = -1;
  let currentTextLines: string[] = [];

  const timeRegex = /([\d:,.]+)\s*-->\s*([\d:,.]+)/;

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(timeRegex);
    
    if (match) {
      // If we have an active subtitle, save it
      if (currentStart >= 0 && currentTextLines.length > 0) {
        subs.push({
          text: currentTextLines.join(' '),
          start: currentStart,
          duration: Math.max(0.1, currentEnd - currentStart)
        });
      }
      // Reset for next
      currentStart = parseTimestampToSeconds(match[1]);
      currentEnd = parseTimestampToSeconds(match[2]);
      currentTextLines = [];
    } else if (trimmed === "" || /^\d+$/.test(trimmed) || trimmed === "WEBVTT") {
      // Blank line or sequence number or WEBVTT header
      // If blank line, we can optionally save current subtitle if it's the end of block
      if (trimmed === "" && currentStart >= 0 && currentTextLines.length > 0) {
        subs.push({
          text: currentTextLines.join(' '),
          start: currentStart,
          duration: Math.max(0.1, currentEnd - currentStart)
        });
        currentStart = -1;
        currentEnd = -1;
        currentTextLines = [];
      }
    } else {
      if (currentStart >= 0) {
        currentTextLines.push(trimmed);
      }
    }
  }

  // Save the last subtitle if any
  if (currentStart >= 0 && currentTextLines.length > 0) {
    subs.push({
      text: currentTextLines.join(' '),
      start: currentStart,
      duration: Math.max(0.1, currentEnd - currentStart)
    });
  }

  // 3. Fallback to Plain Text (if no subtitles were parsed)
  if (subs.length === 0) {
    const lines = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
    let time = 0;
    for (const line of lines) {
      subs.push({
        text: line,
        start: time,
        duration: 8
      });
      time += 8;
    }
  }

  return subs;
}

export function parseTimestampToSeconds(ts: string): number {
  const clean = ts.trim().replace(',', '.');
  const parts = clean.split(':').map(Number);
  
  if (parts.length === 3) {
    // HH:MM:SS.mmm
    const h = parts[0];
    const m = parts[1];
    const s = parts[2];
    return h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    // MM:SS.mmm
    const m = parts[0];
    const s = parts[1];
    return m * 60 + s;
  } else if (!isNaN(Number(clean))) {
    return Number(clean);
  }
  return 0;
}
