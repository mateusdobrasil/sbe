"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  if (!username || !password) {
    return { error: "Preencha usuário e senha." };
  }

  let ok: boolean;
  try {
    ok = await checkCredentials(username, password);
  } catch (err) {
    // ADMIN_SESSION_SECRET ausente, por exemplo — não vaza detalhes ao usuário.
    console.error("[admin/login]", err instanceof Error ? err.message : err);
    return { error: "O painel não está configurado corretamente. Avise quem cuida do site." };
  }

  if (!ok) {
    return { error: "Usuário ou senha incorretos." };
  }

  const token = await createSessionToken(username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}
