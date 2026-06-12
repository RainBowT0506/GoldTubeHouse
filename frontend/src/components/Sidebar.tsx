import React from 'react';
import type { Segment } from '../utils';

import VideoCard from './VideoCard';
import OpenAISettings from './OpenAISettings';
import ChaptersInput from './ChaptersInput';
import RangeMerging from './RangeMerging';
import SettingsParameters from './SettingsParameters';
import CostEstimation from './CostEstimation';

interface SidebarProps {
  videoData: any;
  openaiKey: string;
  setOpenaiKey: (val: string) => void;
  hasEnvKey: boolean;
  loadEnvKey: () => void;
  chaptersInput: string;
  setChaptersInput: (val: string) => void;
  applyChapters: () => void;
  clearChapters: () => void;
  flatActiveSegments: Segment[];
  batchStartIdx: number;
  setBatchStartIdx: (val: number) => void;
  batchEndIdx: number;
  setBatchEndIdx: (val: number) => void;
  rangeOptions: { index: number; time: number; label: string }[];
  handleBatchMerge: () => void;
  handleBatchSplit: () => void;
  settingsInterval: number;
  setSettingsInterval: (val: number) => void;
  setPresetInterval: (val: number) => void;
  settingsNoSegment: number;
  setSettingsNoSegment: (val: number) => void;
  settingsSubSegment: number;
  setSettingsSubSegment: (val: number) => void;
  lockAndEstimateCost: () => void;
  showCostEstimation: boolean;
  estCostInfo: any;
  showCostDetails: boolean;
  setShowCostDetails: (val: boolean) => void;
  runAIGeneration: () => void;
  goBackToHome: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  videoData,
  openaiKey,
  setOpenaiKey,
  hasEnvKey,
  loadEnvKey,
  chaptersInput,
  setChaptersInput,
  applyChapters,
  clearChapters,
  flatActiveSegments,
  batchStartIdx,
  setBatchStartIdx,
  batchEndIdx,
  setBatchEndIdx,
  rangeOptions,
  handleBatchMerge,
  handleBatchSplit,
  settingsInterval,
  setSettingsInterval,
  setPresetInterval,
  settingsNoSegment,
  setSettingsNoSegment,
  settingsSubSegment,
  setSettingsSubSegment,
  lockAndEstimateCost,
  showCostEstimation,
  estCostInfo,
  showCostDetails,
  setShowCostDetails,
  runAIGeneration,
  goBackToHome
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-scroll-area">
        {/* Video Info Card */}
        <VideoCard videoData={videoData} />

        {/* OpenAI API Settings Card */}
        <OpenAISettings
          openaiKey={openaiKey}
          setOpenaiKey={setOpenaiKey}
          hasEnvKey={hasEnvKey}
          loadEnvKey={loadEnvKey}
        />

        {/* Chapters Input Card */}
        <ChaptersInput
          chaptersInput={chaptersInput}
          setChaptersInput={setChaptersInput}
          applyChapters={applyChapters}
          clearChapters={clearChapters}
        />

        {/* Range Merging Card */}
        <RangeMerging
          flatActiveSegmentsCount={flatActiveSegments.length}
          batchStartIdx={batchStartIdx}
          setBatchStartIdx={setBatchStartIdx}
          batchEndIdx={batchEndIdx}
          setBatchEndIdx={setBatchEndIdx}
          rangeOptions={rangeOptions}
          handleBatchMerge={handleBatchMerge}
          handleBatchSplit={handleBatchSplit}
        />

        {/* Settings Parameter Card */}
        <SettingsParameters
          settingsInterval={settingsInterval}
          setSettingsInterval={setSettingsInterval}
          setPresetInterval={setPresetInterval}
          settingsNoSegment={settingsNoSegment}
          setSettingsNoSegment={setSettingsNoSegment}
          settingsSubSegment={settingsSubSegment}
          setSettingsSubSegment={setSettingsSubSegment}
        />
      </div>

      {/* Sidebar Footer Operations */}
      <div className="sidebar-footer">
        <CostEstimation
          showCostEstimation={showCostEstimation}
          estCostInfo={estCostInfo}
          showCostDetails={showCostDetails}
          setShowCostDetails={setShowCostDetails}
          runAIGeneration={runAIGeneration}
          lockAndEstimateCost={lockAndEstimateCost}
        />

        <button className="btn-global btn-back" onClick={goBackToHome}>
          <span>← 返回輸入其他網址</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
