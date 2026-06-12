import React from 'react';

interface AIBlock {
  title: string;
  content: string;
  status: 'loading' | 'done' | 'error';
  text: string;
  currentTitle?: string;
  fullChapters?: string;
}

interface AINotesTabProps {
  aiNotesResult: AIBlock[];
  collapsedNotes: Set<string>;
  toggleCollapseNote: (title: string) => void;
  retryNoteBlock: (block: AIBlock) => void;
  copyTextToClipboard: (text: string) => void;
  showToast: (msg: string) => void;
  expandAllNotes: () => void;
  collapseAllNotes: () => void;
  copyAllAINotes: () => void;
}

export const AINotesTab: React.FC<AINotesTabProps> = ({
  aiNotesResult,
  collapsedNotes,
  toggleCollapseNote,
  retryNoteBlock,
  copyTextToClipboard,
  showToast,
  expandAllNotes,
  collapseAllNotes,
  copyAllAINotes
}) => {
  return (
    <div className="tab-content active">
      <div className="panel-header">
        <h2 className="panel-title">重點整理筆記</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-copy" onClick={expandAllNotes}>
            展開全部
          </button>
          <button className="btn-copy" onClick={collapseAllNotes}>
            收合全部
          </button>
          <button className="btn-copy btn-copy-highlight" onClick={copyAllAINotes}>
            複製全部筆記
          </button>
        </div>
      </div>
      <div className="ai-result-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {aiNotesResult.map((item, idx) => {
          const isCollapsed = collapsedNotes.has(item.title);
          return (
            <div key={idx} style={{ 
              background: 'rgba(255,255,255,0.01)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px', 
              padding: isCollapsed ? '12px 20px' : '20px',
              transition: 'all 0.2s ease'
            }}>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.05)', 
                  paddingBottom: isCollapsed ? '0' : '10px'
                }}
                onClick={() => toggleCollapseNote(item.title)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '11px', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                    ▶
                  </span>
                  <h3 style={{ color: 'var(--primary)', fontSize: '15px', fontWeight: 600, margin: 0 }}>{item.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
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
              {!isCollapsed && (
                <div style={{ marginTop: '15px' }}>
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AINotesTab;
