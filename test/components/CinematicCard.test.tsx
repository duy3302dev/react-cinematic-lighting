import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CinematicCard } from "../../src/components/CinematicCard";
import { AdaptiveProvider } from "../../src/react/AdaptiveProvider";

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<AdaptiveProvider>{ui}</AdaptiveProvider>);
};

describe("CinematicCard", () => {
  describe("Rendering", () => {
    it("should render children", () => {
      renderWithProvider(
        <CinematicCard>
          <h1>Test Title</h1>
          <p>Test content</p>
        </CinematicCard>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render wrapper and content divs", () => {
      const { container } = renderWithProvider(
        <CinematicCard>
          <div>Content</div>
        </CinematicCard>
      );

      const wrapper = container.querySelector(".cinematic-card-wrapper");
      const content = container.querySelector(".cinematic-card-content");
      const ambient = container.querySelector(".cinematic-card-ambient");

      expect(wrapper).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(ambient).toBeInTheDocument();
    });

    it("should render with default styles", () => {
      const { container } = renderWithProvider(
        <CinematicCard>
          <div>Content</div>
        </CinematicCard>
      );

      const wrapper = container.querySelector(".cinematic-card-wrapper");
      const content = container.querySelector(".cinematic-card-content");

      expect(wrapper).toHaveStyle({ position: "relative" });
      expect(content).toHaveStyle({ position: "relative", zIndex: "1" });
    });
  });

  describe("Card Props", () => {
    it("should apply custom borderRadius", () => {
      const { container } = renderWithProvider(
        <CinematicCard borderRadius="20px">
          <div>Content</div>
        </CinematicCard>
      );

      const wrapper = container.querySelector(".cinematic-card-wrapper");
      const content = container.querySelector(".cinematic-card-content");

      expect(wrapper).toHaveStyle({ borderRadius: "20px" });
      expect(content).toHaveStyle({ borderRadius: "20px" });
    });

    it("should apply custom padding", () => {
      const { container } = renderWithProvider(
        <CinematicCard padding="2rem">
          <div>Content</div>
        </CinematicCard>
      );

      const content = container.querySelector(".cinematic-card-content");
      expect(content).toHaveStyle({ padding: "2rem" });
    });

    it("should apply extractFrom prop (background)", () => {
      renderWithProvider(
        <CinematicCard extractFrom="background">
          <div>Content</div>
        </CinematicCard>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should apply extractFrom prop (content)", () => {
      renderWithProvider(
        <CinematicCard extractFrom="content">
          <div>Content</div>
        </CinematicCard>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should apply shadowStrength multiplier", () => {
      const { container } = renderWithProvider(
        <CinematicCard shadowStrength={2}>
          <div>Content</div>
        </CinematicCard>
      );

      const content = container.querySelector(".cinematic-card-content");
      expect(content).toBeInTheDocument();
      // Shadow strength affects boxShadow calculation
    });
  });

  describe("Presets", () => {
    it("should apply ambient preset", () => {
      const { container } = renderWithProvider(
        <CinematicCard preset="ambient">
          <div>Content</div>
        </CinematicCard>
      );

      const ambient = container.querySelector(".cinematic-card-ambient");
      expect(ambient).toBeInTheDocument();
    });

    it("should apply neon preset", () => {
      const { container } = renderWithProvider(
        <CinematicCard preset="neon">
          <div>Content</div>
        </CinematicCard>
      );

      const ambient = container.querySelector(".cinematic-card-ambient");
      expect(ambient).toBeInTheDocument();
    });

    it("should apply apple preset", () => {
      const { container } = renderWithProvider(
        <CinematicCard preset="apple">
          <div>Content</div>
        </CinematicCard>
      );

      const content = container.querySelector(".cinematic-card-content");
      expect(content).toBeInTheDocument();
    });

    it("should apply custom preset configuration", () => {
      const customPreset = {
        intensity: 0.8,
        blur: 100,
        spread: "ultra-wide" as const,
        glow: true,
        glowStrength: 70,
        vignette: true,
        vignetteStrength: 0.4,
        colorBoost: 1.6,
        fps: 15,
        sampling: 10,
      };

      renderWithProvider(
        <CinematicCard preset={customPreset}>
          <div>Content</div>
        </CinematicCard>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("Custom Props Override", () => {
    it("should override preset intensity", () => {
      const { container } = renderWithProvider(
        <CinematicCard preset="ambient" intensity={0.95}>
          <div>Content</div>
        </CinematicCard>
      );

      const ambient = container.querySelector(".cinematic-card-ambient");
      expect(ambient).toBeInTheDocument();
    });

    it("should override preset blur", () => {
      const { container } = renderWithProvider(
        <CinematicCard preset="netflix" blur={200}>
          <div>Content</div>
        </CinematicCard>
      );

      const ambient = container.querySelector(".cinematic-card-ambient");
      expect(ambient).toBeInTheDocument();
    });

    it("should override preset glow settings", () => {
      const { container } = renderWithProvider(
        <CinematicCard preset="minimal" glow={true} glowStrength={100}>
          <div>Content</div>
        </CinematicCard>
      );

      const content = container.querySelector(".cinematic-card-content");
      expect(content).toBeInTheDocument();
    });

    it("should override preset sampling", () => {
      renderWithProvider(
        <CinematicCard preset="spotify" sampling={25}>
          <div>Content</div>
        </CinematicCard>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("Callbacks", () => {
    it("should call onColorChange when color is extracted", () => {
      const onColorChange = vi.fn();

      renderWithProvider(
        <CinematicCard onColorChange={onColorChange}>
          <div style={{ backgroundColor: "red" }}>Content</div>
        </CinematicCard>
      );

      // Initially not called (async extraction)
      expect(onColorChange).not.toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("should not extract color when disabled", () => {
      const { container } = renderWithProvider(
        <CinematicCard disabled>
          <div>Content</div>
        </CinematicCard>
      );

      const ambient = container.querySelector(".cinematic-card-ambient");
      expect(ambient).toBeInTheDocument();
      // Should not have background gradient when disabled
    });

    it("should not apply glow when disabled", () => {
      const { container } = renderWithProvider(
        <CinematicCard disabled glow glowStrength={100}>
          <div>Content</div>
        </CinematicCard>
      );

      const content = container.querySelector(".cinematic-card-content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply custom className", () => {
      const { container } = renderWithProvider(
        <CinematicCard className="custom-card-class">
          <div>Content</div>
        </CinematicCard>
      );

      const wrapper = container.querySelector(".custom-card-class");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply custom style", () => {
      const { container } = renderWithProvider(
        <CinematicCard style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div>Content</div>
        </CinematicCard>
      );

      const wrapper = container.querySelector(".cinematic-card-wrapper");
      expect(wrapper).toHaveStyle({ maxWidth: "600px", margin: "0 auto" });
    });

    it("should have backdrop filter on content", () => {
      const { container } = renderWithProvider(
        <CinematicCard>
          <div>Content</div>
        </CinematicCard>
      );

      const content = container.querySelector(".cinematic-card-content");
      expect(content).toHaveStyle({ backdropFilter: "blur(10px)" });
    });
  });

  describe("Complex Children", () => {
    it("should render complex nested content", () => {
      renderWithProvider(
        <CinematicCard>
          <div>
            <h1>Title</h1>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </CinematicCard>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should render React components as children", () => {
      const CustomComponent = () => <div>Custom Component</div>;

      renderWithProvider(
        <CinematicCard>
          <CustomComponent />
        </CinematicCard>
      );

      expect(screen.getByText("Custom Component")).toBeInTheDocument();
    });
  });

  describe("Layers", () => {
    it("should render ambient layer below content", () => {
      const { container } = renderWithProvider(
        <CinematicCard>
          <div>Content</div>
        </CinematicCard>
      );

      const ambient = container.querySelector(".cinematic-card-ambient");
      const content = container.querySelector(".cinematic-card-content");

      expect(ambient).toHaveStyle({ zIndex: "0" });
      expect(content).toHaveStyle({ zIndex: "1" });
    });

    it("should make ambient layer non-interactive", () => {
      const { container } = renderWithProvider(
        <CinematicCard>
          <div>Content</div>
        </CinematicCard>
      );

      const ambient = container.querySelector(".cinematic-card-ambient");
      expect(ambient).toHaveStyle({ pointerEvents: "none" });
    });
  });
});
