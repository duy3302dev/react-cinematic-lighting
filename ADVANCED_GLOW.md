# Advanced Glow Mode

## Overview

Advanced Glow Mode is a performance-optimized feature that creates realistic ambient lighting effects by extracting and rendering edge strips from video content. Unlike standard multi-zone extraction that averages colors to a single RGB value per zone, Advanced Glow preserves the pixel data and color variations from each edge, creating more realistic and dynamic lighting effects.

## How It Works

### 1. Strip Extraction

Instead of sampling the entire frame, the system:

- Divides the video into 4 edge zones: **left**, **right**, **top**, **bottom**
- Extracts only the outer **15%** of each edge
- Scales the extracted strips down to low resolution (default: 50x10 or 10x50 pixels)
- Stores pixel data as `ImageData` objects

### 2. Rendering Pipeline

The extracted strips are:

1. Converted to data URLs with blur applied
2. Rendered as positioned `<div>` overlays behind the video
3. Blurred using CSS `filter: blur()` for smooth gradients
4. Masked with linear gradients for seamless fade-out
5. Opacity-controlled to match preset intensity

### 3. Performance Optimizations

- **Low-res extraction**: Strips are scaled to ~50 pixels (customizable via `stripWidth`)
- **Reduced FPS**: Defaults to 5 FPS when advanced glow is enabled (vs 10 FPS standard)
- **Throttled extraction**: Uses requestAnimationFrame with interval throttling
- **WebWorker-ready**: Architecture supports offloading to worker threads

## Usage

### Basic Example

```tsx
import { CinematicVideo } from "react-cinematic-lighting";

function App() {
  return (
    <CinematicVideo
      src="video.mp4"
      advancedGlow={true}
      stripWidth={50} // Width of strip in pixels (default: 50)
      blurStrength={40} // Blur filter strength in px (default: 40)
      preset="youtube"
      autoPlay
      loop
      muted
    />
  );
}
```

### With Controls

```tsx
function App() {
  const [advancedGlow, setAdvancedGlow] = useState(false);
  const [stripWidth, setStripWidth] = useState(50);
  const [blurStrength, setBlurStrength] = useState(40);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={advancedGlow}
          onChange={(e) => setAdvancedGlow(e.target.checked)}
        />
        Enable Advanced Glow
      </label>

      {advancedGlow && (
        <>
          <label>
            Strip Width: {stripWidth}px
            <input
              type="range"
              min="20"
              max="100"
              value={stripWidth}
              onChange={(e) => setStripWidth(Number(e.target.value))}
            />
          </label>

          <label>
            Blur Strength: {blurStrength}px
            <input
              type="range"
              min="10"
              max="80"
              value={blurStrength}
              onChange={(e) => setBlurStrength(Number(e.target.value))}
            />
          </label>
        </>
      )}

      <CinematicVideo
        src="video.mp4"
        advancedGlow={advancedGlow}
        stripWidth={stripWidth}
        blurStrength={blurStrength}
        preset="youtube"
      />
    </>
  );
}
```

## Props

| Prop           | Type      | Default | Description                                              |
| -------------- | --------- | ------- | -------------------------------------------------------- |
| `advancedGlow` | `boolean` | `false` | Enable strip-based advanced glow mode                    |
| `stripWidth`   | `number`  | `50`    | Width of extracted strips in pixels (20-100 recommended) |
| `blurStrength` | `number`  | `40`    | CSS blur filter strength in pixels (10-80 recommended)   |

## Comparison: Standard vs Advanced Glow

### Standard Multi-Zone Mode

- Extracts colors from 4/8/12 zones
- Averages each zone to a single RGB color
- Renders uniform radial gradients per zone
- **Best for**: Clean, consistent ambient effects
- **Performance**: ~10 FPS extraction

### Advanced Glow Mode

- Extracts pixel strips from 4 edges
- Preserves full color variation in strips
- Renders strips with blur and masking
- **Best for**: Realistic, dynamic ambient effects with scene complexity
- **Performance**: ~5 FPS extraction with low-res strips

## Technical Details

### Strip Data Structure

```typescript
interface StripImageData {
  left: ImageData; // 10 x stripWidth pixels
  right: ImageData; // 10 x stripWidth pixels
  top: ImageData; // stripWidth x 10 pixels
  bottom: ImageData; // stripWidth x 10 pixels
}
```

### Extraction Process

```typescript
// VideoExtractor.extractStrips()
1. Calculate 15% edge width from video dimensions
2. Draw cropped edge to offscreen canvas
3. Scale to low resolution (stripWidth x 10 or 10 x stripWidth)
4. Extract ImageData
5. Return StripImageData object
```

### Rendering Process

```typescript
// CinematicVideo component
1. Call extractor.getStrips() every 100ms
2. Convert ImageData to data URL
3. Apply blur filter during conversion
4. Render as background-image on positioned divs
5. Apply CSS masking for gradient fade
6. Set opacity based on preset intensity
```

## Performance Tips

### Optimize Strip Width

- **Lower values (20-30px)**: Better performance, less detail
- **Medium values (40-60px)**: Balanced quality/performance
- **Higher values (70-100px)**: More detail, higher resource usage

### Adjust FPS

```tsx
<CinematicVideo
  advancedGlow={true}
  fps={5} // Lower FPS = better performance
/>
```

### Combine with Presets

```tsx
// Use minimal preset for less intensive effects
<CinematicVideo
  advancedGlow={true}
  preset="minimal" // Lower intensity, blur, and glow
/>
```

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (webkit-prefixed properties)
- ✅ Mobile: Supported but may impact battery

## Future Enhancements

- [ ] WebWorker offloading for extraction
- [ ] WebGL shader-based rendering
- [ ] Adaptive quality based on device performance
- [ ] Gradient mesh rendering for smoother transitions
- [ ] Edge detection for intelligent strip positioning

## Examples

Check the demo app for interactive examples:

```bash
cd examples/demo-app
npm run dev
```

Visit http://localhost:5173 and enable "Advanced Glow Mode" in the controls panel.
