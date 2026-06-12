import React, { useState, useEffect, useMemo } from 'react';
import type { ChapterSplit, Segment } from './utils';
import {
  parseTimeToSeconds,
  formatTime,
  cleanAndJoinSubtitles,
  generateSegments,
  getCleanedSubtitlesAndMappings,
  resolveSubtitleOverlaps,
  parseSubtitlesText
} from './utils';

// Helper to determine caret offset inside contentEditable
function getCaretCharacterOffsetWithin(element: HTMLElement): number {
  let caretOffset = 0;
  const doc = element.ownerDocument;
  const win = doc?.defaultView;
  if (win && win.getSelection) {
    const sel = win.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  }
  return caretOffset;
}

// Editable Segment Component to prevent cursor jumping
const EditableSegmentText = ({
  initialText,
  onBlur,
  onKeydown
}: {
  segId: string;
  initialText: string;
  onBlur: (text: string) => void;
  onKeydown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className="segment-content"
      contentEditable
      suppressContentEditableWarning
      spellCheck="false"
      onBlur={(e) => onBlur(e.currentTarget.innerText)}
      onKeyDown={onKeydown}
    >
      {initialText}
    </div>
  );
};

interface AIBlock {
  title: string;
  content: string;
  status: 'loading' | 'done' | 'error';
  text: string;
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

  // 過濾掉被「合併」移除的 Chapter 分界點
  const filteredChapterSplits = useMemo<ChapterSplit[]>(() => {
    console.log('[Merge Debug] parsedChapters:', parsedChapters);
    console.log('[Merge Debug] removedBoundaryTimes:', removedBoundaryTimes);
    const result = parsedChapters.filter(ch => {
      const isRemoved = removedBoundaryTimes.includes(ch.time);
      if (isRemoved) {
        console.log('[Merge Debug] Filtering out chapter split:', ch.title, 'at time:', ch.time);
      }
      return !isRemoved;
    });
    return result;
  }, [parsedChapters, removedBoundaryTimes]);

  // 過濾掉被移除的自訂切分點
  const filteredCustomSplits = useMemo<ChapterSplit[]>(() => {
    return userCustomSplits.filter(cs => !removedBoundaryTimes.includes(cs.time));
  }, [userCustomSplits, removedBoundaryTimes]);

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
      removedBoundaryTimes
    );
  }, [videoData, filteredChapterSplits, filteredCustomSplits, settingsInterval, settingsNoSegment, settingsSubSegment, removedBoundaryTimes]);

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
    let totalChars = 0;
    let totalSegmentsCount = 0;
    const flatSegmentsList: { start: number; end: number; chars: number }[] = [];

    currentSegments.forEach((seg) => {
      if (seg.isGroup && seg.subSegments) {
        seg.subSegments.forEach((sub) => {
          totalSegmentsCount++;
          const segId = sub.id || '';
          const text =
            editedSegmentTexts[segId] !== undefined
              ? editedSegmentTexts[segId]
              : cleanAndJoinSubtitles(sub.subtitles);
          totalChars += text.length;
          flatSegmentsList.push({
            start: sub.start,
            end: sub.end,
            chars: text.length
          });
        });
      } else {
        totalSegmentsCount++;
        const segId = seg.id || '';
        const text =
          editedSegmentTexts[segId] !== undefined
            ? editedSegmentTexts[segId]
            : cleanAndJoinSubtitles(seg.subtitles);
        totalChars += text.length;
        flatSegmentsList.push({
          start: seg.start,
          end: seg.end,
          chars: text.length
        });
      }
    });

    // Group for Prompt 2 (every 60 minutes = 3600 seconds)
    const p2Groups: Record<number, any[]> = {};
    flatSegmentsList.forEach((seg) => {
      const bIdx = Math.floor(seg.start / 3600);
      if (!p2Groups[bIdx]) p2Groups[bIdx] = [];
      p2Groups[bIdx].push(seg);
    });

    const videoDuration = videoData?.duration || 0;
    const p1Calls = totalSegmentsCount;
    const p2Calls = Object.keys(p2Groups).length;

    const estInputTokens = Math.ceil(totalChars * 1.2);
    const estOutputP1 = p1Calls * 500;
    const estOutputP2 = p2Calls * 800;
    const estOutputTokens = estOutputP1 + estOutputP2;

    const inputCost = (estInputTokens / 1000000) * 1.25; // fixed gpt-5.1 rates
    const outputCost = (estOutputTokens / 1000000) * 10.0;
    const totalCost = inputCost + outputCost;

    return {
      segments: totalSegmentsCount,
      chars: totalChars,
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
  }, [currentSegments, editedSegmentTexts, videoData]);

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

  const handleMergeWithNext = (nextChapterStartTime: number) => {
    console.log('[Merge Debug] handleMergeWithNext called with nextChapterStartTime:', nextChapterStartTime, 'type:', typeof nextChapterStartTime);
    setRemovedBoundaryTimes(prev => {
      const next = [...prev, nextChapterStartTime];
      console.log('[Merge Debug] New removedBoundaryTimes will be:', next);
      return next;
    });
    showToast('✅ 已合併相鄰段落！點「清除章節」可全部復原。');
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
      currentSegments.forEach((seg) => {
        if (seg.isGroup && seg.subSegments) {
          seg.subSegments.forEach((sub) => {
            const segId = sub.id || '';
            const text =
              editedSegmentTexts[segId] !== undefined
                ? editedSegmentTexts[segId]
                : cleanAndJoinSubtitles(sub.subtitles);
            flatSegments.push({
              title: `${sub.chapterTitle} (${sub.subTitle})`,
              text: text,
              start: sub.start,
              end: sub.end
            });
          });
        } else {
          const segId = seg.id || '';
          const text =
            editedSegmentTexts[segId] !== undefined
              ? editedSegmentTexts[segId]
              : cleanAndJoinSubtitles(seg.subtitles);
          flatSegments.push({
            title: `${seg.chapterTitle} (${seg.subTitle})`,
            text: text,
            start: seg.start,
            end: seg.end
          });
        }
      });

      try {
        await fetch('/api/save-segments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_id: videoData.video_id,
            segments: flatSegments
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

    const flatSegments: { title: string; text: string; start: number; end: number }[] = [];
    currentSegments.forEach((seg) => {
      if (seg.isGroup && seg.subSegments) {
        seg.subSegments.forEach((sub) => {
          const segId = sub.id || '';
          const text =
            editedSegmentTexts[segId] !== undefined
              ? editedSegmentTexts[segId]
              : cleanAndJoinSubtitles(sub.subtitles);
          flatSegments.push({
            title: `${sub.chapterTitle} (${sub.subTitle})`,
            text: text,
            start: sub.start,
            end: sub.end
          });
        });
      } else {
        const segId = seg.id || '';
        const text =
          editedSegmentTexts[segId] !== undefined
            ? editedSegmentTexts[segId]
            : cleanAndJoinSubtitles(seg.subtitles);
        flatSegments.push({
          title: `${seg.chapterTitle} (${seg.subTitle})`,
          text: text,
          start: seg.start,
          end: seg.end
        });
      }
    });

    if (flatSegments.length === 0) {
      alert('無字幕內容可供整理！');
      return;
    }

    // Group for Prompt 2 (every 60 minutes = 3600 seconds)
    const p2Groups: Record<number, typeof flatSegments> = {};
    flatSegments.forEach((seg) => {
      const bIdx = Math.floor(seg.start / 3600);
      if (!p2Groups[bIdx]) p2Groups[bIdx] = [];
      p2Groups[bIdx].push(seg);
    });

    // Construct initial states for blocks (Prompt 1 is 1-to-1 with segments)
    const totalP1 = flatSegments.length;
    const initialNotes: AIBlock[] = flatSegments.map((seg, idx) => {
      const title = `影片時間 ${formatSecondsToTime(seg.start)} ~ ${formatSecondsToTime(seg.end)} 重點整理 (第 ${idx + 1} / ${totalP1} 次)`;
      return {
        title,
        content: '⏳ 正在呼叫 AI 整理中...',
        status: 'loading' as const,
        text: `### ${seg.title}\n${seg.text}`
      };
    });

    const totalP2 = Object.keys(p2Groups).length;
    const initialTerms: AIBlock[] = Object.keys(p2Groups)
      .map(Number)
      .sort((a, b) => a - b)
      .map((bIdx, idx) => {
        const groupSegs = p2Groups[bIdx];
        const combinedText = groupSegs.map((s) => s.text).join('\n');
        const minStart = Math.min(...groupSegs.map((s) => s.start));
        const maxEnd = Math.max(...groupSegs.map((s) => s.end));
        const title = `影片時間 ${formatSecondsToTime(minStart)} ~ ${formatSecondsToTime(maxEnd)} 專業術語對照 (第 ${idx + 1} / ${totalP2} 次)`;
        return {
          title,
          content: '⏳ 正在呼叫 AI 整理中...',
          status: 'loading' as const,
          text: combinedText
        };
      });

    setAiNotesResult(initialNotes);
    setAiTermsResult(initialTerms);
    setActiveTab('notes');
    showToast('🚀 已啟動批次併行整理，請在左側查看即時進度！');

    // Trigger fetch calls concurrently
    initialNotes.forEach((block) => {
      fetchBlockNote(block.title, block.text);
    });

    initialTerms.forEach((block) => {
      fetchBlockTerms(block.title, block.text);
    });
  };

  const fetchBlockNote = async (title: string, text: string) => {
    try {
      const res = await fetch('/api/generate-block-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: openaiKey,
          model: 'gpt-5.1',
          title: title,
          text: text
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

  const fetchBlockTerms = async (title: string, text: string) => {
    try {
      const res = await fetch('/api/generate-block-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: openaiKey,
          model: 'gpt-5.1',
          text: text
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
    fetchBlockNote(block.title, block.text);
  };

  const retryTermsBlock = (block: AIBlock) => {
    updateTermsBlock(block.title, '⏳ 正在重新呼叫 AI 整理中...', 'loading');
    fetchBlockTerms(block.title, block.text);
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

  // --- Rendering Helpers ---
  const renderSegmentCard = (seg: Segment, isSub: boolean) => {
    const segId = seg.id || '';
    const initialText = cleanAndJoinSubtitles(seg.subtitles);
    const textToShow = editedSegmentTexts[segId] !== undefined ? editedSegmentTexts[segId] : initialText;

    return (
      <div className={`segment-card ${isSub ? 'subsegment' : ''}`} key={segId} id={segId}>
        <div className="segment-header">
          <div className="segment-meta">
            <span className="segment-title">
              {isSub ? (
                <>
                  ↳ <span>細分區間</span>
                </>
              ) : (
                <>
                  # <span>{seg.chapterTitle}</span>
                </>
              )}
            </span>
            {seg.subTitle && <span className="segment-time-range">{seg.subTitle}</span>}
          </div>
          <div className="segment-actions">
            <button className="btn-copy btn-copy-highlight" onClick={() => copySegmentText(segId, seg, false)}>
              <span>僅複製字幕</span>
            </button>
            <button className="btn-copy" onClick={() => copySegmentText(segId, seg, true)}>
              <span>複製標題與字幕</span>
            </button>
          </div>
        </div>
        <EditableSegmentText
          segId={segId}
          initialText={textToShow}
          onBlur={(newVal) => handleSegmentTextChange(segId, newVal)}
          onKeydown={(e) => handleSegmentKeydown(e, seg)}
        />
      </div>
    );
  };

  // --- JSX Rendering ---
  return (
    <>
      <header>
        <div className="logo" onClick={goBackToHome}>
          <span>GoldTubeHouse 🛠️</span>
        </div>
        <a href="#" className="github-link" onClick={(e) => e.preventDefault()}>
          <span>字幕分段整理與 AI 筆記系統 v3.0</span>
        </a>
      </header>

      <main>
        {/* Screen 1: Home screen */}
        {screen === 'home' && (
          <div id="home-screen">
            <h1 className="hero-title">YouTube 字幕分段整理工具</h1>
            <p className="hero-subtitle">
              貼上 YouTube 影片網址，即可極速取得字幕，並根據章節進行智慧分段。支援手動鍵盤 Enter
              調整切分點，並可呼叫 OpenAI API 一鍵生成結構化重點整理與專業術語對照。
            </p>

            <div className="input-group">
              <input
                type="text"
                className="url-input"
                placeholder="請貼上 YouTube 影片網址 (例如 https://www.youtube.com/watch?v=2GZ2SNXWK-c)"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
              />
              <button className="btn-submit" onClick={handleUrlSubmit}>
                <span>開始處理</span>
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
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '-10px', marginBottom: '25px', width: '100%' }}>
              <button
                className="btn-global btn-back"
                style={{ width: 'auto', padding: '10px 24px', borderRadius: 'var(--radius-md)' }}
                onClick={() => setShowImportModal(true)}
              >
                📁 手動匯入字幕 (VTT / SRT / JSON / 純文字)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px', alignSelf: 'center' }}>常用測試範例：</span>
              <span
                className="example-tag"
                onClick={() => useExample('https://www.youtube.com/watch?v=2GZ2SNXWK-c')}
              >
                n8n 自動化大師課 (長達 6 小時)
              </span>
              <span
                className="example-tag"
                onClick={() => useExample('https://www.youtube.com/watch?v=EH5jx5qPabU')}
              >
                n8n AI Agent 教學 (約 25 分)
              </span>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">⌨️</div>
                <div className="feature-title">手動 Enter 快速切分</div>
                <div className="feature-desc">
                  直接點擊文字卡片，在任意句點後按下 Enter 鍵，系統即會精準在該時間點進行段落分割，其後區段自動後移。
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <div className="feature-title">句點對齊智慧分段</div>
                <div className="feature-desc">
                  無章節或大間隔自動分割時，自動抓取最接近 20 分鐘的句尾（句號），保持語意段落完整性。
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <div className="feature-title">OpenAI 自動筆記術語</div>
                <div className="feature-desc">
                  串接 API 金鑰，一鍵為每個分段生成重點筆記，並每小時（3個分段）生成 50
                  個專業詞彙的中英文對照與釋義。固定使用 gpt-5.1 引擎。
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 2: Loading screen */}
        {screen === 'loading' && (
          <div id="loading-screen">
            <div className="spinner-container">
              <div className="spinner-glow"></div>
              <div className="spinner-core">📺</div>
            </div>
            <h2 className="loading-title">正在處理中</h2>
            <p className="loading-subtitle">{loadingText}</p>
          </div>
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
                <div className="tab-content active">
                  <div className="panel-header">
                    <h2 className="panel-title">
                      <span>字幕分段區塊</span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 'normal',
                          color: 'var(--text-muted)',
                          background: 'rgba(255,255,255,0.04)',
                          padding: '4px 10px',
                          borderRadius: '20px'
                        }}
                      >
                        {segmentsCount} 個區塊
                      </span>
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '500' }}>
                      💡 您可點選任意卡片內容，在句號後按 Enter 鍵進行手動段落切分
                    </span>
                  </div>

                  <div className="subtitle-scroll-area">
                    {currentSegments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        無分段資料，請確認字幕下載正確。
                      </div>
                    ) : (
                      currentSegments.map((item, index) => {
                        if (item.isGroup) {
                          const groupKey = `group_ch_${index}_${item.chapterTitle}`;
                          const isCollapsed = collapsedChapters.has(groupKey);
                          const nextItem = index + 1 < currentSegments.length ? currentSegments[index + 1] : null;
                          return (
                            <React.Fragment key={groupKey}>
                              <div className="chapter-group">
                                <div
                                  className="chapter-group-header"
                                  onClick={() => toggleChapterCollapse(groupKey)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="chapter-group-title">
                                    <span className="collapse-arrow">{isCollapsed ? '▶' : '▼'}</span>
                                    📁 <span># {item.chapterTitle}</span>
                                  </div>
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <span className="chapter-group-time">
                                      {formatTime(item.start)} ~ {formatTime(item.end)}
                                    </span>
                                    {!isCollapsed && (
                                      <button className="btn-copy-group" onClick={() => copyEntireChapter(item)}>
                                        複製整章
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {!isCollapsed && item.subSegments?.map((subSeg, subIdx) => {
                                  const subSegs = item.subSegments || [];
                                  const isLastSub = subIdx === subSegs.length - 1;
                                  return (
                                    <React.Fragment key={subSeg.id || `sub_${subIdx}`}>
                                      {renderSegmentCard(subSeg, true)}
                                      {!isLastSub && subSegs[subIdx + 1] && (
                                        <div className="merge-btn-row subsegment-merge">
                                          <div className="merge-line" />
                                          <button
                                            className="btn-merge-next btn-merge-sub"
                                            onClick={() => handleMergeWithNext(subSegs[subIdx + 1].start)}
                                            title="合併此子段落與下一段"
                                          >
                                            ⊕ 合併子段落
                                          </button>
                                          <div className="merge-line" />
                                        </div>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                              {nextItem && nextItem.isGroup && (
                                <div className="merge-btn-row">
                                  <div className="merge-line" />
                                  <button
                                    className="btn-merge-next"
                                    onClick={() => handleMergeWithNext(nextItem.start)}
                                    title={`合併「${item.chapterTitle}」與「${nextItem.chapterTitle}」`}
                                  >
                                    ⊕ 合併此章節與下一章
                                  </button>
                                  <div className="merge-line" />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        } else {
                          return renderSegmentCard(item, false);
                        }
                      })
                    )}

                  </div>
                </div>
              )}

              {/* Tab 2: AI Notes */}
              {activeTab === 'notes' && aiNotesResult && (
                <div className="tab-content active">
                  <div className="panel-header">
                    <h2 className="panel-title">重點整理筆記</h2>
                    <button className="btn-copy btn-copy-highlight" onClick={copyAllAINotes}>
                      複製全部筆記
                    </button>
                  </div>
                  <div className="ai-result-area" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {aiNotesResult.map((item, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                          <h3 style={{ color: 'var(--primary)', fontSize: '16px', fontWeight: 600 }}>{item.title}</h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {item.status === 'error' && (
                              <button className="btn-copy" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => retryNoteBlock(item)}>
                                🔄 重新整理此區塊
                              </button>
                            )}
                            {item.status === 'done' && (
                              <button className="btn-copy" onClick={() => { copyTextToClipboard(`# ${item.title}\n\n${item.content}`); showToast('已複製該段筆記！'); }}>
                                📋 複製此段
                              </button>
                            )}
                          </div>
                        </div>
                        {item.status === 'loading' ? (
                          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            <span>⏳</span><span>正在整理此時間段的重點整理...</span>
                          </div>
                        ) : item.status === 'error' ? (
                          <div style={{ color: 'var(--error)', fontSize: '14px' }}>
                            ⚠️ 錯誤：{item.content}
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>{item.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: AI Terms */}
              {activeTab === 'term' && aiTermsResult && (
                <div className="tab-content active">
                  <div className="panel-header">
                    <h2 className="panel-title">專業術語對照表</h2>
                    <button className="btn-copy btn-copy-highlight" onClick={copyAllAITerms}>
                      複製全部術語
                    </button>
                  </div>
                  <div className="ai-result-area" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {aiTermsResult.map((item, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                          <h3 style={{ color: '#10b981', fontSize: '16px', fontWeight: 600 }}>{item.title}</h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {item.status === 'error' && (
                              <button className="btn-copy" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => retryTermsBlock(item)}>
                                🔄 重新整理此區塊
                              </button>
                            )}
                            {item.status === 'done' && (
                              <button className="btn-copy" onClick={() => { copyTextToClipboard(`# ${item.title}\n\n${item.content}`); showToast('已複製該段術語！'); }}>
                                📋 複製此段
                              </button>
                            )}
                          </div>
                        </div>
                        {item.status === 'loading' ? (
                          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            <span>⏳</span><span>正在整理此時間段的專業術語...</span>
                          </div>
                        ) : item.status === 'error' ? (
                          <div style={{ color: 'var(--error)', fontSize: '14px' }}>
                            ⚠️ 錯誤：{item.content}
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>{item.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right panel: Sidebar controls */}
            <div className="sidebar">
              <div className="sidebar-scroll-area">
                {/* Video Info Card */}
                <div className="sidebar-card video-card">
                  <div className="video-thumb">
                    <a
                      href={`https://www.youtube.com/watch?v=${videoData.video_id}`}
                      target="_blank"
                      rel="noreferrer"
                      title="在新分頁開啟影片"
                    >
                      <img src={videoData.thumbnail || 'https://via.placeholder.com/120x90'} alt="影片縮圖" />
                    </a>
                  </div>
                  <div className="video-detail">
                    <h3 className="video-title" title={videoData.title}>
                      {videoData.title}
                    </h3>
                    <div className="video-meta">
                      <span>長度：{formatTime(videoData.duration)}</span>
                      <span>Video ID: {videoData.video_id}</span>
                    </div>
                  </div>
                </div>

                {/* OpenAI API Settings Card */}
                <div className="sidebar-card">
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: '12px',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '8px'
                    }}
                  >
                    OpenAI API 設定
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        API Key
                      </label>
                      <input
                        type="password"
                        className="settings-input"
                        style={{ width: '100%', textAlign: 'left', height: '32px' }}
                        placeholder="貼上 sk-...金鑰"
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                      />
                      {hasEnvKey && (
                        <div
                          style={{
                            fontSize: '11px',
                            marginTop: '5px',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            lineHeight: '1.4'
                          }}
                          onClick={loadEnvKey}
                        >
                          💡 偵測到本地環境中有 API Key [點此引入]
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        使用模型
                      </label>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🧠</span>
                        <span>gpt-5.1 (已固定為此模型)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapters Input Card */}
                <div className="sidebar-card">
                  <div className="chapters-label">
                    <span>貼上影片章節 (Chapters)</span>
                    <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                      可留空以使用時間間隔
                    </span>
                  </div>
                  <textarea
                    className="chapters-textarea"
                    placeholder={`格式範例：
00:00:00 Introduction
00:01:25 The n8n basics
01:11:41 Foundational concepts
03:11:09 Javascript functions`}
                    value={chaptersInput}
                    onChange={(e) => setChaptersInput(e.target.value)}
                  />
                  <div className="chapters-actions">
                    <button className="btn-action btn-apply" onClick={applyChapters}>
                      <span>套用章節</span>
                    </button>
                    <button className="btn-action btn-clear" onClick={clearChapters}>
                      <span>清除</span>
                    </button>
                  </div>
                </div>

                {/* Settings Parameter Card */}
                <div className="sidebar-card">
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: '12px',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '8px'
                    }}
                  >
                    分段參數微調
                  </h4>
                  <div className="settings-grid">
                    <div>
                      <div className="settings-item">
                        <span className="settings-name">自訂分段區間 (預設 20分)</span>
                        <div className="settings-control">
                          <input
                            type="number"
                            className="settings-input"
                            value={settingsInterval}
                            min={1}
                            max={180}
                            onChange={(e) => setSettingsInterval(Math.max(1, Number(e.target.value)))}
                          />
                          <span className="settings-unit">分</span>
                        </div>
                      </div>
                      <div className="presets">
                        {[5, 10, 15, 20, 30].map((m) => (
                          <button
                            key={m}
                            className={`btn-preset ${settingsInterval === m ? 'active' : ''}`}
                            onClick={() => setPresetInterval(m)}
                          >
                            {m}分
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="settings-item">
                      <span className="settings-name">直接顯示門檻</span>
                      <div className="settings-control">
                        <input
                          type="number"
                          className="settings-input"
                          value={settingsNoSegment}
                          min={5}
                          max={120}
                          onChange={(e) => setSettingsNoSegment(Math.max(5, Number(e.target.value)))}
                        />
                        <span className="settings-unit">分</span>
                      </div>
                    </div>

                    <div className="settings-item">
                      <span className="settings-name">超長章節細分門檻</span>
                      <div className="settings-control">
                        <input
                          type="number"
                          className="settings-input"
                          value={settingsSubSegment}
                          min={5}
                          max={120}
                          onChange={(e) => setSettingsSubSegment(Math.max(5, Number(e.target.value)))}
                        />
                        <span className="settings-unit">分</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer Operations */}
              <div className="sidebar-footer">
                <button className="btn-global btn-lock-changes" onClick={lockAndEstimateCost}>
                  <span>🔒 鎖定分段並預估 API 費用</span>
                </button>

                {showCostEstimation && (
                  <div className="cost-box">
                    <div className="cost-title">
                      <span>📊 API 費用估算 (gpt-5.1)</span>
                    </div>
                    <div className="cost-row">
                      <span>總段落數</span>
                      <span>{estCostInfo.segments} 個</span>
                    </div>
                    <div className="cost-row">
                      <span>總文字長度</span>
                      <span>{estCostInfo.chars.toLocaleString()} 字</span>
                    </div>
                    <div className="cost-row">
                      <span>預估費用 (USD)</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        ${estCostInfo.costUSD.toFixed(4)} USD (約台幣 {estCostInfo.costTWD.toFixed(2)} 元)
                      </span>
                    </div>

                    <div className="cost-details-toggle" onClick={() => setShowCostDetails(!showCostDetails)}>
                      <span>{showCostDetails ? '▲ 收起詳細計算過程' : '▼ 展開詳細計算過程'}</span>
                    </div>

                    {showCostDetails && (
                      <div className="cost-details-content">
                        <div className="cost-details-section-title">輸入計費 (Input):</div>
                        <div className="cost-details-row">
                          <span>預估 Token 數 (字數 × 1.2)</span>
                          <span className="cost-details-highlight">{estCostInfo.estInputTokens?.toLocaleString()} tokens</span>
                        </div>
                        <div className="cost-details-row">
                          <span>費率 ($1.25 / 1M tokens)</span>
                          <span>${estCostInfo.inputCost?.toFixed(6)} USD</span>
                        </div>

                        <div className="cost-details-section-title">輸出計費 (Output):</div>
                        <div className="cost-details-row">
                          <span>影片長度 / 段落區間</span>
                          <span>{((estCostInfo.videoDuration || 0) / 60).toFixed(1)} 分鐘</span>
                        </div>
                        <div className="cost-details-row">
                          <span>筆記次數 (每個段落)</span>
                          <span>{estCostInfo.p1Calls} 次 (約 {estCostInfo.estOutputP1?.toLocaleString()} tokens)</span>
                        </div>
                        <div className="cost-details-row">
                          <span>術語次數 (每 60 分鐘)</span>
                          <span>{estCostInfo.p2Calls} 次 (約 {estCostInfo.estOutputP2?.toLocaleString()} tokens)</span>
                        </div>
                        <div className="cost-details-row">
                          <span>費率 ($10.00 / 1M tokens)</span>
                          <span>${estCostInfo.outputCost?.toFixed(6)} USD</span>
                        </div>

                        <div className="cost-details-row cost-details-divider">
                          <span>總預估 Token</span>
                          <span className="cost-details-highlight">{((estCostInfo.estInputTokens || 0) + (estCostInfo.estOutputTokens || 0)).toLocaleString()} tokens</span>
                        </div>
                        <div className="cost-details-row">
                          <span>計算公式 (In + Out)</span>
                          <span>${estCostInfo.inputCost?.toFixed(4)} + ${estCostInfo.outputCost?.toFixed(4)}</span>
                        </div>
                        <div className="cost-details-row">
                          <span>匯率參考 (TWD/USD)</span>
                          <span>32.5</span>
                        </div>
                      </div>
                    )}

                    <button className="btn-global btn-copy-all" style={{ marginTop: '5px' }} onClick={runAIGeneration}>
                      <span>🚀 確認呼叫 AI 開始整理</span>
                    </button>
                  </div>
                )}

                <button className="btn-global btn-back" onClick={goBackToHome}>
                  <span>← 返回輸入其他網址</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Manual Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">📁 手動匯入字幕</h2>
              <button className="btn-close-modal" onClick={() => setShowImportModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">影片標題 (選填)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="請輸入影片標題，例如：機器學習基礎課程"
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">字幕內容 (支援 VTT, SRT, JSON 或純文字段落/單行)</label>
                <textarea
                  className="form-textarea"
                  placeholder="請在此貼上字幕內容..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-global btn-back"
                style={{ width: 'auto', padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
                onClick={() => setShowImportModal(false)}
              >
                取消
              </button>
              <button
                className="btn-global btn-lock-changes"
                style={{ width: 'auto', padding: '10px 24px', borderRadius: 'var(--radius-md)' }}
                onClick={handleManualImport}
              >
                確認匯入
              </button>
            </div>
          </div>
        </div>
      )}

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
