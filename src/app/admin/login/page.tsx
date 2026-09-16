import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar — Painel SBE",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/admin") ? redirect : "/admin";

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper-alt px-4">
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
