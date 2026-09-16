import { FaqForm } from "../FaqForm";
import { createFaq } from "../actions";

export const metadata = { title: "Nova pergunta" };

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Nova pergunta</h1>
      <FaqForm action={createFaq} />
    </div>
  );
}
