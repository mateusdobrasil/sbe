"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";

function parseForm(formData: FormData) {
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    term: String(formData.get("term") ?? "").trim() || null,
    photo: String(formData.get("photo") ?? "").trim() || null,
    sort_order: sortOrderRaw ? Number(sortOrderRaw) : 0,
  };
}

function revalidateLeaderPages() {
  revalidatePath("/admin/diretoria");
  revalidatePath("/quem-somos");
}

export async function createLeader(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.name || !values.role) throw new Error("Nome e cargo são obrigatórios.");

  const { data, error } = await db.from("leaders").insert(values).select("id").single();
  if (error) throw new Error(error.message);

  await logAudit({ action: "create", resource: "leaders", resourceId: String(data.id), summary: `${values.name} — ${values.role}`, changes: values });
  revalidateLeaderPages();
  redirect("/admin/diretoria");
}

export async function updateLeader(id: number, formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  const { error } = await db.from("leaders").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "update", resource: "leaders", resourceId: String(id), summary: `${values.name} — ${values.role}`, changes: values });
  revalidateLeaderPages();
  redirect("/admin/diretoria");
}

export async function deleteLeader(id: number, name: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("leaders").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "leaders", resourceId: String(id), summary: name });
  revalidateLeaderPages();
}
