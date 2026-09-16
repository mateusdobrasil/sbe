import { LeaderForm } from "../LeaderForm";
import { createLeader } from "../actions";

export const metadata = { title: "Novo cargo" };

export default function NewLeaderPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Novo cargo</h1>
      <LeaderForm action={createLeader} />
    </div>
  );
}
