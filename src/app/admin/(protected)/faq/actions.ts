"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";

function parseForm(formData: FormData) {
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    sort_order: sortOrderRaw ? Number(sortOrderRaw) : 0,
  };
}

function revalidateFaqPages() {
  revalidatePath("/admin/faq");
  revalidatePath("/");
  revalidatePath("/seja-associado");
}

export async function createFaq(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.question || !values.answer) throw new Error("Pergunta e resposta são obrigatórias.");

  const { data, error } = await db.from("faq").insert(values).select("id").single();
  if (error) throw new Error(error.message);

  await logAudit({ action: "create", resource: "faq", resourceId: String(data.id), summary: values.question, changes: values });
  revalidateFaqPages();
  redirect("/admin/faq");
}

export async function updateFaq(id: number, formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  const { error } = await db.from("faq").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "update", resource: "faq", resourceId: String(id), summary: values.question, changes: values });
  revalidateFaqPages();
  redirect("/admin/faq");
}

export async function deleteFaq(id: number, question: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("faq").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "faq", resourceId: String(id), summary: question });
  revalidateFaqPages();
}
