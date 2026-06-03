import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

const adminEmails = [
  "danilova2223@gmail.com",
  "polinabakatovic@gmail.com",
  "ramazisahejsvili@gmail.com",
];

async function main() {
  console.log("Setting up admins...");

  for (const email of adminEmails) {
    await db.user.upsert({
      where: { email },
      update: { role: UserRole.ADMIN },
      create: {
        email,
        name: `Admin (${email.split("@")[0]})`,
        role: UserRole.ADMIN,
      },
    });
    console.log(`✅ Set admin role for: ${email}`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
