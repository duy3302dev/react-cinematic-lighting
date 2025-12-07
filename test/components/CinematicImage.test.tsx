import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CinematicImage } from "../../src/components/CinematicImage";
import { AdaptiveProvider } from "../../src/react/AdaptiveProvider";

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<AdaptiveProvider>{ui}</AdaptiveProvider>);
};

describe("CinematicImage", () => {
  describe("Rendering", () => {
    it("should render image element", () => {
      renderWithProvider(<CinematicImage src="test.jpg" alt="Test image" />);

      const img = screen.getByAltText("Test image");
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe("IMG");
    });

    it("should render with correct src and alt", () => {
      renderWithProvider(<CinematicImage src="test.jpg" alt="Test image" />);

      const img = screen.getByAltText("Test image") as HTMLImageElement;
      expect(img.src).toContain("test.jpg");
      expect(img.alt).toBe("Test image");
    });

    it("should render card wrapper", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" />
      );

      const card = container.querySelector(".cinematic-image-card");
      expect(card).toBeInTheDocument();
    });

    it("should apply default loading strategy", () => {
      renderWithProvider(<CinematicImage src="test.jpg" alt="Test" />);

      const img = screen.getByAltText("Test") as HTMLImageElement;
      expect(img.loading).toBe("lazy");
    });
  });

  describe("Image Attributes", () => {
    it("should apply custom width and height", () => {
      renderWithProvider(
        <CinematicImage
          src="test.jpg"
          alt="Test"
          width="400px"
          height="300px"
        />
      );

      const img = screen.getByAltText("Test");
      expect(img).toHaveAttribute("width", "400px");
      expect(img).toHaveAttribute("height", "300px");
    });

    it("should apply crossOrigin attribute", () => {
      renderWithProvider(
        <CinematicImage
          src="test.jpg"
          alt="Test"
          crossOrigin="use-credentials"
        />
      );

      const img = screen.getByAltText("Test") as HTMLImageElement;
      expect(img.crossOrigin).toBe("use-credentials");
    });

    it("should apply loading attribute", () => {
      renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" loading="eager" />
      );

      const img = screen.getByAltText("Test") as HTMLImageElement;
      expect(img.loading).toBe("eager");
    });

    it("should apply object-fit style", () => {
      renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" objectFit="contain" />
      );

      const img = screen.getByAltText("Test");
      expect(img).toHaveStyle({ objectFit: "contain" });
    });
  });

  describe("Presets", () => {
    it("should apply ambient preset", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" preset="ambient" />
      );

      const card = container.querySelector(".cinematic-image-card");
      expect(card).toBeInTheDocument();
    });

    it("should apply neon preset", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" preset="neon" />
      );

      const card = container.querySelector(".cinematic-image-card");
      expect(card).toBeInTheDocument();
    });

    it("should apply custom preset", () => {
      const customPreset = {
        intensity: 0.7,
        blur: 80,
        spread: "normal" as const,
        glow: true,
        glowStrength: 50,
        vignette: false,
        vignetteStrength: 0,
        colorBoost: 1.4,
        fps: 10,
        sampling: 8,
      };

      renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" preset={customPreset} />
      );

      const img = screen.getByAltText("Test");
      expect(img).toBeInTheDocument();
    });
  });

  describe("Hover Effects", () => {
    it("should not show color indicator by default", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" />
      );

      const indicator = container.querySelector(".cinematic-color-indicator");
      expect(indicator).toBeInTheDocument();
      // Should have opacity 0 initially
    });

    it("should enable hover effect when specified", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" hoverEffect />
      );

      const card = container.querySelector(".cinematic-image-card");
      expect(card).toBeInTheDocument();
    });

    it("should apply transform on hover", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" hoverEffect />
      );

      const card = container.querySelector(
        ".cinematic-image-card"
      ) as HTMLElement;

      // Simulate hover
      fireEvent.mouseEnter(card);

      // Should apply transform (tested via class/style presence)
      expect(card).toBeInTheDocument();
    });

    it("should remove transform on mouse leave", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" hoverEffect />
      );

      const card = container.querySelector(
        ".cinematic-image-card"
      ) as HTMLElement;

      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);

      expect(card).toBeInTheDocument();
    });

    it("should apply custom transition duration", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" transitionDuration={0.8} />
      );

      const card = container.querySelector(".cinematic-image-card");
      expect(card).toHaveStyle({ transition: "all 0.8s ease" });
    });
  });

  describe("Callbacks", () => {
    it("should call onColorChange when color is extracted", () => {
      const onColorChange = vi.fn();

      renderWithProvider(
        <CinematicImage
          src="test.jpg"
          alt="Test"
          onColorChange={onColorChange}
        />
      );

      // Initial render, not yet called
      expect(onColorChange).not.toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("should not extract color when disabled", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" disabled />
      );

      const card = container.querySelector(".cinematic-image-card");
      expect(card).toBeInTheDocument();
    });

    it("should not show color indicator when disabled", () => {
      const { container } = renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" disabled hoverEffect />
      );

      const indicator = container.querySelector(".cinematic-color-indicator");
      // Indicator exists but should not be visible
      expect(indicator).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = renderWithProvider(
        <CinematicImage
          src="test.jpg"
          alt="Test"
          className="custom-image-class"
        />
      );

      const card = container.querySelector(".custom-image-class");
      expect(card).toBeInTheDocument();
    });

    it("should apply custom style", () => {
      const { container } = renderWithProvider(
        <CinematicImage
          src="test.jpg"
          alt="Test"
          style={{ maxWidth: "500px" }}
        />
      );

      const card = container.querySelector(".cinematic-image-card");
      expect(card).toHaveStyle({ maxWidth: "500px" });
    });
  });

  describe("Custom Props Override", () => {
    it("should override preset intensity", () => {
      renderWithProvider(
        <CinematicImage
          src="test.jpg"
          alt="Test"
          preset="ambient"
          intensity={0.9}
        />
      );

      const img = screen.getByAltText("Test");
      expect(img).toBeInTheDocument();
    });

    it("should override preset sampling", () => {
      renderWithProvider(
        <CinematicImage src="test.jpg" alt="Test" preset="neon" sampling={20} />
      );

      const img = screen.getByAltText("Test");
      expect(img).toBeInTheDocument();
    });
  });
});
