import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteProvider } from "./actions";

export const metadata = { title: "Rede credenciada" };

export default async function ProvidersAdminPage() {
  const db = getSupabaseAdmin();
  const { data, error } = db
    ? await db.from("providers").select("*").order("name")
    : { data: [], error: null };

  const providers = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Rede credenciada</h1>
          <p className="mt-1 text-ink-soft">{providers.length} credenciados cadastrados.</p>
        </div>
        <Link
          href="/admin/rede-credenciada/novo"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-deep-950 hover:bg-brand-400"
        >
          + Novo credenciado
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
              <th className="p-3 font-semibold">Especialidades</th>
              <th className="p-3 font-semibold">Desconto</th>
              <th className="p-3 font-semibold">Destaque</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {providers.map((p) => (
              <tr key={p.slug}>
                <td className="p-3 font-medium text-ink">{p.name}</td>
                <td className="max-w-xs p-3 text-ink-soft">{(p.specialties ?? []).join(", ")}</td>
                <td className="p-3 text-ink-soft">{p.discount ? `${p.discount}%` : "—"}</td>
                <td className="p-3 text-ink-soft">{p.featured ? "Sim" : "—"}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Link href={`/admin/rede-credenciada/${p.slug}`} className="mr-4 font-semibold text-brand-700 hover:text-brand-800">
                    Editar
                  </Link>
                  <DeleteForm action={deleteProvider.bind(null, p.slug, p.name)} confirmText={`Excluir "${p.name}" da rede credenciada?`} />
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-mute">
                  Nenhum credenciado cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
