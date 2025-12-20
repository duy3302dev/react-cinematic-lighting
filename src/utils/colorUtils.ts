import type { ColorRGB, MultiZoneColors, ExtractedColor } from "../core/types";

export function isMultiZoneColor(
  color: ExtractedColor | null
): color is MultiZoneColors {
  return color !== null && typeof color === "object" && "left" in color;
}

export function dominantColor(
  imageData: ImageData,
  sampling: number = 10
): ColorRGB {
  const data = imageData.data;
  let r = 0,
    g = 0,
    b = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4 * sampling) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  };
}

export function extractZoneColor(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number,
  sampling: number = 10
): ColorRGB {
  const data = imageData.data;
  const imgWidth = imageData.width;
  let r = 0,
    g = 0,
    b = 0,
    count = 0;

  for (let dy = y; dy < y + height; dy += sampling) {
    for (let dx = x; dx < x + width; dx += sampling) {
      if (dx >= imgWidth || dy >= imageData.height) continue;
      const idx = (dy * imgWidth + dx) * 4;
      r += data[idx];
      g += data[idx + 1];
      b += data[idx + 2];
      count++;
    }
  }

  return count > 0
    ? {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      }
    : { r: 0, g: 0, b: 0 };
}

export function extractMultiZoneColors(
  imageData: ImageData,
  zoneCount: 4 | 8 | 12 = 4,
  sampling: number = 10
): MultiZoneColors {
  const w = imageData.width;
  const h = imageData.height;
  const edgePercent = 0.15; // 15% edge zones
  const edgeW = Math.floor(w * edgePercent);
  const edgeH = Math.floor(h * edgePercent);

  const zones: MultiZoneColors = {
    left: extractZoneColor(imageData, 0, 0, edgeW, h, sampling),
    right: extractZoneColor(imageData, w - edgeW, 0, edgeW, h, sampling),
    top: extractZoneColor(imageData, 0, 0, w, edgeH, sampling),
    bottom: extractZoneColor(imageData, 0, h - edgeH, w, edgeH, sampling),
  };

  if (zoneCount >= 8) {
    zones.topLeft = extractZoneColor(imageData, 0, 0, edgeW, edgeH, sampling);
    zones.topRight = extractZoneColor(
      imageData,
      w - edgeW,
      0,
      edgeW,
      edgeH,
      sampling
    );
    zones.bottomLeft = extractZoneColor(
      imageData,
      0,
      h - edgeH,
      edgeW,
      edgeH,
      sampling
    );
    zones.bottomRight = extractZoneColor(
      imageData,
      w - edgeW,
      h - edgeH,
      edgeW,
      edgeH,
      sampling
    );
  }

  if (zoneCount >= 12) {
    const centerW = Math.floor(w * 0.3);
    const centerH = Math.floor(h * 0.3);
    zones.center = extractZoneColor(
      imageData,
      Math.floor((w - centerW) / 2),
      Math.floor((h - centerH) / 2),
      centerW,
      centerH,
      sampling
    );
  }

  return zones;
}

export function rgbToHex(color: ColorRGB): string {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
