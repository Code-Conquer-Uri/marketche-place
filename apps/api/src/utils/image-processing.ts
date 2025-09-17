import sharp from "sharp";

export async function convertToWebPBase64(buffer: Buffer): Promise<string> {
  const webpBuffer = await sharp(buffer).webp().toBuffer();
  const base64 = webpBuffer.toString("base64");

  return `data:image/webp;base64,${base64}`;
}

export async function generateImageBlur(buffer: Buffer): Promise<string> {
  const resizedBuffer = await sharp(buffer)
    .resize(10) // Resize to a very small size
    .toBuffer();
  const base64 = resizedBuffer.toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}
