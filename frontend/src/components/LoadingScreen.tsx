import React from 'react';

interface LoadingScreenProps {
  loadingText: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ loadingText }) => {
  return (
    <div id="loading-screen">
      <div className="spinner-container">
        <div className="spinner-glow"></div>
        <div className="spinner-core">📺</div>
      </div>
      <h2 className="loading-title">正在處理中</h2>
      <p className="loading-subtitle">{loadingText}</p>
    </div>
  );
};
export default LoadingScreen;
