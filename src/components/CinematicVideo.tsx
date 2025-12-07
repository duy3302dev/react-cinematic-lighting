import React, { useRef, CSSProperties, VideoHTMLAttributes } from 'react';
import { useCinematicLighting } from '../hooks';
import type { CinematicLightingOptions } from '../types';
import { rgbToCss } from '../utils';

export interface CinematicVideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'style'> {
  /**
   * Cinematic lighting options
   */
  lightingOptions?: CinematicLightingOptions;

  /**
   * Custom styles for the container
   */
  containerStyle?: CSSProperties;

  /**
   * Custom styles for the video element
   */
  videoStyle?: CSSProperties;

  /**
   * Class name for the container
   */
  containerClassName?: string;

  /**
   * Class name for the video element
   */
  videoClassName?: string;

  /**
   * Whether to show the lighting effect
   */
  showLighting?: boolean;
}

/**
 * Video component with cinematic ambient lighting
 */
export const CinematicVideo = React.forwardRef<HTMLVideoElement, CinematicVideoProps>(
  (
    {
      lightingOptions = {},
      containerStyle = {},
      videoStyle = {},
      containerClassName = '',
      videoClassName = '',
      showLighting = true,
      children,
      ...videoProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const videoRef = (forwardedRef as React.RefObject<HTMLVideoElement>) || internalRef;

    const { colors, isActive } = useCinematicLighting(videoRef, {
      ...lightingOptions,
      enabled: showLighting && (lightingOptions.enabled ?? true),
    });

    const lightingStyle: CSSProperties = {};

    if (showLighting && isActive && colors) {
      const { blurRadius = 100, opacity = 0.5, spread = 50 } = lightingOptions;
      const color = colors.dominantColor;
      const colorStr = rgbToCss({ ...color, alpha: opacity });

      lightingStyle.boxShadow = `0 0 ${blurRadius}px ${spread}px ${colorStr}`;
    }

    return (
      <div
        className={containerClassName}
        style={{
          position: 'relative',
          display: 'inline-block',
          ...containerStyle,
        }}
      >
        <video
          ref={videoRef}
          className={videoClassName}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            ...videoStyle,
            ...lightingStyle,
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          {...videoProps}
        >
          {children}
        </video>
      </div>
    );
  }
);

CinematicVideo.displayName = 'CinematicVideo';
