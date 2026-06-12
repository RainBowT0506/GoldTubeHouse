import React from 'react';

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
}

export const RangeMerging: React.FC<RangeMergingProps> = ({
  flatActiveSegmentsCount,
  batchStartIdx,
  setBatchStartIdx,
  batchEndIdx,
  setBatchEndIdx,
  rangeOptions,
  handleBatchMerge,
  handleBatchSplit
}) => {
  if (flatActiveSegmentsCount === 0) return null;

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
            {rangeOptions.map((opt) => (
              <option key={opt.index} value={opt.index} style={{ background: '#1c1c1e', color: '#fff' }}>
                {opt.label}
              </option>
            ))}
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
            {rangeOptions.map((opt) => (
              <option key={opt.index} value={opt.index} style={{ background: '#1c1c1e', color: '#fff' }}>
                {opt.label}
              </option>
            ))}
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
