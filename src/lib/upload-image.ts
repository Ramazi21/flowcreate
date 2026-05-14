export type AllowedImageKind = "jpeg" | "png" | "webp";

/** Определение формата по сигнатуре файла (надёжнее, чем MIME в браузере). */
export function sniffImageKind(buf: Buffer): AllowedImageKind | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "png";
  }
  const riff = buf.subarray(0, 4).toString("ascii");
  const webp = buf.subarray(8, 12).toString("ascii");
  if (riff === "RIFF" && webp === "WEBP") return "webp";
  return null;
}

export function extensionForKind(kind: AllowedImageKind): string {
  return kind === "jpeg" ? "jpg" : kind;
}
