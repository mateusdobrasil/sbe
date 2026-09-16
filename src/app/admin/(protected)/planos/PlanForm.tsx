import { Checkbox, Field, SubmitButton } from "@/components/admin/Field";

interface PlanFormValues {
  slug?: string;
  name?: string;
  price?: string;
  period?: string;
  highlight?: boolean | null;
  benefits?: string[] | null;
  note?: string | null;
}

export function PlanForm({
  plan,
  action,
}: {
  plan?: PlanFormValues;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      <Field
        label="Identificador (slug)"
        name="slug"
        defaultValue={plan?.slug}
        required
        disabled={!!plan}
        hint={plan ? "Não pode ser alterado depois de criado." : "Ex.: familiar"}
      />
      <Field label="Nome do plano" name="name" defaultValue={plan?.name} required />
      <Field label="Preço" name="price" defaultValue={plan?.price} required hint='Ex.: "R$ 49,90" ou "Sob consulta"' />
      <Field label="Período" name="period" defaultValue={plan?.period ?? "por mês"} />
      <Field
        label="Benefícios"
        name="benefits"
        defaultValue={(plan?.benefits ?? []).join("\n")}
        textarea
        rows={6}
        hint="Um benefício por linha."
      />
      <Field label="Selo" name="note" defaultValue={plan?.note ?? ""} hint='Ex.: "Plano mais procurado"' />
      <Checkbox label="Destacar este plano" name="highlight" defaultChecked={plan?.highlight ?? false} />
      <SubmitButton />
    </form>
  );
}
