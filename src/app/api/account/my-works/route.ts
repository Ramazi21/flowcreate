import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const works = await db.product.findMany({
    where: { authorId: session.user.id },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(works);
}
