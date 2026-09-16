"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";

function parseForm(formData: FormData) {
  const benefits = String(formData.get("benefits") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    period: String(formData.get("period") ?? "por mês").trim(),
    highlight: formData.get("highlight") === "on",
    benefits,
    note: String(formData.get("note") ?? "").trim() || null,
  };
}

function revalidatePlanPages() {
  revalidatePath("/admin/planos");
  revalidatePath("/seja-associado");
}

export async function createPlan(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.slug || !values.name) throw new Error("Nome e identificador são obrigatórios.");

  const { error } = await db.from("membership_plans").insert(values);
  if (error) throw new Error(error.message);

  await logAudit({ action: "create", resource: "membership_plans", resourceId: values.slug, summary: values.name, changes: values });
  revalidatePlanPages();
  redirect("/admin/planos");
}

export async function updatePlan(originalSlug: string, formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  const { error } = await db.from("membership_plans").update(values).eq("slug", originalSlug);
  if (error) throw new Error(error.message);

  await logAudit({ action: "update", resource: "membership_plans", resourceId: originalSlug, summary: values.name, changes: values });
  revalidatePlanPages();
  redirect("/admin/planos");
}

export async function deletePlan(slug: string, name: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("membership_plans").delete().eq("slug", slug);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "membership_plans", resourceId: slug, summary: name });
  revalidatePlanPages();
}
