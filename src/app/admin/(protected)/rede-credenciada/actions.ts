"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";

function parseForm(formData: FormData) {
  const specialties = String(formData.get("specialties") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const discountRaw = String(formData.get("discount") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    specialties,
    district: String(formData.get("district") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    discount: discountRaw ? Number(discountRaw) : null,
    featured: formData.get("featured") === "on",
  };
}

function revalidateProviderPages() {
  revalidatePath("/admin/rede-credenciada");
  revalidatePath("/rede-credenciada");
  revalidatePath("/"); // a home mostra credenciados em destaque e a contagem total
}

export async function createProvider(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.slug || !values.name) throw new Error("Nome e identificador são obrigatórios.");

  const { error } = await db.from("providers").insert(values);
  if (error) throw new Error(error.message);

  await logAudit({ action: "create", resource: "providers", resourceId: values.slug, summary: values.name, changes: values });
  revalidateProviderPages();
  redirect("/admin/rede-credenciada");
}

export async function updateProvider(originalSlug: string, formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.name) throw new Error("Nome é obrigatório.");

  const { error } = await db.from("providers").update(values).eq("slug", originalSlug);
  if (error) throw new Error(error.message);

  await logAudit({ action: "update", resource: "providers", resourceId: originalSlug, summary: values.name, changes: values });
  revalidateProviderPages();
  redirect("/admin/rede-credenciada");
}

export async function deleteProvider(slug: string, name: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("providers").delete().eq("slug", slug);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "providers", resourceId: slug, summary: name });
  revalidateProviderPages();
}
