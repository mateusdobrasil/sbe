import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ServiceForm } from "../ServiceForm";
import { updateService } from "../actions";

export const metadata = { title: "Editar serviço" };

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getSupabaseAdmin();
  const { data: service } = db
    ? await db.from("services").select("*").eq("slug", slug).maybeSingle()
    : { data: null };

  if (!service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Editar serviço</h1>
      <ServiceForm service={service} action={updateService.bind(null, slug)} />
    </div>
  );
}
