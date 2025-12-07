import React, { useRef, useEffect, useState } from 'react';
import { useCinematicLighting, youtubePreset } from 'react-cinematic-lighting';

/**
 * Example: Custom video player using the useCinematicLighting hook
 */
export function CustomVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { colors, isActive } = useCinematicLighting(videoRef, youtubePreset);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const boxShadowStyle = colors
    ? `0 0 ${youtubePreset.blurRadius}px ${youtubePreset.spread}px rgba(${Math.round(colors.dominantColor.r)}, ${Math.round(colors.dominantColor.g)}, ${Math.round(colors.dominantColor.b)}, ${youtubePreset.opacity})`
    : 'none';

  return (
    <div style={{ 
      background: '#0f0f0f', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          style={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: boxShadowStyle,
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          onClick={togglePlay}
        />
        
        <div style={{ marginTop: '2rem', color: '#fff' }}>
          <button
            onClick={togglePlay}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              background: '#ff0000',
              color: '#fff',
              cursor: 'pointer',
              marginBottom: '1rem',
              width: '100%',
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          {isActive && colors && (
            <div style={{
              background: '#282828',
              padding: '1.5rem',
              borderRadius: '8px',
            }}>
              <h3 style={{ marginTop: 0 }}>Extracted Colors</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.7 }}>
                    Dominant Color
                  </p>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      background: `rgb(${Math.round(colors.dominantColor.r)}, ${Math.round(colors.dominantColor.g)}, ${Math.round(colors.dominantColor.b)})`,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    rgb({Math.round(colors.dominantColor.r)}, {Math.round(colors.dominantColor.g)}, {Math.round(colors.dominantColor.b)})
                  </p>
                </div>

                {colors.accentColors.slice(0, 3).map((color, i) => (
                  <div key={i}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.7 }}>
                      Accent {i + 1}
                    </p>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        background: `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      rgb({Math.round(color.r)}, {Math.round(color.g)}, {Math.round(color.b)})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomVideoPlayer;
