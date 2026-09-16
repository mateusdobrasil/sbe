import { Field, SubmitButton } from "@/components/admin/Field";

export function LeaderForm({
  leader,
  action,
}: {
  leader?: { name?: string; role?: string; term?: string | null; photo?: string | null; sort_order?: number | null };
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      <Field label="Nome" name="name" defaultValue={leader?.name} required />
      <Field label="Cargo" name="role" defaultValue={leader?.role} required hint='Ex.: "Presidência", "Diretoria financeira"' />
      <Field label="Gestão" name="term" defaultValue={leader?.term ?? ""} hint='Ex.: "Gestão 2024–2027"' />
      <Field label="Foto (URL)" name="photo" defaultValue={leader?.photo ?? ""} />
      <Field
        label="Ordem"
        name="sort_order"
        type="number"
        defaultValue={leader?.sort_order ?? 0}
        hint="Cargos com número menor aparecem primeiro."
      />
      <SubmitButton />
    </form>
  );
}
