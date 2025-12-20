# Feature Comparison: Single Color vs Multi-Zone vs Advanced Glow

## Quick Reference

| Feature              | Single Color           | Multi-Zone (4/8/12)            | Advanced Glow              |
| -------------------- | ---------------------- | ------------------------------ | -------------------------- |
| **Color Extraction** | Entire frame → 1 RGB   | 4/8/12 zones → RGB per zone    | 4 edge strips → ImageData  |
| **Rendering Method** | Single radial gradient | Multiple directional gradients | Blurred pixel strips       |
| **Color Accuracy**   | Average of whole frame | Average per zone               | Pixel-perfect preservation |
| **Performance**      | 🟢 Best (10 FPS)       | 🟡 Good (10 FPS)               | 🟠 Moderate (5 FPS)        |
| **Visual Quality**   | Basic ambient          | Directional ambient            | Realistic ambient          |
| **Best For**         | Simple effects         | Balanced quality/perf          | Premium experiences        |
| **CPU Usage**        | Low                    | Medium                         | Medium-High                |
| **Memory Usage**     | Low                    | Low                            | Medium                     |

## Feature Comparison

### Single Color Mode (Default)

```tsx
<CinematicVideo src="video.mp4" preset="youtube" />
```

**How it works:**

- Samples entire video frame
- Calculates single dominant color
- Renders uniform radial gradient

**Pros:**

- ✅ Lowest resource usage
- ✅ Fastest performance
- ✅ Consistent look
- ✅ Works on all devices

**Cons:**

- ❌ No directional lighting
- ❌ May miss localized colors
- ❌ Less dynamic

**Use when:**

- Performance is critical
- Simple ambient effect is enough
- Targeting mobile/low-end devices
- Video has mostly uniform colors

---

### Multi-Zone Mode

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  multiZone={true}
  zoneCount={4} // or 8, 12
/>
```

**How it works:**

- Divides frame into zones (4/8/12)
- Extracts dominant color per zone
- Renders gradient from each direction

**Zone Layouts:**

**4 Zones:**

```
┌─────────┬─────────┐
│  TOP    │   TOP   │
├─────────┼─────────┤
│ BOTTOM  │ BOTTOM  │
└─────────┴─────────┘
   LEFT      RIGHT
```

**8 Zones:**

```
┌────┬────┬────┐
│ TL │ T  │ TR │
├────┼────┼────┤
│ L  │ C  │ R  │
├────┼────┼────┤
│ BL │ B  │ BR │
└────┴────┴────┘
```

**Pros:**

- ✅ Directional lighting effect
- ✅ Good performance
- ✅ Captures spatial color distribution
- ✅ More dynamic than single color
- ✅ Low memory footprint

**Cons:**

- ❌ Still averages colors per zone
- ❌ May miss color gradients within zones
- ❌ Slightly higher CPU than single mode

**Use when:**

- Want directional ambient effect
- Good balance of quality/performance
- Video has distinct edge colors
- Targeting modern devices

---

### Advanced Glow Mode

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  advancedGlow={true}
  stripWidth={50}
  blurStrength={40}
/>
```

**How it works:**

- Extracts 15% edge strips from each side
- Scales to low-res (default 50x10px per strip)
- Preserves all pixel data (no averaging)
- Renders as blurred overlays with masking

**Strip Extraction:**

```
┌───────────────────────┐
│ ████████ TOP ████████ │  ← 15% height
├───┬───────────────┬───┤
│ █ │               │ █ │
│ L │               │ R │  ← 15% width each
│ █ │     VIDEO     │ █ │
│ █ │               │ █ │
├───┴───────────────┴───┤
│ ███████ BOTTOM ██████ │  ← 15% height
└───────────────────────┘
```

**Pros:**

- ✅ Most realistic ambient lighting
- ✅ Preserves color variations and gradients
- ✅ Pixel-accurate edge glow
- ✅ Creates depth and atmosphere
- ✅ Non-uniform gradients

**Cons:**

- ❌ Higher CPU usage (5 FPS)
- ❌ More memory for ImageData
- ❌ More complex rendering
- ❌ May impact battery on mobile

**Use when:**

- Premium experience is priority
- Video has colorful, dynamic scenes
- Desktop/modern devices
- Replicating YouTube/Netflix ambient
- Color accuracy matters

---

## Performance Comparison

### CPU Usage (Relative)

```
Single Color:    ▓░░░░░░░░░  10%
Multi-Zone (4):  ▓▓░░░░░░░░  20%
Multi-Zone (8):  ▓▓▓░░░░░░░  30%
Multi-Zone (12): ▓▓▓▓░░░░░░  40%
Advanced Glow:   ▓▓▓▓▓▓░░░░  60%
```

### Memory Usage (Relative)

```
Single Color:    ▓░░░░░░░░░  1x
Multi-Zone:      ▓░░░░░░░░░  1x (minimal increase)
Advanced Glow:   ▓▓░░░░░░░░  2x (ImageData storage)
```

### Extraction FPS

```
Single Color:    10 FPS
Multi-Zone:      10 FPS
Advanced Glow:    5 FPS (default)
```

---

## Visual Quality Comparison

### Scene: Colorful Movie Trailer

**Single Color:**

- Result: Orange glow (averaged from fire + blue sky)
- Quality: ⭐⭐⭐
- Notes: Misses blue sky completely

**Multi-Zone (4):**

- Result: Orange glow (bottom/right), Blue glow (top/left)
- Quality: ⭐⭐⭐⭐
- Notes: Captures main color zones

**Advanced Glow:**

- Result: Orange-yellow gradient (bottom), Blue-cyan gradient (top)
- Quality: ⭐⭐⭐⭐⭐
- Notes: Preserves fire gradient and sky variation

---

## Recommended Settings

### Mobile Devices

```tsx
<CinematicVideo
  preset="minimal"
  multiZone={false} // Single color
  fps={8}
  resolution="low"
/>
```

### Desktop - Balanced

```tsx
<CinematicVideo
  preset="youtube"
  multiZone={true}
  zoneCount={4}
  fps={10}
  resolution="low"
/>
```

### Desktop - Premium

```tsx
<CinematicVideo
  preset="netflix"
  advancedGlow={true}
  stripWidth={50}
  blurStrength={40}
  fps={5}
  resolution="low"
/>
```

### High-End Desktop - Maximum Quality

```tsx
<CinematicVideo
  preset="netflix"
  advancedGlow={true}
  stripWidth={80}
  blurStrength={50}
  fps={8}
  resolution="medium"
/>
```

---

## Combining Features

You **cannot** combine `multiZone` and `advancedGlow`:

❌ **Don't do this:**

```tsx
<CinematicVideo
  multiZone={true}
  advancedGlow={true} // Will ignore multiZone
/>
```

✅ **Choose one:**

```tsx
// Option 1: Multi-zone
<CinematicVideo multiZone={true} zoneCount={4} />

// Option 2: Advanced glow
<CinematicVideo advancedGlow={true} stripWidth={50} />
```

---

## Performance Optimization Tips

### For Advanced Glow Mode

1. **Lower strip width:**

   ```tsx
   stripWidth={30}  // Less pixels = better perf
   ```

2. **Reduce FPS:**

   ```tsx
   fps={3}  // Slower updates = better perf
   ```

3. **Use minimal preset:**

   ```tsx
   preset = "minimal"; // Lower intensity/blur
   ```

4. **Adjust blur strength:**
   ```tsx
   blurStrength={30}  // Less blur = better perf
   ```

### For Multi-Zone Mode

1. **Use 4 zones:**

   ```tsx
   zoneCount={4}  // Faster than 8 or 12
   ```

2. **Lower resolution:**
   ```tsx
   resolution = "low"; // Smallest canvas
   ```

---

## Browser Support

All modes work on:

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (with reduced performance)

Advanced Glow specifically:

- Requires `ImageData` support (all modern browsers)
- CSS `filter: blur()` support (all modern browsers)
- May impact battery life on mobile

---

## Summary

**Choose Single Color when:**

- Performance is critical
- Mobile/low-end devices
- Simple ambient effect is enough

**Choose Multi-Zone when:**

- Want directional lighting
- Good balance needed
- Video has distinct edge colors

**Choose Advanced Glow when:**

- Premium experience desired
- Pixel-accurate ambient needed
- Desktop/modern devices
- Replicating high-end video players
