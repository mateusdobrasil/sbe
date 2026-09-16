import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

async function count(table: string): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db) return 0;
  const { count } = await db.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function DashboardPage() {
  const db = getSupabaseAdmin();

  const [providers, services, posts, faq, testimonials, plans, leaders, leadsOpen] = await Promise.all([
    count("providers"),
    count("services"),
    count("posts"),
    count("faq"),
    count("testimonials"),
    count("membership_plans"),
    count("leaders"),
    db
      ? db.from("leads").select("*", { count: "exact", head: true }).eq("handled", false).then((r) => r.count ?? 0)
      : Promise.resolve(0),
  ]);

  const cards = [
    { label: "Credenciados", value: providers, href: "/admin/rede-credenciada" },
    { label: "Serviços", value: services, href: "/admin/servicos" },
    { label: "Diretoria", value: leaders, href: "/admin/diretoria" },
    { label: "Notícias", value: posts, href: "/admin/noticias" },
    { label: "Perguntas frequentes", value: faq, href: "/admin/faq" },
    { label: "Depoimentos", value: testimonials, href: "/admin/depoimentos" },
    { label: "Planos de associação", value: plans, href: "/admin/planos" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Painel</h1>
      <p className="mt-1 text-ink-soft">Visão geral do conteúdo do site.</p>

      {!db && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          O Supabase não está configurado (faltam as variáveis de ambiente). O painel não
          consegue ler nem gravar dados enquanto isso não for resolvido.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-brand-300"
          >
            <p className="font-[family-name:var(--font-bricolage)] text-3xl font-extrabold text-brand-700">
              {c.value}
            </p>
            <p className="mt-1 text-sm font-medium text-ink-soft">{c.label}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/mensagens"
        className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-brand-300"
      >
        <div>
          <p className="text-lg font-bold text-ink">Mensagens recebidas</p>
          <p className="text-sm text-ink-soft">
            Contato, voluntariado, associação e credenciamento vindos do site.
          </p>
        </div>
        <p className="font-[family-name:var(--font-bricolage)] text-3xl font-extrabold text-brand-700">
          {leadsOpen}
        </p>
      </Link>
    </div>
  );
}
