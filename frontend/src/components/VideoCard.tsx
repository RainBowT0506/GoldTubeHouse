import React from 'react';
import { formatTime } from '../utils';

/**
 * Props for the VideoCard component.
 */
interface VideoCardProps {
  videoData: {
    video_id: string;               // YouTube Video ID (used to generate YouTube links and thumbnails)
    title: string;                  // Title of the YouTube video
    thumbnail?: string;             // Optional thumbnail image URL
    duration: number;               // Total duration in seconds
    channel?: string;               // Optional channel name
  };
}

/**
 * VideoCard component displays details of the selected YouTube video in the sidebar.
 * It shows the video title, duration, ID, and thumbnail image, which links directly to the YouTube video.
 */
export const VideoCard: React.FC<VideoCardProps> = ({ videoData }) => {
  const handleDownload = async () => {
    if (!videoData.thumbnail) return;

    // Use proxy-image endpoint to avoid CORS issues
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(videoData.thumbnail)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Get file extension from content-type or thumbnail url
      let ext = 'jpg';
      if (videoData.thumbnail.toLowerCase().endsWith('.png')) ext = 'png';
      else if (videoData.thumbnail.toLowerCase().endsWith('.webp')) ext = 'webp';

      const channelName = videoData.channel || '未知頻道';
      const videoTitle = videoData.title || '未命名影片';

      // Sanitize filename: replace invalid characters like \ / : * ? " < > | with _
      const filename = `${channelName}：${videoTitle}.${ext}`.replace(/[\\/:*?"<>|]/g, '_');

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Proxy download failed, fallback to direct tab open', error);
      window.open(videoData.thumbnail, '_blank');
    }
  };

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
        {videoData.thumbnail && (
          <button className="btn-download-thumb" onClick={handleDownload} title="下載影片縮圖">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '4px', verticalAlign: 'middle' }}
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path>
            </svg>
            下載圖片
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
