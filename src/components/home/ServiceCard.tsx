import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/lib/content/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/servicos#${service.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-paper p-7 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-500 group-hover:text-deep-950">
        <Icon name={service.icon} className="size-6" />
      </span>

      <h3 className="mt-5 text-lg text-ink">{service.name}</h3>
      <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{service.summary}</p>

      <span className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        {service.price && (
          <span className="rounded-full bg-deep-50 px-3 py-1 text-sm font-semibold text-deep-700">
            {service.price}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          Saiba mais
          <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
