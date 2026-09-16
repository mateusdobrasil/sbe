"use client";

import { usePathname } from "next/navigation";

/**
 * Esconde o "cromo" do site público (rodapé, WhatsApp flutuante, aviso de
 * cookies) nas rotas do painel administrativo, que tem sua própria interface.
 *
 * Um portão client-only em vez de tornar Footer um client component: os
 * filhos passados aqui (Server Components) continuam renderizados no
 * servidor — só a decisão de exibir ou não roda no cliente, olhando a rota.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
