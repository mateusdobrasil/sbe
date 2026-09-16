import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deletePlan } from "./actions";

export const metadata = { title: "Planos de associação" };

export default async function PlansAdminPage() {
  const db = getSupabaseAdmin();
  const { data, error } = db
    ? await db.from("membership_plans").select("*").order("sort_order")
    : { data: [], error: null };

  const plans = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Planos de associação</h1>
          <p className="mt-1 text-ink-soft">{plans.length} planos cadastrados.</p>
        </div>
        <Link
          href="/admin/planos/novo"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-deep-950 hover:bg-brand-400"
        >
          + Novo plano
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Erro ao carregar: {error.message}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-ink-mute">
            <tr>
              <th className="p-3 font-semibold">Nome</th>
              <th className="p-3 font-semibold">Preço</th>
              <th className="p-3 font-semibold">Destaque</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {plans.map((p) => (
              <tr key={p.slug}>
                <td className="p-3 font-medium text-ink">{p.name}</td>
                <td className="p-3 text-ink-soft">
                  {p.price} {p.period}
                </td>
                <td className="p-3 text-ink-soft">{p.highlight ? "Sim" : "—"}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Link href={`/admin/planos/${p.slug}`} className="mr-4 font-semibold text-brand-700 hover:text-brand-800">
                    Editar
                  </Link>
                  <DeleteForm action={deletePlan.bind(null, p.slug, p.name)} confirmText={`Excluir o plano "${p.name}"?`} />
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-ink-mute">
                  Nenhum plano cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
