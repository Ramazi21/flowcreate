import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { generateVkAccessCode } from "@/lib/vk-utils";
import { verifyVkBotSecret } from "@/lib/vk-bot-secret";

const MAX_TTL_MIN = 60 * 24 * 7;

export async function POST(req: Request) {
  const secret = req.headers.get("x-vk-bot-secret");
  if (!verifyVkBotSecret(secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let ttlMinutes = 60;
  try {
    const body = (await req.json()) as { ttlMinutes?: number };
    if (typeof body?.ttlMinutes === "number" && Number.isFinite(body.ttlMinutes)) {
      ttlMinutes = Math.min(Math.max(1, Math.floor(body.ttlMinutes)), MAX_TTL_MIN);
    }
  } catch {
    // empty body — default ttl
  }

  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateVkAccessCode(8);
    try {
      await db.vkAccessCode.create({
        data: { code, expiresAt },
      });
      return NextResponse.json({ code, expiresAt: expiresAt.toISOString() });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        continue;
      }
      throw e;
    }
  }

  return NextResponse.json({ error: "Could not generate unique code" }, { status: 500 });
}
