# react-cinematic-lighting

A TypeScript-first React library for cinematic lighting effects—automatically extract colors from videos, images, canvases, and components to create ambient glows and dynamic backgrounds.

## ✨ Features

- 🎥 **Video realtime extraction** - Real-time color extraction from playing videos
- 🖼️ **Image extraction** - Extract dominant color from static images
- 🎨 **Component extraction** - Extract colors from any React component or DOM element
- 🎬 **Ready-to-use components** - `CinematicVideo`, `CinematicImage`, `CinematicCard` with built-in effects
- � **Multi-zone color extraction** - Extract colors from 4/8/12 zones for directional ambient effects
- ✨ **Advanced Glow Mode** - Strip-based extraction for realistic, pixel-accurate ambient lighting
- �🎭 **7 Built-in presets** - YouTube, Netflix, Spotify, Apple, Minimal, Neon, Ambient styles
- ⚡ **Performance optimized** - FPS limiting, throttling, sparse pixel sampling
- 🎯 **TypeScript first** - Full type safety with comprehensive type definitions
- 🪶 **Lightweight** - Zero dependencies (except React peer dependency)
- 🎨 **Customizable** - Fine-tune every aspect or use custom preset configurations

## 📦 Installation

```bash
npm install react-cinematic-lighting
# or
pnpm add react-cinematic-lighting
# or
yarn add react-cinematic-lighting
```

**Requirements:**

- React >= 19.0.0
- Node >= 18

## 🚀 Quick Start

### Using Ready-to-Use Components

The easiest way to get started is with the built-in components:

```tsx
import {
  AdaptiveProvider,
  CinematicVideo,
  CinematicImage,
  CinematicCard,
} from "react-cinematic-lighting";

function App() {
  return (
    <AdaptiveProvider>
      {/* Video with ambient glow - New grouped API */}
      <CinematicVideo
        src="video.mp4"
        preset="youtube"
        controls
        autoPlay
        loop
        effects={{ intensity: 0.5, blur: 80 }}
        extraction={{ fps: 10, sampling: 8 }}
      />

      {/* Image with hover effects - Backward compatible flat props */}
      <CinematicImage
        src="image.jpg"
        alt="Description"
        preset="ambient"
        hoverEffect
      />

      {/* Card with adaptive lighting */}
      <CinematicCard preset="neon" layout={{ borderRadius: "16px" }}>
        <h2>Card Title</h2>
        <p>Card content with cinematic lighting</p>
      </CinematicCard>
    </AdaptiveProvider>
  );
}
```

> **Note:** Version 0.2.0 introduces a cleaner, grouped API for better organization. The flat props API is still fully supported for backward compatibility. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details.

### Using the Hook API

For more control, use the `useAdaptiveItem` hook:

```tsx
import { AdaptiveProvider, useAdaptiveItem } from "react-cinematic-lighting";
import { useRef } from "react";

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { color } = useAdaptiveItem(videoRef, {
    colorExtraction: true,
    fps: 10,
    sampling: 10,
    extractMode: "video",
    onColorChange: (color) => {
      console.log("Extracted color:", color);
    },
  });

  return (
    <div
      style={{
        background: color
          ? `radial-gradient(circle, rgba(${color.r}, ${color.g}, ${color.b}, 0.3) 0%, transparent 70%)`
          : "#000",
        padding: "2rem",
      }}
    >
      <video ref={videoRef} src="video.mp4" controls />
    </div>
  );
}

function App() {
  return (
    <AdaptiveProvider>
      <VideoPlayer />
    </AdaptiveProvider>
  );
}
```

## 📚 API Reference

### `<AdaptiveProvider>`

Context provider that manages the adaptive lighting system. Wrap your app or component tree with this provider.

**Props:**

- `children: React.ReactNode` - Your app content
- `debug?: boolean` - Enable debug logging (default: `false`)

```tsx
<AdaptiveProvider debug={false}>{children}</AdaptiveProvider>
```

### `useAdaptiveItem(ref, options)`

Hook to extract color from a DOM element (video, image, canvas, or any React component).

**Parameters:**

- `ref: React.RefObject<HTMLElement | null>` - Reference to the DOM element
- `options: AdaptiveItemProps` - Configuration options

**Options:**

- `id?: string` - Unique identifier (auto-generated if not provided)
- `colorExtraction?: boolean` - Enable/disable extraction (default: `true`)
- `fps?: number` - Limit updates per second (default: `10`)
- `sampling?: number` - Pixel sampling step, higher = faster but less accurate (default: `10`)
- `extractMode?: 'auto' | 'video' | 'canvas' | 'computed'` - Extraction method (default: `'auto'`)
- `onColorChange?: (color: ColorRGB) => void` - Callback when color changes
- `disabled?: boolean` - Disable extraction temporarily

**Returns:**

```typescript
{
  color: ColorRGB | null,  // Current extracted color
  start: () => void,        // Manually start extraction
  stop: () => void          // Manually stop extraction
}
```

**ColorRGB type:**

```typescript
interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}
```

### `<CinematicVideo>`

Ready-to-use video component with automatic color extraction and ambient glow effects.

**Props:**

- All standard HTML video props (`src`, `poster`, `autoPlay`, `loop`, `muted`, `controls`, etc.)
- `preset?: PresetName | PresetConfig` - Preset name or custom config (default: `'ambient'`)
- `intensity?: number` - Glow intensity 0-1 (overrides preset)
- `blur?: number` - Background blur in pixels (overrides preset)
- `glow?: boolean` - Enable glow effect (overrides preset)
- `glowStrength?: number` - Glow strength in pixels (overrides preset)
- `fps?: number` - Color extraction FPS (overrides preset)
- `sampling?: number` - Pixel sampling step (overrides preset)
- `disabled?: boolean` - Disable color extraction
- `onColorChange?: (color: ColorRGB) => void` - Color change callback
- `className?: string` - Additional CSS classes
- `style?: React.CSSProperties` - Additional inline styles

```tsx
<CinematicVideo
  src="video.mp4"
  preset="netflix"
  controls
  autoPlay
  loop
  onColorChange={(color) => console.log(color)}
/>
```

### `<CinematicImage>`

Image component with color extraction and optional hover effects.

**Props:**

- All standard HTML image props (`src`, `alt`, `width`, `height`, `loading`, etc.)
- `preset?: PresetName | PresetConfig` - Preset configuration
- `hoverEffect?: boolean` - Enable hover animation (default: `false`)
- `transitionDuration?: number` - Hover transition duration in seconds (default: `0.3`)
- `objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'` - Image fit mode
- All other props from `CinematicVideo` (intensity, blur, glow, etc.)

```tsx
<CinematicImage
  src="image.jpg"
  alt="Description"
  preset="spotify"
  hoverEffect
  transitionDuration={0.5}
/>
```

### `<CinematicCard>`

Card component that extracts color from its content and applies ambient lighting.

**Props:**

- `children: React.ReactNode` - Card content
- `preset?: PresetName | PresetConfig` - Preset configuration
- `extractFrom?: 'background' | 'content' | 'dominant'` - Color extraction source (default: `'background'`)
- `borderRadius?: string | number` - Card border radius (default: `'12px'`)
- `padding?: string | number` - Card padding (default: `'1.5rem'`)
- `shadowStrength?: number` - Shadow intensity multiplier (default: `1`)
- All other props from `CinematicVideo` (intensity, blur, glow, etc.)

```tsx
<CinematicCard preset="neon" borderRadius="16px" padding="2rem">
  <h2>Card Title</h2>
  <p>Card content</p>
</CinematicCard>
```

## � Advanced Features

### Multi-Zone Color Extraction

Extract colors from multiple zones (4/8/12) for directional ambient lighting effects:

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  multiZone={true}
  zoneCount={4} // 4, 8, or 12 zones
/>
```

This creates different colored glows from each edge (left, right, top, bottom) based on the content in those areas.

### Advanced Glow Mode

For the most realistic ambient lighting, enable Advanced Glow Mode which uses strip-based pixel extraction:

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  advancedGlow={true}
  stripWidth={50} // Strip resolution in pixels
  blurStrength={40} // Blur intensity
/>
```

**How it works:**

- Extracts pixel strips from the outer 15% of each edge
- Preserves color variations instead of averaging
- Renders blurred strips behind the video for realistic glow
- Optimized with low-res extraction (default 50x10px strips)
- Runs at 5 FPS for better performance

**Best for:** Videos with dynamic scenes, colorful content, or when you want the most authentic ambient lighting effect.

See [ADVANCED_GLOW.md](./ADVANCED_GLOW.md) for detailed documentation.

## �🎭 Presets

The library includes 7 built-in presets, each optimized for different use cases:

### Available Presets

| Preset      | Intensity | Blur  | Glow | Best For                         |
| ----------- | --------- | ----- | ---- | -------------------------------- |
| **youtube** | 0.3       | 80px  | ✅   | Video players, content platforms |
| **netflix** | 0.4       | 100px | ✅   | Premium video experiences        |
| **spotify** | 0.5       | 60px  | ✅   | Music, vibrant content           |
| **apple**   | 0.25      | 50px  | ❌   | Minimal, elegant designs         |
| **minimal** | 0.15      | 40px  | ❌   | Subtle effects                   |
| **neon**    | 0.7       | 30px  | ✅   | Eye-catching, high-energy        |
| **ambient** | 0.35      | 70px  | ✅   | Balanced, versatile (default)    |

### Using Presets

```tsx
// Use preset by name
<CinematicVideo preset="youtube" src="video.mp4" />

// Use custom preset configuration
<CinematicVideo
  preset={{
    intensity: 0.6,
    blur: 90,
    spread: "wide",
    glow: true,
    glowStrength: 50,
    vignette: true,
    vignetteStrength: 0.2,
    colorBoost: 1.4,
    fps: 15,
    sampling: 8,
  }}
  src="video.mp4"
/>
```

### Preset Configuration

```typescript
interface PresetConfig {
  intensity: number; // 0-1, glow intensity
  blur: number; // pixels, background blur
  spread: "tight" | "normal" | "wide" | "ultra-wide"; // gradient spread
  glow: boolean; // enable glow effect
  glowStrength: number; // pixels, glow radius
  vignette: boolean; // enable vignette effect
  vignetteStrength: number; // 0-1, vignette opacity
  colorBoost: number; // 1.0 = normal, >1 = boosted saturation
  fps: number; // color extraction frame rate
  sampling: number; // pixel sampling step
}
```

## 🎨 Examples

### Video Player with Custom Glow

```tsx
<CinematicVideo
  src="movie.mp4"
  preset="netflix"
  intensity={0.5}
  glowStrength={60}
  onColorChange={(color) => {
    // Update page theme based on video colors
    document.body.style.setProperty(
      "--theme-color",
      `rgb(${color.r}, ${color.g}, ${color.b})`
    );
  }}
/>
```

### Image Gallery with Hover Effects

```tsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
  }}
>
  {images.map((src, idx) => (
    <CinematicImage
      key={idx}
      src={src}
      alt={`Image ${idx + 1}`}
      preset="spotify"
      hoverEffect
      transitionDuration={0.4}
    />
  ))}
</div>
```

### Custom Card with Manual Color Control

```tsx
const cardRef = useRef<HTMLDivElement>(null);
const { color } = useAdaptiveItem(cardRef, {
  extractMode: "computed",
  sampling: 15,
});

<CinematicCard
  ref={cardRef}
  preset="apple"
  style={{
    background: color
      ? `linear-gradient(135deg, rgba(${color.r}, ${color.g}, ${color.b}, 0.2), transparent)`
      : undefined,
  }}
>
  <h3>Dynamic Card</h3>
  <p>Color extracted from content</p>
</CinematicCard>;
```

### Multiple Videos with Shared Context

```tsx
<AdaptiveProvider>
  <div>
    <CinematicVideo src="video1.mp4" preset="youtube" />
    <CinematicVideo src="video2.mp4" preset="netflix" />
    <CinematicVideo src="video3.mp4" preset="spotify" />
  </div>
</AdaptiveProvider>
```

## ⚡ Performance Tips

1. **Adjust FPS**: Lower FPS (5-10) for better performance, higher (15-30) for smoother updates
2. **Increase Sampling**: Higher sampling values (15-20) reduce computation but may be less accurate
3. **Disable When Hidden**: Use `disabled` prop when components are off-screen
4. **Use Presets**: Presets are optimized for performance
5. **Throttle Callbacks**: If using `onColorChange`, throttle expensive operations

```tsx
// Performance-optimized configuration
<CinematicVideo
  src="video.mp4"
  preset="minimal" // Lower intensity = less computation
  fps={8} // Lower FPS
  sampling={15} // Higher sampling = faster
/>
```

## 🔧 Advanced Usage

### Accessing the Controller

```tsx
import { useAdaptiveController } from "react-cinematic-lighting";

function CustomComponent() {
  const controller = useAdaptiveController();

  // Get color for a specific item
  const color = controller.getColor("my-video-id");

  return (
    <div
      style={{
        background: color ? `rgb(${color.r}, ${color.g}, ${color.b})` : "#000",
      }}
    />
  );
}
```

### Custom Extractors

The library automatically selects the appropriate extractor based on element type:

- `VideoExtractor` - For `<video>` elements
- `ImageExtractor` - For `<img>` elements
- `CanvasExtractor` - For `<canvas>` elements
- `ComponentExtractor` - For other DOM elements (uses computed styles)

You can force a specific extractor using `extractMode`:

```tsx
useAdaptiveItem(ref, {
  extractMode: "video", // Force video extractor
});
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode with watch
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test
```

## 📄 License

MIT © DuyDoo

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
