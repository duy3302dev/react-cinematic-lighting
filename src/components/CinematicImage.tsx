import React, { useRef, CSSProperties, ImgHTMLAttributes } from 'react';
import { useCinematicLighting } from '../hooks';
import type { CinematicLightingOptions } from '../types';
import { rgbToCss } from '../utils';

export interface CinematicImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'style'> {
  /**
   * Cinematic lighting options
   */
  lightingOptions?: CinematicLightingOptions;

  /**
   * Custom styles for the container
   */
  containerStyle?: CSSProperties;

  /**
   * Custom styles for the image element
   */
  imageStyle?: CSSProperties;

  /**
   * Class name for the container
   */
  containerClassName?: string;

  /**
   * Class name for the image element
   */
  imageClassName?: string;

  /**
   * Whether to show the lighting effect
   */
  showLighting?: boolean;
}

/**
 * Image component with cinematic ambient lighting
 */
export const CinematicImage = React.forwardRef<HTMLImageElement, CinematicImageProps>(
  (
    {
      lightingOptions = {},
      containerStyle = {},
      imageStyle = {},
      containerClassName = '',
      imageClassName = '',
      showLighting = true,
      ...imageProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLImageElement>(null);
    const imageRef = (forwardedRef as React.RefObject<HTMLImageElement>) || internalRef;

    const { colors, isActive } = useCinematicLighting(imageRef, {
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
        <img
          ref={imageRef}
          className={imageClassName}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            ...imageStyle,
            ...lightingStyle,
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          {...imageProps}
        />
      </div>
    );
  }
);

CinematicImage.displayName = 'CinematicImage';
