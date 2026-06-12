import React from 'react';

/**
 * Props for the OpenAISettings component.
 */
interface OpenAISettingsProps {
  openaiKey: string;                 // The user-provided OpenAI API Key
  setOpenaiKey: (val: string) => void; // State setter to update the key
  hasEnvKey: boolean;                // Flag indicating if a key exists in the backend environment
  loadEnvKey: () => void;            // Callback to retrieve the key from the backend environment
}

/**
 * OpenAISettings component renders the OpenAI API key input field in the sidebar.
 * It provides a quick-import button if a key is detected in the backend .env file,
 * and indicates that the target model is fixed to "gpt-5.1".
 */
export const OpenAISettings: React.FC<OpenAISettingsProps> = ({
  openaiKey,
  setOpenaiKey,
  hasEnvKey,
  loadEnvKey
}) => {
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
        OpenAI API 設定
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            API Key
          </label>
          <input
            type="password"
            className="settings-input"
            style={{ width: '100%', textAlign: 'left', height: '32px' }}
            placeholder="貼上 sk-...金鑰"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
          />
          {hasEnvKey && (
            <div
              style={{
                fontSize: '11px',
                marginTop: '5px',
                color: 'var(--primary)',
                cursor: 'pointer',
                lineHeight: '1.4'
              }}
              onClick={loadEnvKey}
            >
              💡 偵測到本地環境中有 API Key [點此引入]
            </div>
          )}
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            使用模型
          </label>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--primary)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🧠</span>
            <span>gpt-5.1 (已固定為此模型)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAISettings;
