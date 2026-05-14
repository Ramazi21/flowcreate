import { NextResponse } from "next/server";

/**
 * Лёгкий маршрут для прокси/балансировщика: без layout, без RSC-стрима.
 * Проверяйте: curl -sf http://127.0.0.1:3000/health
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ ok: true, service: "flow-atelier" }, { status: 200 });
}
