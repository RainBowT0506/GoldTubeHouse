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
 * It shows the video title, duration, ID, and thumbnail image. Clicking the thumbnail
 * prompts the user to download the image.
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

  const handleThumbnailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!videoData.thumbnail) return;
    if (window.confirm('是否下載此影片縮圖？')) {
      handleDownload();
    }
  };

  return (
    <div className="sidebar-card video-card">
      <div className="video-thumb">
        <a
          href={`https://www.youtube.com/watch?v=${videoData.video_id}`}
          onClick={handleThumbnailClick}
          title="點擊下載影片縮圖"
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
