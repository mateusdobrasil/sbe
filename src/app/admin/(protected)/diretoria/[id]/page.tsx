import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { LeaderForm } from "../LeaderForm";
import { updateLeader } from "../actions";

export const metadata = { title: "Editar cargo" };

export default async function EditLeaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const db = getSupabaseAdmin();
  const { data: leader } = db
    ? await db.from("leaders").select("*").eq("id", numericId).maybeSingle()
    : { data: null };

  if (!leader) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Editar cargo</h1>
      <LeaderForm leader={leader} action={updateLeader.bind(null, numericId)} />
    </div>
  );
}
