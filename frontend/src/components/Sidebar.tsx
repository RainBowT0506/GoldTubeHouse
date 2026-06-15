import React from 'react';
import type { Segment } from '../utils';

import VideoCard from './VideoCard';
import OpenAISettings from './OpenAISettings';
import ChaptersInput from './ChaptersInput';
import RangeMerging from './RangeMerging';
import SettingsParameters from './SettingsParameters';
import CostEstimation from './CostEstimation';

/**
 * Props for the Sidebar component.
 */
interface SidebarProps {
  videoData: any;                     // YouTube video details (title, duration, ID, thumbnail)
  openaiKey: string;                 // The user-provided OpenAI API Key
  setOpenaiKey: (val: string) => void; // State setter to update the key
  hasEnvKey: boolean;                // Flag indicating if a key exists in the backend environment
  loadEnvKey: () => void;            // Callback to retrieve the key from backend .env
  chaptersInput: string;             // The raw multiline string of chapters pasted by the user
  setChaptersInput: (val: string) => void; // State setter for raw chapters string
  applyChapters: () => void;         // Callback to parse and apply chapters
  clearChapters: () => void;         // Callback to clear chapters
  flatActiveSegments: Segment[];     // Flattened array of all active segment objects
  batchStartIdx: number;             // State value for start index of range merge
  setBatchStartIdx: (val: number) => void; // Setter for start index
  batchEndIdx: number;               // State value for end index of range merge
  setBatchEndIdx: (val: number) => void; // Setter for end index
  rangeOptions: { index: number; time: number; label: string }[]; // Formatted options list for range selects
  handleBatchMerge: () => void;      // Callback to merge selected range of segments
  handleBatchSplit: () => void;      // Callback to split/reset selected range of segments
  settingsInterval: number;          // Default/Custom segment duration interval (minutes)
  setSettingsInterval: (val: number) => void; // State setter for segment interval
  setPresetInterval: (val: number) => void;    // Helper callback to select preset minutes
  settingsNoSegment: number;         // Threshold below which no automatic splitting occurs (minutes)
  setSettingsNoSegment: (val: number) => void; // State setter for direct-display threshold
  settingsSubSegment: number;        // Threshold above which long chapters are sub-segmented (minutes)
  setSettingsSubSegment: (val: number) => void; // State setter for sub-segment threshold
  lockAndEstimateCost: () => void;   // Callback to lock edits, sync to backend, and calculate cost
  showCostEstimation: boolean;       // Controls visibility of the cost estimation box
  estCostInfo: any;                  // Estimated cost statistics object (tokens, calls, USD/TWD cost)
  showCostDetails: boolean;          // Controls visibility of detailed cost breakdown
  setShowCostDetails: (val: boolean) => void; // Setter for showCostDetails
  runAIGeneration: () => void;       // Callback to proceed and run the AI pipeline
  goBackToHome: () => void;          // Callback to reset state and return to URL input home page
  removedBoundaryTimes: number[];    // Times (seconds) where chapter/subsegment boundaries were removed
  handleSplitSpecificRange: (startIdx: number, endIdx: number) => void; // Splits specific range
}

/**
 * Sidebar component acts as the container layout for all sidebar panels:
 * Video Info, API key settings, Chapters import, Range merging selector, and Parameters.
 * It also holds the final action footer (cost estimation & call AI buttons).
 */
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
  goBackToHome,
  removedBoundaryTimes,
  handleSplitSpecificRange
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
          videoData={videoData}
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
          removedBoundaryTimes={removedBoundaryTimes}
          flatActiveSegments={flatActiveSegments}
          handleSplitSpecificRange={handleSplitSpecificRange}
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
