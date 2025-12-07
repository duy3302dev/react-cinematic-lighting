import React from 'react';
import { CinematicImage, subtlePreset } from 'react-cinematic-lighting';

/**
 * Example: Image gallery with subtle ambient glow
 */
export function ImageGallery() {
  const images = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
    'https://picsum.photos/400/300?random=5',
    'https://picsum.photos/400/300?random=6',
  ];

  return (
    <div style={{ 
      background: '#1a1a1a', 
      minHeight: '100vh',
      padding: '3rem',
    }}>
      <h1 style={{ 
        color: '#fff', 
        textAlign: 'center', 
        marginBottom: '3rem',
        fontSize: '2.5rem',
      }}>
        Cinematic Image Gallery
      </h1>
      <div style={{ 
        display: 'grid', 
        gap: '3rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {images.map((src, i) => (
          <CinematicImage
            key={i}
            src={src}
            alt={`Gallery image ${i + 1}`}
            lightingOptions={subtlePreset}
            containerStyle={{
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
