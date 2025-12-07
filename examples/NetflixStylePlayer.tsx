import React from 'react';
import { CinematicVideo, netflixPreset } from 'react-cinematic-lighting';

/**
 * Example: Netflix-style video player with ambient lighting
 */
export function NetflixStylePlayer() {
  return (
    <div style={{ 
      background: '#141414', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <CinematicVideo
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        lightingOptions={netflixPreset}
        controls
        containerStyle={{
          maxWidth: '1200px',
          width: '100%',
        }}
        videoStyle={{
          borderRadius: '4px',
        }}
      />
    </div>
  );
}

export default NetflixStylePlayer;
