import { Checkbox, Field, SubmitButton } from "@/components/admin/Field";

interface ProviderFormValues {
  slug?: string;
  name?: string;
  specialties?: string[] | null;
  district?: string | null;
  address?: string | null;
  phone?: string | null;
  discount?: number | null;
  featured?: boolean | null;
}

export function ProviderForm({
  provider,
  action,
}: {
  provider?: ProviderFormValues;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      <Field
        label="Identificador (slug)"
        name="slug"
        defaultValue={provider?.slug}
        required
        disabled={!!provider}
        hint={
          provider
            ? "Não pode ser alterado depois de criado."
            : "Só letras minúsculas, números e hífen. Ex.: hospital-sao-judas"
        }
      />
      <Field label="Nome" name="name" defaultValue={provider?.name} required />
      <Field
        label="Especialidades"
        name="specialties"
        defaultValue={(provider?.specialties ?? []).join(", ")}
        hint="Separadas por vírgula. Ex.: Cardiologia, Exames laboratoriais"
      />
      <Field label="Bairro" name="district" defaultValue={provider?.district ?? ""} />
      <Field label="Endereço" name="address" defaultValue={provider?.address ?? ""} />
      <Field label="Telefone" name="phone" defaultValue={provider?.phone ?? ""} />
      <Field
        label="Desconto para associados (%)"
        name="discount"
        type="number"
        step="1"
        defaultValue={provider?.discount ?? ""}
      />
      <Checkbox label="Destacar na página inicial" name="featured" defaultChecked={provider?.featured ?? false} />
      <SubmitButton />
    </form>
  );
}
