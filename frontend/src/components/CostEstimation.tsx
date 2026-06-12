import React from 'react';

interface CostEstimationProps {
  showCostEstimation: boolean;
  estCostInfo: {
    segments: number;
    chars: number;
    costUSD: number;
    costTWD: number;
    videoDuration: number;
    p1Calls: number;
    p2Calls: number;
    estInputTokens: number;
    estOutputP1: number;
    estOutputP2: number;
    estOutputTokens: number;
    inputCost: number;
    outputCost: number;
  };
  showCostDetails: boolean;
  setShowCostDetails: (val: boolean) => void;
  runAIGeneration: () => void;
  lockAndEstimateCost: () => void;
}

export const CostEstimation: React.FC<CostEstimationProps> = ({
  showCostEstimation,
  estCostInfo,
  showCostDetails,
  setShowCostDetails,
  runAIGeneration,
  lockAndEstimateCost
}) => {
  return (
    <>
      <button className="btn-global btn-lock-changes" onClick={lockAndEstimateCost}>
        <span>🔒 鎖定分段並預估 API 費用</span>
      </button>

      {showCostEstimation && (
        <div className="cost-box">
          <div className="cost-title">
            <span>📊 API 費用估算 (gpt-5.1)</span>
          </div>
          <div className="cost-row">
            <span>總段落數</span>
            <span>{estCostInfo.segments} 個</span>
          </div>
          <div className="cost-row">
            <span>總文字長度</span>
            <span>{estCostInfo.chars.toLocaleString()} 字</span>
          </div>
          <div className="cost-row">
            <span>預估費用 (USD)</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              ${estCostInfo.costUSD.toFixed(4)} USD (約台幣 {estCostInfo.costTWD.toFixed(2)} 元)
            </span>
          </div>

          <div className="cost-details-toggle" onClick={() => setShowCostDetails(!showCostDetails)}>
            <span>{showCostDetails ? '▲ 收起詳細計算過程' : '▼ 展開詳細計算過程'}</span>
          </div>

          {showCostDetails && (
            <div className="cost-details-content">
              <div className="cost-details-section-title">輸入計費 (Input):</div>
              <div className="cost-details-row">
                <span>預估 Token 數 (字數 × 1.2)</span>
                <span className="cost-details-highlight">{estCostInfo.estInputTokens?.toLocaleString()} tokens</span>
              </div>
              <div className="cost-details-row">
                <span>費率 ($1.25 / 1M tokens)</span>
                <span>${estCostInfo.inputCost?.toFixed(6)} USD</span>
              </div>

              <div className="cost-details-section-title">輸出計費 (Output):</div>
              <div className="cost-details-row">
                <span>影片長度 / 段落區間</span>
                <span>{((estCostInfo.videoDuration || 0) / 60).toFixed(1)} 分鐘</span>
              </div>
              <div className="cost-details-row">
                <span>筆記次數 (每個段落)</span>
                <span>{estCostInfo.p1Calls} 次 (約 {estCostInfo.estOutputP1?.toLocaleString()} tokens)</span>
              </div>
              <div className="cost-details-row">
                <span>術語次數 (每 60 分鐘)</span>
                <span>{estCostInfo.p2Calls} 次 (約 {estCostInfo.estOutputP2?.toLocaleString()} tokens)</span>
              </div>
              <div className="cost-details-row">
                <span>費率 ($10.00 / 1M tokens)</span>
                <span>${estCostInfo.outputCost?.toFixed(6)} USD</span>
              </div>

              <div className="cost-details-row cost-details-divider">
                <span>總預估 Token</span>
                <span className="cost-details-highlight">{((estCostInfo.estInputTokens || 0) + (estCostInfo.estOutputTokens || 0)).toLocaleString()} tokens</span>
              </div>
              <div className="cost-details-row">
                <span>計算公式 (In + Out)</span>
                <span>${estCostInfo.inputCost?.toFixed(4)} + ${estCostInfo.outputCost?.toFixed(4)}</span>
              </div>
              <div className="cost-details-row">
                <span>計算匯率 (TWD/USD)</span>
                <span>32.5</span>
              </div>
            </div>
          )}

          <button className="btn-global btn-copy-all" style={{ marginTop: '5px' }} onClick={runAIGeneration}>
            <span>🚀 確認呼叫 AI 開始整理</span>
          </button>
        </div>
      )}
    </>
  );
};

export default CostEstimation;
