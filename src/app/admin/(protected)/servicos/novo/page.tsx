import { ServiceForm } from "../ServiceForm";
import { createService } from "../actions";

export const metadata = { title: "Novo serviço" };

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Novo serviço</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
