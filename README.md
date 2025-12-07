# React Cinematic Lighting 🎬✨

Thư viện React cho hiệu ứng cinematic lighting - tự động trích xuất màu từ video, ảnh, canvas và components để tạo ambient glow effects.

## ✨ Features

- 🎥 **Video realtime extraction** - Color extraction từ video đang phát
- 🖼️ **Image extraction** - Lấy dominant color từ ảnh
- 🎨 **Component extraction** - Extract màu từ bất kỳ React component nào
- ⚡ **Performance optimized** - FPS limiting, throttling, sparse sampling
- 🎯 **TypeScript first** - Full type safety
- 🪶 **Lightweight** - Zero dependencies (except React peer dep)
- 🎭 **Multiple modes** - YouTube, Netflix, Ambient, Solid styles

## 📦 Installation

```bash
npm install react-cinematic-lighting
# or
pnpm add react-cinematic-lighting
# or
yarn add react-cinematic-lighting
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { AdaptiveProvider, useAdaptiveItem } from "react-cinematic-lighting";

function App() {
  return (
    <AdaptiveProvider>
      <VideoPlayer />
    </AdaptiveProvider>
  );
}

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { color } = useAdaptiveItem(videoRef, {
    colorExtraction: true,
    fps: 10,
    mode: "youtube",
  });

  return (
    <div
      style={{
        background: color ? `rgb(${color.r}, ${color.g}, ${color.b})` : "#000",
        padding: "2rem",
      }}
    >
      <video ref={videoRef} src="video.mp4" controls />
    </div>
  );
}
```

## 📚 API Reference

### `<AdaptiveProvider>`

Wrap your app with this provider.

```tsx
<AdaptiveProvider debug={false}>{children}</AdaptiveProvider>
```

### `useAdaptiveItem(ref, options)`

Hook để extract color từ một element.

**Options:**

- `colorExtraction?: boolean` - Enable/disable extraction (default: `true`)
- `fps?: number` - Limit updates per second (default: `10`)
- `sampling?: number` - Pixel sampling step (default: `10`)
- `mode?: 'youtube' | 'netflix' | 'ambient' | 'solid' | 'minimal'`
- `extractMode?: 'auto' | 'video' | 'canvas' | 'computed'`
- `onColorChange?: (color: ColorRGB) => void`

**Returns:**

```typescript
{
  color: ColorRGB | null,
  start: () => void,
  stop: () => void
}
```

## 🎨 Examples

### Video with Glow Effect

```tsx
const { color } = useAdaptiveItem(videoRef, {
  fps: 15,
  sampling: 8,
  glow: true,
  glowStrength: 50,
});
```

### Image Gallery

```tsx
const { color } = useAdaptiveItem(imgRef, {
  extractMode: "auto",
  sampling: 20,
});
```

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT © [Your Name]
