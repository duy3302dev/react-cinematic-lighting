import React, { useState } from "react";
import {
  AdaptiveProvider,
  CinematicVideo,
  CinematicImage,
  CinematicCard,
  type PresetName,
} from "react-cinematic-lighting";

function App() {
  const [videoPreset, setVideoPreset] = useState<PresetName>("youtube");
  const [imagePreset, setImagePreset] = useState<PresetName>("ambient");

  const presets: PresetName[] = [
    "youtube",
    "netflix",
    "spotify",
    "apple",
    "minimal",
    "neon",
    "ambient",
  ];

  return (
    <AdaptiveProvider>
      <div
        style={{
          background: "#0a0a0a",
          minHeight: "100vh",
          padding: "2rem",
          color: "white",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "3rem" }}>
          🎬 Cinematic Components Demo
        </h1>

        {/* Video Section */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ color: "#60a5fa", marginBottom: "1rem" }}>
            CinematicVideo
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ marginRight: "1rem" }}>Preset:</label>
            <select
              value={videoPreset}
              onChange={(e) => setVideoPreset(e.target.value as PresetName)}
              style={{
                padding: "0.5rem 1rem",
                background: "#1a1a1a",
                color: "white",
                border: "1px solid #333",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {presets.map((preset) => (
                <option key={preset} value={preset}>
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <CinematicVideo
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            preset={videoPreset}
            autoPlay
            loop
            muted
            controls
            width="100%"
            style={{ maxWidth: "800px", margin: "0 auto" }}
            onColorChange={(color) => {
              console.log("Video color:", color);
            }}
          />
        </section>

        {/* Image Gallery Section */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ color: "#60a5fa", marginBottom: "1rem" }}>
            CinematicImage Gallery
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ marginRight: "1rem" }}>Preset:</label>
            <select
              value={imagePreset}
              onChange={(e) => setImagePreset(e.target.value as PresetName)}
              style={{
                padding: "0.5rem 1rem",
                background: "#1a1a1a",
                color: "white",
                border: "1px solid #333",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {presets.map((preset) => (
                <option key={preset} value={preset}>
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
              "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
            ].map((src, idx) => (
              <CinematicImage
                key={idx}
                src={src}
                alt={`Demo ${idx + 1}`}
                preset={imagePreset}
                hoverEffect
                loading="lazy"
                height="250px"
                objectFit="cover"
              />
            ))}
          </div>
        </section>

        {/* Card Section */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ color: "#60a5fa", marginBottom: "1rem" }}>
            CinematicCard
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <CinematicCard preset="neon">
              <h3 style={{ marginTop: 0, color: "#f59e0b" }}>Neon Preset</h3>
              <p style={{ color: "#ccc" }}>
                High intensity with strong glow effect. Perfect for eye-catching
                cards and CTAs.
              </p>
            </CinematicCard>

            <CinematicCard preset="apple">
              <h3 style={{ marginTop: 0, color: "#60a5fa" }}>Apple Preset</h3>
              <p style={{ color: "#ccc" }}>
                Subtle and elegant. Glassmorphism-inspired with minimal glow.
              </p>
            </CinematicCard>

            <CinematicCard preset="spotify">
              <h3 style={{ marginTop: 0, color: "#1db954" }}>Spotify Preset</h3>
              <p style={{ color: "#ccc" }}>
                Vibrant colors with boosted saturation. Great for music and
                media content.
              </p>
            </CinematicCard>
          </div>
        </section>

        {/* Custom Configuration */}
        <section>
          <h2 style={{ color: "#60a5fa", marginBottom: "1rem" }}>
            Custom Configuration
          </h2>

          <CinematicCard
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
            borderRadius="20px"
            padding="2rem"
          >
            <h3 style={{ marginTop: 0 }}>💎 Custom Preset</h3>
            <p style={{ color: "#ccc" }}>
              You can pass a custom PresetConfig object to create your own
              unique effects!
            </p>
            <pre
              style={{
                background: "#000",
                padding: "1rem",
                borderRadius: "8px",
                overflow: "auto",
              }}
            >
              {`{
  intensity: 0.6,
  blur: 90,
  spread: 'wide',
  glow: true,
  glowStrength: 50,
  vignette: true,
  vignetteStrength: 0.2,
  colorBoost: 1.4,
  fps: 15,
  sampling: 8,
}`}
            </pre>
          </CinematicCard>
        </section>
      </div>
    </AdaptiveProvider>
  );
}

export default App;
