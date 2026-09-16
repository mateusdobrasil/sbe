import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin/session";

/**
 * Encerra a sessão do painel.
 *
 * Uma rota comum, não uma Server Action: quando o logout também era uma
 * Server Action, ele coexistia com a Server Action de cada página (criar,
 * editar, excluir) na mesma árvore renderizada — e o Next.js 16.3.5
 * confundia as duas referências, fazendo o navegador enviar o ID do
 * logout ao submeter QUALQUER outro formulário do painel (a sessão era
 * encerrada no meio de uma criação/edição normal). Uma rota HTTP separada
 * não compartilha esse mecanismo de referência e não sofre a colisão.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
