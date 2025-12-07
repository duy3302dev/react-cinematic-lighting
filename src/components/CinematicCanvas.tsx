import React, { useRef, CSSProperties, CanvasHTMLAttributes } from 'react';
import { useCinematicLighting } from '../hooks';
import type { CinematicLightingOptions } from '../types';
import { rgbToCss } from '../utils';

export interface CinematicCanvasProps extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'style'> {
  /**
   * Cinematic lighting options
   */
  lightingOptions?: CinematicLightingOptions;

  /**
   * Custom styles for the container
   */
  containerStyle?: CSSProperties;

  /**
   * Custom styles for the canvas element
   */
  canvasStyle?: CSSProperties;

  /**
   * Class name for the container
   */
  containerClassName?: string;

  /**
   * Class name for the canvas element
   */
  canvasClassName?: string;

  /**
   * Whether to show the lighting effect
   */
  showLighting?: boolean;

  /**
   * Callback to trigger manual color extraction
   * Useful for canvas content that updates programmatically
   */
  onExtractTrigger?: () => void;
}

/**
 * Canvas component with cinematic ambient lighting
 */
export const CinematicCanvas = React.forwardRef<HTMLCanvasElement, CinematicCanvasProps>(
  (
    {
      lightingOptions = {},
      containerStyle = {},
      canvasStyle = {},
      containerClassName = '',
      canvasClassName = '',
      showLighting = true,
      onExtractTrigger,
      children,
      ...canvasProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (forwardedRef as React.RefObject<HTMLCanvasElement>) || internalRef;

    const { colors, isActive, extract } = useCinematicLighting(canvasRef, {
      ...lightingOptions,
      enabled: showLighting && (lightingOptions.enabled ?? true),
    });

    // Expose extract function to parent
    React.useEffect(() => {
      if (onExtractTrigger) {
        onExtractTrigger();
      }
    }, [onExtractTrigger]);

    // Expose extract method via ref if needed
    React.useImperativeHandle(forwardedRef, () => ({
      ...canvasRef.current!,
      extractColors: extract,
    }));

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
        <canvas
          ref={canvasRef}
          className={canvasClassName}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            ...canvasStyle,
            ...lightingStyle,
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          {...canvasProps}
        >
          {children}
        </canvas>
      </div>
    );
  }
);

CinematicCanvas.displayName = 'CinematicCanvas';
