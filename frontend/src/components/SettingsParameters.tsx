import React from 'react';

interface SettingsParametersProps {
  settingsInterval: number;
  setSettingsInterval: (val: number) => void;
  setPresetInterval: (val: number) => void;
  settingsNoSegment: number;
  setSettingsNoSegment: (val: number) => void;
  settingsSubSegment: number;
  setSettingsSubSegment: (val: number) => void;
}

export const SettingsParameters: React.FC<SettingsParametersProps> = ({
  settingsInterval,
  setSettingsInterval,
  setPresetInterval,
  settingsNoSegment,
  setSettingsNoSegment,
  settingsSubSegment,
  setSettingsSubSegment
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
        分段參數微調
      </h4>
      <div className="settings-grid">
        <div>
          <div className="settings-item">
            <span className="settings-name">自訂分段區間 (預設 20分)</span>
            <div className="settings-control">
              <input
                type="number"
                className="settings-input"
                value={settingsInterval}
                min={1}
                max={180}
                onChange={(e) => setSettingsInterval(Math.max(1, Number(e.target.value)))}
              />
              <span className="settings-unit">分</span>
            </div>
          </div>
          <div className="presets">
            {[5, 10, 15, 20, 30].map((m) => (
              <button
                key={m}
                className={`btn-preset ${settingsInterval === m ? 'active' : ''}`}
                onClick={() => setPresetInterval(m)}
              >
                {m}分
              </button>
            ))}
          </div>
        </div>

        <div className="settings-item">
          <span className="settings-name">直接顯示門檻</span>
          <div className="settings-control">
            <input
              type="number"
              className="settings-input"
              value={settingsNoSegment}
              min={5}
              max={120}
              onChange={(e) => setSettingsNoSegment(Math.max(5, Number(e.target.value)))}
            />
            <span className="settings-unit">分</span>
          </div>
        </div>

        <div className="settings-item">
          <span className="settings-name">超長章節細分門檻</span>
          <div className="settings-control">
            <input
              type="number"
              className="settings-input"
              value={settingsSubSegment}
              min={5}
              max={120}
              onChange={(e) => setSettingsSubSegment(Math.max(5, Number(e.target.value)))}
            />
            <span className="settings-unit">分</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsParameters;
