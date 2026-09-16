import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { formatDate } from "@/lib/utils";
import { deletePost } from "./actions";

export const metadata = { title: "Notícias" };

export default async function PostsAdminPage() {
  const db = getSupabaseAdmin();
  const { data, error } = db
    ? await db.from("posts").select("*").order("date", { ascending: false })
    : { data: [], error: null };

  const posts = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Notícias</h1>
          <p className="mt-1 text-ink-soft">{posts.length} notícias cadastradas.</p>
        </div>
        <Link
          href="/admin/noticias/novo"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-deep-950 hover:bg-brand-400"
        >
          + Nova notícia
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
              <th className="p-3 font-semibold">Título</th>
              <th className="p-3 font-semibold">Categoria</th>
              <th className="p-3 font-semibold">Data</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {posts.map((p) => (
              <tr key={p.slug}>
                <td className="p-3 font-medium text-ink">{p.title}</td>
                <td className="p-3 text-ink-soft">{p.category}</td>
                <td className="p-3 text-ink-soft">{formatDate(p.date)}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      p.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.published ? "Publicada" : "Rascunho"}
                  </span>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Link href={`/admin/noticias/${p.slug}`} className="mr-4 font-semibold text-brand-700 hover:text-brand-800">
                    Editar
                  </Link>
                  <DeleteForm action={deletePost.bind(null, p.slug, p.title)} confirmText={`Excluir a notícia "${p.title}"?`} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-mute">
                  Nenhuma notícia cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
