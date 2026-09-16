"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/admin/audit";
import { renderMarkdown } from "@/lib/markdown";

function parseForm(formData: FormData) {
  const contentMd = String(formData.get("content_md") ?? "");
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content_md: contentMd,
    // O site lê `content` como HTML pronto — renderizado aqui, uma vez, ao
    // salvar. Assim a leitura pública nunca precisa rodar o Markdown de novo.
    content: renderMarkdown(contentMd),
    date: String(formData.get("date") ?? "").trim() || new Date().toISOString().slice(0, 10),
    category: String(formData.get("category") ?? "Notícias").trim(),
    author: String(formData.get("author") ?? "").trim() || null,
    cover: String(formData.get("cover") ?? "").trim() || null,
    published: formData.get("published") === "on",
  };
}

function revalidatePostPages(slug?: string) {
  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  revalidatePath("/");
  if (slug) revalidatePath(`/noticias/${slug}`);
}

export async function createPost(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  if (!values.slug || !values.title) throw new Error("Título e identificador são obrigatórios.");

  const { error } = await db.from("posts").insert(values);
  if (error) throw new Error(error.message);

  await logAudit({
    action: "create",
    resource: "posts",
    resourceId: values.slug,
    summary: values.title,
    changes: { ...values, content: undefined },
  });
  revalidatePostPages(values.slug);
  redirect("/admin/noticias");
}

export async function updatePost(originalSlug: string, formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const values = parseForm(formData);
  const { error } = await db.from("posts").update(values).eq("slug", originalSlug);
  if (error) throw new Error(error.message);

  await logAudit({
    action: "update",
    resource: "posts",
    resourceId: originalSlug,
    summary: values.title,
    changes: { ...values, content: undefined },
  });
  revalidatePostPages(originalSlug);
  redirect("/admin/noticias");
}

export async function deletePost(slug: string, title: string) {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Supabase não configurado.");

  const { error } = await db.from("posts").delete().eq("slug", slug);
  if (error) throw new Error(error.message);

  await logAudit({ action: "delete", resource: "posts", resourceId: slug, summary: title });
  revalidatePostPages(slug);
}
