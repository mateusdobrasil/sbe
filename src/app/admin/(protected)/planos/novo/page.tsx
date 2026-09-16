import { PlanForm } from "../PlanForm";
import { createPlan } from "../actions";

export const metadata = { title: "Novo plano" };

export default function NewPlanPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Novo plano</h1>
      <PlanForm action={createPlan} />
    </div>
  );
}
