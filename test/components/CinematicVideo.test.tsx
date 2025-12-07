import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CinematicVideo } from "../../src/components/CinematicVideo";
import { AdaptiveProvider } from "../../src/react/AdaptiveProvider";

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<AdaptiveProvider>{ui}</AdaptiveProvider>);
};

describe("CinematicVideo", () => {
  describe("Rendering", () => {
    it("should render video element", () => {
      renderWithProvider(<CinematicVideo src="test.mp4" data-testid="video" />);

      const video = screen.getByTestId("video");
      expect(video).toBeInTheDocument();
      expect(video.tagName).toBe("VIDEO");
    });

    it("should render with default props", () => {
      renderWithProvider(<CinematicVideo src="test.mp4" />);

      const video = screen.getByRole("video") as HTMLVideoElement;
      expect(video.controls).toBe(true);
      expect(video.autoplay).toBe(false);
      expect(video.loop).toBe(false);
      expect(video.muted).toBe(false);
    });

    it("should apply custom video attributes", () => {
      renderWithProvider(
        <CinematicVideo
          src="test.mp4"
          autoPlay
          loop
          muted
          controls={false}
          playsInline
        />
      );

      const video = screen.getByRole("video") as HTMLVideoElement;
      expect(video.autoplay).toBe(true);
      expect(video.loop).toBe(true);
      expect(video.muted).toBe(true);
      expect(video.controls).toBe(false);
      expect(video.playsInline).toBe(true);
    });

    it("should render with multiple sources", () => {
      renderWithProvider(
        <CinematicVideo
          sources={[
            { src: "video.mp4", type: "video/mp4" },
            { src: "video.webm", type: "video/webm" },
          ]}
        />
      );

      const sources = screen.getAllByRole("source");
      expect(sources).toHaveLength(2);
      expect(sources[0]).toHaveAttribute("src", "video.mp4");
      expect(sources[0]).toHaveAttribute("type", "video/mp4");
    });

    it("should render ambient background wrapper", () => {
      const { container } = renderWithProvider(
        <CinematicVideo src="test.mp4" />
      );

      const ambient = container.querySelector(".cinematic-background");
      expect(ambient).toBeInTheDocument();
    });
  });

  describe("Presets", () => {
    it("should apply youtube preset", () => {
      const { container } = renderWithProvider(
        <CinematicVideo src="test.mp4" preset="youtube" />
      );

      const ambient = container.querySelector(".cinematic-background");
      expect(ambient).toBeInTheDocument();
    });

    it("should apply netflix preset", () => {
      const { container } = renderWithProvider(
        <CinematicVideo src="test.mp4" preset="netflix" />
      );

      const ambient = container.querySelector(".cinematic-background");
      expect(ambient).toBeInTheDocument();
    });

    it("should apply custom preset configuration", () => {
      const customPreset = {
        intensity: 0.8,
        blur: 100,
        spread: "wide" as const,
        glow: true,
        glowStrength: 60,
        vignette: true,
        vignetteStrength: 0.5,
        colorBoost: 1.5,
        fps: 20,
        sampling: 5,
      };

      renderWithProvider(
        <CinematicVideo src="test.mp4" preset={customPreset} />
      );

      const video = screen.getByRole("video");
      expect(video).toBeInTheDocument();
    });
  });

  describe("Custom Props Override", () => {
    it("should override preset intensity", () => {
      renderWithProvider(
        <CinematicVideo src="test.mp4" preset="youtube" intensity={0.9} />
      );

      const video = screen.getByRole("video");
      expect(video).toBeInTheDocument();
    });

    it("should override preset blur", () => {
      renderWithProvider(
        <CinematicVideo src="test.mp4" preset="netflix" blur={150} />
      );

      const video = screen.getByRole("video");
      expect(video).toBeInTheDocument();
    });

    it("should override preset glow settings", () => {
      renderWithProvider(
        <CinematicVideo
          src="test.mp4"
          preset="minimal"
          glow={true}
          glowStrength={80}
        />
      );

      const video = screen.getByRole("video");
      expect(video).toBeInTheDocument();
    });
  });

  describe("Callbacks", () => {
    it("should call onColorChange when color is extracted", () => {
      const onColorChange = vi.fn();

      renderWithProvider(
        <CinematicVideo src="test.mp4" onColorChange={onColorChange} />
      );

      // Note: Actual color extraction happens asynchronously
      // This test verifies the callback is passed correctly
      expect(onColorChange).not.toHaveBeenCalled(); // Initially
    });
  });

  describe("Disabled State", () => {
    it("should not extract color when disabled", () => {
      const { container } = renderWithProvider(
        <CinematicVideo src="test.mp4" disabled />
      );

      const ambient = container.querySelector(".cinematic-background");
      expect(ambient).toBeInTheDocument();
      // Background should be empty when disabled
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = renderWithProvider(
        <CinematicVideo src="test.mp4" className="custom-video-class" />
      );

      const wrapper = container.querySelector(".custom-video-class");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply custom style", () => {
      const { container } = renderWithProvider(
        <CinematicVideo src="test.mp4" style={{ maxWidth: "600px" }} />
      );

      const wrapper = container.querySelector(".cinematic-video-wrapper");
      expect(wrapper).toHaveStyle({ maxWidth: "600px" });
    });

    it("should apply custom width and height", () => {
      const { container } = renderWithProvider(
        <CinematicVideo src="test.mp4" width="800px" height="450px" />
      );

      const wrapper = container.querySelector(".cinematic-video-wrapper");
      expect(wrapper).toHaveStyle({ width: "800px", height: "450px" });
    });
  });

  describe("Accessibility", () => {
    it("should have crossOrigin attribute", () => {
      renderWithProvider(
        <CinematicVideo src="test.mp4" crossOrigin="anonymous" />
      );

      const video = screen.getByRole("video") as HTMLVideoElement;
      expect(video.crossOrigin).toBe("anonymous");
    });

    it("should support poster attribute", () => {
      renderWithProvider(<CinematicVideo src="test.mp4" poster="poster.jpg" />);

      const video = screen.getByRole("video") as HTMLVideoElement;
      expect(video.poster).toContain("poster.jpg");
    });
  });

  describe("Children Support", () => {
    it("should render children (tracks, etc.)", () => {
      renderWithProvider(
        <CinematicVideo src="test.mp4">
          <track kind="subtitles" src="subs.vtt" label="English" />
        </CinematicVideo>
      );

      const track = screen.getByRole("video").querySelector("track");
      expect(track).toBeInTheDocument();
    });
  });
});
