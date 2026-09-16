import { TestimonialForm } from "../TestimonialForm";
import { createTestimonial } from "../actions";

export const metadata = { title: "Novo depoimento" };

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Novo depoimento</h1>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
