import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        login: { label: "Логин или email", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const rawLogin = typeof credentials?.login === "string" ? credentials.login.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!rawLogin || !password) return null;

        const user = rawLogin.includes("@")
          ? await db.user.findFirst({
              where: { email: rawLogin.toLowerCase(), passwordHash: { not: null } },
            })
          : await db.user.findFirst({
              where: { login: rawLogin.toLowerCase(), passwordHash: { not: null } },
            });

        if (!user?.passwordHash || !user.email) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.login ?? "",
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        token.role = user.role ?? UserRole.USER;
      }
      if (!token.role) token.role = UserRole.USER;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserRole) ?? UserRole.USER;
      }
      return session;
    },
  },
});
