import React, { useState, useEffect, useMemo } from 'react';
import type { ChapterSplit, Segment, TermsBatch } from './utils';
import {
  parseTimeToSeconds,
  formatTime,
  cleanAndJoinSubtitles,
  generateSegments,
  getCleanedSubtitlesAndMappings,
  resolveSubtitleOverlaps,
  parseSubtitlesText,
  groupSegmentsForTerms,
  getCaretCharacterOffsetWithin
} from './utils';

import { HomeScreen } from './components/HomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ManualImportModal } from './components/ManualImportModal';
import { Sidebar } from './components/Sidebar';
import { AINotesTab } from './components/AINotesTab';
import { AITermsTab } from './components/AITermsTab';
import { EditSegmentsTab } from './components/EditSegmentsTab';


interface AIBlock {
  title: string;
  content: string;
  status: 'loading' | 'done' | 'error';
  text: string;
  currentTitle?: string;
  fullChapters?: string;
}

function App() {
  // --- States ---
  const [screen, setScreen] = useState<'home' | 'loading' | 'app'>(() => {
    return (localStorage.getItem('gth_screen') as any) || 'home';
  });
  const [loadingText, setLoadingText] = useState<string>('正在載入，請稍候...');
  const [ytUrl, setYtUrl] = useState<string>(() => {
    const saved = localStorage.getItem('gth_ytUrl_v2');
    return saved !== null ? saved : '';
  });
  const [videoData, setVideoData] = useState<any | null>(() => {
    const data = localStorage.getItem('gth_videoData_v2');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.subtitles) {
          parsed.subtitles = resolveSubtitleOverlaps(parsed.subtitles).map((s: any, idx: number) => ({
            ...s,
            globalIndex: idx
          }));
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [chaptersInput, setChaptersInput] = useState<string>(() => {
    const saved = localStorage.getItem('gth_chaptersInput_v2');
    return saved !== null ? saved : '';
  });
  const [userCustomSplits, setUserCustomSplits] = useState<ChapterSplit[]>(() => {
    const data = localStorage.getItem('gth_userCustomSplits');
    return data ? JSON.parse(data) : [];
  });
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(() => {
    try {
      const data = localStorage.getItem('gth_collapsedChapters');
      return data ? new Set<string>(JSON.parse(data)) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  const [collapsedAIGroups, setCollapsedAIGroups] = useState<Set<string>>(() => {
    try {
      const data = localStorage.getItem('gth_collapsedAIGroups');
      return data ? new Set<string>(JSON.parse(data)) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  const [removedBoundaryTimes, setRemovedBoundaryTimes] = useState<number[]>(() => {
    try {
      const data = localStorage.getItem('gth_removedBoundaryTimes');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  });
  const [editedSegmentTexts, setEditedSegmentTexts] = useState<Record<string, string>>(() => {
    const data = localStorage.getItem('gth_editedSegmentTexts');
    return data ? JSON.parse(data) : {};
  });
  const [batchStartIdx, setBatchStartIdx] = useState<number>(0);
  const [batchEndIdx, setBatchEndIdx] = useState<number>(0);
  const [aiNotesResult, setAiNotesResult] = useState<AIBlock[] | null>(() => {
    try {
      const data = localStorage.getItem('gth_aiNotesResult');
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          title: item.title || '',
          content: item.content || '',
          status: item.status || 'done',
          text: item.text || ''
        }));
      }
      return null;
    } catch {
      return null;
    }
  });
  const [aiTermsResult, setAiTermsResult] = useState<AIBlock[] | null>(() => {
    try {
      const data = localStorage.getItem('gth_aiTermsResult');
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          title: item.title || '',
          content: item.content || '',
          status: item.status || 'done',
          text: item.text || ''
        }));
      }
      return null;
    } catch {
      return null;
    }
  });
  const [openaiKey, setOpenaiKey] = useState<string>(() => {
    return localStorage.getItem('gth_openaiKey') || localStorage.getItem('openai_api_key') || '';
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'notes' | 'term'>(() => {
    return (localStorage.getItem('gth_activeTab') as any) || 'edit';
  });
  const [settingsInterval, setSettingsInterval] = useState<number>(() => {
    const saved = localStorage.getItem('gth_settingsInterval');
    return saved ? Number(saved) : 20;
  });
  const [settingsNoSegment, setSettingsNoSegment] = useState<number>(() => {
    const saved = localStorage.getItem('gth_settingsNoSegment');
    return saved ? Number(saved) : 30;
  });
  const [settingsSubSegment, setSettingsSubSegment] = useState<number>(() => {
    const saved = localStorage.getItem('gth_settingsSubSegment');
    return saved ? Number(saved) : 30;
  });
  const [showCostEstimation, setShowCostEstimation] = useState<boolean>(() => {
    return localStorage.getItem('gth_showCostEstimation') === 'true';
  });
  const [showCostDetails, setShowCostDetails] = useState<boolean>(false);
  const [collapsedNotes, setCollapsedNotes] = useState<Set<string>>(new Set());
  const [collapsedTerms, setCollapsedTerms] = useState<Set<string>>(new Set());

  const toggleCollapseNote = (title: string) => {
    setCollapsedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };

  const toggleCollapseTerm = (title: string) => {
    setCollapsedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };

  const expandAllNotes = () => setCollapsedNotes(new Set());
  const collapseAllNotes = () => {
    if (aiNotesResult) {
      setCollapsedNotes(new Set(aiNotesResult.map((item) => item.title)));
    }
  };

  const expandAllTerms = () => setCollapsedTerms(new Set());
  const collapseAllTerms = () => {
    if (aiTermsResult) {
      setCollapsedTerms(new Set(aiTermsResult.map((item) => item.title)));
    }
  };

  const [hasEnvKey, setHasEnvKey] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // --- Manual Import States ---
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importTitle, setImportTitle] = useState<string>('');
  const [importText, setImportText] = useState<string>('');

  // --- Effects for checkEnvKey ---
  useEffect(() => {
    const checkEnvKey = async () => {
      try {
        const res = await fetch('/api/check-env');
        const data = await res.json();
        if (data.status === 'success' && data.has_key) {
          setHasEnvKey(true);
        }
      } catch (e) {
        console.error('檢查本地環境變數失敗:', e);
      }
    };
    checkEnvKey();
  }, []);

  // --- Effects for State Persistence ---
  useEffect(() => {
    localStorage.setItem('gth_screen', screen);
  }, [screen]);

  useEffect(() => {
    localStorage.setItem('gth_ytUrl_v2', ytUrl);
  }, [ytUrl]);

  useEffect(() => {
    if (videoData) {
      localStorage.setItem('gth_videoData_v2', JSON.stringify(videoData));
    } else {
      localStorage.removeItem('gth_videoData_v2');
    }
  }, [videoData]);

  useEffect(() => {
    localStorage.setItem('gth_chaptersInput_v2', chaptersInput);
  }, [chaptersInput]);

  useEffect(() => {
    localStorage.setItem('gth_userCustomSplits', JSON.stringify(userCustomSplits));
  }, [userCustomSplits]);

  useEffect(() => {
    localStorage.setItem('gth_editedSegmentTexts', JSON.stringify(editedSegmentTexts));
  }, [editedSegmentTexts]);

  useEffect(() => {
    localStorage.setItem('gth_removedBoundaryTimes', JSON.stringify(removedBoundaryTimes));
  }, [removedBoundaryTimes]);

  useEffect(() => {
    localStorage.setItem('gth_collapsedAIGroups', JSON.stringify([...collapsedAIGroups]));
  }, [collapsedAIGroups]);

  useEffect(() => {
    if (aiNotesResult) {
      localStorage.setItem('gth_aiNotesResult', JSON.stringify(aiNotesResult));
    } else {
      localStorage.removeItem('gth_aiNotesResult');
    }
  }, [aiNotesResult]);

  useEffect(() => {
    if (aiTermsResult) {
      localStorage.setItem('gth_aiTermsResult', JSON.stringify(aiTermsResult));
    } else {
      localStorage.removeItem('gth_aiTermsResult');
    }
  }, [aiTermsResult]);

  useEffect(() => {
    localStorage.setItem('gth_openaiKey', openaiKey);
  }, [openaiKey]);

  useEffect(() => {
    localStorage.setItem('gth_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('gth_settingsInterval', String(settingsInterval));
  }, [settingsInterval]);

  useEffect(() => {
    localStorage.setItem('gth_settingsNoSegment', String(settingsNoSegment));
  }, [settingsNoSegment]);

  useEffect(() => {
    localStorage.setItem('gth_settingsSubSegment', String(settingsSubSegment));
  }, [settingsSubSegment]);

  useEffect(() => {
    localStorage.setItem('gth_showCostEstimation', String(showCostEstimation));
  }, [showCostEstimation]);

  useEffect(() => {
    if (videoData && videoData.video_id) {
      const savedVideoId = localStorage.getItem('gth_chaptersVideoId_v2');
      if (savedVideoId !== videoData.video_id) {
        setChaptersInput('');
        localStorage.setItem('gth_chaptersVideoId_v2', videoData.video_id);
      }
    } else {
      localStorage.removeItem('gth_chaptersVideoId_v2');
    }
  }, [videoData]);

  // --- Toast Trigger ---
  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  // --- Parsers & Segment Generation Memo ---
  const parsedChapters = useMemo<ChapterSplit[]>(() => {
    const list: ChapterSplit[] = [];
    if (chaptersInput.trim()) {
      const lines = chaptersInput.split('\n');
      const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/;

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        const match = line.match(timeRegex);
        if (match) {
          const timeStr = match[1];
          const timeSecs = parseTimeToSeconds(timeStr);
          let title = line.replace(timeStr, '').replace(/^\s*[-–—]\s*/, '').trim();
          if (!title) title = `章節 @ ${timeStr}`;
          list.push({
            time: timeSecs,
            title: title
          });
        }
      }
    }
    return list;
  }, [chaptersInput]);

  // 不再在此處過濾，保留所有 Chapter 分界點以利 UI 獨立卡片呈現
  const filteredChapterSplits = parsedChapters;

  // 不再過濾已被合併的自訂切分點
  const filteredCustomSplits = userCustomSplits;

  const currentSegments = useMemo<Segment[]>(() => {
    if (!videoData || !videoData.subtitles) return [];
    return generateSegments(
      videoData.subtitles,
      videoData.duration,
      filteredChapterSplits,
      filteredCustomSplits,
      settingsInterval * 60,
      settingsNoSegment * 60,
      settingsSubSegment * 60,
      [] // 傳入空陣列，避免實體摺疊合併卡片
    );
  }, [videoData, filteredChapterSplits, filteredCustomSplits, settingsInterval, settingsNoSegment, settingsSubSegment]);

  // 取得實際上在 UI 呈現的扁平卡片清單
  const flatActiveSegments = useMemo<Segment[]>(() => {
    const list: Segment[] = [];
    currentSegments.forEach((seg) => {
      if (seg.isGroup && seg.subSegments) {
        list.push(...seg.subSegments);
      } else {
        list.push(seg);
      }
    });
    return list;
  }, [currentSegments]);

  // 範圍合併的下拉選單選項
  const rangeOptions = useMemo(() => {
    return flatActiveSegments.map((seg, index) => {
      const timeStr = `${formatTime(seg.start)} ~ ${formatTime(seg.end)}`;
      const diffSecs = seg.end - seg.start;
      const diffMin = Math.floor(diffSecs / 60);
      const diffSec = Math.floor(diffSecs % 60);
      const durationStr = diffSec > 0 ? `${diffMin}分${diffSec}秒` : `${diffMin}分`;
      return {
        index,
        time: seg.start,
        label: `${timeStr} (${durationStr}) - ${seg.chapterTitle}${seg.isSubSegment ? ' (細分區間)' : ''}`
      };
    });
  }, [flatActiveSegments]);

  // 當扁平卡片變動時，重設範圍合併的選擇 index 避免溢界
  useEffect(() => {
    if (flatActiveSegments.length > 0) {
      setBatchStartIdx(0);
      setBatchEndIdx(flatActiveSegments.length - 1);
    } else {
      setBatchStartIdx(0);
      setBatchEndIdx(0);
    }
  }, [flatActiveSegments]);

  // 找出目前已合併的區間
  const mergedRanges = useMemo(() => {
    const ranges: { startIdx: number; endIdx: number; start: number; end: number; label: string; count: number }[] = [];
    if (flatActiveSegments.length === 0) return ranges;

    let currentRange: { startIdx: number; endIdx: number; start: number; end: number; count: number } | null = null;

    for (let i = 0; i < flatActiveSegments.length; i++) {
      const seg = flatActiveSegments[i];
      const isMergedWithPrev = i > 0 && removedBoundaryTimes.includes(seg.start);

      if (isMergedWithPrev) {
        if (!currentRange) {
          currentRange = {
            startIdx: i - 1,
            endIdx: i,
            start: flatActiveSegments[i - 1].start,
            end: seg.end,
            count: 2
          };
        } else {
          currentRange.endIdx = i;
          currentRange.end = seg.end;
          currentRange.count += 1;
        }
      } else {
        if (currentRange) {
          ranges.push({
            ...currentRange,
            label: `${formatTime(currentRange.start)} ~ ${formatTime(currentRange.end)}`
          });
          currentRange = null;
        }
      }
    }

    if (currentRange) {
      ranges.push({
        ...currentRange,
        label: `${formatTime(currentRange.start)} ~ ${formatTime(currentRange.end)}`
      });
    }

    return ranges;
  }, [flatActiveSegments, removedBoundaryTimes]);

  const maxMergedEndIdx = useMemo(() => {
    if (mergedRanges.length === 0) return -1;
    return Math.max(...mergedRanges.map(r => r.endIdx));
  }, [mergedRanges]);

  // 當已合併時間或扁平卡片變動時，確保選擇的起始/結束索引不會落在已被合併或已處理/跳過的區間（避免選取已合併/已處理區塊）
  useEffect(() => {
    if (flatActiveSegments.length === 0) return;

    const getValidIndex = (idx: number): number => {
      let targetIdx = idx;
      // 確保索引大於最後一個已合併的索引（避免選取前面已合併或已跳過的區塊）
      if (maxMergedEndIdx !== -1 && targetIdx <= maxMergedEndIdx) {
        targetIdx = maxMergedEndIdx + 1;
      }

      if (targetIdx >= flatActiveSegments.length) {
        targetIdx = flatActiveSegments.length - 1;
      }

      const isMerged = (i: number): boolean => {
        if (i < 0 || i >= flatActiveSegments.length) return false;
        return (
          (i > 0 && removedBoundaryTimes.includes(flatActiveSegments[i].start)) ||
          (i + 1 < flatActiveSegments.length && removedBoundaryTimes.includes(flatActiveSegments[i + 1].start))
        );
      };

      if (!isMerged(targetIdx)) {
        return targetIdx;
      }

      // 優先往回尋找未合併且未跳過的區塊
      for (let i = targetIdx - 1; i >= 0; i--) {
        if (maxMergedEndIdx !== -1 && i <= maxMergedEndIdx) {
          break; // 不可小於等於 maxMergedEndIdx
        }
        if (!isMerged(i)) {
          return i;
        }
      }

      // 往後尋找未合併的區塊
      for (let i = targetIdx + 1; i < flatActiveSegments.length; i++) {
        if (!isMerged(i)) {
          return i;
        }
      }

      return 0;
    };

    setBatchStartIdx(prev => {
      const nextStart = getValidIndex(prev);
      return nextStart;
    });
    setBatchEndIdx(prev => {
      const nextEnd = getValidIndex(prev);
      const nextStart = getValidIndex(batchStartIdx);
      return Math.max(nextStart, nextEnd);
    });
  }, [removedBoundaryTimes, flatActiveSegments, maxMergedEndIdx]);

  // AI 整合群組介面 (根據 removedBoundaryTimes 將相鄰 segments 文字串連，對齊發送與計費)
  interface AIGroup {
    id: string;
    title: string;
    text: string;
    start: number;
    end: number;
    segments: Segment[];
  }

  const aiGroups = useMemo<AIGroup[]>(() => {
    const isShortVideo = videoData && videoData.duration <= settingsNoSegment * 60 && userCustomSplits.length === 0;
    const groups: AIGroup[] = [];
    let currentGroup: AIGroup | null = null;

    flatActiveSegments.forEach((seg, index) => {
      // 若是短影片且無自訂分割，則一律合併至前一個區塊以進行單次 AI 整理
      const isMergedWithPrev = isShortVideo
        ? index > 0
        : (index > 0 && removedBoundaryTimes.includes(seg.start));

      const segText = editedSegmentTexts[seg.id || ''] !== undefined
        ? editedSegmentTexts[seg.id || '']
        : cleanAndJoinSubtitles(seg.subtitles);

      if (isMergedWithPrev && currentGroup) {
        currentGroup.segments.push(seg);
        currentGroup.end = seg.end;
        currentGroup.text += '\n' + segText;
      } else {
        currentGroup = {
          id: `ai_group_${index}`,
          title: '',
          text: segText,
          start: seg.start,
          end: seg.end,
          segments: [seg]
        };
        groups.push(currentGroup);
      }
    });

    // 格式化每個 AI 群組所屬的 Chapter 目錄
    const formatSecondsToTime = (secs: number) => {
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = Math.floor(secs % 60);
      const pad = (num: number) => String(num).padStart(2, '0');
      if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
      return `${pad(m)}:${pad(s)}`;
    };

    groups.forEach((g) => {
      const lines = g.segments.map((s) => {
        const timeStr = formatSecondsToTime(s.start);
        const rangeStr = s.subTitle ? ` (${s.subTitle})` : '';
        return `* [${timeStr}] ${s.chapterTitle}${rangeStr}`;
      });
      g.title = lines.join('\n');
    });

    return groups;
  }, [flatActiveSegments, removedBoundaryTimes, editedSegmentTexts, videoData, settingsNoSegment, userCustomSplits]);

  const activeSegmentsWithEdits = useMemo<Segment[]>(() => {
    return flatActiveSegments.map(seg => {
      const segId = seg.id || '';
      if (editedSegmentTexts[segId] !== undefined) {
        return {
          ...seg,
          subtitles: [{ text: editedSegmentTexts[segId], start: seg.start, duration: seg.end - seg.start }]
        };
      }
      return seg;
    });
  }, [flatActiveSegments, editedSegmentTexts]);

  const aiTermsGroups = useMemo<TermsBatch[]>(() => {
    const totalDur = videoData ? videoData.duration : 0;
    return groupSegmentsForTerms(activeSegmentsWithEdits, totalDur);
  }, [activeSegmentsWithEdits, videoData]);

  interface RenderingAIGroup {
    id: string;
    start: number;
    end: number;
    title: string;
    items: Segment[];
  }

  const renderingAIGroups = useMemo<RenderingAIGroup[]>(() => {
    const groups: RenderingAIGroup[] = [];
    let currentGroup: RenderingAIGroup | null = null;

    currentSegments.forEach((item, index) => {
      const isMergedWithPrev = index > 0 && removedBoundaryTimes.includes(item.start);

      if (isMergedWithPrev && currentGroup) {
        currentGroup.items.push(item);
        currentGroup.end = item.end;
      } else {
        currentGroup = {
          id: `render_group_${index}`,
          start: item.start,
          end: item.end,
          title: '',
          items: [item]
        };
        groups.push(currentGroup);
      }
    });

    groups.forEach((g) => {
      const titles = g.items.map((it) => it.chapterTitle);
      g.title = titles.join(' + ');
    });

    return groups;
  }, [currentSegments, removedBoundaryTimes]);

  // 當 AI 整合區間變動時，自動將最後一個合併組之前的所有章節與合併組設為隱藏/折疊
  useEffect(() => {
    if (renderingAIGroups.length === 0) return;

    // 找到最後一個合併組（即 items.length > 1 的 group）在 renderingAIGroups 中的 index
    let lastMergedIdx = -1;
    for (let i = renderingAIGroups.length - 1; i >= 0; i--) {
      if (renderingAIGroups[i].items.length > 1) {
        lastMergedIdx = i;
        break;
      }
    }

    if (lastMergedIdx === -1) return;

    const toCollapseChapters: string[] = [];
    const toCollapseAIGroups: string[] = [];

    for (let i = 0; i < lastMergedIdx; i++) {
      const group = renderingAIGroups[i];
      if (group.items.length > 1) {
        toCollapseAIGroups.push(group.id);
      } else {
        const item = group.items[0];
        toCollapseChapters.push(`group_ch_${item.start}_${item.chapterTitle}`);
      }
    }

    // 自動折疊 preceding 單一章節，並清理已被合併的章節 key
    setCollapsedChapters((prev) => {
      const next = new Set(prev);
      let changed = false;
      toCollapseChapters.forEach((key) => {
        if (!next.has(key)) {
          next.add(key);
          changed = true;
        }
      });
      // 收集所有已被合併的章節 key，自動從 collapsedChapters 清理
      const mergedChapterKeys: string[] = [];
      renderingAIGroups.forEach((group) => {
        if (group.items.length > 1) {
          group.items.forEach((item) => {
            mergedChapterKeys.push(`group_ch_${item.start}_${item.chapterTitle}`);
          });
        }
      });
      mergedChapterKeys.forEach((key) => {
        if (next.has(key)) {
          next.delete(key);
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('gth_collapsedChapters', JSON.stringify([...next]));
        return next;
      }
      return prev;
    });

    // 自動折疊 preceding 已合併組
    setCollapsedAIGroups((prev) => {
      const next = new Set(prev);
      let changed = false;
      toCollapseAIGroups.forEach((key) => {
        if (!next.has(key)) {
          next.add(key);
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('gth_collapsedAIGroups', JSON.stringify([...next]));
        return next;
      }
      return prev;
    });
  }, [renderingAIGroups]);

  const segmentsCount = useMemo(() => {
    let count = 0;
    currentSegments.forEach((item) => {
      if (item.isGroup && item.subSegments) {
        count += item.subSegments.length;
      } else {
        count++;
      }
    });
    return count;
  }, [currentSegments]);

  // --- API Cost Estimation Memo ---
  const estCostInfo = useMemo(() => {
    let totalCharsNotes = 0;
    aiGroups.forEach((group) => {
      totalCharsNotes += group.text.length;
    });

    let totalCharsTerms = 0;
    aiTermsGroups.forEach((group) => {
      totalCharsTerms += group.text.length;
    });

    const videoDuration = videoData?.duration || 0;
    const p1Calls = aiGroups.length;
    const p2Calls = aiTermsGroups.length;

    // Both notes and terms processes send their respective group texts
    const estInputTokens = Math.ceil((totalCharsNotes + totalCharsTerms) * 1.2);
    const estOutputP1 = p1Calls * 500;
    const estOutputP2 = p2Calls * 800;
    const estOutputTokens = estOutputP1 + estOutputP2;

    const inputCost = (estInputTokens / 1000000) * 1.25; // fixed gpt-5.1 rates
    const outputCost = (estOutputTokens / 1000000) * 10.0;
    const totalCost = inputCost + outputCost;

    return {
      segments: flatActiveSegments.length,
      chars: totalCharsNotes,
      costUSD: totalCost,
      costTWD: totalCost * 32.5,
      videoDuration,
      p1Calls,
      p2Calls,
      estInputTokens,
      estOutputP1,
      estOutputP2,
      estOutputTokens,
      inputCost,
      outputCost
    };
  }, [aiGroups, aiTermsGroups, flatActiveSegments.length, videoData]);

  // --- Handlers ---
  const handleUrlSubmit = async () => {
    if (!ytUrl.trim()) {
      alert('請輸入 YouTube 影片網址！');
      return;
    }

    setScreen('loading');
    setLoadingText('正在剖析 YouTube 影片資訊與下載字幕，請稍候...');

    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: ytUrl })
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        throw new Error(`伺服器回應格式錯誤 (HTTP ${response.status})。請確認後端服務運作正常。`);
      }

      if (response.ok && result.status === 'success') {
        setUserCustomSplits([]);
        setEditedSegmentTexts({});
        setChaptersInput('');
        setAiNotesResult(null);
        setAiTermsResult(null);
        setActiveTab('edit');
        setShowCostEstimation(false);

        if (result.subtitles) {
          result.subtitles = resolveSubtitleOverlaps(result.subtitles).map((s: any, idx: number) => ({
            ...s,
            globalIndex: idx
          }));
        }
        setVideoData(result);
        setScreen('app');
      } else {
        throw new Error(result?.message || '無法下載或處理該影片。請確認網址，且該影片有提供字幕。');
      }
    } catch (err: any) {
      setScreen('home');
      alert(err.message || '發生未知錯誤，請重試。');
    }
  };

  const handleManualImport = () => {
    if (!importText.trim()) {
      alert('請貼上字幕內容！');
      return;
    }

    try {
      const parsedSubs = parseSubtitlesText(importText);
      if (parsedSubs.length === 0) {
        alert('無法從貼上的文字中解析出任何字幕。');
        return;
      }

      // Calculate duration from parsed subtitles
      let duration = 0;
      if (parsedSubs.length > 0) {
        const lastSub = parsedSubs[parsedSubs.length - 1];
        duration = Math.ceil(lastSub.start + lastSub.duration);
      }

      const manualVideoData = {
        status: 'success',
        video_id: 'manual_' + Date.now(),
        title: importTitle.trim() || '手動匯入影片',
        duration: duration,
        thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=60',
        channel: '手動匯入',
        subtitles: resolveSubtitleOverlaps(parsedSubs).map((s: any, idx: number) => ({
          ...s,
          globalIndex: idx
        }))
      };

      setUserCustomSplits([]);
      setEditedSegmentTexts({});
      setChaptersInput('');
      setAiNotesResult(null);
      setAiTermsResult(null);
      setActiveTab('edit');
      setShowCostEstimation(false);

      setVideoData(manualVideoData);
      setScreen('app');
      setShowImportModal(false);
      setImportTitle('');
      setImportText('');
      showToast('✅ 成功手動匯入字幕！');
    } catch (err: any) {
      alert('匯入失敗: ' + err.message);
    }
  };

  const useExample = (url: string) => {
    setYtUrl(url);
    if (url.includes('2GZ2SNXWK-c')) {
      setChaptersInput(`00:00:00 Introduction
00:01:25 The n8n basics
01:11:41 Foundational concepts
03:11:09 Javascript functions
05:04:47 Setting up self-hosting
05:28:07 Comparing n8n vs make & which to use when
05:55:27 Outro`);
      localStorage.setItem('gth_chaptersVideoId_v2', '2GZ2SNXWK-c');
    } else if (url.includes('EH5jx5qPabU')) {
      setChaptersInput(`0:00 Intro
0:33 What is an Agent?
0:54 Agents vs. Automations
2:09 3 Main Components
3:29 Types of Systems
4:25 Guardrails
5:05 Resources
6:01 Recap
6:58 APIs and HTTP Requests
9:07 What Can You Build?
9:52 n8n Overview
11:08 Agent Build Overview
12:12 Set Trigger
12:26 AI Agent Node
13:20 Connect the Brain
14:40 Setting up Memory
15:54 Adding Tools
22:48 Testing and Debugging
24:53 Possibilities From Here`);
      localStorage.setItem('gth_chaptersVideoId_v2', 'EH5jx5qPabU');
    } else {
      setChaptersInput('');
      localStorage.removeItem('gth_chaptersVideoId_v2');
    }
    showToast('已預填測試範例影片網址與章節。');
  };

  const loadEnvKey = async () => {
    if (
      window.confirm(
        '偵測到您本地系統環境變數中已設定 OPENAI_API_KEY。\n是否確定要將其引入至網頁中？\n（引入後將自動儲存於瀏覽器快取中）'
      )
    ) {
      try {
        const res = await fetch('/api/get-env-key', { method: 'POST' });
        const data = await res.json();
        if (data.status === 'success' && data.api_key) {
          setOpenaiKey(data.api_key);
          localStorage.setItem('openai_api_key', data.api_key);
          showToast('✅ 已成功引入本地環境變數 API Key！');
        } else {
          alert('引入失敗：' + (data.message || '未知錯誤'));
        }
      } catch (e: any) {
        alert('引入過程發生錯誤：' + e.message);
      }
    }
  };

  const applyChapters = () => {
    showToast('已套用章節分段！');
  };

  const clearChapters = () => {
    setChaptersInput('');
    setUserCustomSplits([]);
    setEditedSegmentTexts({});
    setRemovedBoundaryTimes([]);
    setCollapsedChapters(new Set());
    setCollapsedAIGroups(new Set());
    showToast('已清除章節與自訂切分點。');
  };

  const toggleChapterCollapse = (key: string) => {
    setCollapsedChapters(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      localStorage.setItem('gth_collapsedChapters', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleAIGroupCollapse = (key: string) => {
    setCollapsedAIGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleMergeWithNext = (nextChapterStartTime: number) => {
    console.log('[Merge Debug] handleMergeWithNext called with nextChapterStartTime:', nextChapterStartTime, 'type:', typeof nextChapterStartTime);
    setRemovedBoundaryTimes(prev => {
      const isAlreadyMerged = prev.includes(nextChapterStartTime);
      const next = isAlreadyMerged
        ? prev.filter(t => t !== nextChapterStartTime)
        : [...prev, nextChapterStartTime];
      console.log('[Merge Debug] New removedBoundaryTimes will be:', next);
      return next;
    });
    showToast('✅ 已更新 AI 整合設定！');
  };

  const handleBatchMerge = () => {
    const start = Math.min(batchStartIdx, batchEndIdx);
    const end = Math.max(batchStartIdx, batchEndIdx);
    if (start === end) {
      showToast('⚠️ 請選擇不同的開始與結束區塊進行合併！');
      return;
    }

    setRemovedBoundaryTimes(prev => {
      const next = [...prev];
      for (let i = start + 1; i <= end; i++) {
        const time = flatActiveSegments[i].start;
        if (!next.includes(time)) {
          next.push(time);
        }
      }
      return next;
    });
    showToast('✅ 已成功將所選範圍內的所有區塊進行 AI 整合！');
  };

  const handleBatchSplit = () => {
    const start = Math.min(batchStartIdx, batchEndIdx);
    const end = Math.max(batchStartIdx, batchEndIdx);

    setRemovedBoundaryTimes(prev => {
      const timesToRemove: number[] = [];
      for (let i = start + 1; i <= end; i++) {
        timesToRemove.push(flatActiveSegments[i].start);
      }
      return prev.filter(t => !timesToRemove.includes(t));
    });
    showToast('🔓 已成功拆分所選範圍內的所有區塊！');
  };

  const handleSplitSpecificRange = (startIdx: number, endIdx: number) => {
    const start = Math.min(startIdx, endIdx);
    const end = Math.max(startIdx, endIdx);
    setRemovedBoundaryTimes(prev => {
      const timesToRemove: number[] = [];
      for (let i = start + 1; i <= end; i++) {
        timesToRemove.push(flatActiveSegments[i].start);
      }
      return prev.filter(t => !timesToRemove.includes(t));
    });
    showToast('🔓 已成功拆分該整合區間！');
  };

  const setPresetInterval = (minutes: number) => {
    setSettingsInterval(minutes);
    showToast(`已設定預設區間為 ${minutes} 分鐘。`);
  };

  const handleSegmentKeydown = (event: React.KeyboardEvent<HTMLDivElement>, seg: Segment) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent line break in contentEditable

      const element = event.currentTarget;
      const caretOffset = getCaretCharacterOffsetWithin(element);

      if (!seg.subtitles || seg.subtitles.length === 0) return;

      const { mappings } = getCleanedSubtitlesAndMappings(seg.subtitles);
      if (mappings.length === 0) return;

      let targetLocalIdx = -1;
      let targetCharOffset = 0;

      // Find which mapping contains the caretOffset
      for (let i = 0; i < mappings.length; i++) {
        const m = mappings[i];
        if (caretOffset >= m.textStart && caretOffset <= m.textEnd) {
          targetLocalIdx = m.entryIndex;
          targetCharOffset = caretOffset - m.textStart;
          break;
        }
        if (i < mappings.length - 1) {
          const nextM = mappings[i + 1];
          if (caretOffset > m.textEnd && caretOffset < nextM.textStart) {
            targetLocalIdx = m.entryIndex;
            targetCharOffset = m.textEnd - m.textStart;
            break;
          }
        }
      }

      if (targetLocalIdx === -1) {
        const lastM = mappings[mappings.length - 1];
        targetLocalIdx = lastM.entryIndex;
        targetCharOffset = lastM.textEnd - lastM.textStart;
      }

      const targetEntry = seg.subtitles[targetLocalIdx];
      const cleanText = targetEntry.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

      let splitTime = targetEntry.start;

      // If the cursor is inside the entry (not at the very start or end)
      if (targetCharOffset > 0 && targetCharOffset < cleanText.length) {
        const part1 = cleanText.substring(0, targetCharOffset).trim();
        const part2 = cleanText.substring(targetCharOffset).trim();

        if (part1 && part2) {
          const ratio = part1.length / cleanText.length;
          const duration1 = targetEntry.duration * ratio;
          const duration2 = targetEntry.duration * (1 - ratio);
          const start2 = targetEntry.start + duration1;

          const entry1 = {
            start: targetEntry.start,
            duration: duration1,
            text: part1
          };
          const entry2 = {
            start: start2,
            duration: duration2,
            text: part2
          };

          // Find the index of targetEntry in the global videoData.subtitles
          let globalIdx = -1;
          if (targetEntry.globalIndex !== undefined) {
            globalIdx = targetEntry.globalIndex;
          } else {
            globalIdx = videoData.subtitles.findIndex(
              (s: any) => Math.abs(s.start - targetEntry.start) < 0.01 && s.text === targetEntry.text
            );
          }

          if (globalIdx !== -1) {
            const updatedSubtitles = [...videoData.subtitles];
            updatedSubtitles.splice(globalIdx, 1, entry1, entry2);
            
            // Re-index updated subtitles to have correct globalIndex
            const reindexedSubtitles = updatedSubtitles.map((s, idx) => ({
              ...s,
              globalIndex: idx
            }));

            setVideoData({
              ...videoData,
              subtitles: reindexedSubtitles
            });

            splitTime = start2;
          }
        }
      } else if (targetCharOffset >= cleanText.length) {
        // Cursor is at the end of the entry.
        // If there is a next entry in this segment, split at its start time.
        if (targetLocalIdx + 1 < seg.subtitles.length) {
          splitTime = seg.subtitles[targetLocalIdx + 1].start;
        } else {
          showToast('⚠️ 請在區塊內部的字句中間或句尾進行分割。');
          return;
        }
      } else {
        // Cursor is at the start of the entry
        splitTime = targetEntry.start;
      }

      const distanceFromStart = splitTime - seg.start;
      if (distanceFromStart < 1) {
        showToast('⚠️ 請在區塊內部的字句中間或句尾進行分割。');
        return;
      }

      // Add to custom splits
      const newSplit: ChapterSplit = {
        time: splitTime,
        title: '' // unnamed custom split
      };
      setUserCustomSplits((prev) => [...prev, newSplit].sort((a, b) => a.time - b.time));
      showToast('✂️ 手動分割成功！後續時段已向後推移。');
    }
  };

  const handleSegmentTextChange = (segId: string, newText: string) => {
    setEditedSegmentTexts((prev) => ({
      ...prev,
      [segId]: newText
    }));
  };

  const copyTextToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const copySegmentText = (segId: string, segment: Segment, withHeader = false) => {
    const rawText =
      editedSegmentTexts[segId] !== undefined
        ? editedSegmentTexts[segId]
        : cleanAndJoinSubtitles(segment.subtitles);

    if (withHeader) {
      const headerText = segment.isSubSegment
        ? `## ${segment.chapterTitle} (${segment.subTitle})`
        : `# ${segment.chapterTitle} (${segment.subTitle})`;
      copyTextToClipboard(`${headerText}\n\n${rawText}`);
    } else {
      copyTextToClipboard(rawText);
    }
    showToast('已複製段落字幕！');
  };

  const copyEntireChapter = (group: Segment) => {
    const headerText = `# ${group.chapterTitle} (${formatTime(group.start)} ~ ${formatTime(group.end)})`;
    const texts: string[] = [];

    group.subSegments?.forEach((sub) => {
      const segId = sub.id || '';
      const text =
        editedSegmentTexts[segId] !== undefined
          ? editedSegmentTexts[segId]
          : cleanAndJoinSubtitles(sub.subtitles);
      texts.push(`## (${sub.subTitle})\n${text}`);
    });

    copyTextToClipboard(`${headerText}\n\n${texts.join('\n\n')}`);
    showToast(`已複製整章「${group.chapterTitle}」內容！`);
  };

  const lockAndEstimateCost = async () => {
    setShowCostEstimation(true);
    showToast('🔒 已鎖定當前段落，請於右側查看 API 費用預估！');

    // Send segments data to backend for inspection/verification
    if (videoData && videoData.video_id) {
      const flatSegments: { title: string; text: string; start: number; end: number }[] = [];
      flatActiveSegments.forEach((seg) => {
        const segId = seg.id || '';
        const text =
          editedSegmentTexts[segId] !== undefined
            ? editedSegmentTexts[segId]
            : cleanAndJoinSubtitles(seg.subtitles);
        flatSegments.push({
          title: `${seg.chapterTitle}${seg.subTitle ? ` (${seg.subTitle})` : ''}`,
          text: text,
          start: seg.start,
          end: seg.end
        });
      });

      try {
        await fetch('/api/save-segments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_id: videoData.video_id,
            segments: flatSegments,
            removed_boundary_times: removedBoundaryTimes,  // 合併設定：已移除的邊界時間點
            chapters_input: chaptersInput                   // 使用者貼入的章節文字
          })
        });
      } catch (e) {
        console.error('儲存分段資料失敗:', e);
      }
    }
  };

  const runAIGeneration = async () => {
    if (!openaiKey.trim()) {
      alert('請填寫您的 OpenAI API Key！');
      return;
    }

    const formatSecondsToTime = (secs: number) => {
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = Math.floor(secs % 60);
      const pad = (num: number) => String(num).padStart(2, '0');
      if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
      return `${pad(m)}:${pad(s)}`;
    };

    if (flatActiveSegments.length === 0) {
      alert('無字幕內容可供整理！');
      return;
    }

    // 建立完整的章節上下文
    const fullChaptersText = flatActiveSegments
      .map((s) => `* [${formatSecondsToTime(s.start)}] ${s.chapterTitle}${s.subTitle ? ` (${s.subTitle})` : ''}`)
      .join('\n');

    // 對應 AI 整合群組進行呼叫
    const totalP1 = aiGroups.length;
    const initialNotes: AIBlock[] = aiGroups.map((group, idx) => {
      const title = `影片時間 ${formatSecondsToTime(group.start)} ~ ${formatSecondsToTime(group.end)} 重點整理 (第 ${idx + 1} / ${totalP1} 次)`;
      return {
        title,
        content: '⏳ 正在呼叫 AI 整理中...',
        status: 'loading' as const,
        text: group.text,
        currentTitle: group.title,
        fullChapters: fullChaptersText
      };
    });

    const totalP2 = aiTermsGroups.length;
    const initialTerms: AIBlock[] = aiTermsGroups.map((group, idx) => {
      const title = `影片時間 ${formatSecondsToTime(group.start)} ~ ${formatSecondsToTime(group.end)} 專業術語對照 (第 ${idx + 1} / ${totalP2} 次)`;
      return {
        title,
        content: '⏳ 正在呼叫 AI 整理中...',
        status: 'loading' as const,
        text: group.text,
        currentTitle: group.title,
        fullChapters: fullChaptersText
      };
    });

    setAiNotesResult(initialNotes);
    setAiTermsResult(initialTerms);
    setActiveTab('notes');
    showToast('🚀 已啟動批次併行整理，請在左側查看即時進度！');

    // Trigger fetch calls concurrently
    initialNotes.forEach((block) => {
      fetchBlockNote(block.title, block.text, block.currentTitle || '', block.fullChapters || '');
    });

    initialTerms.forEach((block) => {
      fetchBlockTerms(block.title, block.text, block.currentTitle || '', block.fullChapters || '');
    });
  };

  const fetchBlockNote = async (title: string, text: string, currentTitle: string, fullChapters: string) => {
    try {
      const res = await fetch('/api/generate-block-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: openaiKey,
          model: 'gpt-5.1',
          title: title,
          text: text,
          current_title: currentTitle,
          full_chapters: fullChapters
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        updateNoteBlock(title, data.content, 'done');
      } else {
        updateNoteBlock(title, data.detail || '呼叫 AI 整理失敗。', 'error');
      }
    } catch (e: any) {
      updateNoteBlock(title, e.message || '網路連線異常。', 'error');
    }
  };

  const fetchBlockTerms = async (title: string, text: string, currentTitle: string, fullChapters: string) => {
    try {
      const res = await fetch('/api/generate-block-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: openaiKey,
          model: 'gpt-5.1',
          text: text,
          current_title: currentTitle,
          full_chapters: fullChapters
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        updateTermsBlock(title, data.content, 'done');
      } else {
        updateTermsBlock(title, data.detail || '呼叫 AI 整理失敗。', 'error');
      }
    } catch (e: any) {
      updateTermsBlock(title, e.message || '網路連線異常。', 'error');
    }
  };

  const updateNoteBlock = (title: string, content: string, status: 'done' | 'error' | 'loading') => {
    setAiNotesResult((prev) => {
      if (!prev) return null;
      return prev.map((item) => {
        if (item.title === title) {
          return { ...item, content, status };
        }
        return item;
      });
    });
  };

  const updateTermsBlock = (title: string, content: string, status: 'done' | 'error' | 'loading') => {
    setAiTermsResult((prev) => {
      if (!prev) return null;
      return prev.map((item) => {
        if (item.title === title) {
          return { ...item, content, status };
        }
        return item;
      });
    });
  };

  const retryNoteBlock = (block: AIBlock) => {
    updateNoteBlock(block.title, '⏳ 正在重新呼叫 AI 整理中...', 'loading');
    fetchBlockNote(block.title, block.text, block.currentTitle || '', block.fullChapters || '');
  };

  const retryTermsBlock = (block: AIBlock) => {
    updateTermsBlock(block.title, '⏳ 正在重新呼叫 AI 整理中...', 'loading');
    fetchBlockTerms(block.title, block.text, block.currentTitle || '', block.fullChapters || '');
  };

  const copyAllAINotes = () => {
    if (!aiNotesResult) return;
    const completedBlocks = aiNotesResult.filter((item) => item.status === 'done');
    if (completedBlocks.length === 0) {
      alert('無已完成的筆記內容可複製！');
      return;
    }
    let fullNotesMarkdown = '';
    completedBlocks.forEach((item, index) => {
      fullNotesMarkdown += `# ${item.title}\n\n${item.content}`;
      if (index < completedBlocks.length - 1) {
        fullNotesMarkdown += '\n\n---\n\n';
      }
    });
    copyTextToClipboard(fullNotesMarkdown);
    showToast('已複製全部 AI 重點整理筆記！');
  };

  const copyAllAITerms = () => {
    if (!aiTermsResult) return;
    const completedBlocks = aiTermsResult.filter((item) => item.status === 'done');
    if (completedBlocks.length === 0) {
      alert('無已完成的術語內容可複製！');
      return;
    }
    let fullTermsMarkdown = '';
    completedBlocks.forEach((item, index) => {
      fullTermsMarkdown += `# ${item.title}\n\n${item.content}`;
      if (index < completedBlocks.length - 1) {
        fullTermsMarkdown += '\n\n---\n\n';
      }
    });
    copyTextToClipboard(fullTermsMarkdown);
    showToast('已複製全部 AI 專業術語對照表！');
  };

  const goBackToHome = () => {
    setScreen('home');
    setAiNotesResult(null);
    setAiTermsResult(null);
    setUserCustomSplits([]);
    setEditedSegmentTexts({});
    setShowCostEstimation(false);
    setActiveTab('edit');
  };



  // --- JSX Rendering ---
  return (
    <>
      <header>
        <div className="logo" onClick={goBackToHome}>
          <img src="/logo.jpg" alt="GoldTubeHouse" className="logo-img" />
          <span className="logo-text">GoldTubeHouse</span>
        </div>
        <a href="#" className="github-link" onClick={(e) => e.preventDefault()}>
          <span>字幕分段整理與 AI 筆記系統 v3.0</span>
        </a>
      </header>

      <main>
        {/* Screen 1: Home screen */}
        {screen === 'home' && (
          <HomeScreen
            ytUrl={ytUrl}
            setYtUrl={setYtUrl}
            handleUrlSubmit={handleUrlSubmit}
            setShowImportModal={setShowImportModal}
            useExample={useExample}
          />
        )}

        {/* Screen 2: Loading screen */}
        {screen === 'loading' && (
          <LoadingScreen loadingText={loadingText} />
        )}

        {/* Screen 3: Main App screen */}
        {screen === 'app' && videoData && (
          <div id="app-screen">
            {/* Left panel: Subtitles and AI Output */}
            <div className="content-panel">
              <div className="tab-bar">
                <button
                  className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                >
                  編輯與分割區塊
                </button>
                {aiNotesResult && (
                  <button
                    className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notes')}
                  >
                    AI 整理筆記 📝
                  </button>
                )}
                {aiTermsResult && (
                  <button
                    className={`tab-btn ${activeTab === 'term' ? 'active' : ''}`}
                    onClick={() => setActiveTab('term')}
                  >
                    專業術語對照 📘
                  </button>
                )}
              </div>

              {/* Tab 1: Edit & Split */}
              {activeTab === 'edit' && (
                <EditSegmentsTab
                  segmentsCount={segmentsCount}
                  renderingAIGroups={renderingAIGroups}
                  collapsedChapters={collapsedChapters}
                  toggleChapterCollapse={toggleChapterCollapse}
                  copyEntireChapter={copyEntireChapter}
                  removedBoundaryTimes={removedBoundaryTimes}
                  handleMergeWithNext={handleMergeWithNext}
                  editedSegmentTexts={editedSegmentTexts}
                  copySegmentText={copySegmentText}
                  handleSegmentTextChange={handleSegmentTextChange}
                  handleSegmentKeydown={handleSegmentKeydown}
                  collapsedAIGroups={collapsedAIGroups}
                  toggleAIGroupCollapse={toggleAIGroupCollapse}
                />
              )}

              {/* Tab 2: AI Notes */}
              {activeTab === 'notes' && aiNotesResult && (
                <AINotesTab
                  aiNotesResult={aiNotesResult}
                  collapsedNotes={collapsedNotes}
                  toggleCollapseNote={toggleCollapseNote}
                  retryNoteBlock={retryNoteBlock}
                  copyTextToClipboard={copyTextToClipboard}
                  showToast={showToast}
                  expandAllNotes={expandAllNotes}
                  collapseAllNotes={collapseAllNotes}
                  copyAllAINotes={copyAllAINotes}
                />
              )}

              {/* Tab 3: AI Terms */}
              {activeTab === 'term' && aiTermsResult && (
                <AITermsTab
                  aiTermsResult={aiTermsResult}
                  collapsedTerms={collapsedTerms}
                  toggleCollapseTerm={toggleCollapseTerm}
                  retryTermsBlock={retryTermsBlock}
                  copyTextToClipboard={copyTextToClipboard}
                  showToast={showToast}
                  expandAllTerms={expandAllTerms}
                  collapseAllTerms={collapseAllTerms}
                  copyAllAITerms={copyAllAITerms}
                />
              )}
            </div>

            {/* Right panel: Sidebar controls */}
            <Sidebar
              videoData={videoData}
              openaiKey={openaiKey}
              setOpenaiKey={setOpenaiKey}
              hasEnvKey={hasEnvKey}
              loadEnvKey={loadEnvKey}
              chaptersInput={chaptersInput}
              setChaptersInput={setChaptersInput}
              applyChapters={applyChapters}
              clearChapters={clearChapters}
              flatActiveSegments={flatActiveSegments}
              removedBoundaryTimes={removedBoundaryTimes}
              handleSplitSpecificRange={handleSplitSpecificRange}
              batchStartIdx={batchStartIdx}
              setBatchStartIdx={setBatchStartIdx}
              batchEndIdx={batchEndIdx}
              setBatchEndIdx={setBatchEndIdx}
              rangeOptions={rangeOptions}
              handleBatchMerge={handleBatchMerge}
              handleBatchSplit={handleBatchSplit}
              settingsInterval={settingsInterval}
              setSettingsInterval={setSettingsInterval}
              setPresetInterval={setPresetInterval}
              settingsNoSegment={settingsNoSegment}
              setSettingsNoSegment={setSettingsNoSegment}
              settingsSubSegment={settingsSubSegment}
              setSettingsSubSegment={setSettingsSubSegment}
              lockAndEstimateCost={lockAndEstimateCost}
              showCostEstimation={showCostEstimation}
              estCostInfo={estCostInfo}
              showCostDetails={showCostDetails}
              setShowCostDetails={setShowCostDetails}
              runAIGeneration={runAIGeneration}
              goBackToHome={goBackToHome}
            />
          </div>
        )}
      </main>

      <ManualImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        importTitle={importTitle}
        setImportTitle={setImportTitle}
        importText={importText}
        setImportText={setImportText}
        handleManualImport={handleManualImport}
      />

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>{toast.message}</span>
      </div>
    </>
  );
}

export default App;
