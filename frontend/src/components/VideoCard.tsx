import React from 'react';
import { formatTime } from '../utils';

interface VideoCardProps {
  videoData: {
    video_id: string;
    title: string;
    thumbnail?: string;
    duration: number;
  };
}

export const VideoCard: React.FC<VideoCardProps> = ({ videoData }) => {
  return (
    <div className="sidebar-card video-card">
      <div className="video-thumb">
        <a
          href={`https://www.youtube.com/watch?v=${videoData.video_id}`}
          target="_blank"
          rel="noreferrer"
          title="在新分頁開啟影片"
        >
          <img src={videoData.thumbnail || 'https://via.placeholder.com/120x90'} alt="影片縮圖" />
        </a>
      </div>
      <div className="video-detail">
        <h3 className="video-title" title={videoData.title}>
          {videoData.title}
        </h3>
        <div className="video-meta">
          <span>長度：{formatTime(videoData.duration)}</span>
          <span>Video ID: {videoData.video_id}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
