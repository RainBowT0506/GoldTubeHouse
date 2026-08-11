import React from 'react';

/**
 * Props for the ManualImportModal component.
 */
interface ManualImportModalProps {
  show: boolean;                     // Determines if the modal is currently open
  onClose: () => void;               // Callback to close the modal
  importTitle: string;               // State value of the imported video title
  setImportTitle: (val: string) => void; // State setter for imported title
  importText: string;                // State value of the raw subtitle text to import
  setImportText: (val: string) => void;  // State setter for imported subtitle text
  importYtUrl: string;               // YouTube URL for thumbnail/download reference
  setImportYtUrl: (val: string) => void; // Setter for importYtUrl
  importMode: 'single' | 'playlist';  // Handling mode for '#' lines
  setImportMode: (val: 'single' | 'playlist') => void; // Setter for importMode
  handleManualImport: (files?: FileList | null) => void;    // Callback to process and parse the text into subtitles
}

/**
 * ManualImportModal component renders a pop-up overlay modal.
 * It allows users to manually import subtitle text in VTT, SRT, JSON, or plain text formats,
 * bypassing the need for a YouTube URL download.
 */
export const ManualImportModal: React.FC<ManualImportModalProps> = ({
  show,
  onClose,
  importTitle,
  setImportTitle,
  importText,
  setImportText,
  importYtUrl,
  setImportYtUrl,
  importMode,
  setImportMode,
  handleManualImport
}) => {
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);

  if (!show) return null;

  const handleConfirm = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      handleManualImport(selectedFiles);
    } else {
      handleManualImport(null);
    }
    setSelectedFiles(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📁 手動匯入字幕 / 影片清單</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {/* File input for playlist/batch mode */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>
              📂 選擇多個字幕檔案 (支援多選 VTT / SRT / JSON) - 播放清單模式
            </label>
            <input
              type="file"
              multiple
              accept=".vtt,.srt,.json"
              className="form-input"
              style={{
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(223, 177, 91, 0.3)',
                borderRadius: '8px',
                width: '100%',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
              💡 可多選多個字幕檔。系統將自動以「檔案名稱」做為影片名稱，依時長序偏移時間軸，建立虛擬播放清單。
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ padding: '0 15px', fontWeight: '500' }}>或直接貼上字幕內容</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

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
            <label className="form-label">YouTube 影片連結 (選填，可關聯影片以取得並下載縮圖)</label>
            <input
              type="text"
              className="form-input"
              placeholder="請貼上 YouTube 影片連結，例如：https://www.youtube.com/watch?v=..."
              value={importYtUrl}
              onChange={(e) => setImportYtUrl(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>段落/章節處理模式</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'single'}
                  onChange={() => setImportMode('single')}
                />
                <span>單一影片 (自動將 # 行轉為章節，無時間戳文本適用)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'playlist'}
                  onChange={() => setImportMode('playlist')}
                />
                <span>播放清單 (以 # 行切割為多部影片)</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              字幕內容 (支援 VTT, SRT, JSON 或純文字。若選單一影片模式，貼上 `# 標題` 即會自動在該處建立章節)
            </label>
            <textarea
              className="form-textarea"
              placeholder={`單影片範例：
# 01 - 開場介紹
好，首先呢很高興大家來...

# 02 - 重點工具
第一個工具是過去我們參考文獻...`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              style={{ minHeight: '160px' }}
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
            onClick={handleConfirm}
          >
            確認匯入
          </button>
        </div>
      </div>
    </div>
  );
};
export default ManualImportModal;
