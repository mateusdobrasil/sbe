import { Icon } from "@/components/ui/Icon";
import type { Provider } from "@/lib/content/types";

/**
 * Cartão de credenciado.
 *
 * No site antigo cada parceiro era apenas um logo em imagem, sem texto
 * alternativo — invisível para o Google e para leitores de tela. Aqui o
 * nome e as especialidades são texto real; a marca aparece como monograma.
 */
export function ProviderCard({ provider }: { provider: Provider }) {
  const monogram = provider.name
    .replace(/^(Hospital|Clínica|Instituto|Laboratório)\s+(d[aeo]s?\s+)?/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-deep-800 font-[family-name:var(--font-bricolage)] text-lg font-bold text-brand-300"
        >
          {monogram}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base leading-snug text-ink">{provider.name}</h3>
          {provider.district && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-mute">
              <Icon name="pin" className="size-4 shrink-0" />
              {provider.district}
            </p>
          )}
        </div>
        {provider.discount && (
          <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-800">
            −{provider.discount}%
          </span>
        )}
      </div>

      <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
        {provider.specialties.map((s) => (
          <li key={s} className="rounded-full bg-paper-alt px-2.5 py-1 text-xs font-medium text-ink-soft">
            {s}
          </li>
        ))}
      </ul>

      {provider.phone && (
        <a
          href={`tel:${provider.phone.replace(/\D/g, "")}`}
          className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-sm font-semibold text-deep-800 hover:text-brand-700"
        >
          <Icon name="phone" className="size-4" />
          {provider.phone}
        </a>
      )}
    </article>
  );
}
