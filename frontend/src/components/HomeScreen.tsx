import React from 'react';

interface HomeScreenProps {
  ytUrl: string;
  setYtUrl: (val: string) => void;
  handleUrlSubmit: () => void;
  setShowImportModal: (val: boolean) => void;
  useExample: (url: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  ytUrl,
  setYtUrl,
  handleUrlSubmit,
  setShowImportModal,
  useExample
}) => {
  return (
    <div id="home-screen">
      <h1 className="hero-title">YouTube 字幕分段整理工具</h1>
      <p className="hero-subtitle">
        貼上 YouTube 影片網址，即可極速取得字幕，並根據章節進行智慧分段。支援手動鍵盤 Enter
        調整切分點，並可呼叫 OpenAI API 一鍵生成結構化重點整理與專業術語對照。
      </p>

      <div className="input-group">
        <input
          type="text"
          className="url-input"
          placeholder="請貼上 YouTube 影片網址 (例如 https://www.youtube.com/watch?v=2GZ2SNXWK-c)"
          value={ytUrl}
          onChange={(e) => setYtUrl(e.target.value)}
        />
        <button className="btn-submit" onClick={handleUrlSubmit}>
          <span>開始處理</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '-10px', marginBottom: '25px', width: '100%' }}>
        <button
          className="btn-global btn-back"
          style={{ width: 'auto', padding: '10px 24px', borderRadius: 'var(--radius-md)' }}
          onClick={() => setShowImportModal(true)}
        >
          📁 手動匯入字幕 (VTT / SRT / JSON / 純文字)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px', alignSelf: 'center' }}>常用測試範例：</span>
        <span
          className="example-tag"
          onClick={() => useExample('https://www.youtube.com/watch?v=2GZ2SNXWK-c')}
        >
          n8n 自動化大師課 (長達 6 小時)
        </span>
        <span
          className="example-tag"
          onClick={() => useExample('https://www.youtube.com/watch?v=EH5jx5qPabU')}
        >
          n8n AI Agent 教學 (約 25 分)
        </span>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⌨️</div>
          <div className="feature-title">手動 Enter 快速切分</div>
          <div className="feature-desc">
            直接點擊文字卡片，在任意句點後按下 Enter 鍵，系統即會精準在該時間點進行段落分割，其後區段自動後移。
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <div className="feature-title">句點對齊智慧分段</div>
          <div className="feature-desc">
            無章節或大間隔自動分割時，自動抓取最接近 20 分鐘的句尾（句號），保持語意段落完整性。
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <div className="feature-title">OpenAI 自動筆記術語</div>
          <div className="feature-desc">
            自動串接 API 金鑰，一鍵為每個分段生成重點筆記，並每小時（3個分段）生成 50
            個專業詞彙的中英文對照與釋義。固定使用 gpt-5.1 引擎。
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
