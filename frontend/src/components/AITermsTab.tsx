import React from 'react';

/**
 * AIBlock represents a segment of AI-generated content (notes or terms).
 */
interface AIBlock {
  title: string;        // The segment/chapter range title
  content: string;      // Markdown content returned from the AI
  status: 'loading' | 'done' | 'error'; // Loading status of this block
  text: string;         // Raw subtitle text used for this generation
  currentTitle?: string;
  fullChapters?: string;
  groupIndex?: number;
}

/**
 * Props for the AITermsTabProps component.
 */
interface AITermsTabProps {
  aiTermsResult: AIBlock[];                               // Array of AI terms blocks
  collapsedTerms: Set<string>;                            // Set of term titles that are collapsed in the UI
  toggleCollapseTerm: (title: string) => void;           // Callback to toggle collapse state for a terms block
  retryTermsBlock: (block: AIBlock) => void;              // Callback to retry generation for a failed terms block
  copyTextToClipboard: (text: string) => void;            // Helper to copy text to clipboard
  showToast: (msg: string) => void;                       // Callback to display a status toast message
  expandAllTerms: () => void;                             // Callback to expand all terms
  collapseAllTerms: () => void;                           // Callback to collapse all terms
  copyAllAITerms: () => void;                             // Callback to copy all terms combined
}

/**
 * AITermsTab component renders the AI-generated professional terms table.
 * It features bulk actions (expand, collapse, copy all) and individual block
 * collapse/expand, copy, and retry controls.
 */
export const AITermsTab: React.FC<AITermsTabProps> = ({
  aiTermsResult,
  collapsedTerms,
  toggleCollapseTerm,
  retryTermsBlock,
  copyTextToClipboard,
  showToast,
  expandAllTerms,
  collapseAllTerms,
  copyAllAITerms
}) => {
  return (
    <div className="tab-content active">
      <div className="panel-header">
        <h2 className="panel-title">專業術語對照表</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-copy" onClick={expandAllTerms}>
            展開全部
          </button>
          <button className="btn-copy" onClick={collapseAllTerms}>
            收合全部
          </button>
          <button className="btn-copy btn-copy-highlight" onClick={copyAllAITerms}>
            複製全部術語
          </button>
        </div>
      </div>
      <div className="ai-result-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {aiTermsResult.map((item, idx) => {
          const isCollapsed = collapsedTerms.has(item.title);
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
                onClick={() => toggleCollapseTerm(item.title)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981', fontSize: '11px', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                    ▶
                  </span>
                  <h3 style={{ color: '#10b981', fontSize: '15px', fontWeight: 600, margin: 0 }}>{item.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
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
              {!isCollapsed && (
                <div style={{ marginTop: '15px' }}>
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AITermsTab;
