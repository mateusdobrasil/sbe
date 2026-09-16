import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentAdminUser } from "./current-user";

export type AuditAction = "create" | "update" | "delete";

/**
 * Registra uma alteração na trilha de auditoria.
 *
 * Chamado por toda Server Action de escrita do painel, depois que a
 * gravação principal já foi confirmada no banco. Uma falha ao registrar o
 * log nunca derruba a ação que o originou — ela já foi salva com sucesso;
 * o pior cenário aqui é essa entrada específica não aparecer na auditoria.
 */
export async function logAudit(params: {
  action: AuditAction;
  resource: string;
  resourceId: string;
  summary: string;
  changes?: Record<string, unknown> | null;
}): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;

  const actor = (await getCurrentAdminUser()) ?? "desconhecido";

  const { error } = await db.from("audit_log").insert({
    actor,
    action: params.action,
    resource: params.resource,
    resource_id: params.resourceId,
    summary: params.summary,
    changes: params.changes ?? null,
  });

  if (error) {
    console.error("[audit_log] falha ao registrar:", error.message);
  }
}
