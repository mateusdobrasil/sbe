import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteService } from "./actions";

export const metadata = { title: "Serviços" };

export default async function ServicesAdminPage() {
  const db = getSupabaseAdmin();
  const { data, error } = db
    ? await db.from("services").select("*").order("category").order("name")
    : { data: [], error: null };

  const services = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Serviços</h1>
          <p className="mt-1 text-ink-soft">{services.length} serviços cadastrados.</p>
        </div>
        <Link
          href="/admin/servicos/novo"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-deep-950 hover:bg-brand-400"
        >
          + Novo serviço
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
              <th className="p-3 font-semibold">Categoria</th>
              <th className="p-3 font-semibold">Valor</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {services.map((s) => (
              <tr key={s.slug}>
                <td className="p-3 font-medium text-ink">{s.name}</td>
                <td className="p-3 text-ink-soft">{s.category}</td>
                <td className="p-3 text-ink-soft">{s.price ?? "—"}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Link href={`/admin/servicos/${s.slug}`} className="mr-4 font-semibold text-brand-700 hover:text-brand-800">
                    Editar
                  </Link>
                  <DeleteForm action={deleteService.bind(null, s.slug, s.name)} confirmText={`Excluir o serviço "${s.name}"?`} />
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-ink-mute">
                  Nenhum serviço cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
