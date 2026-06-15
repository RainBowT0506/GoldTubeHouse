import React from 'react';
import { formatTime } from '../utils';

/**
 * Props for the VideoCard component.
 */
interface VideoCardProps {
  videoData: {
    video_id: string;               // YouTube Video ID or playlist ID
    title: string;                  // Title of the YouTube video or playlist
    thumbnail?: string;             // Optional thumbnail image URL
    duration: number;               // Total duration in seconds
    channel?: string;               // Optional channel name
    is_playlist?: boolean;          // Optional playlist flag
    videos?: Array<{
      video_id: string;
      title: string;
      thumbnail?: string;
      duration: number;
    }>;
  };
}

/**
 * VideoCard component displays details of the selected YouTube video or playlist in the sidebar.
 * It shows the title, duration, and thumbnail image. Clicking the thumbnail
 * prompts the user to download the image.
 */
export const VideoCard: React.FC<VideoCardProps> = ({ videoData }) => {
  const isPlaylist = !!videoData.is_playlist;
  const firstVideo = videoData.videos && videoData.videos.length > 0 ? videoData.videos[0] : null;
  
  // Use first video's thumbnail for playlists if root thumbnail is missing/placeholder
  const thumbnailToUse = videoData.thumbnail || (firstVideo ? firstVideo.thumbnail : '') || 'https://via.placeholder.com/120x90';
  
  const handleDownload = async () => {
    if (!thumbnailToUse) return;

    // Use proxy-image endpoint to avoid CORS issues
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(thumbnailToUse)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Get file extension from content-type or thumbnail url
      let ext = 'jpg';
      if (thumbnailToUse.toLowerCase().endsWith('.png')) ext = 'png';
      else if (thumbnailToUse.toLowerCase().endsWith('.webp')) ext = 'webp';

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
      window.open(thumbnailToUse, '_blank');
    }
  };

  const handleThumbnailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!thumbnailToUse) return;
    if (window.confirm('是否下載此影片縮圖？')) {
      handleDownload();
    }
  };

  // Link to the first video watch page or the video itself
  const firstVideoId = firstVideo ? firstVideo.video_id : videoData.video_id;
  const youtubeUrl = isPlaylist
    ? (firstVideo ? `https://www.youtube.com/watch?v=${firstVideoId}` : '#')
    : `https://www.youtube.com/watch?v=${videoData.video_id}`;

  return (
    <div className="sidebar-card video-card">
      <div className="video-thumb">
        <a
          href={youtubeUrl}
          onClick={youtubeUrl !== '#' ? handleThumbnailClick : undefined}
          title="點擊下載影片縮圖"
          style={{ cursor: youtubeUrl !== '#' ? 'pointer' : 'default' }}
        >
          <img src={thumbnailToUse} alt="影片縮圖" />
        </a>
      </div>
      <div className="video-detail">
        <h3 className="video-title" title={videoData.title}>
          {videoData.title}
        </h3>
        {videoData.channel && (
          <div className="video-channel" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📺</span> <span>{videoData.channel}</span>
          </div>
        )}
        <div className="video-meta">
          <span>長度：{formatTime(videoData.duration)}</span>
          {isPlaylist ? (
            <span>播放清單 ({videoData.videos?.length || 0} 部影片)</span>
          ) : (
            <span>Video ID: {videoData.video_id}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
