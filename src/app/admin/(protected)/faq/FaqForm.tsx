import { Field, SubmitButton } from "@/components/admin/Field";

export function FaqForm({
  faq,
  action,
}: {
  faq?: { question?: string; answer?: string; sort_order?: number | null };
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      <Field label="Pergunta" name="question" defaultValue={faq?.question} required />
      <Field label="Resposta" name="answer" defaultValue={faq?.answer} textarea rows={5} required />
      <Field
        label="Ordem"
        name="sort_order"
        type="number"
        defaultValue={faq?.sort_order ?? 0}
        hint="Perguntas com número menor aparecem primeiro."
      />
      <SubmitButton />
    </form>
  );
}
