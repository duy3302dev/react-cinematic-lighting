import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { useAdaptiveItem } from "../../src/react/useAdaptiveItem";
import { AdaptiveProvider } from "../../src/react/AdaptiveProvider";

describe("Video Extraction Integration", () => {
  it("should extract color from video element", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AdaptiveProvider>{children}</AdaptiveProvider>
    );

    const { result } = renderHook(
      () => {
        const videoRef = useRef<HTMLVideoElement>(
          document.createElement("video")
        );
        return useAdaptiveItem(videoRef, {
          colorExtraction: true,
          fps: 30,
        });
      },
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.color).toBeDefined();
    });
  });
});
