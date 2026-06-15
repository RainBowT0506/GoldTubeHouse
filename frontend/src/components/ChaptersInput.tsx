import React from 'react';

/**
 * Props for the ChaptersInput component.
 */
interface ChaptersInputProps {
  chaptersInput: string;            // The raw multiline string of chapters pasted by the user
  setChaptersInput: (val: string) => void; // State setter to update the raw chapters string
  applyChapters: () => void;         // Callback to parse and apply the chapters into splits
  clearChapters: () => void;         // Callback to clear the input and reset parsed chapters
  videoData: any;                    // The videoData structure containing playlist videos
}

/**
 * ChaptersInput component provides a textarea in the sidebar where users can paste
 * YouTube-style chapter timestamps to define semantic boundaries.
 * In playlist mode, it allows selecting specific videos to paste chapters relative to 00:00,
 * automatically computing time offsets to prevent conflicts.
 */
export const ChaptersInput: React.FC<ChaptersInputProps> = ({
  chaptersInput,
  setChaptersInput,
  applyChapters,
  clearChapters,
  videoData
}) => {
  const [selectedVideoId, setSelectedVideoId] = React.useState<string>('global');
  const [localChapters, setLocalChapters] = React.useState<Record<string, string>>({});

  const isPlaylist = !!(videoData?.is_playlist && videoData?.videos);

  // Sync global chaptersInput down to local video chapters
  React.useEffect(() => {
    if (!isPlaylist || !videoData?.videos) return;

    let currentOffset = 0;
    const videoRanges = videoData.videos.map((v: any) => {
      const offset = currentOffset;
      const duration = v.duration || 600;
      currentOffset += duration;
      return { video_id: v.video_id, title: v.title, start: offset, end: offset + duration };
    });

    const parsedLocal: Record<string, string[]> = {};
    videoRanges.forEach((vr: any) => {
      parsedLocal[vr.video_id] = [];
    });

    const lines = chaptersInput.split('\n').map(l => l.trim()).filter(Boolean);
    const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/;

    const parseTimeToSeconds = (timeStr: string): number => {
      const parts = timeStr.split(':').map(Number);
      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      }
      return 0;
    };

    const formatSecondsToHHMMSS = (seconds: number): string => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      const pad = (num: number) => String(num).padStart(2, '0');
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    lines.forEach(line => {
      const match = line.match(timeRegex);
      if (match) {
        const timeStr = match[1];
        const seconds = parseTimeToSeconds(timeStr);
        const vr = videoRanges.find((r: any) => seconds >= r.start && seconds < r.end);
        if (vr) {
          const localSec = seconds - vr.start;
          const localTimeStr = formatSecondsToHHMMSS(localSec);
          let title = line.replace(timeStr, '').trim();
          
          // Clean prefixes like "[Video Title]" or "Video Title"
          const escapedTitle = vr.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const prefixRegex = new RegExp(`^\\s*\\[?${escapedTitle}\\]?\\s*[-–—]?\\s*`, 'i');
          title = title.replace(prefixRegex, '').trim();

          // Keep it if it has an actual sub-chapter title
          if (title && title.toLowerCase() !== vr.title.toLowerCase()) {
            parsedLocal[vr.video_id].push(`${localTimeStr} ${title}`);
          }
        }
      }
    });

    const newLocalChapters: Record<string, string> = {};
    Object.keys(parsedLocal).forEach(vid => {
      newLocalChapters[vid] = parsedLocal[vid].join('\n');
    });

    setLocalChapters(newLocalChapters);
  }, [chaptersInput, videoData, isPlaylist]);

  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const formatSecondsToHHMMSS = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const applyVideoChapters = (videoId: string, rawText: string) => {
    let currentOffset = 0;
    let targetVideo: any = null;
    
    (videoData?.videos || []).forEach((v: any) => {
      const offset = currentOffset;
      const duration = v.duration || 600;
      if (v.video_id === videoId) {
        targetVideo = { ...v, offset, duration };
      }
      currentOffset += duration;
    });

    if (!targetVideo) return;

    const startOffset = targetVideo.offset;
    const endOffset = targetVideo.offset + targetVideo.duration;

    const currentLines = chaptersInput.split('\n').map(l => l.trim()).filter(Boolean);
    const otherLines: { seconds: number; line: string }[] = [];
    const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/;

    currentLines.forEach(line => {
      const match = line.match(timeRegex);
      if (match) {
        const timeStr = match[1];
        const seconds = parseTimeToSeconds(timeStr);
        if (seconds < startOffset || seconds >= endOffset) {
          otherLines.push({ seconds, line });
        }
      } else {
        otherLines.push({ seconds: 0, line });
      }
    });

    const newLocalLines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const newOffsettedLines: { seconds: number; line: string }[] = [];

    newLocalLines.forEach(line => {
      const match = line.match(timeRegex);
      if (match) {
        const timeStr = match[1];
        const localSec = parseTimeToSeconds(timeStr);
        const globalSec = localSec + startOffset;
        const globalTimeStr = formatSecondsToHHMMSS(globalSec);
        let title = line.replace(timeStr, '').replace(/^\s*[-–—]\s*/, '').trim();
        if (!title) title = `章節`;
        
        const formattedLine = `${globalTimeStr} [${targetVideo.title}] ${title}`;
        newOffsettedLines.push({ seconds: globalSec, line: formattedLine });
      }
    });

    if (newOffsettedLines.length === 0) {
      const globalTimeStr = formatSecondsToHHMMSS(startOffset);
      newOffsettedLines.push({
        seconds: startOffset,
        line: `${globalTimeStr} ${targetVideo.title}`
      });
    }

    const allLinesObj = [...otherLines, ...newOffsettedLines];
    allLinesObj.sort((a, b) => a.seconds - b.seconds);

    const finalChaptersText = allLinesObj.map(o => o.line).join('\n');
    setChaptersInput(finalChaptersText);

    setTimeout(() => {
      applyChapters();
    }, 50);
  };

  const handleApply = () => {
    if (selectedVideoId === 'global') {
      applyChapters();
    } else {
      applyVideoChapters(selectedVideoId, localChapters[selectedVideoId] || '');
    }
  };

  const handleClear = () => {
    if (selectedVideoId === 'global') {
      clearChapters();
      setLocalChapters({});
    } else {
      setLocalChapters(prev => ({ ...prev, [selectedVideoId]: '' }));
      applyVideoChapters(selectedVideoId, '');
    }
  };

  const handleTextareaChange = (val: string) => {
    if (selectedVideoId === 'global') {
      setChaptersInput(val);
    } else {
      setLocalChapters(prev => ({ ...prev, [selectedVideoId]: val }));
    }
  };

  const getTextAreaValue = () => {
    if (selectedVideoId === 'global') {
      return chaptersInput;
    }
    return localChapters[selectedVideoId] || '';
  };

  return (
    <div className="sidebar-card">
      <div className="chapters-label">
        <span>貼上影片章節 (Chapters)</span>
        <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--text-muted)' }}>
          可留空以使用時間間隔
        </span>
      </div>

      {isPlaylist && (
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            編輯特定影片的內部章節
          </label>
          <select
            className="settings-input"
            style={{
              width: '100%',
              height: '32px',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--text)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0 8px',
              fontSize: '12px',
              outline: 'none'
            }}
            value={selectedVideoId}
            onChange={(e) => setSelectedVideoId(e.target.value)}
          >
            <option value="global" style={{ background: '#1c1c1e', color: '#fff' }}>
              📋 全域時間軸 (合併編輯)
            </option>
            {(videoData?.videos || []).map((v: any, idx: number) => (
              <option key={v.video_id} value={v.video_id} style={{ background: '#1c1c1e', color: '#fff' }}>
                🎥 影片 {idx + 1}: {v.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <textarea
        className="chapters-textarea"
        placeholder={
          selectedVideoId === 'global'
            ? `格式範例：
00:00:00 Introduction
00:01:25 The n8n basics
01:11:41 Foundational concepts`
            : `請貼上此影片專屬章節 (從 00:00 開始)：
00:00 Intro
01:30 Setup
05:00 Coding`
        }
        value={getTextAreaValue()}
        onChange={(e) => handleTextareaChange(e.target.value)}
      />

      <div className="chapters-actions">
        <button className="btn-action btn-apply" onClick={handleApply}>
          <span>套用章節</span>
        </button>
        <button className="btn-action btn-clear" onClick={handleClear}>
          <span>清除</span>
        </button>
      </div>
    </div>
  );
};

export default ChaptersInput;
