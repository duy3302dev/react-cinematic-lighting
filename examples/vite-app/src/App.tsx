import { useRef } from "react";
import "./App.css";
import { AdaptiveProvider, useAdaptiveItem } from "react-cinematic-lighting";
import React from "react";

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { color } = useAdaptiveItem(videoRef as React.RefObject<HTMLElement>, {
    colorExtraction: true,
    fps: 5,
    sampling: 1,
  });

  return (
    <div
      style={{
        padding: "2rem",
        background: color
          ? `radial-gradient(circle, rgba(${color.r}, ${color.g}, ${color.b}, 0.3), transparent)`
          : "#000",
        transition: "background 0.5s",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center", marginBottom: "2rem" }}>
        🎬 Cinematic Lighting Test
      </h1>

      <video
        ref={videoRef}
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        controls
        autoPlay
        loop
        muted
        crossOrigin="anonymous"
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          display: "block",
          borderRadius: "12px",
        }}
      />

      {color && (
        <div
          style={{
            color: "white",
            marginTop: "1rem",
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: "1.2rem",
          }}
        >
          <div
            style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              background: `rgb(${color.r}, ${color.g}, ${color.b})`,
              borderRadius: "4px",
              marginRight: "1rem",
              verticalAlign: "middle",
              border: "2px solid white",
            }}
          />
          rgb({color.r}, {color.g}, {color.b})
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AdaptiveProvider debug={false}>
      <VideoPlayer />
    </AdaptiveProvider>
  );
}
export default App;
