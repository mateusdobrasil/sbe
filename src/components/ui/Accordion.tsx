import { Icon } from "./Icon";
import type { FaqItem } from "@/lib/content/types";

/**
 * FAQ usando <details>/<summary> nativos: acessível por teclado e
 * funcional mesmo sem JavaScript, sem nenhum estado no cliente.
 */
export function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-paper">
      {items.map((item) => (
        <details key={item.question} className="group px-5 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-ink marker:hidden">
            {item.question}
            <Icon
              name="chevron"
              className="size-5 shrink-0 text-brand-600 transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="pb-5 leading-relaxed text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
