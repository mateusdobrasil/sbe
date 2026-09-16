import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/**
 * Usuário logado no painel, a partir do cookie de sessão.
 *
 * Só pode ser usado em contexto de servidor com acesso a `next/headers`
 * (Server Actions, Server Components, Route Handlers) — nunca a partir do
 * middleware, que roda em runtime Edge e usa a API de cookies do
 * `NextRequest` diretamente. Por isso isto fica separado de `session.ts`,
 * que middleware.ts também importa.
 */
export async function getCurrentAdminUser(): Promise<string | null> {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  return session?.user ?? null;
}
