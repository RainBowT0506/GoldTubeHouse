import React from 'react';
import type { Segment } from '../utils';
import { cleanAndJoinSubtitles } from '../utils';

/**
 * EditableSegmentText component renders a div with `contentEditable` to allow direct subtitle editing.
 */
export const EditableSegmentText = ({
  initialText,
  onBlur,
  onKeydown
}: {
  segId: string;                    // Unique identifier of the segment being edited
  initialText: string;              // Initial/saved subtitle text
  onBlur: (text: string) => void;   // Callback when focus is lost, committing the changes
  onKeydown: (event: React.KeyboardEvent<HTMLDivElement>) => void; // Keyboard event handler (captures Enter)
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

/**
 * Props for the SegmentCard component.
 */
interface SegmentCardProps {
  seg: Segment;                                           // The Segment object containing time, title, and subtitles list
  isSub: boolean;                                         // True if this card is a sub-segment (subdivision of a chapter)
  editedText?: string;                                    // Optional user-edited text override
  copySegmentText: (segId: string, segment: Segment, withHeader: boolean) => void; // Callback to copy text
  handleSegmentTextChange: (segId: string, text: string) => void; // Callback to save text changes
  handleSegmentKeydown: (event: React.KeyboardEvent<HTMLDivElement>, seg: Segment) => void; // Keydown handler
}

/**
 * SegmentCard component displays a single subtitle block.
 * Renders the segment header (title, actions to copy subtitles) and the editable body text.
 */
export const SegmentCard: React.FC<SegmentCardProps> = ({
  seg,
  isSub,
  editedText,
  copySegmentText,
  handleSegmentTextChange,
  handleSegmentKeydown
}) => {
  const segId = seg.id || '';
  const initialText = cleanAndJoinSubtitles(seg.subtitles);
  const textToShow = editedText !== undefined ? editedText : initialText;

  const isLoading = textToShow.includes('⏳ 正在下載字幕');

  return (
    <div className={`segment-card ${isSub ? 'subsegment' : ''} ${isLoading ? 'loading-card' : ''}`} key={segId} id={segId}>
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
        {!isLoading && (
          <div className="segment-actions">
            <button className="btn-copy btn-copy-highlight" onClick={() => copySegmentText(segId, seg, false)}>
              <span>僅複製字幕</span>
            </button>
            <button className="btn-copy" onClick={() => copySegmentText(segId, seg, true)}>
              <span>複製標題與字幕</span>
            </button>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="segment-loading-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 0', color: 'var(--accent)' }}>
          <div className="loading-spinner-small" style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(223, 177, 91, 0.2)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'rotate 1.5s linear infinite'
          }} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>正在依序下載並加載此影片字幕...</span>
        </div>
      ) : (
        <EditableSegmentText
          segId={segId}
          initialText={textToShow}
          onBlur={(newVal) => handleSegmentTextChange(segId, newVal)}
          onKeydown={(e) => handleSegmentKeydown(e, seg)}
        />
      )}
    </div>
  );
};
export default SegmentCard;
