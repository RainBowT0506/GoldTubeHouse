import React from 'react';
import type { Segment } from '../utils';
import { formatTime } from '../utils';
import SegmentCard from './SegmentCard';

interface RenderingAIGroup {
  id: string;
  start: number;
  end: number;
  title: string;
  items: Segment[];
}

interface EditSegmentsTabProps {
  segmentsCount: number;
  renderingAIGroups: RenderingAIGroup[];
  collapsedChapters: Set<string>;
  toggleChapterCollapse: (key: string) => void;
  copyEntireChapter: (group: Segment) => void;
  removedBoundaryTimes: number[];
  handleMergeWithNext: (nextChapterStartTime: number) => void;
  editedSegmentTexts: Record<string, string>;
  copySegmentText: (segId: string, segment: Segment, withHeader: boolean) => void;
  handleSegmentTextChange: (segId: string, text: string) => void;
  handleSegmentKeydown: (event: React.KeyboardEvent<HTMLDivElement>, seg: Segment) => void;
  collapsedAIGroups: Set<string>;
  toggleAIGroupCollapse: (key: string) => void;
}

export const EditSegmentsTab: React.FC<EditSegmentsTabProps> = ({
  segmentsCount,
  renderingAIGroups,
  collapsedChapters,
  toggleChapterCollapse,
  copyEntireChapter,
  removedBoundaryTimes,
  handleMergeWithNext,
  editedSegmentTexts,
  copySegmentText,
  handleSegmentTextChange,
  handleSegmentKeydown,
  collapsedAIGroups,
  toggleAIGroupCollapse
}) => {
  return (
    <div className="tab-content active">
      <div className="panel-header">
        <h2 className="panel-title">
          <span>字幕分段區塊</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 'normal',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.04)',
              padding: '4px 10px',
              borderRadius: '20px'
            }}
          >
            {segmentsCount} 個區塊
          </span>
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '500' }}>
          💡 您可點選任意卡片內容，在句號後按 Enter 鍵進行手動段落切分
        </span>
      </div>

      <div className="subtitle-scroll-area">
        {renderingAIGroups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            無分段資料，請確認字幕下載正確。
          </div>
        ) : (
          renderingAIGroups.map((group, groupIdx) => {
            const nextGroup = groupIdx + 1 < renderingAIGroups.length ? renderingAIGroups[groupIdx + 1] : null;

            const renderGroupItem = (item: Segment, idxInGroup: number, groupItems: Segment[]) => {
              const nextItemInGroup = idxInGroup + 1 < groupItems.length ? groupItems[idxInGroup + 1] : null;

              if (item.isGroup) {
                const groupKey = `group_ch_${item.start}_${item.chapterTitle}`;
                const isCollapsed = collapsedChapters.has(groupKey);
                return (
                  <React.Fragment key={groupKey}>
                    <div className="chapter-group">
                      <div
                        className="chapter-group-header"
                        onClick={() => toggleChapterCollapse(groupKey)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="chapter-group-title">
                          <span className="collapse-arrow">{isCollapsed ? '▶' : '▼'}</span>
                          📁 <span># {item.chapterTitle}</span>
                        </div>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <span className="chapter-group-time">
                            {formatTime(item.start)} ~ {formatTime(item.end)}
                          </span>
                          {!isCollapsed && (
                            <button className="btn-copy-group" onClick={() => copyEntireChapter(item)}>
                              複製整章
                            </button>
                          )}
                        </div>
                      </div>
                      {!isCollapsed && item.subSegments?.map((subSeg, subIdx) => {
                        const subSegs = item.subSegments || [];
                        const isLastSub = subIdx === subSegs.length - 1;
                        const subSegId = subSeg.id || '';
                        return (
                          <React.Fragment key={subSeg.id || `sub_${subIdx}`}>
                            <SegmentCard
                              seg={subSeg}
                              isSub={true}
                              editedText={editedSegmentTexts[subSegId]}
                              copySegmentText={copySegmentText}
                              handleSegmentTextChange={handleSegmentTextChange}
                              handleSegmentKeydown={handleSegmentKeydown}
                            />
                            {!isLastSub && subSegs[subIdx + 1] && (() => {
                              const isMerged = removedBoundaryTimes.includes(subSegs[subIdx + 1].start);
                              return (
                                <div className={`merge-btn-row subsegment-merge ${isMerged ? 'merged-ai' : ''}`}>
                                  <div className="merge-line" />
                                  <button
                                    className={`btn-merge-next btn-merge-sub ${isMerged ? 'merged' : ''}`}
                                    onClick={() => handleMergeWithNext(subSegs[subIdx + 1].start)}
                                    title={isMerged ? "取消合併此子段落" : "合併此子段落與下一段 (AI 整合)"}
                                  >
                                    {isMerged ? '⊖ 取消 AI 整合' : '⊕ 合併子段落'}
                                  </button>
                                  <div className="merge-line" />
                                </div>
                              );
                            })()}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    {nextItemInGroup && nextItemInGroup.isGroup && (() => {
                      const isMerged = removedBoundaryTimes.includes(nextItemInGroup.start);
                      return (
                        <div className={`merge-btn-row ${isMerged ? 'merged-ai' : ''}`}>
                          <div className="merge-line" />
                          <button
                            className={`btn-merge-next ${isMerged ? 'merged' : ''}`}
                            onClick={() => handleMergeWithNext(nextItemInGroup.start)}
                            title={isMerged ? `取消合併「${item.chapterTitle}」與「${nextItemInGroup.chapterTitle}」` : `合併「${item.chapterTitle}」與「${nextItemInGroup.chapterTitle}」 (AI 整合)`}
                          >
                            {isMerged ? '⊖ 取消 AI 整合' : '⊕ 合併此章節 (AI 整合)'}
                          </button>
                          <div className="merge-line" />
                        </div>
                      );
                    })()}
                  </React.Fragment>
                );
              } else {
                const segId = item.id || '';
                return (
                  <SegmentCard
                    key={segId}
                    seg={item}
                    isSub={false}
                    editedText={editedSegmentTexts[segId]}
                    copySegmentText={copySegmentText}
                    handleSegmentTextChange={handleSegmentTextChange}
                    handleSegmentKeydown={handleSegmentKeydown}
                  />
                );
              }
            };

            const isMergedGroup = group.items.length > 1;
            const isGroupCollapsed = collapsedAIGroups.has(group.id);

            return (
              <React.Fragment key={group.id}>
                {isMergedGroup ? (
                  <div className="ai-merged-group-container">
                    <div
                      className="ai-merged-group-header"
                      onClick={() => toggleAIGroupCollapse(group.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="ai-merged-group-title">
                        <span className="collapse-arrow">{isGroupCollapsed ? '▶' : '▼'}</span>
                        <span>🧠 AI 整合區間 ({group.items.length} 個章節)</span>
                      </div>
                      <span className="ai-merged-group-time">
                        {formatTime(group.start)} ~ {formatTime(group.end)}
                      </span>
                    </div>
                    {!isGroupCollapsed && (
                      <div className="ai-merged-group-content">
                        {group.items.map((item, idx) => renderGroupItem(item, idx, group.items))}
                      </div>
                    )}
                  </div>
                ) : (
                  renderGroupItem(group.items[0], 0, group.items)
                )}

                {/* 渲染此 AI 群組與下一個 AI 群組之間的合併邊界按鈕 */}
                {nextGroup && (() => {
                  const lastItemOfCurrent = group.items[group.items.length - 1];
                  const firstItemOfNext = nextGroup.items[0];
                  if (lastItemOfCurrent.isGroup && firstItemOfNext.isGroup) {
                    const isMerged = removedBoundaryTimes.includes(firstItemOfNext.start);
                    return (
                      <div className={`merge-btn-row ${isMerged ? 'merged-ai' : ''}`}>
                        <div className="merge-line" />
                        <button
                          className={`btn-merge-next ${isMerged ? 'merged' : ''}`}
                          onClick={() => handleMergeWithNext(firstItemOfNext.start)}
                          title={isMerged ? `取消合併「${lastItemOfCurrent.chapterTitle}」與「${firstItemOfNext.chapterTitle}」` : `合併「${lastItemOfCurrent.chapterTitle}」與「${firstItemOfNext.chapterTitle}」 (AI 整合)`}
                        >
                          {isMerged ? '⊖ 取消 AI 整合' : '⊕ 合併此章節 (AI 整合)'}
                        </button>
                        <div className="merge-line" />
                      </div>
                    );
                  }
                  return null;
                })()}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EditSegmentsTab;
