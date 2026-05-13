import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { registerBodySchema } from "@/lib/auth-register-schema";
import { hashPassword } from "@/lib/auth-password";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const parsed = registerBodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      first.login?.[0] ??
      first.email?.[0] ??
      first.password?.[0] ??
      first.passwordConfirm?.[0] ??
      first.vkCode?.[0] ??
      "Проверьте поля формы";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { login, email, password, vkCode } = parsed.data;
  const loginNorm = login.toLowerCase();
  const emailNorm = email.toLowerCase();
  const codeNorm = vkCode.replace(/\s/g, "").toUpperCase();

  try {
    await db.$transaction(async (tx) => {
      const access = await tx.vkAccessCode.findFirst({
        where: {
          code: codeNorm,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      if (!access) {
        throw new Error("INVALID_CODE");
      }

      const existing = await tx.user.findFirst({
        where: {
          OR: [{ email: emailNorm }, { login: loginNorm }],
        },
      });

      if (existing) {
        throw new Error("DUPLICATE");
      }

      const passwordHash = await hashPassword(password);

      await tx.user.create({
        data: {
          login: loginNorm,
          name: login,
          email: emailNorm,
          passwordHash,
          role: UserRole.USER,
        },
      });

      await tx.vkAccessCode.update({
        where: { id: access.id },
        data: { consumedAt: new Date() },
      });
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "INVALID_CODE") {
      return NextResponse.json({ error: "Неверный или просроченный код доступа" }, { status: 400 });
    }
    if (msg === "DUPLICATE") {
      return NextResponse.json({ error: "Пользователь с таким логином или email уже существует" }, { status: 409 });
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Пользователь с таким логином или email уже существует" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Не удалось зарегистрироваться" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
