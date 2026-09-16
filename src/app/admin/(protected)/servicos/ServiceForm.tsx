import { Field, SubmitButton } from "@/components/admin/Field";

const ICONS = ["stethoscope", "flask", "scan", "heart", "basket", "users", "book", "shield"];
const CATEGORIES = ["Saúde", "Assistência social", "Apoio"];

interface ServiceFormValues {
  slug?: string;
  name?: string;
  summary?: string;
  description?: string;
  icon?: string;
  category?: string;
  price?: string | null;
  how_to?: string[] | null;
}

export function ServiceForm({
  service,
  action,
}: {
  service?: ServiceFormValues;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      <Field
        label="Identificador (slug)"
        name="slug"
        defaultValue={service?.slug}
        required
        disabled={!!service}
        hint={service ? "Não pode ser alterado depois de criado." : "Ex.: consultas-agendadas"}
      />
      <Field label="Nome" name="name" defaultValue={service?.name} required />
      <Field
        label="Resumo"
        name="summary"
        defaultValue={service?.summary}
        required
        hint="Frase curta exibida no cartão do serviço."
      />
      <Field
        label="Descrição completa"
        name="description"
        defaultValue={service?.description}
        textarea
        rows={5}
      />

      <div>
        <label htmlFor="icon" className="block text-sm font-semibold text-ink">
          Ícone
        </label>
        <select
          id="icon"
          name="icon"
          defaultValue={service?.icon ?? "heart"}
          className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink"
        >
          {ICONS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-ink">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          defaultValue={service?.category ?? "Saúde"}
          className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <Field label="Valor" name="price" defaultValue={service?.price ?? ""} hint='Ex.: "Gratuito", "Valor social"' />
      <Field
        label="Como ser atendido"
        name="how_to"
        defaultValue={(service?.how_to ?? []).join("\n")}
        textarea
        rows={4}
        hint="Um passo por linha."
      />
      <SubmitButton />
    </form>
  );
}
