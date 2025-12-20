# API Migration Guide v0.2.0

## Overview

Version 0.2.0 introduces a **cleaner, grouped API** to reduce prop sprawl while maintaining **100% backward compatibility** with the flat props API.

## What Changed?

### Before (Flat Props - Still Supported)

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  intensity={0.5}
  blur={80}
  glow={true}
  glowStrength={40}
  fps={10}
  sampling={8}
  disabled={false}
  onColorChange={(color) => console.log(color)}
  resolution="low"
  multiZone={true}
  zoneCount={4}
  advancedGlow={true}
  stripWidth={50}
  blurStrength={40}
/>
```

### After (Grouped Props - Recommended)

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  effects={{
    intensity: 0.5,
    blur: 80,
    glow: true,
    glowStrength: 40,
  }}
  extraction={{
    fps: 10,
    sampling: 8,
    disabled: false,
    resolution: "low",
    onColorChange: (color) => console.log(color),
  }}
  multiZone={{
    enabled: true,
    zoneCount: 4,
  }}
  advancedGlow={{
    enabled: true,
    stripWidth: 50,
    blurStrength: 40,
  }}
/>
```

## Benefits of Grouped API

### 1. **Better Organization**

Related properties are grouped logically, making it clear what each group controls.

### 2. **Reduced Prop Sprawl**

Components no longer have 15+ flat props. Each group is a single prop with clear purpose.

### 3. **Type Safety**

TypeScript provides better autocomplete and validation for nested options.

### 4. **Easier to Override**

You can easily override specific groups without affecting others:

```tsx
const defaultEffects = {
  intensity: 0.5,
  blur: 80,
  glow: true,
  glowStrength: 40,
};

<CinematicVideo
  preset="youtube"
  effects={userCustomEffects || defaultEffects}
/>;
```

## Property Groups

### 1. `effects` - Visual Effects Options

Controls the visual appearance of the ambient lighting.

```tsx
interface VisualEffectsOptions {
  intensity?: number; // 0-1, effect intensity
  blur?: number; // px, background blur
  glow?: boolean; // enable glow effect
  glowStrength?: number; // px, glow radius
}
```

**Example:**

```tsx
<CinematicVideo
  effects={{
    intensity: 0.6,
    blur: 100,
    glow: true,
    glowStrength: 50,
  }}
/>
```

---

### 2. `extraction` - Color Extraction Options

Controls how colors are extracted from the media.

```tsx
interface ColorExtractionOptions {
  disabled?: boolean; // disable extraction
  fps?: number; // extraction frame rate
  sampling?: number; // pixel sampling step
  resolution?: "low" | "medium" | "high"; // canvas resolution
  onColorChange?: (color: ExtractedColor) => void; // callback
}
```

**Example:**

```tsx
<CinematicVideo
  extraction={{
    fps: 10,
    sampling: 8,
    resolution: "low",
    disabled: false,
    onColorChange: (color) => console.log("Color changed:", color),
  }}
/>
```

---

### 3. `multiZone` - Multi-Zone Extraction

Enables directional color extraction from multiple zones.

```tsx
interface MultiZoneOptions {
  enabled: boolean; // enable multi-zone
  zoneCount?: 4 | 8 | 12; // number of zones
}
```

**Example:**

```tsx
<CinematicVideo
  multiZone={{
    enabled: true,
    zoneCount: 4,
  }}
/>
```

---

### 4. `advancedGlow` - Advanced Strip-Based Glow

Enables realistic, pixel-accurate ambient glow using edge strips.

```tsx
interface AdvancedGlowOptions {
  enabled: boolean; // enable advanced glow
  stripWidth?: number; // strip resolution (20-100px)
  blurStrength?: number; // blur intensity (10-80px)
}
```

**Example:**

```tsx
<CinematicVideo
  advancedGlow={{
    enabled: true,
    stripWidth: 50,
    blurStrength: 40,
  }}
/>
```

---

### Component-Specific Groups

#### CinematicImage - `hover`

```tsx
interface ImageInteractionOptions {
  enabled?: boolean; // enable hover effect
  duration?: number; // transition duration in seconds
}
```

**Example:**

```tsx
<CinematicImage
  src="image.jpg"
  hover={{
    enabled: true,
    duration: 0.5,
  }}
/>
```

---

#### CinematicCard - `layout`

```tsx
interface CardLayoutOptions {
  borderRadius?: string | number; // border radius
  padding?: string | number; // padding
  shadowStrength?: number; // shadow multiplier
}
```

**Example:**

```tsx
<CinematicCard
  layout={{
    borderRadius: "16px",
    padding: "2rem",
    shadowStrength: 1.5,
  }}
>
  <h2>Card Content</h2>
</CinematicCard>
```

---

#### CinematicCanvas - `particles`

```tsx
interface ParticleEffectOptions {
  enabled?: boolean; // enable particles
  count?: number; // number of particles
}
```

**Example:**

```tsx
<CinematicCanvas
  width={800}
  height={600}
  particles={{
    enabled: true,
    count: 100,
  }}
/>
```

---

#### CinematicText - `typography`

```tsx
interface TextTypographyOptions {
  fontSize?: string | number;
  fontWeight?: string | number;
  textAlign?: "left" | "center" | "right";
  gradient?: boolean;
}
```

**Example:**

```tsx
<CinematicText
  typography={{
    fontSize: "3rem",
    fontWeight: "bold",
    textAlign: "center",
    gradient: true,
  }}
>
  Cinematic Text
</CinematicText>
```

## Backward Compatibility

All flat props are still supported and will work exactly as before:

```tsx
// ✅ This still works!
<CinematicVideo
  src="video.mp4"
  intensity={0.5}
  blur={80}
  multiZone={true}
  zoneCount={4}
/>
```

**Priority:** Flat props take precedence over grouped props for backward compatibility:

```tsx
// intensity flat prop (0.8) overrides effects.intensity (0.5)
<CinematicVideo intensity={0.8} effects={{ intensity: 0.5, blur: 80 }} />
// Result: intensity = 0.8, blur = 80
```

## Migration Strategy

### Option 1: Gradual Migration (Recommended)

Migrate one component at a time:

```tsx
// Before
<CinematicVideo intensity={0.5} blur={80} fps={10} sampling={8} />

// After - Step 1: Migrate effects
<CinematicVideo
  effects={{ intensity: 0.5, blur: 80 }}
  fps={10}
  sampling={8}
/>

// After - Step 2: Migrate extraction
<CinematicVideo
  effects={{ intensity: 0.5, blur: 80 }}
  extraction={{ fps: 10, sampling: 8 }}
/>
```

### Option 2: Full Migration

Migrate all props at once:

```tsx
// Before
<CinematicVideo
  intensity={0.5}
  blur={80}
  glow={true}
  glowStrength={40}
  fps={10}
  sampling={8}
  multiZone={true}
  zoneCount={4}
/>

// After
<CinematicVideo
  effects={{ intensity: 0.5, blur: 80, glow: true, glowStrength: 40 }}
  extraction={{ fps: 10, sampling: 8 }}
  multiZone={{ enabled: true, zoneCount: 4 }}
/>
```

### Option 3: Keep Flat Props

No migration needed! The flat props API is fully supported:

```tsx
// ✅ This will continue to work
<CinematicVideo intensity={0.5} blur={80} multiZone={true} />
```

## Deprecation Timeline

- **v0.2.0** (Current): Grouped API introduced, flat props marked as `@deprecated` in TypeScript
- **v0.3.0** (Future): Flat props will show console warnings in development
- **v1.0.0** (Future): Flat props may be removed (breaking change)

**Recommendation:** Start using grouped props for new code, migrate existing code gradually.

## TypeScript Support

The TypeScript compiler will show deprecation warnings for flat props:

```tsx
<CinematicVideo
  intensity={0.5} // ⚠️ @deprecated Use effects.intensity instead
  blur={80} // ⚠️ @deprecated Use effects.blur instead
/>
```

To see these warnings, ensure you're using TypeScript 5.0+.

## Code Examples

### Example 1: Simple Video Player

**Old API:**

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  intensity={0.5}
  blur={80}
  fps={10}
/>
```

**New API:**

```tsx
<CinematicVideo
  src="video.mp4"
  preset="youtube"
  effects={{ intensity: 0.5, blur: 80 }}
  extraction={{ fps: 10 }}
/>
```

---

### Example 2: Multi-Zone with Advanced Glow

**Old API:**

```tsx
<CinematicVideo
  src="video.mp4"
  multiZone={true}
  zoneCount={4}
  advancedGlow={true}
  stripWidth={50}
  blurStrength={40}
/>
```

**New API:**

```tsx
<CinematicVideo
  src="video.mp4"
  multiZone={{ enabled: true, zoneCount: 4 }}
  advancedGlow={{ enabled: true, stripWidth: 50, blurStrength: 40 }}
/>
```

---

### Example 3: Custom Configuration Object

**Old API:**

```tsx
const config = {
  intensity: 0.6,
  blur: 100,
  fps: 15,
  sampling: 5,
};

<CinematicVideo
  intensity={config.intensity}
  blur={config.blur}
  fps={config.fps}
  sampling={config.sampling}
/>;
```

**New API:**

```tsx
const effectsConfig = { intensity: 0.6, blur: 100 };
const extractionConfig = { fps: 15, sampling: 5 };

<CinematicVideo effects={effectsConfig} extraction={extractionConfig} />;
```

---

### Example 4: Conditional Props

**Old API:**

```tsx
<CinematicVideo
  multiZone={userPreferences.multiZone}
  zoneCount={userPreferences.multiZone ? 4 : undefined}
/>
```

**New API:**

```tsx
<CinematicVideo
  multiZone={
    userPreferences.multiZone ? { enabled: true, zoneCount: 4 } : undefined
  }
/>
```

## FAQ

### Q: Do I need to migrate immediately?

**A:** No! The flat props API is fully supported and will continue to work.

### Q: What happens if I mix flat and grouped props?

**A:** Flat props take precedence. For example:

```tsx
<CinematicVideo intensity={0.8} effects={{ intensity: 0.5 }} />
// Result: intensity = 0.8 (flat prop wins)
```

### Q: Will this affect performance?

**A:** No. The implementation normalizes props internally, so there's no performance difference.

### Q: Can I use both APIs in the same project?

**A:** Yes! You can use flat props in some components and grouped props in others.

### Q: Why introduce grouped props?

**A:** To improve developer experience with better organization, type safety, and reduced prop sprawl as the library grows.

## Need Help?

- Open an issue on GitHub
- Check the [documentation](../README.md)
- See [ADVANCED_GLOW.md](./ADVANCED_GLOW.md) for advanced glow details
- See [FEATURE_COMPARISON.md](./FEATURE_COMPARISON.md) for feature comparison
