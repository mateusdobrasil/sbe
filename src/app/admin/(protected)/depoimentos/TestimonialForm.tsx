import { Field, SubmitButton } from "@/components/admin/Field";

export function TestimonialForm({
  testimonial,
  action,
}: {
  testimonial?: { quote?: string; author?: string; role?: string | null; sort_order?: number | null };
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      <Field label="Depoimento" name="quote" defaultValue={testimonial?.quote} textarea rows={4} required />
      <Field label="Nome do autor" name="author" defaultValue={testimonial?.author} required />
      <Field
        label="Função / relação com a SBE"
        name="role"
        defaultValue={testimonial?.role ?? ""}
        hint='Ex.: "Associado desde 2020"'
      />
      <Field label="Ordem" name="sort_order" type="number" defaultValue={testimonial?.sort_order ?? 0} />
      <SubmitButton />
    </form>
  );
}
