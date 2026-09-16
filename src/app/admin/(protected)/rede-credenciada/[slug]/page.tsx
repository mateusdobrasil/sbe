import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ProviderForm } from "../ProviderForm";
import { updateProvider } from "../actions";

export const metadata = { title: "Editar credenciado" };

export default async function EditProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getSupabaseAdmin();
  const { data: provider } = db
    ? await db.from("providers").select("*").eq("slug", slug).maybeSingle()
    : { data: null };

  if (!provider) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Editar credenciado</h1>
      <ProviderForm provider={provider} action={updateProvider.bind(null, slug)} />
    </div>
  );
}
