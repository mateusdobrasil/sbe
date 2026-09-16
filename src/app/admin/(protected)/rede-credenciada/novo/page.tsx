import { ProviderForm } from "../ProviderForm";
import { createProvider } from "../actions";

export const metadata = { title: "Novo credenciado" };

export default function NewProviderPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Novo credenciado</h1>
      <ProviderForm action={createProvider} />
    </div>
  );
}
