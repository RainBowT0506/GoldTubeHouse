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
  getCaretCharacterOffsetWithin,
  getVideoId,
  groupSegmentsForTerms,
  formatSubtitlesToSRT,
  cleanChineseWhitespace
} from './utils';
import {
  DEFAULT_INTERVAL_MIN,
  DEFAULT_NO_SEGMENT_MIN,
  DEFAULT_SUB_SEGMENT_MIN,
  SHORT_VIDEO_BUFFER_SEC,
  PRICE_INPUT_PER_M,
  PRICE_OUTPUT_PER_M,
  TWD_PER_USD,
  EST_OUTPUT_TOKENS_NOTES,
  EST_OUTPUT_TOKENS_TERMS,
  EST_OUTPUT_TOKENS_COMBINED,
  CHARS_TO_TOKENS_RATIO
} from './constants';

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
  groupIndex?: number;
}

const isDuplicateVideo = (videoId: string): boolean => {
  const stored = localStorage.getItem('gth_generated_video_ids');
  if (!stored) return false;
  try {
    const list = JSON.parse(stored);
    return Array.isArray(list) && list.includes(videoId);
  } catch (e) {
    return false;
  }
};

const markVideoAsGenerated = (videoId: string) => {
  if (!videoId) return;
  const stored = localStorage.getItem('gth_generated_video_ids');
  let list: string[] = [];
  if (stored) {
    try {
      list = JSON.parse(stored);
      if (!Array.isArray(list)) {
        list = [];
      }
    } catch (e) {
      list = [];
    }
  }
  if (!list.includes(videoId)) {
    list.push(videoId);
    localStorage.setItem('gth_generated_video_ids', JSON.stringify(list));
  }
};

const generateManualVideoId = (title: string, text: string) => {
  const combined = title + '_' + text.slice(0, 10000);
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'manual_' + Math.abs(hash).toString(36);
};

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

  // Calculate restored video data first
  const initialVideoData = (() => {
    const data = localStorage.getItem('gth_videoData_v2');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed) {
          if (parsed.videos) {
            parsed.videos = parsed.videos.map((v: any) => {
              if (v.loading) {
                return {
                  ...v,
                  loading: false,
                  subtitles: v.subtitles || [{ text: "(此影片無字幕文字)", start: 0.0, duration: parseFloat(v.duration || 600) }]
                };
              }
              return v;
            });
          }
          if (parsed.subtitles) {
            parsed.subtitles = resolveSubtitleOverlaps(parsed.subtitles).map((s: any, idx: number) => ({
              ...s,
              globalIndex: idx
            }));
          }
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  })();

  const initialVideoId = initialVideoData?.video_id || '';

  const [videoData, setVideoData] = useState<any | null>(initialVideoData);

  const [chaptersInput, setChaptersInput] = useState<string>(() => {
    if (initialVideoId) {
      const saved = localStorage.getItem(`gth_chaptersInput_${initialVideoId}`);
      if (saved !== null) return saved;
    }
    const saved = localStorage.getItem('gth_chaptersInput_v2');
    return saved !== null ? saved : '';
  });

  const [userCustomSplits, setUserCustomSplits] = useState<ChapterSplit[]>(() => {
    if (initialVideoId) {
      const saved = localStorage.getItem(`gth_userCustomSplits_${initialVideoId}`);
      if (saved) return JSON.parse(saved);
    }
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
    if (initialVideoId) {
      const saved = localStorage.getItem(`gth_removedBoundaryTimes_${initialVideoId}`);
      if (saved) return JSON.parse(saved);
    }
    try {
      const data = localStorage.getItem('gth_removedBoundaryTimes');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  });

  const [editedSegmentTexts, setEditedSegmentTexts] = useState<Record<string, string>>(() => {
    if (initialVideoId) {
      const saved = localStorage.getItem(`gth_editedSegmentTexts_${initialVideoId}`);
      if (saved) return JSON.parse(saved);
    }
    const data = localStorage.getItem('gth_editedSegmentTexts');
    return data ? JSON.parse(data) : {};
  });

  const [batchStartIdx, setBatchStartIdx] = useState<number>(0);
  const [batchEndIdx, setBatchEndIdx] = useState<number>(0);

  const [aiNotesResult, setAiNotesResult] = useState<AIBlock[] | null>(() => {
    if (initialVideoId) {
      const saved = localStorage.getItem(`gth_aiNotesResult_${initialVideoId}`);
      if (saved) return JSON.parse(saved);
    }
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
    if (initialVideoId) {
      const saved = localStorage.getItem(`gth_aiTermsResult_${initialVideoId}`);
      if (saved) return JSON.parse(saved);
    }
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

  const loadVideoState = (videoId: string) => {
    const savedChapters = localStorage.getItem(`gth_chaptersInput_${videoId}`);
    const savedSplits = localStorage.getItem(`gth_userCustomSplits_${videoId}`);
    const savedTexts = localStorage.getItem(`gth_editedSegmentTexts_${videoId}`);
    const savedBoundaries = localStorage.getItem(`gth_removedBoundaryTimes_${videoId}`);
    const savedNotes = localStorage.getItem(`gth_aiNotesResult_${videoId}`);
    const savedTerms = localStorage.getItem(`gth_aiTermsResult_${videoId}`);

    setChaptersInput(savedChapters !== null ? savedChapters : '');
    setUserCustomSplits(savedSplits ? JSON.parse(savedSplits) : []);
    setEditedSegmentTexts(savedTexts ? JSON.parse(savedTexts) : {});
    setRemovedBoundaryTimes(savedBoundaries ? JSON.parse(savedBoundaries) : []);
    setAiNotesResult(savedNotes ? JSON.parse(savedNotes) : null);
    setAiTermsResult(savedTerms ? JSON.parse(savedTerms) : null);
  };
  const [openaiKey, setOpenaiKey] = useState<string>(() => {
    return localStorage.getItem('gth_openaiKey') || localStorage.getItem('openai_api_key') || '';
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'notes' | 'term'>(() => {
    return (localStorage.getItem('gth_activeTab') as any) || 'edit';
  });
  const [settingsInterval, setSettingsInterval] = useState<number>(() => {
    const saved = localStorage.getItem('gth_settingsInterval');
    return saved ? Number(saved) : DEFAULT_INTERVAL_MIN;
  });
  const [settingsNoSegment, setSettingsNoSegment] = useState<number>(() => {
    const saved = localStorage.getItem('gth_settingsNoSegment');
    return saved ? Number(saved) : DEFAULT_NO_SEGMENT_MIN;
  });
  const [settingsSubSegment, setSettingsSubSegment] = useState<number>(() => {
    const saved = localStorage.getItem('gth_settingsSubSegment');
    return saved ? Number(saved) : DEFAULT_SUB_SEGMENT_MIN;
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
  const [importYtUrl, setImportYtUrl] = useState<string>('');
  const [importMode, setImportMode] = useState<'single' | 'playlist'>('single');

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
  // --- Global Client Error Logger ---
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      fetch('/api/log-client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.message || 'Unknown error',
          stack: event.error?.stack || null,
          url: window.location.href
        })
      }).catch(err => console.error('Failed to send error to backend:', err));
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      fetch('/api/log-client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.reason?.message || String(event.reason) || 'Promise rejection',
          stack: event.reason?.stack || null,
          url: window.location.href
        })
      }).catch(err => console.error('Failed to send rejection to backend:', err));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
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
    if (videoData?.video_id) {
      localStorage.setItem(`gth_chaptersInput_${videoData.video_id}`, chaptersInput);
    }
  }, [chaptersInput, videoData?.video_id]);

  useEffect(() => {
    localStorage.setItem('gth_userCustomSplits', JSON.stringify(userCustomSplits));
    if (videoData?.video_id) {
      localStorage.setItem(`gth_userCustomSplits_${videoData.video_id}`, JSON.stringify(userCustomSplits));
    }
  }, [userCustomSplits, videoData?.video_id]);

  useEffect(() => {
    localStorage.setItem('gth_editedSegmentTexts', JSON.stringify(editedSegmentTexts));
    if (videoData?.video_id) {
      localStorage.setItem(`gth_editedSegmentTexts_${videoData.video_id}`, JSON.stringify(editedSegmentTexts));
    }
  }, [editedSegmentTexts, videoData?.video_id]);

  useEffect(() => {
    localStorage.setItem('gth_removedBoundaryTimes', JSON.stringify(removedBoundaryTimes));
    if (videoData?.video_id) {
      localStorage.setItem(`gth_removedBoundaryTimes_${videoData.video_id}`, JSON.stringify(removedBoundaryTimes));
    }
  }, [removedBoundaryTimes, videoData?.video_id]);

  useEffect(() => {
    localStorage.setItem('gth_collapsedAIGroups', JSON.stringify([...collapsedAIGroups]));
  }, [collapsedAIGroups]);

  useEffect(() => {
    if (aiNotesResult) {
      localStorage.setItem('gth_aiNotesResult', JSON.stringify(aiNotesResult));
      if (videoData?.video_id) {
        localStorage.setItem(`gth_aiNotesResult_${videoData.video_id}`, JSON.stringify(aiNotesResult));
      }
    } else {
      localStorage.removeItem('gth_aiNotesResult');
      if (videoData?.video_id) {
        localStorage.removeItem(`gth_aiNotesResult_${videoData.video_id}`);
      }
    }
  }, [aiNotesResult, videoData?.video_id]);

  useEffect(() => {
    if (aiTermsResult) {
      localStorage.setItem('gth_aiTermsResult', JSON.stringify(aiTermsResult));
      if (videoData?.video_id) {
        localStorage.setItem(`gth_aiTermsResult_${videoData.video_id}`, JSON.stringify(aiTermsResult));
      }
    } else {
      localStorage.removeItem('gth_aiTermsResult');
      if (videoData?.video_id) {
        localStorage.removeItem(`gth_aiTermsResult_${videoData.video_id}`);
      }
    }
  }, [aiTermsResult, videoData?.video_id]);

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

  // 只有真正的短影片（無章節、無自訂切分、期限內）才合併成單次 combined 呼叫
  // 有章節分割時一律採用長影片模式（分開筆記+術語）
  const isShortVideo = useMemo<boolean>(() => {
    if (!videoData) return false;
    if (videoData.duration > (settingsNoSegment * 60 + SHORT_VIDEO_BUFFER_SEC)) return false;
    if (userCustomSplits.length > 0) return false;
    if (parsedChapters.length > 0) return false; // 有章節即為長影片模式
    return true;
  }, [videoData, settingsNoSegment, userCustomSplits, parsedChapters]);

  // 不再過濾已被合併的自訂切分點
  const filteredCustomSplits = userCustomSplits;

  const currentSegments = useMemo<Segment[]>(() => {
    if (!videoData || !videoData.subtitles) return [];
    const rawSegments = generateSegments(
      videoData.subtitles,
      videoData.duration,
      filteredChapterSplits,
      filteredCustomSplits,
      settingsInterval * 60,
      settingsNoSegment * 60,
      settingsSubSegment * 60,
      [], // 傳入空陣列，避免實體摺疊合併卡片
      !!videoData?.no_timestamps
    );

    if (videoData.is_playlist && videoData.videos) {
      return rawSegments.map((group) => {
        if (group.isGroup && group.subSegments) {
          const videoDuration = group.end - group.start;
          const adjustedSubSegments = group.subSegments.map((subSeg) => {
            const localStart = subSeg.start - group.start;
            const localEnd = subSeg.end - group.start;
            return {
              ...subSeg,
              subTitle: `${formatTime(localStart)} ~ ${formatTime(localEnd)}`
            };
          });
          return {
            ...group,
            subTitle: `00:00 ~ ${formatTime(videoDuration)}`,
            subSegments: adjustedSubSegments
          };
        }
        return group;
      });
    }

    return rawSegments;
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
      const timeStr = videoData?.no_timestamps ? `段落 ${index + 1}` : (seg.subTitle || `${formatTime(seg.start)} ~ ${formatTime(seg.end)}`);
      const diffSecs = seg.end - seg.start;
      const diffMin = Math.floor(diffSecs / 60);
      const diffSec = Math.floor(diffSecs % 60);
      const durationStr = videoData?.no_timestamps ? '' : (diffSec > 0 ? ` (${diffMin}分${diffSec}秒)` : ` (${diffMin}分)`);
      return {
        index,
        time: seg.start,
        label: `${timeStr}${durationStr} - ${seg.chapterTitle}${seg.isSubSegment ? ' (細分區間)' : ''}`
      };
    });
  }, [flatActiveSegments, videoData]);

  // 當扁平卡片變動時，自動檢查並過濾掉不再存在的邊界合併時間點，防止舊影片或舊章節的合併狀態殘留
  useEffect(() => {
    if (flatActiveSegments.length === 0) {
      if (removedBoundaryTimes.length > 0) {
        setRemovedBoundaryTimes([]);
      }
      return;
    }
    const validStarts = new Set(flatActiveSegments.map(seg => seg.start));
    const nextBoundaryTimes = removedBoundaryTimes.filter(t => validStarts.has(t));
    if (nextBoundaryTimes.length !== removedBoundaryTimes.length) {
      setRemovedBoundaryTimes(nextBoundaryTimes);
    }
  }, [flatActiveSegments, removedBoundaryTimes]);

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
    const groups: AIGroup[] = [];
    let currentGroup: AIGroup | null = null;

    flatActiveSegments.forEach((seg, index) => {
      // 只有在使用者點選「合併」記錄在 removedBoundaryTimes 的時間點時才進行合併，以確保 AI 批次與 UI 卡片完全一致
      const isMergedWithPrev = index > 0 && removedBoundaryTimes.includes(seg.start);

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
  }, [flatActiveSegments, removedBoundaryTimes, editedSegmentTexts, videoData, settingsNoSegment, userCustomSplits, isShortVideo]);

  const aiGroupsAsSegments = useMemo<Segment[]>(() => {
    return aiGroups.map((g) => {
      const allSubs: any[] = [];
      g.segments.forEach((seg) => {
        const segId = seg.id || '';
        if (editedSegmentTexts[segId] !== undefined) {
          allSubs.push({ text: editedSegmentTexts[segId], start: seg.start, duration: seg.end - seg.start });
        } else if (seg.subtitles) {
          allSubs.push(...seg.subtitles);
        }
      });
      return {
        id: g.id,
        chapterTitle: g.title,
        subTitle: '',
        start: g.start,
        end: g.end,
        subtitles: allSubs
      };
    });
  }, [aiGroups, editedSegmentTexts]);

  const aiTermsGroups = useMemo<TermsBatch[]>(() => {
    const totalDur = videoData ? videoData.duration : 0;
    return groupSegmentsForTerms(aiGroupsAsSegments, totalDur);
  }, [aiGroupsAsSegments, videoData]);



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

    const videoDuration = videoData?.duration || 0;

    if (isShortVideo) {
      const p1Calls = aiGroups.length; // usually 1
      const p2Calls = 0;
      const estInputTokens = Math.ceil(totalCharsNotes * CHARS_TO_TOKENS_RATIO);
      const estOutputTokens = p1Calls * EST_OUTPUT_TOKENS_COMBINED;

      const inputCost = (estInputTokens / 1000000) * PRICE_INPUT_PER_M;
      const outputCost = (estOutputTokens / 1000000) * PRICE_OUTPUT_PER_M;
      const totalCost = inputCost + outputCost;

      return {
        segments: flatActiveSegments.length,
        chars: totalCharsNotes,
        costUSD: totalCost,
        costTWD: totalCost * TWD_PER_USD,
        videoDuration,
        p1Calls,
        p2Calls,
        estInputTokens,
        estOutputP1: p1Calls * EST_OUTPUT_TOKENS_NOTES,
        estOutputP2: p1Calls * EST_OUTPUT_TOKENS_TERMS,
        estOutputTokens,
        inputCost,
        outputCost
      };
    } else {
      let totalCharsTerms = 0;
      aiTermsGroups.forEach((group) => {
        totalCharsTerms += group.text.length;
      });

      const p1Calls = aiGroups.length;
      const p2Calls = aiTermsGroups.length;

      const estInputTokens = Math.ceil((totalCharsNotes + totalCharsTerms) * CHARS_TO_TOKENS_RATIO);
      const estOutputP1 = p1Calls * EST_OUTPUT_TOKENS_NOTES;
      const estOutputP2 = p2Calls * EST_OUTPUT_TOKENS_TERMS;
      const estOutputTokens = estOutputP1 + estOutputP2;

      const inputCost = (estInputTokens / 1000000) * PRICE_INPUT_PER_M;
      const outputCost = (estOutputTokens / 1000000) * PRICE_OUTPUT_PER_M;
      const totalCost = inputCost + outputCost;

      return {
        segments: flatActiveSegments.length,
        chars: totalCharsNotes,
        costUSD: totalCost,
        costTWD: totalCost * TWD_PER_USD,
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
    }
  }, [aiGroups, aiTermsGroups, flatActiveSegments.length, videoData, isShortVideo]);

  // --- Handlers ---
  const currentLoadSessionIdRef = React.useRef<number>(0);

  const loadPlaylistSubtitlesSequentially = async (initialData: any, sessionId: number) => {
    const updatedVideos = [...initialData.videos];
    
    for (let i = 0; i < updatedVideos.length; i++) {
      if (currentLoadSessionIdRef.current !== sessionId) {
        console.log('[Sequential Loader] Aborted session', sessionId);
        return;
      }
      
      const v = updatedVideos[i];
      console.log(`[Sequential Loader] Starting download for: ${v.title} (${i+1}/${updatedVideos.length})`);
      
      try {
        const videoUrl = v.url || `https://www.youtube.com/watch?v=${v.video_id}`;
        const response = await fetch('/api/process-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: videoUrl })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const res = await response.json();
        if (currentLoadSessionIdRef.current !== sessionId) return;

        if (res.status === 'success') {
          updatedVideos[i] = {
            ...v,
            title: res.title || v.title,
            duration: res.duration || v.duration,
            thumbnail: res.thumbnail || v.thumbnail,
            channel: res.channel || '未知頻道',
            subtitles: res.subtitles || [],
            loading: false
          };
          console.log(`[Sequential Loader] Finished download for: ${res.title}`);
        } else {
          throw new Error(res.message || '下載失敗');
        }
      } catch (err: any) {
        console.warn(`[Sequential Loader] 影片 ${v.title} 下載失敗:`, err);
        if (currentLoadSessionIdRef.current !== sessionId) return;
        
        updatedVideos[i] = {
          ...v,
          subtitles: [{
            text: "(此影片無字幕文字)",
            start: 0.0,
            duration: parseFloat(v.duration || 600)
          }],
          loading: false
        };
      }
      
      // Rebuild unified subtitles and chapters list
      let currentOffset = 0;
      let tempChaptersInput = "";
      const flatSubtitles: any[] = [];
      
      const formatSecondsToHHMMSS = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const pad = (num: number) => String(num).padStart(2, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
      };
      
      updatedVideos.forEach((video) => {
        if (initialData.is_playlist) {
          const timeStr = formatSecondsToHHMMSS(currentOffset);
          tempChaptersInput += `${timeStr} ${video.title}\n`;
        }
        
        const subsToUse = (video.subtitles && video.subtitles.length > 0)
          ? video.subtitles
          : [{ text: "⏳ 正在下載字幕，請稍候...", start: 0.0, duration: video.duration || 600 }];
          
        const shiftedSubs = subsToUse.map((s: any) => ({
          ...s,
          start: s.start + currentOffset
        }));
        flatSubtitles.push(...shiftedSubs);
        
        currentOffset += video.duration || 600;
      });
      
      if (initialData.is_playlist) {
        setChaptersInput(tempChaptersInput.trim());
      }
      
      setVideoData((prev: any) => {
        if (!prev || currentLoadSessionIdRef.current !== sessionId) return prev;
        
        const isSingle = !prev.is_playlist;
        const mainTitle = isSingle && updatedVideos[0] ? updatedVideos[0].title : prev.title;
        const mainThumbnail = isSingle && updatedVideos[0] ? updatedVideos[0].thumbnail : prev.thumbnail;
        const mainChannel = isSingle && updatedVideos[0] ? updatedVideos[0].channel : prev.channel;
        
        return {
          ...prev,
          title: mainTitle,
          thumbnail: mainThumbnail,
          channel: mainChannel,
          duration: currentOffset,
          videos: [...updatedVideos],
          subtitles: resolveSubtitleOverlaps(flatSubtitles).map((s, idx) => ({ ...s, globalIndex: idx }))
        };
      });
    }
  };

  const handleUrlSubmit = async () => {
    if (!ytUrl.trim()) {
      alert('請輸入 YouTube 影片網址！');
      return;
    }

    const urls = ytUrl.split(/[\n, ]+/).map(u => u.trim()).filter(Boolean);

    if (urls.length > 1) {
      setScreen('loading');
      setLoadingText(`正在解析 ${urls.length} 個網址資訊...`);

      try {
        const fetchPromises = urls.map(async (url, idx) => {
          const isPlaylistUrl = url.includes('list=') && (url.includes('/playlist') || !url.includes('v='));
          if (isPlaylistUrl) {
            try {
              const response = await fetch('/api/playlist-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
              });
              if (!response.ok) throw new Error(`HTTP error ${response.status}`);
              const res = await response.json();
              if (res.status === 'success' && res.videos) {
                return { isPlaylist: true, videos: res.videos, url };
              }
            } catch (err) {
              console.warn(`[Fast Metadata] 播放清單 ${url} 解析失敗:`, err);
            }
          }

          // Single video: parse video ID directly
          let videoId = `custom_v_${idx}_${Date.now()}`;
          let title = `影片 ${idx + 1}`;
          try {
            const match = url.match(/(?:v=|\/embed\/|\/shorts\/|\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (match) {
              videoId = match[1];
              title = `影片 (ID: ${videoId})`;
            }
          } catch (e) {}

          return {
            isPlaylist: false,
            videos: [{
              video_id: videoId,
              title: title,
              duration: 600,
              thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              loading: true,
              url: url
            }],
            url
          };
        });

        const results = await Promise.all(fetchPromises);
        const videos: any[] = [];
        results.forEach(item => {
          videos.push(...item.videos);
        });

        if (videos.length === 0) {
          throw new Error('未解析到任何有效的影片網址。');
        }

        currentLoadSessionIdRef.current += 1;
        const sessionId = currentLoadSessionIdRef.current;

        let currentOffset = 0;
        let tempChaptersInput = "";
        const flatSubtitles: any[] = [];

        const formatSecondsToHHMMSS = (seconds: number): string => {
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = Math.floor(seconds % 60);
          const pad = (num: number) => String(num).padStart(2, '0');
          return `${pad(h)}:${pad(m)}:${pad(s)}`;
        };

        videos.forEach((v) => {
          const timeStr = formatSecondsToHHMMSS(currentOffset);
          tempChaptersInput += `${timeStr} ${v.title}\n`;
          
          flatSubtitles.push({
            text: "⏳ 正在下載字幕，請稍候...",
            start: currentOffset,
            duration: v.duration || 600
          });
          
          currentOffset += v.duration || 600;
        });

        const playlistVideoData = {
          status: 'success',
          video_id: 'playlist_multi_' + Date.now(),
          title: '自訂影片清單',
          is_playlist: true,
          duration: currentOffset,
          thumbnail: videos[0]?.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=60',
          channel: '自訂清單',
          videos: videos,
          subtitles: flatSubtitles.map((s, idx) => ({ ...s, globalIndex: idx }))
        };

        loadVideoState(playlistVideoData.video_id);
        if (localStorage.getItem(`gth_chaptersInput_${playlistVideoData.video_id}`) === null) {
          setChaptersInput(tempChaptersInput.trim());
        }
        setActiveTab('edit');
        setShowCostEstimation(false);

        setVideoData(playlistVideoData);
        setScreen('app');
        showToast(`✅ 已進入工作區！開始依序載入 ${videos.length} 部影片字幕...`);

        loadPlaylistSubtitlesSequentially(playlistVideoData, sessionId);

      } catch (err: any) {
        setScreen('home');
        alert(err.message || '載入失敗，請重試。');
      }
      return;
    }

    let isPlaylist = false;
    if (ytUrl.includes('list=')) {
      if (ytUrl.includes('/playlist') || !ytUrl.includes('v=')) {
        isPlaylist = true;
      } else {
        isPlaylist = window.confirm(
          '偵測到此網址包含播放清單 (Playlist) 參數。\n您是否要載入「整部播放清單」？\n\n[確定] 載入播放清單 | [取消] 僅載入單部影片'
        );
      }
    }

    const videoId = getVideoId(ytUrl);
    if (!isPlaylist && videoId && isDuplicateVideo(videoId)) {
      const confirmLoad = window.confirm(
        '偵測到此影片之前已整理過重點筆記。\n是否確定要再次載入此影片並還原歷史整理紀錄？'
      );
      if (!confirmLoad) {
        return;
      }
    }

    if (isPlaylist) {
      setScreen('loading');
      setLoadingText('正在解析播放清單影片列表，請稍候...');
      try {
        const response = await fetch('/api/playlist-metadata', {
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
          throw new Error(`伺服器回應格式錯誤 (HTTP ${response.status})。`);
        }

        if (response.ok && result.status === 'success' && result.videos) {
          const videos = result.videos.map((v: any) => ({
            ...v,
            loading: true
          }));

          currentLoadSessionIdRef.current += 1;
          const sessionId = currentLoadSessionIdRef.current;

          let currentOffset = 0;
          let tempChaptersInput = "";
          const flatSubtitles: any[] = [];

          const formatSecondsToHHMMSS = (seconds: number): string => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const pad = (num: number) => String(num).padStart(2, '0');
            return `${pad(h)}:${pad(m)}:${pad(s)}`;
          };

          videos.forEach((v: any) => {
            const timeStr = formatSecondsToHHMMSS(currentOffset);
            tempChaptersInput += `${timeStr} ${v.title}\n`;
            
            flatSubtitles.push({
              text: "⏳ 正在下載字幕，請稍候...",
              start: currentOffset,
              duration: v.duration || 600
            });
            
            currentOffset += v.duration || 600;
          });

          const playlistVideoData = {
            status: 'success',
            video_id: 'playlist_' + Date.now(),
            title: result.title || '播放清單',
            is_playlist: true,
            duration: currentOffset,
            thumbnail: result.thumbnail || videos[0]?.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=60',
            channel: result.channel || '未知頻道',
            videos: videos,
            subtitles: flatSubtitles.map((s, idx) => ({ ...s, globalIndex: idx }))
          };

          loadVideoState(playlistVideoData.video_id);
          if (localStorage.getItem(`gth_chaptersInput_${playlistVideoData.video_id}`) === null) {
            setChaptersInput(tempChaptersInput.trim());
          }
          setActiveTab('edit');
          setShowCostEstimation(false);

          setVideoData(playlistVideoData);
          setScreen('app');
          showToast(`✅ 已載入播放清單！共 ${videos.length} 部影片，正在背景依序下載字幕...`);

          loadPlaylistSubtitlesSequentially(playlistVideoData, sessionId);
        } else {
          throw new Error(result.message || '解析播放清單失敗');
        }
      } catch (err: any) {
        setScreen('home');
        alert(err.message || '載入播放清單失敗，請重試。');
      }
      return;
    }

    if (!videoId) {
      alert('無法取得影片 ID，請確認 URL 是否正確。');
      return;
    }

    // Single video mode
    currentLoadSessionIdRef.current += 1;
    const sessionId = currentLoadSessionIdRef.current;

    const singleVideo = {
      video_id: videoId,
      title: '正在下載影片資訊...',
      duration: 600,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      loading: true,
      url: ytUrl
    };

    const initialVideoData = {
      status: 'success',
      video_id: videoId,
      title: '正在載入...',
      is_playlist: false,
      duration: 600,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      channel: '正在載入',
      videos: [singleVideo],
      subtitles: [{
        text: "⏳ 正在下載字幕，請稍候...",
        start: 0.0,
        duration: 600.0
      }]
    };

    loadVideoState(videoId);
    setActiveTab('edit');
    setShowCostEstimation(false);

    setVideoData(initialVideoData);
    setScreen('app');
    showToast('✅ 已進入工作區！正在下載字幕...');

    loadPlaylistSubtitlesSequentially(initialVideoData, sessionId);
  };

  const handleManualImport = async (files?: FileList | null) => {
    if (files && files.length > 0) {
      try {
        setScreen('loading');
        setLoadingText(`正在讀取並解析 ${files.length} 個字幕檔案，請稍候...`);

        const videos: any[] = [];
        let currentOffset = 0;
        let tempChaptersInput = "";
        const flatSubtitles: any[] = [];

        const readFileAsText = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string || "");
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
          });
        };

        const fileList = Array.from(files).sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        );

        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const text = await readFileAsText(file);
          const parsedSubs = parseSubtitlesText(cleanChineseWhitespace(text));
          if (parsedSubs.length === 0) {
            continue;
          }

          let duration = 0;
          if (parsedSubs.length > 0) {
            const lastSub = parsedSubs[parsedSubs.length - 1];
            duration = Math.ceil(lastSub.start + lastSub.duration);
          }

          const title = file.name.replace(/\.[^/.]+$/, ""); // strip extension

          const formatSecondsToHHMMSS = (seconds: number): string => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const pad = (num: number) => String(num).padStart(2, '0');
            return `${pad(h)}:${pad(m)}:${pad(s)}`;
          };

          const timeStr = formatSecondsToHHMMSS(currentOffset);
          tempChaptersInput += `${timeStr} ${title}\n`;

          const shiftedSubs = parsedSubs.map((s: any) => ({
            ...s,
            start: s.start + currentOffset
          }));
          flatSubtitles.push(...shiftedSubs);

          videos.push({
            video_id: `manual_v_${i}_${Date.now()}`,
            title: title,
            duration: duration,
            subtitles: parsedSubs
          });

          currentOffset += duration;
        }

        if (videos.length === 0) {
          throw new Error("未能從選取的文件中解析出任何有效字幕。");
        }

        // Try extracting YT ID for playlist if URL is specified
        let resolvedVideoId = '';
        let resolvedThumbnail = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=60';
        if (importYtUrl.trim()) {
          const vid = getVideoId(importYtUrl.trim());
          if (vid && vid !== 'null') {
            resolvedVideoId = vid;
            resolvedThumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
          }
        }

        const targetVideoId = resolvedVideoId || generateManualVideoId(importTitle.trim() || '手動匯入播放清單', flatSubtitles.map(s => s.text).join(' '));

        const manualVideoData = {
          status: 'success',
          video_id: targetVideoId,
          title: importTitle.trim() || '手動匯入播放清單',
          is_playlist: true,
          duration: currentOffset,
          thumbnail: resolvedThumbnail,
          channel: '手動匯入',
          videos: videos,
          subtitles: resolveSubtitleOverlaps(flatSubtitles).map((s, idx) => ({ ...s, globalIndex: idx })),
          no_timestamps: fileList.every(f => f.name.toLowerCase().endsWith('.txt')),
          is_manual_import: true
        };

        loadVideoState(targetVideoId);
        if (localStorage.getItem(`gth_chaptersInput_${targetVideoId}`) === null) {
          setChaptersInput(tempChaptersInput.trim());
        }
        setActiveTab('edit');
        setShowCostEstimation(false);

        setVideoData(manualVideoData);
        setScreen('app');
        setShowImportModal(false);
        setImportTitle('');
        setImportText('');
        setImportYtUrl('');
        showToast(`✅ 成功匯入播放清單！共 ${videos.length} 部影片。`);
      } catch (err: any) {
        setScreen('home');
        alert('匯入失敗: ' + err.message);
      }
      return;
    }

    if (!importText.trim()) {
      alert('請貼上字幕內容或選擇字幕檔案！');
      return;
    }

    try {
      const cleanedImportText = cleanChineseWhitespace(importText);
      // Try extracting YT ID
      let resolvedVideoId = '';
      let resolvedThumbnail = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=60';
      if (importYtUrl.trim()) {
        const vid = getVideoId(importYtUrl.trim());
        if (vid && vid !== 'null') {
          resolvedVideoId = vid;
          resolvedThumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
        }
      }

      if (importMode === 'playlist') {
        const sections = cleanedImportText.split(/(?=^#\s+)/m);
        if (sections.length > 1) {
          const videos: any[] = [];
          let currentOffset = 0;
          let tempChaptersInput = "";
          const flatSubtitles: any[] = [];

          const formatSecondsToHHMMSS = (seconds: number): string => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const pad = (num: number) => String(num).padStart(2, '0');
            return `${pad(h)}:${pad(m)}:${pad(s)}`;
          };

          sections.forEach((sec, idx) => {
            const lines = sec.split('\n');
            const headerLine = lines[0].trim();
            const title = headerLine.replace(/^#\s+/, "").trim() || `影片 ${idx + 1}`;
            const content = lines.slice(1).join('\n').trim();
            if (!content) return;

            const parsedSubs = parseSubtitlesText(content);
            if (parsedSubs.length === 0) return;

            let duration = 0;
            if (parsedSubs.length > 0) {
              const lastSub = parsedSubs[parsedSubs.length - 1];
              duration = Math.ceil(lastSub.start + lastSub.duration);
            }

            const timeStr = formatSecondsToHHMMSS(currentOffset);
            tempChaptersInput += `${timeStr} ${title}\n`;

            const shiftedSubs = parsedSubs.map((s: any) => ({
              ...s,
              start: s.start + currentOffset
            }));
            flatSubtitles.push(...shiftedSubs);

            videos.push({
              video_id: `manual_text_v_${idx}_${Date.now()}`,
              title: title,
              duration: duration,
              subtitles: parsedSubs
            });

            currentOffset += duration;
          });

          if (videos.length > 0) {
            const targetVideoId = resolvedVideoId || generateManualVideoId(importTitle.trim() || '手動匯入播放清單', importText);

            const manualVideoData = {
              status: 'success',
              video_id: targetVideoId,
              title: importTitle.trim() || '手動匯入播放清單',
              is_playlist: true,
              duration: currentOffset,
              thumbnail: resolvedThumbnail,
              channel: '手動匯入',
              videos: videos,
              subtitles: resolveSubtitleOverlaps(flatSubtitles).map((s, idx) => ({ ...s, globalIndex: idx })),
              is_manual_import: true
            };

            loadVideoState(targetVideoId);
            if (localStorage.getItem(`gth_chaptersInput_${targetVideoId}`) === null) {
              setChaptersInput(tempChaptersInput.trim());
            }
            setActiveTab('edit');
            setShowCostEstimation(false);

            setVideoData(manualVideoData);
            setScreen('app');
            setShowImportModal(false);
            setImportTitle('');
            setImportText('');
            setImportYtUrl('');
            showToast(`✅ 成功手動匯入播放清單！共 ${videos.length} 部影片。`);
            return;
          }
        }
      }

      // Single Video Mode (with automatic '#' heading to chapter conversion)
      let parsedSubs: any[] = [];
      let tempChaptersInput = "";
      let duration = 0;

      const formatSecondsToHHMMSS = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const pad = (num: number) => String(num).padStart(2, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
      };

      if (importMode === 'single') {
        const lines = cleanedImportText.split(/\r?\n/);
        let currentTime = 0;
        const chapters: { time: number; title: string }[] = [];

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('#')) {
            const title = trimmed.replace(/^#+\s*/, '').trim();
            if (title) {
              chapters.push({ time: currentTime, title });
            }
          } else {
            // Check if it's a timestamped subtitle line
            const timePrefixRegex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.*)$/;
            const match = trimmed.match(timePrefixRegex);
            if (match) {
              const timeStr = match[1];
              const textContent = match[2].trim();
              const seconds = parseTimeToSeconds(timeStr);
              parsedSubs.push({
                text: textContent,
                start: seconds,
                duration: 8
              });
              currentTime = seconds + 8;
            } else {
              parsedSubs.push({
                text: trimmed,
                start: currentTime,
                duration: 8
              });
              currentTime += 8;
            }
          }
        }
        duration = currentTime;
        tempChaptersInput = chapters
          .map(c => `${formatSecondsToHHMMSS(c.time)} ${c.title}`)
          .join('\n');
      } else {
        // Fallback or playlist mode with only 1 segment
        parsedSubs = parseSubtitlesText(cleanedImportText);
        if (parsedSubs.length > 0) {
          const lastSub = parsedSubs[parsedSubs.length - 1];
          duration = Math.ceil(lastSub.start + lastSub.duration);
        }
      }

      if (parsedSubs.length === 0) {
        alert('無法從貼上的文字中解析出任何字幕。');
        return;
      }

      const isPlainTextInput = !importText.includes('-->') && !/^\d{1,2}:\d{2}/m.test(importText);

      const targetVideoId = resolvedVideoId || generateManualVideoId(importTitle.trim() || '手動匯入影片', importText);

      const manualVideoData = {
        status: 'success',
        video_id: targetVideoId,
        title: importTitle.trim() || '手動匯入影片',
        duration: duration,
        thumbnail: resolvedThumbnail,
        channel: '手動匯入',
        subtitles: resolveSubtitleOverlaps(parsedSubs).map((s: any, idx: number) => ({
          ...s,
          globalIndex: idx
        })),
        no_timestamps: isPlainTextInput,
        is_manual_import: true
      };

      loadVideoState(targetVideoId);
      if (localStorage.getItem(`gth_chaptersInput_${targetVideoId}`) === null) {
        setChaptersInput(tempChaptersInput.trim());
      }
      setActiveTab('edit');
      setShowCostEstimation(false);

      setVideoData(manualVideoData);
      setScreen('app');
      setShowImportModal(false);
      setImportTitle('');
      setImportText('');
      setImportYtUrl('');
      showToast('✅ 成功手動匯入字幕！');
    } catch (err: any) {
      alert('匯入失敗: ' + err.message);
    }
  };

  const useExample = (url: string) => {
    setYtUrl(url);
    setUserCustomSplits([]);
    setEditedSegmentTexts({});
    setRemovedBoundaryTimes([]);
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

  const handleSegmentKeydown = (event: React.KeyboardEvent<HTMLDivElement>, seg: Segment) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent line break in contentEditable

      const element = event.currentTarget;
      const caretOffset = getCaretCharacterOffsetWithin(element);

      if (!seg.subtitles || seg.subtitles.length === 0) return;

      const normalizeTextForComparison = (str: string) => {
        return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      };

      const normalizedCurrent = normalizeTextForComparison(element.innerText);
      const normalizedOriginal = normalizeTextForComparison(cleanAndJoinSubtitles(seg.subtitles));

      let splitTime = -1;

      if (normalizedCurrent !== normalizedOriginal && normalizedCurrent.length > 0) {
        // --- 1. 使用者已經編輯過卡片文字，使用比例切分並整合新文字到 global subtitles ---
        const targetCharOffset = Math.max(0, Math.min(caretOffset, normalizedCurrent.length));

        if (targetCharOffset > 0 && targetCharOffset < normalizedCurrent.length) {
          const part1 = normalizedCurrent.substring(0, targetCharOffset).trim();
          const part2 = normalizedCurrent.substring(targetCharOffset).trim();

          if (part1 && part2) {
            const ratio = targetCharOffset / normalizedCurrent.length;
            const totalDuration = seg.end - seg.start;
            const duration1 = totalDuration * ratio;
            const duration2 = totalDuration * (1 - ratio);
            const start2 = seg.start + duration1;

            const entry1 = {
              start: seg.start,
              duration: duration1,
              text: part1
            };
            const entry2 = {
              start: start2,
              duration: duration2,
              text: part2
            };

            // 尋找此 segment 原始字幕在 global videoData.subtitles 的第一個位置
            let firstGlobalIdx = -1;
            if (seg.subtitles[0] && seg.subtitles[0].globalIndex !== undefined) {
              firstGlobalIdx = seg.subtitles[0].globalIndex;
            } else if (seg.subtitles[0]) {
              firstGlobalIdx = videoData.subtitles.findIndex(
                (s: any) => Math.abs(s.start - seg.subtitles[0].start) < 0.01 && s.text === seg.subtitles[0].text
              );
            }

            if (firstGlobalIdx !== -1) {
              const updatedSubtitles = [...videoData.subtitles];
              // 將原本 segment 底下的多個 entry 替換為兩個切分後的新 entry
              updatedSubtitles.splice(firstGlobalIdx, seg.subtitles.length, entry1, entry2);

              const reindexedSubtitles = updatedSubtitles.map((s, idx) => ({
                ...s,
                globalIndex: idx
              }));

              setVideoData({
                ...videoData,
                subtitles: reindexedSubtitles
              });

              // 清除對應卡片的本地編輯 state，因為已同步至全域 subtitles 中
              setEditedSegmentTexts((prev) => {
                const copy = { ...prev };
                delete copy[seg.id || ''];
                return copy;
              });

              splitTime = start2;
            }
          }
        }
      } else {
        // --- 2. 文字未被修改，使用原本精確的逐條字幕 mapping 邏輯 ---
        const { mappings } = getCleanedSubtitlesAndMappings(seg.subtitles);
        if (mappings.length === 0) return;

        let targetLocalIdx = -1;
        let targetCharOffset = 0;

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

        splitTime = targetEntry.start;

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
              
              const reindexedSubtitles = updatedSubtitles.map((s, idx) => ({
                ...s,
                globalIndex: idx
              }));

              setVideoData({
                ...videoData,
                subtitles: reindexedSubtitles
              });

              // 清除對應卡片的本地編輯 state，避免快取干擾
              setEditedSegmentTexts((prev) => {
                const copy = { ...prev };
                delete copy[seg.id || ''];
                return copy;
              });

              splitTime = start2;
            }
          }
        } else if (targetCharOffset >= cleanText.length) {
          if (targetLocalIdx + 1 < seg.subtitles.length) {
            splitTime = seg.subtitles[targetLocalIdx + 1].start;
          } else {
            showToast('⚠️ 請在區塊內部的字句中間或句尾進行分割。');
            return;
          }
        } else {
          splitTime = targetEntry.start;
        }
      }

      if (splitTime === -1) {
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

  const handleRenameChapter = (time: number, newTitle: string) => {
    const customIdx = userCustomSplits.findIndex(c => c.time === time);
    if (customIdx >= 0) {
      setUserCustomSplits(prev => {
        const next = [...prev];
        next[customIdx] = { ...next[customIdx], title: newTitle };
        return next;
      });
      showToast('已更新自訂切分點名稱！');
      return;
    }

    const lines = chaptersInput.split('\n');
    const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/;
    let updated = false;

    const newLines = lines.map(line => {
      const match = line.match(timeRegex);
      if (match) {
        const timeStr = match[1];
        const timeSecs = parseTimeToSeconds(timeStr);
        if (timeSecs === time) {
          updated = true;
          return `${timeStr} ${newTitle}`;
        }
      }
      return line;
    });

    if (updated) {
      setChaptersInput(newLines.join('\n'));
      showToast('已更新章節名稱！');
    } else {
      const formatSecondsToHHMMSS = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const pad = (num: number) => String(num).padStart(2, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
      };
      const timeStr = formatSecondsToHHMMSS(time);
      const newChaptersInput = `${chaptersInput.trim()}\n${timeStr} ${newTitle}`.trim();
      
      const sortedChapters = newChaptersInput
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .sort((a, b) => {
          const mA = a.match(timeRegex);
          const mB = b.match(timeRegex);
          const tA = mA ? parseTimeToSeconds(mA[1]) : 0;
          const tB = mB ? parseTimeToSeconds(mB[1]) : 0;
          return tA - tB;
        })
        .join('\n');

      setChaptersInput(sortedChapters);
      showToast('已設定章節名稱！');
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
    const isPlaylistMode = !!videoData?.is_playlist;
    const timeStr = isPlaylistMode
      ? `00:00 ~ ${formatTime(group.end - group.start)}`
      : `${formatTime(group.start)} ~ ${formatTime(group.end)}`;
    const headerText = `# ${group.chapterTitle} (${timeStr})`;
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
    showToast(`已複製整部「${group.chapterTitle}」內容！`);
  };

  const copyEntireChapterSRT = (group: Segment) => {
    const isPlaylistMode = !!videoData?.is_playlist;
    let allSubs = (group.subSegments || []).flatMap((sub) => sub.subtitles);
    if (isPlaylistMode) {
      allSubs = allSubs.map((s) => ({
        ...s,
        start: s.start - group.start
      }));
    }
    allSubs.sort((a, b) => a.start - b.start);
    const srtText = formatSubtitlesToSRT(allSubs);
    copyTextToClipboard(srtText);
    showToast(`已複製整部「${group.chapterTitle}」SRT 格式字幕！`);
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

    const videoId = videoData?.video_id;
    if (videoId && isDuplicateVideo(videoId)) {
      const confirmGen = window.confirm(
        '⚠️ 偵測到此影片已有先前的 AI 整理紀錄。是否要清除舊紀錄並重新發送 AI 整理請求？\n（選取 [取消] 將保留原有的筆記與術語）'
      );
      if (!confirmGen) {
        return;
      }
      setAiNotesResult(null);
      setAiTermsResult(null);
    }

    if (videoId) {
      markVideoAsGenerated(videoId);
    }

    // 建立完整的章節上下文
    const fullChaptersText = flatActiveSegments
      .map((s) => `* [${formatSecondsToTime(s.start)}] ${s.chapterTitle}${s.subTitle ? ` (${s.subTitle})` : ''}`)
      .join('\n');

    // 對應 AI 整合群組進行呼叫
    if (isShortVideo) {
      const totalP1 = aiGroups.length;
      const initialNotes: AIBlock[] = aiGroups.map((group, idx) => {
        const title = `影片時間 ${formatSecondsToTime(group.start)} ~ ${formatSecondsToTime(group.end)} 重點整理 (第 ${idx + 1} / ${totalP1} 次)`;
        return {
          title,
          content: '⏳ 正在呼叫 AI 整理中...',
          status: 'loading' as const,
          text: group.text,
          currentTitle: group.title,
          fullChapters: fullChaptersText,
          groupIndex: idx
        };
      });

      setAiNotesResult(initialNotes);
      setAiTermsResult(null); // Hide the terms tab entirely
      setActiveTab('notes');
      showToast('🚀 已啟動短影片合併整理，請在左側查看即時進度！');

      aiGroups.forEach((group, idx) => {
        fetchBlockAnalysis(
          initialNotes[idx].title,
          group.text,
          group.title || '',
          fullChaptersText
        );
      });
    } else {
      const totalP1 = aiGroups.length;
      const initialNotes: AIBlock[] = aiGroups.map((group, idx) => {
        const title = `影片時間 ${formatSecondsToTime(group.start)} ~ ${formatSecondsToTime(group.end)} 重點整理 (第 ${idx + 1} / ${totalP1} 次)`;
        return {
          title,
          content: '⏳ 正在呼叫 AI 整理中...',
          status: 'loading' as const,
          text: group.text,
          currentTitle: group.title,
          fullChapters: fullChaptersText,
          groupIndex: idx
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
          fullChapters: fullChaptersText,
          groupIndex: idx
        };
      });

      setAiNotesResult(initialNotes);
      setAiTermsResult(initialTerms);
      setActiveTab('notes');
      showToast('🚀 已啟動批次併行整理，請在左側查看即時進度！');

      aiGroups.forEach((group, idx) => {
        fetchBlockNote(
          initialNotes[idx].title,
          group.text,
          group.title || '',
          fullChaptersText
        );
      });

      aiTermsGroups.forEach((group, idx) => {
        fetchBlockTerms(
          initialTerms[idx].title,
          group.text,
          group.title || '',
          fullChaptersText
        );
      });
    }
  };

  const fetchBlockAnalysis = async (
    noteTitle: string,
    text: string,
    currentTitle: string,
    fullChapters: string
  ) => {
    try {
      const res = await fetch('/api/generate-block-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: openaiKey,
          model: 'gpt-5.1',
          title: noteTitle,
          text: text,
          current_title: currentTitle,
          full_chapters: fullChapters
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        const combinedMarkdown = `${data.notes}\n\n---\n\n### 專業術語對照\n\n${data.terms}`;
        updateNoteBlock(noteTitle, combinedMarkdown, 'done');
      } else {
        updateNoteBlock(noteTitle, data.detail || '呼叫 AI 整理失敗。', 'error');
      }
    } catch (e: any) {
      updateNoteBlock(noteTitle, e.message || '網路連線異常。', 'error');
    }
  };

  const fetchBlockNote = async (
    title: string,
    text: string,
    currentTitle: string,
    fullChapters: string
  ) => {
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

  const fetchBlockTerms = async (
    title: string,
    text: string,
    currentTitle: string,
    fullChapters: string
  ) => {
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
    if (isShortVideo) {
      fetchBlockAnalysis(
        block.title,
        block.text,
        block.currentTitle || '',
        block.fullChapters || ''
      );
    } else {
      fetchBlockNote(
        block.title,
        block.text,
        block.currentTitle || '',
        block.fullChapters || ''
      );
    }
  };

  const retryTermsBlock = (block: AIBlock) => {
    updateTermsBlock(block.title, '⏳ 正在重新呼叫 AI 整理中...', 'loading');
    fetchBlockTerms(
      block.title,
      block.text,
      block.currentTitle || '',
      block.fullChapters || ''
    );
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
    currentLoadSessionIdRef.current += 1;
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
                  copyEntireChapterSRT={copyEntireChapterSRT}
                  removedBoundaryTimes={removedBoundaryTimes}
                  handleMergeWithNext={handleMergeWithNext}
                  editedSegmentTexts={editedSegmentTexts}
                  copySegmentText={copySegmentText}
                  handleSegmentTextChange={handleSegmentTextChange}
                  handleSegmentKeydown={handleSegmentKeydown}
                  collapsedAIGroups={collapsedAIGroups}
                  toggleAIGroupCollapse={toggleAIGroupCollapse}
                  isPlaylist={!!videoData?.is_playlist}
                  noTimestamps={!!videoData?.no_timestamps}
                  onChapterTitleChange={handleRenameChapter}
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
        importYtUrl={importYtUrl}
        setImportYtUrl={setImportYtUrl}
        importMode={importMode}
        setImportMode={setImportMode}
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
