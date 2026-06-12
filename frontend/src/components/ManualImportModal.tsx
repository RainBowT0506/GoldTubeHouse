import React from 'react';

interface ManualImportModalProps {
  show: boolean;
  onClose: () => void;
  importTitle: string;
  setImportTitle: (val: string) => void;
  importText: string;
  setImportText: (val: string) => void;
  handleManualImport: () => void;
}

export const ManualImportModal: React.FC<ManualImportModalProps> = ({
  show,
  onClose,
  importTitle,
  setImportTitle,
  importText,
  setImportText,
  handleManualImport
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📁 手動匯入字幕</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
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
            style={{ width: 'auto', padding: '10px 24px', borderRadius: 'var(--radius-md)' }}
            onClick={onClose}
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
  );
};
export default ManualImportModal;
