import React from 'react';

/**
 * Props for the ChaptersInput component.
 */
interface ChaptersInputProps {
  chaptersInput: string;            // The raw multiline string of chapters pasted by the user
  setChaptersInput: (val: string) => void; // State setter to update the raw chapters string
  applyChapters: () => void;         // Callback to parse and apply the chapters into splits
  clearChapters: () => void;         // Callback to clear the input and reset parsed chapters
}

/**
 * ChaptersInput component provides a textarea in the sidebar where users can paste
 * YouTube-style chapter timestamps (e.g. "00:00:00 Intro") to define semantic boundaries.
 */
export const ChaptersInput: React.FC<ChaptersInputProps> = ({
  chaptersInput,
  setChaptersInput,
  applyChapters,
  clearChapters
}) => {
  return (
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
  );
};

export default ChaptersInput;
