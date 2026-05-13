import { timingSafeEqual } from "crypto";

export function verifyVkBotSecret(provided: string | null | undefined): boolean {
  const expected = process.env.VK_BOT_SECRET;
  if (!expected || provided === undefined || provided === null) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
