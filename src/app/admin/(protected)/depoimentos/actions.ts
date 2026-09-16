"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";

function parseForm(formData: FormData) {
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  return {
    quote: String(formData.get("quote") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim() || null,
    sort_order: sortOrderRaw ? Number(sortOrderRaw) : 0,
  };
}

function revalidateTestimonialPages() {
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}

export async function createTestimonial(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.quote || !values.author) throw new Error("Depoimento e autor são obrigatórios.");

  const { data, error } = await db.from("testimonials").insert(values).select("id").single();
  if (error) throw new Error(error.message);

  await logAudit({ action: "create", resource: "testimonials", resourceId: String(data.id), summary: values.author, changes: values });
  revalidateTestimonialPages();
  redirect("/admin/depoimentos");
}

export async function updateTestimonial(id: number, formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  const { error } = await db.from("testimonials").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "update", resource: "testimonials", resourceId: String(id), summary: values.author, changes: values });
  revalidateTestimonialPages();
  redirect("/admin/depoimentos");
}

export async function deleteTestimonial(id: number, author: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "testimonials", resourceId: String(id), summary: author });
  revalidateTestimonialPages();
}
