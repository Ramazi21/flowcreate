import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { SignInCredentialsForm } from "@/components/signin-credentials-form";
import { Button } from "@/components/ui/button";

function safeCallbackUrl(raw: string | undefined, fallback: string) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const callbackUrl = safeCallbackUrl(params.callbackUrl, "/");

  const session = await auth();
  if (session?.user) redirect(callbackUrl);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-8 px-4 py-14">
      <div className="text-center">
        <h1 className="text-3xl font-black">Вход в аккаунт</h1>
        <p className="mt-2 text-sm text-charcoal/70">Google или логин с паролем (после регистрации).</p>
      </div>

      <form
        className="w-full"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: callbackUrl });
        }}
      >
        <Button type="submit" className="w-full justify-center">
          Войти через Google
        </Button>
      </form>

      <div className="flex w-full items-center gap-3 text-xs uppercase tracking-wide text-charcoal/40">
        <span className="h-px flex-1 bg-black/10" />
        или
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <div className="w-full">
        <SignInCredentialsForm callbackUrl={callbackUrl} />
      </div>

      <p className="text-center text-sm text-charcoal/70">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-semibold text-[#1f3342] hover:underline">
          Регистрация
        </Link>
      </p>
    </div>
  );
}
