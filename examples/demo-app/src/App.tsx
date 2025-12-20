import { useState } from "react";
import "./App.css";
import {
  AdaptiveProvider,
  CinematicVideo,
  CinematicImage,
  CinematicCard,
  CinematicText,
  CinematicCanvas,
} from "react-cinematic-lighting";

function App() {
  const [multiZone, setMultiZone] = useState(false);
  const [zoneCount, setZoneCount] = useState<4 | 8 | 12>(4);
  const [preset, setPreset] = useState<
    "youtube" | "netflix" | "spotify" | "minimal" | "neon" | "ambient"
  >("youtube");
  const [advancedGlow, setAdvancedGlow] = useState(false);
  const [stripWidth, setStripWidth] = useState(50);
  const [blurStrength, setBlurStrength] = useState(40);
  const [intensity, setIntensity] = useState(0.5);
  const [blur, setBlur] = useState(80);
  const [useGroupedAPI, setUseGroupedAPI] = useState(true);

  return (
    <AdaptiveProvider debug={true}>
      <div className="demo-container">
        {/* Header */}
        <header className="demo-header">
          <CinematicText
            preset="neon"
            typography={{ gradient: true, fontSize: "3rem" }}
            effects={{ glow: true, glowStrength: 40 }}
            style={{ marginBottom: "1rem" }}
          >
            🎬 React Cinematic Lighting v0.2.0
          </CinematicText>
          <p style={{ color: "#888", marginBottom: "0.5rem" }}>
            Dynamic ambient lighting effects for modern React applications
          </p>
          <p
            style={{ color: "#666", fontSize: "0.9rem", marginBottom: "2rem" }}
          >
            ✨ Now with smooth color transitions & grouped API
          </p>
        </header>

        {/* Controls */}
        <CinematicCard
          preset="minimal"
          intensity={0.3}
          className="controls-card"
          style={{ marginBottom: "3rem" }}
        >
          <h3 style={{ marginTop: 0, color: "#fff" }}>Global Controls</h3>
          <div className="controls">
            <label
              style={{
                gridColumn: "1 / -1",
                padding: "0.5rem",
                background: "rgba(99, 102, 241, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              <input
                type="checkbox"
                checked={useGroupedAPI}
                onChange={(e) => setUseGroupedAPI(e.target.checked)}
              />
              🆕 Use New Grouped API (v0.2.0)
            </label>

            <label>
              Intensity: {intensity.toFixed(2)}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
              />
            </label>

            <label>
              Blur: {blur}px
              <input
                type="range"
                min="0"
                max="150"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={multiZone}
                onChange={(e) => setMultiZone(e.target.checked)}
              />
              Multi-Zone Mode
            </label>

            {multiZone && (
              <label>
                Zone Count:
                <select
                  value={zoneCount}
                  onChange={(e) =>
                    setZoneCount(Number(e.target.value) as 4 | 8 | 12)
                  }
                >
                  <option value={4}>4 Zones</option>
                  <option value={8}>8 Zones</option>
                  <option value={12}>12 Zones</option>
                </select>
              </label>
            )}

            <label>
              <input
                type="checkbox"
                checked={advancedGlow}
                onChange={(e) => setAdvancedGlow(e.target.checked)}
              />
              Advanced Glow (Strip-based)
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

            <label>
              Preset:
              <select
                value={preset}
                onChange={(e) =>
                  setPreset(
                    e.target.value as
                      | "youtube"
                      | "netflix"
                      | "spotify"
                      | "minimal"
                      | "neon"
                      | "ambient"
                  )
                }
              >
                <option value="youtube">YouTube</option>
                <option value="netflix">Netflix</option>
                <option value="spotify">Spotify</option>
                <option value="ambient">Ambient</option>
                <option value="minimal">Minimal</option>
                <option value="neon">Neon</option>
              </select>
            </label>
          </div>
        </CinematicCard>

        {/* Video Example */}
        <section className="demo-section">
          <h2 className="section-title">🎥 CinematicVideo</h2>
          <p className="section-desc">
            Real-time color extraction with smooth transitions (400ms
            interpolation + 800ms CSS)
          </p>
          {useGroupedAPI ? (
            <CinematicVideo
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              preset={preset}
              autoPlay
              loop
              muted
              controls
              effects={{ intensity, blur, glow: true }}
              extraction={{
                fps: 10,
                sampling: 8,
                resolution: "low",
                onColorChange: (color) => console.log("Video color:", color),
              }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
              advancedGlow={
                advancedGlow
                  ? { enabled: true, stripWidth, blurStrength }
                  : undefined
              }
              width="100%"
              height="auto"
              style={{ maxWidth: "900px", margin: "0 auto" }}
            />
          ) : (
            <CinematicVideo
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              preset={preset}
              autoPlay
              loop
              muted
              controls
              intensity={intensity}
              blur={blur}
              glow={true}
              zoneCount={zoneCount}
              resolution="low"
              stripWidth={stripWidth}
              blurStrength={blurStrength}
              width="100%"
              height="auto"
              style={{ maxWidth: "900px", margin: "0 auto" }}
              onColorChange={(color) => console.log("Video color:", color)}
            />
          )}
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.85rem",
              color: "#888",
            }}
          >
            {useGroupedAPI
              ? "✨ Using Grouped API"
              : "📌 Using Flat Props API (Legacy)"}
          </div>
        </section>

        {/* Image Examples */}
        <section className="demo-section">
          <h2 className="section-title">🖼️ CinematicImage</h2>
          <p className="section-desc">
            Static images with hover effects and smooth ambient transitions
          </p>
          <div className="image-grid">
            <CinematicImage
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
              alt="Gradient 1"
              preset="ambient"
              hover={{ enabled: true, duration: 0.5 }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
              effects={{ intensity }}
              width="100%"
              objectFit="cover"
              style={{ height: "300px" }}
            />
            <CinematicImage
              src="https://images.unsplash.com/photo-1557672172-298e090bd0f1"
              alt="Gradient 2"
              preset="neon"
              hover={{ enabled: true, duration: 0.5 }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
              effects={{ intensity }}
              width="100%"
              objectFit="cover"
              style={{ height: "300px" }}
            />
            <CinematicImage
              src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d"
              alt="Gradient 3"
              preset="spotify"
              hover={{ enabled: true, duration: 0.5 }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
              effects={{ intensity }}
              width="100%"
              objectFit="cover"
              style={{ height: "300px" }}
            />
          </div>
        </section>

        {/* Card Examples */}
        <section className="demo-section">
          <h2 className="section-title">🎴 CinematicCard</h2>
          <p className="section-desc">
            Cards with adaptive ambient backgrounds and smooth color transitions
          </p>
          <div className="card-grid">
            <CinematicCard
              preset="youtube"
              effects={{ intensity: 0.6, glow: true }}
              layout={{ borderRadius: "12px", padding: "1.5rem" }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
            >
              <h3>YouTube Style</h3>
              <p>
                Smooth transitions with 400ms interpolation + 800ms CSS easing.
              </p>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  height: "100px",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              />
            </CinematicCard>

            <CinematicCard
              preset="netflix"
              effects={{ intensity: 0.5 }}
              layout={{ borderRadius: "12px" }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
            >
              <h3>Netflix Style</h3>
              <p>Cinematic blur with vignette and cubic-bezier easing.</p>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  height: "100px",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              />
            </CinematicCard>

            <CinematicCard
              preset="minimal"
              effects={{ intensity: 0.3 }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
            >
              <h3>Minimal Style</h3>
              <p>Subtle effects with smooth color interpolation.</p>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  height: "100px",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              />
            </CinematicCard>
          </div>
        </section>

        {/* Text Examples */}
        <section className="demo-section">
          <h2 className="section-title">✨ CinematicText</h2>
          <p className="section-desc">
            Dynamic text with gradient effects and smooth glow transitions
          </p>
          <div className="text-examples">
            <CinematicText
              preset="neon"
              typography={{ gradient: true, fontSize: "2.5rem" }}
              effects={{ glow: true, glowStrength: 30 }}
              multiZone={multiZone ? { enabled: true, zoneCount } : undefined}
            >
              Neon Gradient Text
            </CinematicText>

            <CinematicText
              preset="spotify"
              typography={{ gradient: false, fontSize: "2rem" }}
              effects={{ glow: true, glowStrength: 20, intensity: 0.9 }}
            >
              Solid Color with Glow
            </CinematicText>

            <CinematicText
              preset="ambient"
              typography={{
                gradient: true,
                fontSize: "1.8rem",
                fontWeight: "normal",
              }}
            >
              Smooth Ambient Effect
            </CinematicText>
          </div>
        </section>

        {/* Canvas Example */}
        <section className="demo-section">
          <h2 className="section-title">🎨 CinematicCanvas</h2>
          <p className="section-desc">
            Custom canvas with particle effects and smooth animations
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <CinematicCanvas
              width={400}
              height={300}
              particles={{ enabled: true, count: 150 }}
              effects={{ intensity }}
              style={{
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
              }}
            >
              {(ctx) => {
                // Custom drawing
                const centerX = ctx.canvas.width / 2;
                const centerY = ctx.canvas.height / 2;
                const time = Date.now() / 1000;

                ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                  ctx.beginPath();
                  ctx.arc(
                    centerX,
                    centerY,
                    50 + i * 40 + Math.sin(time + i) * 20,
                    0,
                    Math.PI * 2
                  );
                  ctx.stroke();
                }
              }}
            </CinematicCanvas>

            <CinematicCanvas
              width={400}
              height={300}
              particles={{ enabled: true, count: 80 }}
              effects={{ intensity }}
              style={{
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1))",
              }}
            />
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="demo-section">
          <h2 className="section-title">📊 Feature Showcase</h2>
          <div className="comparison-grid">
            <div className="comparison-item">
              <h4>Single-Zone Mode</h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginBottom: "1rem",
                }}
              >
                Uniform glow from all edges
              </p>
              <CinematicCard
                preset="youtube"
                effects={{ intensity: 0.5 }}
                multiZone={undefined}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    height: "150px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Smooth Uniform Glow
                </div>
              </CinematicCard>
            </div>

            <div className="comparison-item">
              <h4>Multi-Zone Mode</h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginBottom: "1rem",
                }}
              >
                Directional lighting per edge
              </p>
              <CinematicCard
                preset="youtube"
                effects={{ intensity: 0.5 }}
                multiZone={{ enabled: true, zoneCount: 4 }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    height: "150px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Smooth Directional Glow
                </div>
              </CinematicCard>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              padding: "1.5rem",
              background: "rgba(99, 102, 241, 0.05)",
              borderRadius: "12px",
            }}
          >
            <h4 style={{ color: "#fff", marginTop: 0 }}>🚀 New in v0.2.0</h4>
            <ul
              style={{
                textAlign: "left",
                maxWidth: "600px",
                margin: "1rem auto",
                color: "#aaa",
              }}
            >
              <li>
                ✨ Smooth color transitions with 400ms interpolation + 800ms CSS
                easing
              </li>
              <li>🎯 Cubic-bezier easing for natural deceleration</li>
              <li>📦 Grouped API for cleaner component props</li>
              <li>⚡ GPU-optimized with will-change hints</li>
              <li>🔄 100% backward compatible with flat props</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="demo-footer">
          <p>Built with React Cinematic Lighting v0.2.0</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
            ✨ Featuring smooth color transitions & grouped API | Open DevTools
            to see color extraction
          </p>
        </footer>
      </div>
    </AdaptiveProvider>
  );
}

export default App;
