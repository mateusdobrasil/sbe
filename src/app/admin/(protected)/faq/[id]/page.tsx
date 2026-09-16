import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { FaqForm } from "../FaqForm";
import { updateFaq } from "../actions";

export const metadata = { title: "Editar pergunta" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const db = getSupabaseAdmin();
  const { data: faq } = db
    ? await db.from("faq").select("*").eq("id", numericId).maybeSingle()
    : { data: null };

  if (!faq) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Editar pergunta</h1>
      <FaqForm faq={faq} action={updateFaq.bind(null, numericId)} />
    </div>
  );
}
