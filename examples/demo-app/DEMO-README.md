# React Cinematic Lighting - Demo App

Comprehensive demo showcasing all features of the React Cinematic Lighting library.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Features Demonstrated

### 1. **CinematicVideo**

- Real-time color extraction from video
- Single-zone and multi-zone ambient effects
- Multiple preset styles (YouTube, Netflix, Spotify)
- Custom intensity and blur controls

### 2. **CinematicImage**

- Static image with ambient lighting
- Hover effects with smooth transitions
- Multi-zone color detection from different image regions
- Support for various presets

### 3. **CinematicCard**

- Adaptive backgrounds based on card content
- Color extraction from gradients
- Multiple shadow and glow configurations
- Border effects with ambient colors

### 4. **CinematicText**

- Gradient text effects
- Dynamic color-based text glow
- Multiple font styles and sizes
- Adaptive text colors from context

### 5. **CinematicCanvas**

- Custom canvas rendering
- Particle effects
- Real-time animations
- Programmable drawing context

## 🎮 Interactive Controls

The demo includes live controls to toggle:

- **Multi-Zone Mode**: Switch between single-color and multi-zone ambient effects
- **Zone Count**: Choose between 4, 8, or 12 zones for color extraction
- **Presets**: Try different visual styles (YouTube, Netflix, Spotify, Ambient, Minimal, Neon)

## 🎨 Multi-Zone Color Extraction

The library supports advanced multi-zone color extraction:

- **4 Zones**: Left, Right, Top, Bottom
- **8 Zones**: + 4 corners (TopLeft, TopRight, BottomLeft, BottomRight)
- **12 Zones**: + Center and enhanced corner detection

This creates more dynamic and directional ambient lighting effects.

## 💡 Code Examples

All components are fully typed and include:

- Color change callbacks
- Custom styling
- Preset configurations
- Performance optimization options

Check the `src/App.tsx` file for complete implementation examples.

## 🔧 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

For full API documentation, visit the main library README at the root of this repository.
