"use client";

import { useTransition } from "react";

/**
 * Botão de sair.
 *
 * Client component chamando uma rota comum via fetch — de propósito, não
 * uma Server Action. Ver o comentário em `src/app/api/admin/logout/route.ts`
 * para o motivo: duas Server Actions de funções diferentes na mesma árvore
 * (esta e a da página) confundiam o Next.js e derrubavam a sessão ao
 * submeter qualquer outro formulário do painel.
 */
export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          window.location.href = "/admin/login";
        });
      }}
      className="text-sm font-medium text-ink-mute hover:text-ink disabled:opacity-60"
    >
      {pending ? "Saindo…" : "Sair"}
    </button>
  );
}
