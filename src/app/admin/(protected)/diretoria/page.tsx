import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteLeader } from "./actions";

export const metadata = { title: "Diretoria" };

export default async function LeadersAdminPage() {
  const db = getSupabaseAdmin();
  const { data, error } = db
    ? await db.from("leaders").select("*").order("sort_order")
    : { data: [], error: null };

  const leaders = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Diretoria</h1>
          <p className="mt-1 text-ink-soft">{leaders.length} cargos cadastrados.</p>
        </div>
        <Link
          href="/admin/diretoria/novo"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-deep-950 hover:bg-brand-400"
        >
          + Novo cargo
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
              <th className="p-3 font-semibold">Cargo</th>
              <th className="p-3 font-semibold">Gestão</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leaders.map((l) => (
              <tr key={l.id}>
                <td className="p-3 font-medium text-ink">{l.name}</td>
                <td className="p-3 text-ink-soft">{l.role}</td>
                <td className="p-3 text-ink-soft">{l.term ?? "—"}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Link href={`/admin/diretoria/${l.id}`} className="mr-4 font-semibold text-brand-700 hover:text-brand-800">
                    Editar
                  </Link>
                  <DeleteForm action={deleteLeader.bind(null, l.id, l.name)} confirmText={`Excluir "${l.name}" da diretoria?`} />
                </td>
              </tr>
            ))}
            {leaders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-ink-mute">
                  Nenhum cargo cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
