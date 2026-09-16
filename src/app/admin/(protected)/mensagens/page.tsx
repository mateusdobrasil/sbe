import { getSupabaseAdmin } from "@/lib/supabase";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { toggleHandled, deleteLead } from "./actions";

export const metadata = { title: "Mensagens recebidas" };

const KIND_LABELS: Record<string, string> = {
  contato: "Contato",
  voluntariado: "Voluntariado",
  associado: "Associação",
  credenciamento: "Credenciamento",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LeadsAdminPage() {
  const db = getSupabaseAdmin();
  const { data, error } = db
    ? await db.from("leads").select("*").order("created_at", { ascending: false }).limit(200)
    : { data: [], error: null };

  const leads = data ?? [];
  const pending = leads.filter((l) => !l.handled).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Mensagens recebidas</h1>
      <p className="mt-1 text-ink-soft">
        {leads.length} mensagens no total · {pending} pendente{pending === 1 ? "" : "s"}.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Erro ao carregar: {error.message}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {leads.map((l) => (
          <div key={l.id} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{l.name}</p>
                  <span className="rounded-full bg-deep-50 px-2.5 py-0.5 text-xs font-bold text-deep-700">
                    {KIND_LABELS[l.kind] ?? l.kind}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {l.phone} · {l.email}
                </p>
                <p className="mt-0.5 text-xs text-ink-mute">{formatDateTime(l.created_at)}</p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <form action={toggleHandled.bind(null, l.id, !l.handled, l.name)}>
                  <button
                    type="submit"
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      l.handled ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {l.handled ? "Atendida" : "Pendente"}
                  </button>
                </form>
                <DeleteForm action={deleteLead.bind(null, l.id, l.name)} confirmText={`Excluir a mensagem de "${l.name}"?`} />
              </div>
            </div>

            {l.subject && <p className="mt-3 text-sm font-semibold text-ink">{l.subject}</p>}
            {l.message && <p className="mt-1 text-sm whitespace-pre-wrap text-ink-soft">{l.message}</p>}
          </div>
        ))}

        {leads.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-8 text-center text-ink-mute">
            Nenhuma mensagem recebida ainda.
          </p>
        )}
      </div>
    </div>
  );
}
