type DownscaleOptions = {
  maxDimension: number;
  quality?: number;
};

export const IMAGE_PRESETS = {
  cover: { maxDimension: 1280, quality: 0.82 } satisfies DownscaleOptions,
  avatar: { maxDimension: 480, quality: 0.85 } satisfies DownscaleOptions,
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export async function fileToCompressedDataUrl(file: File, options: DownscaleOptions): Promise<string> {
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);

  const scale = Math.min(1, options.maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", options.quality ?? 0.85);
}
