import React from 'react';

/**
 * Props for the LoadingScreen component.
 */
interface LoadingScreenProps {
  loadingText: string;  // Detailed status description to display during processing
}

/**
 * LoadingScreen component displays an animated loading spinner (with a TV emoji inside)
 * and status text during background API tasks (e.g. video processing/subtitle fetching).
 */
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
