import React from 'react';
import { formatTime } from '../utils';
import type { Segment } from '../utils';

interface RangeOption {
  index: number;
  time: number;
  label: string;
}

interface RangeMergingProps {
  flatActiveSegmentsCount: number;
  batchStartIdx: number;
  setBatchStartIdx: (val: number) => void;
  batchEndIdx: number;
  setBatchEndIdx: (val: number) => void;
  rangeOptions: RangeOption[];
  handleBatchMerge: () => void;
  handleBatchSplit: () => void;
  removedBoundaryTimes: number[];
  flatActiveSegments: Segment[];
  handleSplitSpecificRange: (startIdx: number, endIdx: number) => void;
}

export const RangeMerging: React.FC<RangeMergingProps> = ({
  flatActiveSegmentsCount,
  batchStartIdx,
  setBatchStartIdx,
  batchEndIdx,
  setBatchEndIdx,
  rangeOptions,
  handleBatchMerge,
  handleBatchSplit,
  removedBoundaryTimes,
  flatActiveSegments,
  handleSplitSpecificRange
}) => {
  if (flatActiveSegmentsCount === 0) return null;

  // Find contiguous merged ranges
  const mergedRanges = React.useMemo(() => {
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

  return (
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
        🔗 AI 整合範圍合併
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* 已合併整合區間清單 */}
        {mergedRanges.length > 0 && (
          <div
            style={{
              marginBottom: '5px',
              padding: '10px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🧠 已合併的 AI 整合區間 ({mergedRanges.length} 次)</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                maxHeight: '130px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}
            >
              {mergedRanges.map((range, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <span
                    style={{
                      cursor: 'pointer',
                      color: 'var(--text)',
                      textDecoration: 'underline',
                      fontWeight: 500,
                      maxWidth: '130px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => {
                      setBatchStartIdx(range.startIdx);
                      setBatchEndIdx(range.endIdx);
                    }}
                    title="點擊以在下方選取此區間"
                  >
                    ⏱️ {range.label} ({range.count} 區塊)
                  </span>
                  <button
                    style={{
                      padding: '2px 6px',
                      fontSize: '10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSplitSpecificRange(range.startIdx, range.endIdx)}
                  >
                    拆分 🔓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            起始區塊
          </label>
          <select
            className="settings-input"
            style={{ width: '100%', height: '32px', background: 'rgba(255,255,255,0.02)', color: 'var(--text)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 8px' }}
            value={batchStartIdx}
            onChange={(e) => setBatchStartIdx(Number(e.target.value))}
          >
            {rangeOptions.map((opt) => {
              const isInterior = opt.index > 0 && removedBoundaryTimes.includes(opt.time);
              return (
                <option
                  key={opt.index}
                  value={opt.index}
                  disabled={isInterior}
                  style={{
                    background: '#1c1c1e',
                    color: isInterior ? '#666' : '#fff'
                  }}
                >
                  {isInterior ? `[已合併] ${opt.label}` : opt.label}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            結束區塊
          </label>
          <select
            className="settings-input"
            style={{ width: '100%', height: '32px', background: 'rgba(255,255,255,0.02)', color: 'var(--text)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 8px' }}
            value={batchEndIdx}
            onChange={(e) => setBatchEndIdx(Number(e.target.value))}
          >
            {rangeOptions.map((opt) => {
              const isInterior = opt.index > 0 && removedBoundaryTimes.includes(opt.time);
              return (
                <option
                  key={opt.index}
                  value={opt.index}
                  disabled={isInterior}
                  style={{
                    background: '#1c1c1e',
                    color: isInterior ? '#666' : '#fff'
                  }}
                >
                  {isInterior ? `[已合併] ${opt.label}` : opt.label}
                </option>
              );
            })}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          <button
            className="btn-action btn-apply"
            style={{ flex: 1, height: '32px', padding: '0 8px' }}
            onClick={handleBatchMerge}
          >
            🔗 範圍合併
          </button>
          <button
            className="btn-action btn-clear"
            style={{ flex: 1, height: '32px', padding: '0 8px', borderColor: 'var(--accent)', color: 'var(--accent)' }}
            onClick={handleBatchSplit}
          >
            🔓 範圍拆分
          </button>
        </div>
      </div>
    </div>
  );
};

export default RangeMerging;
