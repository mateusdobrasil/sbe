import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { TestimonialForm } from "../TestimonialForm";
import { updateTestimonial } from "../actions";

export const metadata = { title: "Editar depoimento" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const db = getSupabaseAdmin();
  const { data: testimonial } = db
    ? await db.from("testimonials").select("*").eq("id", numericId).maybeSingle()
    : { data: null };

  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Editar depoimento</h1>
      <TestimonialForm testimonial={testimonial} action={updateTestimonial.bind(null, numericId)} />
    </div>
  );
}
