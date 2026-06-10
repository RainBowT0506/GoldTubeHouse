import React, { useState, useEffect, useMemo } from 'react';
import type { ChapterSplit, Segment } from './utils';
import {
  parseTimeToSeconds,
  formatTime,
  cleanAndJoinSubtitles,
  generateSegments
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

function App() {
  // --- States ---
  const [screen, setScreen] = useState<'home' | 'loading' | 'app'>(() => {
    return (localStorage.getItem('gth_screen') as any) || 'home';
  });
  const [loadingText, setLoadingText] = useState<string>('正在載入，請稍候...');
  const [ytUrl, setYtUrl] = useState<string>(() => {
    return localStorage.getItem('gth_ytUrl') || 'https://www.youtube.com/watch?v=2GZ2SNXWK-c';
  });
  const [videoData, setVideoData] = useState<any | null>(() => {
    const data = localStorage.getItem('gth_videoData');
    return data ? JSON.parse(data) : null;
  });
  const [chaptersInput, setChaptersInput] = useState<string>(() => {
    return localStorage.getItem('gth_chaptersInput') || `00:00:00 Introduction
00:01:25 The n8n basics
01:11:41 Foundational concepts
03:11:09 Javascript functions
05:04:47 Setting up self-hosting
05:28:07 Comparing n8n vs make & which to use when
05:55:27 Outro`;
  });
  const [userCustomSplits, setUserCustomSplits] = useState<ChapterSplit[]>(() => {
    const data = localStorage.getItem('gth_userCustomSplits');
    return data ? JSON.parse(data) : [];
  });
  const [editedSegmentTexts, setEditedSegmentTexts] = useState<Record<string, string>>(() => {
    const data = localStorage.getItem('gth_editedSegmentTexts');
    return data ? JSON.parse(data) : {};
  });
  const [aiNotesResult, setAiNotesResult] = useState<any[] | null>(() => {
    const data = localStorage.getItem('gth_aiNotesResult');
    return data ? JSON.parse(data) : null;
  });
  const [aiTermsResult, setAiTermsResult] = useState<string | null>(() => {
    return localStorage.getItem('gth_aiTermsResult') || null;
  });
  const [openaiKey, setOpenaiKey] = useState<string>(() => {
    return localStorage.getItem('gth_openaiKey') || localStorage.getItem('openai_api_key') || '';
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'notes' | 'term'>(() => {
    return (localStorage.getItem('gth_activeTab') as any) || 'edit';
  });
  const [settingsInterval, setSettingsInterval] = useState<number>(() => {
    return Number(localStorage.getItem('gth_settingsInterval')) || 20;
  });
  const [settingsNoSegment, setSettingsNoSegment] = useState<number>(() => {
    return Number(localStorage.getItem('gth_settingsNoSegment')) || 20;
  });
  const [settingsSubSegment, setSettingsSubSegment] = useState<number>(() => {
    return Number(localStorage.getItem('gth_settingsSubSegment')) || 20;
  });
  const [showCostEstimation, setShowCostEstimation] = useState<boolean>(() => {
    return localStorage.getItem('gth_showCostEstimation') === 'true';
  });
  const [hasEnvKey, setHasEnvKey] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

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
    localStorage.setItem('gth_ytUrl', ytUrl);
  }, [ytUrl]);

  useEffect(() => {
    if (videoData) {
      localStorage.setItem('gth_videoData', JSON.stringify(videoData));
    } else {
      localStorage.removeItem('gth_videoData');
    }
  }, [videoData]);

  useEffect(() => {
    localStorage.setItem('gth_chaptersInput', chaptersInput);
  }, [chaptersInput]);

  useEffect(() => {
    localStorage.setItem('gth_userCustomSplits', JSON.stringify(userCustomSplits));
  }, [userCustomSplits]);

  useEffect(() => {
    localStorage.setItem('gth_editedSegmentTexts', JSON.stringify(editedSegmentTexts));
  }, [editedSegmentTexts]);

  useEffect(() => {
    if (aiNotesResult) {
      localStorage.setItem('gth_aiNotesResult', JSON.stringify(aiNotesResult));
    } else {
      localStorage.removeItem('gth_aiNotesResult');
    }
  }, [aiNotesResult]);

  useEffect(() => {
    if (aiTermsResult) {
      localStorage.setItem('gth_aiTermsResult', aiTermsResult);
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

  const combinedSplits = useMemo<ChapterSplit[]>(() => {
    const combined = [...parsedChapters];
    userCustomSplits.forEach((custom) => {
      if (!combined.some((s) => Math.abs(s.time - custom.time) < 5)) {
        combined.push(custom);
      }
    });
    combined.sort((a, b) => a.time - b.time);
    return combined;
  }, [parsedChapters, userCustomSplits]);

  const currentSegments = useMemo<Segment[]>(() => {
    if (!videoData || !videoData.subtitles) return [];
    return generateSegments(
      videoData.subtitles,
      videoData.duration,
      combinedSplits,
      settingsInterval * 60,
      settingsNoSegment * 60,
      settingsSubSegment * 60
    );
  }, [videoData, combinedSplits, settingsInterval, settingsNoSegment, settingsSubSegment]);

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
        });
      } else {
        totalSegmentsCount++;
        const segId = seg.id || '';
        const text =
          editedSegmentTexts[segId] !== undefined
            ? editedSegmentTexts[segId]
            : cleanAndJoinSubtitles(seg.subtitles);
        totalChars += text.length;
      }
    });

    const estInputTokens = Math.ceil(totalChars * 1.2);
    const estOutputP1 = totalSegmentsCount * 500;
    const estOutputP2 = Math.ceil(totalSegmentsCount / 3) * 800;
    const estOutputTokens = estOutputP1 + estOutputP2;

    const inputCost = (estInputTokens / 1000000) * 1.25; // fixed gpt-5.1 rates
    const outputCost = (estOutputTokens / 1000000) * 10.0;
    const totalCost = inputCost + outputCost;

    return {
      segments: totalSegmentsCount,
      chars: totalChars,
      costUSD: totalCost,
      costTWD: totalCost * 32.5
    };
  }, [currentSegments, editedSegmentTexts]);

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

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setUserCustomSplits([]);
        setEditedSegmentTexts({});
        setAiNotesResult(null);
        setAiTermsResult(null);
        setActiveTab('edit');
        setShowCostEstimation(false);

        setVideoData(result);
        setScreen('app');
      } else {
        throw new Error(result.message || '無法下載或處理該影片。請確認網址，且該影片有提供字幕。');
      }
    } catch (err: any) {
      setScreen('home');
      alert(err.message || '發生未知錯誤，請重試。');
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
    } else {
      setChaptersInput('');
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
    showToast('已清除章節與自訂切分點。');
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

      let currentOffset = 0;
      let splitTime = seg.start;

      for (const entry of seg.subtitles) {
        const entryText = entry.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() + ' ';
        currentOffset += entryText.length;
        if (currentOffset >= caretOffset) {
          splitTime = entry.start;
          break;
        }
      }

      const distanceFromStart = splitTime - seg.start;
      if (distanceFromStart < 300) {
        showToast('⚠️ 分割出的前半段需大於 5 分鐘，已自動合併。');
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

  const lockAndEstimateCost = () => {
    setShowCostEstimation(true);
    showToast('🔒 已鎖定當前段落，請於右側查看 API 費用預估！');
  };

  const runAIGeneration = async () => {
    if (!openaiKey.trim()) {
      alert('請填寫您的 OpenAI API Key！');
      return;
    }

    const segmentsPayload: any[] = [];
    currentSegments.forEach((seg) => {
      if (seg.isGroup && seg.subSegments) {
        seg.subSegments.forEach((sub) => {
          const segId = sub.id || '';
          const text =
            editedSegmentTexts[segId] !== undefined
              ? editedSegmentTexts[segId]
              : cleanAndJoinSubtitles(sub.subtitles);
          segmentsPayload.push({
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
        segmentsPayload.push({
          title: `${seg.chapterTitle} (${seg.subTitle})`,
          text: text,
          start: seg.start,
          end: seg.end
        });
      }
    });

    setScreen('loading');
    setLoadingText('正在呼叫 OpenAI API 生成筆記與術語中，這可能需要幾十秒至一分鐘，請稍候...');

    try {
      const response = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: openaiKey,
          model: 'gpt-5.1', // fixed model
          segments: segmentsPayload
        })
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setAiNotesResult(result.notes);
        setAiTermsResult(result.terminologies);
        setScreen('app');
        setActiveTab('notes');
        showToast('🎉 AI 筆記整理與術語對照表已生成完畢！');
      } else {
        throw new Error(result.message || '呼叫 AI 失敗，請確認 API 金鑰是否有效且餘額充足。');
      }
    } catch (err: any) {
      setScreen('app');
      alert(err.message || '呼叫 AI 整理時發生錯誤。');
    }
  };

  const copyAllAINotes = () => {
    if (!aiNotesResult) return;
    let fullNotesMarkdown = '';
    aiNotesResult.forEach((item) => {
      fullNotesMarkdown += `# ${item.title}\n\n${item.content}\n\n---\n\n`;
    });
    copyTextToClipboard(fullNotesMarkdown);
    showToast('已複製全部 AI 重點整理筆記！');
  };

  const copyAllAITerms = () => {
    if (!aiTermsResult) return;
    copyTextToClipboard(aiTermsResult);
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
                          return (
                            <div className="chapter-group" key={`group_${index}`}>
                              <div className="chapter-group-header">
                                <div className="chapter-group-title">
                                  📁 <span># {item.chapterTitle}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span className="chapter-group-time">
                                    {formatTime(item.start)} ~ {formatTime(item.end)}
                                  </span>
                                  <button className="btn-copy-group" onClick={() => copyEntireChapter(item)}>
                                    複製整章
                                  </button>
                                </div>
                              </div>
                              {item.subSegments?.map((subSeg) => renderSegmentCard(subSeg, true))}
                            </div>
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
                  <div className="ai-result-area">
                    {aiNotesResult
                      .map((item) => `# ${item.title}\n\n${item.content}`)
                      .join('\n\n---\n\n')}
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
                  <div className="ai-result-area">{aiTermsResult}</div>
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
                            color: '#60a5fa',
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
                          color: '#60a5fa',
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
