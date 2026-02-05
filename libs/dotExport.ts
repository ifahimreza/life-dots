import {DotStyle} from "./lifeDotsData";
import type {Theme} from "./themes";

type DotExportOptions = {
  total: number;
  filled: number;
  perRow: number;
  dotStyle: DotStyle;
  dotSize: number;
  gap: number;
  scale?: number;
  background?: string;
  theme?: Theme;
};

export type PrintSize = "letter" | "a4";
type CardExportOptions = DotExportOptions & {
  title: string;
  weeksText: string;
  percentText: string;
  footerText?: string;
  footerFlagUrl?: string;
  footerFlagSize?: number;
  padding?: number;
  headerGap?: number;
  footerGap?: number;
  radius?: number;
  borderColor?: string;
};

const RAINBOW_HEX = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#facc15",
  "#a3e635",
  "#4ade80",
  "#34d399",
  "#2dd4bf",
  "#22d3ee",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#e879f9",
  "#f472b6",
  "#fb7185"
];

const CLASSIC_FILLED = "#111827";
const CLASSIC_EMPTY = "#e5e7eb";
const CARD_BORDER = "#e5e7eb";
const CARD_TEXT_MUTED = "#6b7280";
const CARD_TEXT = "#374151";

type ExportPalette = {
  filled: string;
  empty: string;
  border: string;
  text: string;
  muted: string;
  background: string;
  rainbow: string[];
};

function getExportPalette(theme?: Theme): ExportPalette {
  if (!theme) {
    return {
      filled: CLASSIC_FILLED,
      empty: CLASSIC_EMPTY,
      border: CARD_BORDER,
      text: CARD_TEXT,
      muted: CARD_TEXT_MUTED,
      background: "#ffffff",
      rainbow: RAINBOW_HEX
    };
  }

  return {
    filled: theme.palette.dotFilled,
    empty: theme.palette.dotEmpty,
    border: theme.palette.border,
    text: theme.palette.text,
    muted: theme.palette.muted,
    background: theme.palette.surface,
    rainbow: theme.palette.rainbow
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
  ctx.fill();
}

function drawRoundedStrokeRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
  ctx.stroke();
}

export function renderDotsToCanvas({
  total,
  filled,
  perRow,
  dotStyle,
  dotSize,
  gap,
  scale = 3,
  background,
  theme
}: DotExportOptions): HTMLCanvasElement {
  const palette = getExportPalette(theme);
  const canvasBackground = background ?? palette.background;
  const rows = Math.ceil(total / perRow);
  const width = perRow * dotSize + (perRow - 1) * gap;
  const height = rows * dotSize + (rows - 1) * gap;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(scale, scale);
  ctx.fillStyle = canvasBackground;
  ctx.fillRect(0, 0, width, height);

  for (let index = 0; index < total; index += 1) {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    const x = col * (dotSize + gap);
    const y = row * (dotSize + gap);
    const isFilled = index < filled;

    if (dotStyle === "classic") {
      ctx.fillStyle = isFilled ? palette.filled : palette.empty;
      ctx.beginPath();
      ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = isFilled
        ? palette.rainbow[index % palette.rainbow.length]
        : palette.empty;
      drawRoundedRect(ctx, x, y, dotSize, dotSize, Math.max(1, dotSize * 0.22));
    }
  }

  return canvas;
}

export async function renderCardToCanvas({
  total,
  filled,
  perRow,
  dotStyle,
  dotSize,
  gap,
  scale = 3,
  title,
  weeksText,
  percentText,
  footerText,
  footerFlagUrl,
  footerFlagSize,
  padding = 24,
  headerGap = 16,
  footerGap = 16,
  radius = 16,
  borderColor,
  background,
  theme
}: CardExportOptions): Promise<HTMLCanvasElement> {
  const palette = getExportPalette(theme);
  const cardBackground = background ?? palette.background;
  const cardBorder = borderColor ?? palette.border;
  const rows = Math.ceil(total / perRow);
  const gridWidth = perRow * dotSize + (perRow - 1) * gap;
  const gridHeight = rows * dotSize + (rows - 1) * gap;
  const titleFontSize = 12;
  const statsFontSize = 12;
  const footerFontSize = 11;
  const headerHeight = Math.max(titleFontSize, statsFontSize);
  const footerHeight = footerText ? footerGap + footerFontSize : 0;
  const cardWidth = gridWidth + padding * 2;
  const cardHeight = padding * 2 + headerHeight + headerGap + gridHeight + footerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(cardWidth * scale);
  canvas.height = Math.ceil(cardHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(scale, scale);
  ctx.fillStyle = cardBackground;
  drawRoundedRect(ctx, 0, 0, cardWidth, cardHeight, radius);
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 1;
  drawRoundedStrokeRect(ctx, 0.5, 0.5, cardWidth - 1, cardHeight - 1, radius);

  ctx.textBaseline = "top";
  ctx.fillStyle = palette.muted;
  ctx.font = `600 ${titleFontSize}px Arial, sans-serif`;
  ctx.fillText(title, padding, padding);

  ctx.font = `600 ${statsFontSize}px Arial, sans-serif`;
  ctx.fillStyle = palette.text;
  ctx.textAlign = "right";
  const statsY = padding;
  const percentWidth = ctx.measureText(percentText).width;
  ctx.fillText(percentText, cardWidth - padding, statsY);
  ctx.fillText(weeksText, cardWidth - padding - percentWidth - 12, statsY);
  ctx.textAlign = "left";

  const gridTop = padding + headerHeight + headerGap;
  for (let index = 0; index < total; index += 1) {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    const x = padding + col * (dotSize + gap);
    const y = gridTop + row * (dotSize + gap);
    const isFilled = index < filled;

    if (dotStyle === "classic") {
      ctx.fillStyle = isFilled ? palette.filled : palette.empty;
      ctx.beginPath();
      ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = isFilled
        ? palette.rainbow[index % palette.rainbow.length]
        : palette.empty;
      drawRoundedRect(ctx, x, y, dotSize, dotSize, Math.max(1, dotSize * 0.22));
    }
  }

  if (footerText) {
    ctx.font = `600 ${footerFontSize}px Arial, sans-serif`;
    ctx.fillStyle = palette.muted;
    const footerY = gridTop + gridHeight + footerGap;
    const textWidth = ctx.measureText(footerText).width;
    let flagImage: HTMLImageElement | null = null;
    if (footerFlagUrl) {
      try {
        flagImage = await loadImage(footerFlagUrl);
      } catch {
        flagImage = null;
      }
    }
    const iconSize = footerFlagSize ?? footerFontSize + 2;
    const iconGap = flagImage ? 6 : 0;
    const totalWidth = textWidth + (flagImage ? iconSize + iconGap : 0);
    const startX = (cardWidth - totalWidth) / 2;
    if (flagImage) {
      const iconY = footerY + (footerFontSize - iconSize) / 2;
      ctx.drawImage(flagImage, startX, iconY, iconSize, iconSize);
    }
    ctx.textAlign = "left";
    ctx.fillText(footerText, startX + (flagImage ? iconSize + iconGap : 0), footerY);
  }

  return canvas;
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function downloadCanvasAsJpg(
  canvas: HTMLCanvasElement,
  filename: string,
  quality = 0.92
) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/jpeg", quality);
  link.click();
}

function buildLocalDateStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRandomToken(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
}

export function buildExportFilename(
  name: string | undefined,
  extension: "png" | "pdf" | "jpg"
) {
  const safeName = name?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const suffix = safeName || `export-${getRandomToken(6)}`;
  const stamp = buildLocalDateStamp();
  return `life-dots-${suffix}-${stamp}.${extension}`;
}

export function writePrintDocument(
  printWindow: Window,
  imageUrl: string,
  title: string,
  printSize: PrintSize
) {
  const pageSize = printSize === "letter" ? "letter" : "A4";
  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
  <html>
    <head>
      <title>${title}</title>
      <style>
        @page { size: ${pageSize}; margin: 16mm; }
        body { margin: 0; font-family: sans-serif; color: #111827; background: #ffffff; }
        .sheet {
          width: 100%;
          box-sizing: border-box;
          padding: 0;
          background: #ffffff;
        }
        img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="sheet">
        <img id="life-dots" src="${imageUrl}" alt="${title}" />
      </div>
      <script>
        const img = document.getElementById("life-dots");
        const triggerPrint = () => {
          setTimeout(() => {
            window.print();
            window.close();
          }, 200);
        };
        if (img.complete) {
          triggerPrint();
        } else {
          img.onload = triggerPrint;
        }
        img.onerror = () => {
          setTimeout(() => window.close(), 500);
        };
      </script>
    </body>
  </html>`);
  printWindow.document.close();
}

export function openPrintWindow(imageUrl: string, title: string, printSize: PrintSize) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) return;
  writePrintDocument(printWindow, imageUrl, title, printSize);
}
async function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}
