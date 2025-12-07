# react-cinematic-lighting

A TypeScript-first React library for cinematic lighting effects—automatically extract colors from videos, images, canvases, and components to create ambient glows.

## ✨ Features

- 🎨 **Real-time Color Extraction** - Extract dominant and accent colors from media elements
- ⚛️ **React Hooks API** - Easy-to-use hooks for custom implementations
- 🧩 **Wrapper Components** - Drop-in components for Video, Image, and Canvas
- 🎭 **Preset Effects** - Pre-configured styles (YouTube, Netflix, and more)
- 🚀 **Zero Dependencies** - No external dependencies (except React peer dependency)
- ⚡ **Performance Optimized** - FPS control and pixel sampling optimization
- 📦 **TypeScript First** - Full TypeScript support with type definitions
- 🎯 **Lightweight** - Small bundle size (~8KB minified)

## 📦 Installation

```bash
npm install react-cinematic-lighting
```

```bash
yarn add react-cinematic-lighting
```

```bash
pnpm add react-cinematic-lighting
```

## 🚀 Quick Start

### Using Wrapper Components

The easiest way to add cinematic lighting to your media elements:

```tsx
import { CinematicVideo, netflixPreset } from 'react-cinematic-lighting';

function App() {
  return (
    <CinematicVideo
      src="video.mp4"
      lightingOptions={netflixPreset}
      controls
    />
  );
}
```

### Using React Hook

For more control, use the `useCinematicLighting` hook:

```tsx
import { useRef } from 'react';
import { useCinematicLighting, youtubePreset } from 'react-cinematic-lighting';

function CustomVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { colors, isActive } = useCinematicLighting(videoRef, youtubePreset);

  return (
    <div>
      <video
        ref={videoRef}
        src="video.mp4"
        controls
        style={{
          boxShadow: colors 
            ? `0 0 ${youtubePreset.blurRadius}px ${youtubePreset.spread}px rgba(${colors.dominantColor.r}, ${colors.dominantColor.g}, ${colors.dominantColor.b}, ${youtubePreset.opacity})`
            : 'none'
        }}
      />
      {isActive && (
        <div>
          Dominant Color: rgb({Math.round(colors.dominantColor.r)}, {Math.round(colors.dominantColor.g)}, {Math.round(colors.dominantColor.b)})
        </div>
      )}
    </div>
  );
}
```

## 📚 API Reference

### Components

#### `<CinematicVideo />`

Wrapper component for `<video>` elements with cinematic lighting.

**Props:**
- All standard `<video>` props
- `lightingOptions?: CinematicLightingOptions` - Lighting configuration
- `showLighting?: boolean` - Toggle lighting effect (default: `true`)
- `containerClassName?: string` - CSS class for container
- `videoClassName?: string` - CSS class for video element
- `containerStyle?: CSSProperties` - Inline styles for container
- `videoStyle?: CSSProperties` - Inline styles for video element

```tsx
<CinematicVideo
  src="video.mp4"
  lightingOptions={{
    fps: 30,
    blurRadius: 100,
    opacity: 0.5,
    spread: 50,
  }}
  controls
  autoPlay
/>
```

#### `<CinematicImage />`

Wrapper component for `<img>` elements with cinematic lighting.

**Props:**
- All standard `<img>` props
- `lightingOptions?: CinematicLightingOptions` - Lighting configuration
- `showLighting?: boolean` - Toggle lighting effect
- `containerClassName?: string` - CSS class for container
- `imageClassName?: string` - CSS class for image element

```tsx
<CinematicImage
  src="image.jpg"
  alt="Beautiful sunset"
  lightingOptions={subtlePreset}
/>
```

#### `<CinematicCanvas />`

Wrapper component for `<canvas>` elements with cinematic lighting.

**Props:**
- All standard `<canvas>` props
- `lightingOptions?: CinematicLightingOptions` - Lighting configuration
- `showLighting?: boolean` - Toggle lighting effect
- `onExtractTrigger?: () => void` - Callback for manual extraction trigger

```tsx
<CinematicCanvas
  width={800}
  height={600}
  lightingOptions={vividPreset}
/>
```

### Hooks

#### `useCinematicLighting()`

React hook for extracting colors from media elements.

**Parameters:**
- `elementRef: RefObject<ExtractableElement>` - Ref to video/image/canvas element
- `options?: CinematicLightingOptions` - Configuration options

**Returns:**
```tsx
{
  colors: ColorExtractionResult | null;  // Extracted color data
  isActive: boolean;                      // Whether extraction is active
  extract: () => void;                    // Manual extraction trigger
}
```

**Example:**
```tsx
const videoRef = useRef<HTMLVideoElement>(null);
const { colors, isActive, extract } = useCinematicLighting(videoRef, {
  fps: 30,
  sampleSize: 10,
  samplingStrategy: 'edges',
});
```

### Types

#### `CinematicLightingOptions`

```tsx
interface CinematicLightingOptions {
  fps?: number;                    // Frames per second (default: 30)
  sampleSize?: number;             // Number of sample points (default: 10)
  blurRadius?: number;             // Blur radius in px (default: 100)
  opacity?: number;                // Opacity 0-1 (default: 0.5)
  spread?: number;                 // Spread distance in px (default: 50)
  enabled?: boolean;               // Enable/disable effect (default: true)
  samplingStrategy?: 'edges' | 'center' | 'corners' | 'uniform';
}
```

#### `ColorExtractionResult`

```tsx
interface ColorExtractionResult {
  dominantColor: ExtractedColor;   // Most prominent color
  accentColors: ExtractedColor[];  // Up to 3 distinct accent colors
  averageColor: ExtractedColor;    // Average of all sampled colors
}

interface ExtractedColor {
  r: number;        // Red (0-255)
  g: number;        // Green (0-255)
  b: number;        // Blue (0-255)
  alpha?: number;   // Alpha (0-1)
}
```

### Presets

Pre-configured lighting effects for common use cases.

#### Available Presets

```tsx
import {
  youtubePreset,     // Soft, wide spread, moderate opacity
  netflixPreset,     // Intense, close spread, higher opacity
  subtlePreset,      // Minimal ambient effect
  vividPreset,       // Maximum visual impact
  performancePreset, // Optimized for lower-end devices
  getPreset,
} from 'react-cinematic-lighting';

// Use a preset
<CinematicVideo lightingOptions={netflixPreset} />

// Get preset by name
const preset = getPreset('youtube');
```

#### Preset Configurations

| Preset | FPS | Sample Size | Blur | Opacity | Spread | Strategy |
|--------|-----|-------------|------|---------|--------|----------|
| YouTube | 30 | 12 | 150px | 0.4 | 80px | edges |
| Netflix | 24 | 16 | 100px | 0.6 | 60px | uniform |
| Subtle | 20 | 8 | 120px | 0.25 | 40px | center |
| Vivid | 30 | 20 | 200px | 0.7 | 100px | edges |
| Performance | 15 | 6 | 80px | 0.4 | 50px | corners |

### Utilities

```tsx
import { 
  rgbToCss,          // Convert RGB to CSS string
  getColorBrightness, // Calculate color brightness
  colorDistance,     // Calculate distance between colors
  blendColors,       // Blend two colors
} from 'react-cinematic-lighting';

// Example
const cssColor = rgbToCss({ r: 255, g: 100, b: 50, alpha: 0.8 });
// Returns: "rgba(255, 100, 50, 0.8)"

const brightness = getColorBrightness({ r: 128, g: 128, b: 128 });
// Returns: 128
```

## 🎯 Advanced Usage

### Custom Sampling Strategy

Control where colors are extracted from:

```tsx
<CinematicVideo
  src="video.mp4"
  lightingOptions={{
    samplingStrategy: 'edges',  // 'edges' | 'center' | 'corners' | 'uniform'
    sampleSize: 16,
  }}
/>
```

- **edges**: Sample from image perimeter (best for videos with centered subjects)
- **center**: Sample from image center (best for close-up content)
- **corners**: Sample from four corners (fast, less accurate)
- **uniform**: Grid-based sampling (balanced, default)

### Performance Optimization

```tsx
// For lower-end devices
<CinematicVideo
  src="video.mp4"
  lightingOptions={{
    fps: 15,              // Reduce extraction frequency
    sampleSize: 6,        // Fewer sample points
    samplingStrategy: 'corners',  // Fastest strategy
  }}
/>

// For high-end devices
<CinematicVideo
  src="video.mp4"
  lightingOptions={{
    fps: 60,
    sampleSize: 25,
    samplingStrategy: 'uniform',
  }}
/>
```

### Manual Color Extraction

For canvas elements that update programmatically:

```tsx
function AnimatedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colors, extract } = useCinematicLighting(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // ... draw on canvas ...
    
    // Trigger extraction after drawing
    extract();
  }, [extract]);

  return <canvas ref={canvasRef} />;
}
```

### Accessing Color Data

```tsx
const { colors } = useCinematicLighting(videoRef);

if (colors) {
  console.log('Dominant:', colors.dominantColor);
  console.log('Accents:', colors.accentColors);
  console.log('Average:', colors.averageColor);
  
  // Use colors for custom effects
  const gradient = `linear-gradient(45deg, 
    rgb(${colors.dominantColor.r}, ${colors.dominantColor.g}, ${colors.dominantColor.b}),
    rgb(${colors.accentColors[0]?.r}, ${colors.accentColors[0]?.g}, ${colors.accentColors[0]?.b})
  )`;
}
```

## 🎨 Examples

### Netflix-Style Video Player

```tsx
import { CinematicVideo, netflixPreset } from 'react-cinematic-lighting';

function NetflixPlayer() {
  return (
    <div style={{ background: '#000', padding: '2rem' }}>
      <CinematicVideo
        src="movie.mp4"
        lightingOptions={netflixPreset}
        controls
        containerStyle={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      />
    </div>
  );
}
```

### Image Gallery with Ambient Glow

```tsx
import { CinematicImage, subtlePreset } from 'react-cinematic-lighting';

function Gallery({ images }) {
  return (
    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {images.map((src, i) => (
        <CinematicImage
          key={i}
          src={src}
          lightingOptions={subtlePreset}
          containerStyle={{
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        />
      ))}
    </div>
  );
}
```

### Dynamic Canvas Visualization

```tsx
import { CinematicCanvas, vividPreset } from 'react-cinematic-lighting';

function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Animation loop...
  }, []);

  return (
    <CinematicCanvas
      ref={canvasRef}
      width={800}
      height={600}
      lightingOptions={vividPreset}
    />
  );
}
```

## 🔧 Core Engine

The library uses a sophisticated color extraction engine:

```tsx
import { ColorExtractor } from 'react-cinematic-lighting';

const extractor = new ColorExtractor({
  fps: 30,
  sampleSize: 10,
  samplingStrategy: 'uniform',
});

const videoElement = document.querySelector('video');
const result = extractor.extract(videoElement);

console.log(result);
// {
//   dominantColor: { r: 120, g: 80, b: 200, alpha: 1 },
//   accentColors: [...],
//   averageColor: { r: 100, g: 90, b: 180, alpha: 1 }
// }

// Clean up
extractor.destroy();
```

## 🤝 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All browsers with Canvas 2D API support

## 📄 License

MIT © [react-cinematic-lighting](https://github.com/duy3302dev/react-cinematic-lighting)

## 🙏 Acknowledgments

Inspired by the ambient lighting effects seen in modern video players like YouTube and Netflix.

## 🚧 Roadmap

- [ ] WebGL-accelerated color extraction
- [ ] Custom shader effects
- [ ] Color palette generation
- [ ] Accessibility improvements
- [ ] React Native support
