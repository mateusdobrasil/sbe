import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: { default: "Painel SBE", template: "%s — Painel SBE" },
  robots: { index: false, follow: false },
};

/**
 * Força renderização dinâmica em todo o painel.
 *
 * Sem isso, páginas de listagem sem searchParams/cookies próprios (o
 * dashboard, a lista de credenciados, a caixa de mensagens...) eram
 * pré-renderizadas como estáticas no build. A caixa de mensagens, por
 * exemplo, ficaria congelada no que existia no momento do build — uma
 * mensagem nova enviada pelo site só apareceria depois que ALGUMA outra
 * ação no painel disparasse um revalidatePath daquela rota específica.
 * Um painel administrativo não ganha nada em cachear isso; o custo de
 * buscar de novo a cada request é irrelevante perto do risco de dado
 * desatualizado.
 */
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/noticias", label: "Notícias" },
  { href: "/admin/rede-credenciada", label: "Rede credenciada" },
  { href: "/admin/servicos", label: "Serviços" },
  { href: "/admin/diretoria", label: "Diretoria" },
  { href: "/admin/planos", label: "Planos de associação" },
  { href: "/admin/faq", label: "Perguntas frequentes" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
  { href: "/admin/mensagens", label: "Mensagens recebidas" },
  { href: "/admin/auditoria", label: "Auditoria" },
];

function NavLinks() {
  return (
    <nav className="space-y-1">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-alt hover:text-ink"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper-alt lg:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-paper p-5 lg:block">
        <p className="text-lg font-bold text-ink">Painel SBE</p>
        <p className="mt-0.5 text-xs text-ink-mute">sbecuiaba.com.br</p>
        <div className="mt-6">
          <NavLinks />
        </div>
        <div className="mt-8 border-t border-line pt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Menu — celular/tablet */}
      <header className="border-b border-line bg-paper p-4 lg:hidden">
        <details>
          <summary className="flex cursor-pointer items-center justify-between text-lg font-bold text-ink marker:hidden">
            <span>☰ Painel SBE</span>
          </summary>
          <div className="mt-4">
            <NavLinks />
          </div>
          <div className="mt-4 border-t border-line pt-4">
            <LogoutButton />
          </div>
        </details>
      </header>

      <main className="min-w-0 flex-1 p-5 lg:p-10">{children}</main>
    </div>
  );
}
