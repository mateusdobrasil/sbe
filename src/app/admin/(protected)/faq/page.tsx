import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteFaq } from "./actions";

export const metadata = { title: "Perguntas frequentes" };

export default async function FaqAdminPage() {
  const db = getSupabaseAdmin();
  const { data, error } = db
    ? await db.from("faq").select("*").order("sort_order")
    : { data: [], error: null };

  const items = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Perguntas frequentes</h1>
          <p className="mt-1 text-ink-soft">{items.length} perguntas cadastradas.</p>
        </div>
        <Link
          href="/admin/faq/novo"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-deep-950 hover:bg-brand-400"
        >
          + Nova pergunta
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Erro ao carregar: {error.message}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {items.map((f) => (
          <div key={f.id} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold text-ink">{f.question}</p>
              <div className="flex shrink-0 gap-4 text-sm whitespace-nowrap">
                <Link href={`/admin/faq/${f.id}`} className="font-semibold text-brand-700 hover:text-brand-800">
                  Editar
                </Link>
                <DeleteForm action={deleteFaq.bind(null, f.id, f.question)} confirmText="Excluir esta pergunta?" />
              </div>
            </div>
            <p className="mt-1.5 text-sm text-ink-soft">{f.answer}</p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-8 text-center text-ink-mute">
            Nenhuma pergunta cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
