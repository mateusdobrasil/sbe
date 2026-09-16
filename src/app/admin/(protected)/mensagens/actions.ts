"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";

function revalidateLeadPages() {
  revalidatePath("/admin/mensagens");
  revalidatePath("/admin");
}

export async function toggleHandled(id: number, handled: boolean, name: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("leads").update({ handled }).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({
    action: "update",
    resource: "leads",
    resourceId: String(id),
    summary: `${name} — marcada como ${handled ? "atendida" : "pendente"}`,
  });
  revalidateLeadPages();
}

export async function deleteLead(id: number, name: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "leads", resourceId: String(id), summary: name });
  revalidateLeadPages();
}
