import sharp from "sharp";

/**
 * Converte buffer original para WebP (qualidade 85) e gera blur placeholder pequeno (base64).
 * Retorna ambos e também o mime type final.
 */
export async function processProductImage(
  original: Buffer,
  options: { quality?: number; blurWidth?: number; blurHeight?: number } = {},
): Promise<{
  webpBuffer: Buffer;
  blurDataUrl: string; // data:image/webp;base64,
  mimeType: string;
}> {
  const quality = options.quality ?? 85;
  const blurWidth = options.blurWidth ?? 16;
  const blurHeight = options.blurHeight ?? 16;

  const webp = sharp(original).webp({ quality });
  const webpBuffer = await webp.toBuffer();

  const blurBuffer = await sharp(original)
    .resize(blurWidth, blurHeight, { fit: "cover" })
    .webp({ quality: 10 })
    .blur(20)
    .toBuffer();

  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  return {
    webpBuffer,
    blurDataUrl,
    mimeType: "image/webp",
  };
}

// LEGACY EXPORTS (mantidos se houver uso antigo; podem ser removidos depois)
export async function convertToWebP(
  buffer: Buffer,
  quality: number = 85,
): Promise<Buffer> {
  return await sharp(buffer).webp({ quality }).toBuffer();
}

export async function generateImageBlur(buffer: Buffer): Promise<string> {
  const blurBuffer = await sharp(buffer)
    .resize(10, 10, { fit: "cover" })
    .blur(2)
    .webp({ quality: 80 })
    .toBuffer();

  return `data:image/webp;base64,${blurBuffer.toString("base64")}`;
}

export async function convertToWebPBase64(buffer: Buffer): Promise<string> {
  const webpBuffer = await sharp(buffer).webp().toBuffer();
  const base64 = webpBuffer.toString("base64");

  return `data:image/webp;base64,${base64}`;
}
