import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Auditoria" };

const RESOURCE_LABELS: Record<string, string> = {
  providers: "Rede credenciada",
  services: "Serviços",
  leaders: "Diretoria",
  membership_plans: "Planos",
  faq: "FAQ",
  testimonials: "Depoimentos",
  posts: "Notícias",
  leads: "Mensagens",
};

const ACTION_LABELS: Record<string, string> = {
  create: "Criação",
  update: "Edição",
  delete: "Exclusão",
};

const ACTION_STYLES: Record<string, string> = {
  create: "bg-green-100 text-green-800",
  update: "bg-deep-50 text-deep-700",
  delete: "bg-red-100 text-red-800",
};

const PAGE_SIZE = 50;

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildQuery(params: Record<string, string | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) usp.set(k, v);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ recurso?: string; acao?: string; page?: string }>;
}) {
  const { recurso, acao, page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const db = getSupabaseAdmin();

  let query = db
    ? db.from("audit_log").select("*", { count: "exact" }).order("created_at", { ascending: false })
    : null;

  if (query && recurso) query = query.eq("resource", recurso);
  if (query && acao) query = query.eq("action", acao);

  const { data, count, error } = query
    ? await query.range(from, to)
    : { data: [], count: 0, error: null };

  const entries = data ?? [];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Auditoria</h1>
      <p className="mt-1 text-ink-soft">
        Registro de tudo que foi criado, alterado ou excluído pelo painel. {count ?? 0} entradas.
      </p>

      {!db && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Supabase não configurado — não há como ler o histórico agora.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Erro ao carregar: {error.message}
        </p>
      )}

      {/* Filtros — links simples, sem JS: cada opção é uma URL diferente. */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 self-center text-xs font-semibold tracking-wide text-ink-mute uppercase">
            Recurso
          </span>
          <Link
            href={`/admin/auditoria${buildQuery({ acao })}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${!recurso ? "bg-deep-800 text-white" : "bg-paper-alt text-ink-soft hover:text-ink"}`}
          >
            Todos
          </Link>
          {Object.entries(RESOURCE_LABELS).map(([value, label]) => (
            <Link
              key={value}
              href={`/admin/auditoria${buildQuery({ recurso: value, acao })}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${recurso === value ? "bg-deep-800 text-white" : "bg-paper-alt text-ink-soft hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 self-center text-xs font-semibold tracking-wide text-ink-mute uppercase">Ação</span>
          <Link
            href={`/admin/auditoria${buildQuery({ recurso })}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${!acao ? "bg-deep-800 text-white" : "bg-paper-alt text-ink-soft hover:text-ink"}`}
          >
            Todas
          </Link>
          {Object.entries(ACTION_LABELS).map(([value, label]) => (
            <Link
              key={value}
              href={`/admin/auditoria${buildQuery({ recurso, acao: value })}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${acao === value ? "bg-deep-800 text-white" : "bg-paper-alt text-ink-soft hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-ink-mute">
            <tr>
              <th className="p-3 font-semibold">Quando</th>
              <th className="p-3 font-semibold">Quem</th>
              <th className="p-3 font-semibold">Ação</th>
              <th className="p-3 font-semibold">Recurso</th>
              <th className="p-3 font-semibold">O quê</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="p-3 whitespace-nowrap text-ink-soft">{formatDateTime(e.created_at)}</td>
                <td className="p-3 font-medium text-ink">{e.actor}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ACTION_STYLES[e.action] ?? ""}`}>
                    {ACTION_LABELS[e.action] ?? e.action}
                  </span>
                </td>
                <td className="p-3 text-ink-soft">{RESOURCE_LABELS[e.resource] ?? e.resource}</td>
                <td className="p-3 text-ink">
                  {e.summary}
                  {e.changes && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs font-semibold text-brand-700">
                        Ver detalhes
                      </summary>
                      <pre className="mt-1 max-w-md overflow-x-auto rounded-lg bg-paper-alt p-2 text-xs text-ink-soft">
                        {JSON.stringify(e.changes, null, 2)}
                      </pre>
                    </details>
                  )}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-mute">
                  Nenhuma entrada encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-ink-soft">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/auditoria${buildQuery({ recurso, acao, page: String(page - 1) })}`}
                className="rounded-full border border-line px-3 py-1.5 font-semibold hover:bg-paper-alt"
              >
                ← Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/auditoria${buildQuery({ recurso, acao, page: String(page + 1) })}`}
                className="rounded-full border border-line px-3 py-1.5 font-semibold hover:bg-paper-alt"
              >
                Próxima →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
