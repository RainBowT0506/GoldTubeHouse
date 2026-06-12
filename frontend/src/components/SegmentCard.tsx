import React from 'react';
import type { Segment } from '../utils';
import { cleanAndJoinSubtitles } from '../utils';

export const EditableSegmentText = ({
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

interface SegmentCardProps {
  seg: Segment;
  isSub: boolean;
  editedText?: string;
  copySegmentText: (segId: string, segment: Segment, withHeader: boolean) => void;
  handleSegmentTextChange: (segId: string, text: string) => void;
  handleSegmentKeydown: (event: React.KeyboardEvent<HTMLDivElement>, seg: Segment) => void;
}

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
export default SegmentCard;
