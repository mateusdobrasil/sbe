import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PlanForm } from "../PlanForm";
import { updatePlan } from "../actions";

export const metadata = { title: "Editar plano" };

export default async function EditPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getSupabaseAdmin();
  const { data: plan } = db
    ? await db.from("membership_plans").select("*").eq("slug", slug).maybeSingle()
    : { data: null };

  if (!plan) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Editar plano</h1>
      <PlanForm plan={plan} action={updatePlan.bind(null, slug)} />
    </div>
  );
}
