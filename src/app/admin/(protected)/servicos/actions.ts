"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";

function parseForm(formData: FormData) {
  const howTo = String(formData.get("how_to") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "heart"),
    category: String(formData.get("category") ?? "Saúde"),
    price: String(formData.get("price") ?? "").trim() || null,
    how_to: howTo,
  };
}

function revalidateServicePages() {
  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.slug || !values.name) throw new Error("Nome e identificador são obrigatórios.");

  const { error } = await db.from("services").insert(values);
  if (error) throw new Error(error.message);

  await logAudit({ action: "create", resource: "services", resourceId: values.slug, summary: values.name, changes: values });
  revalidateServicePages();
  redirect("/admin/servicos");
}

export async function updateService(originalSlug: string, formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  const { error } = await db.from("services").update(values).eq("slug", originalSlug);
  if (error) throw new Error(error.message);

  await logAudit({ action: "update", resource: "services", resourceId: originalSlug, summary: values.name, changes: values });
  revalidateServicePages();
  redirect("/admin/servicos");
}

export async function deleteService(slug: string, name: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("services").delete().eq("slug", slug);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "services", resourceId: slug, summary: name });
  revalidateServicePages();
}
