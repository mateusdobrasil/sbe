import type { ImpactStat } from "@/lib/content/types";

export function ImpactStats({ stats }: { stats: ImpactStat[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-paper p-7">
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block font-[family-name:var(--font-bricolage)] text-4xl font-extrabold text-brand-600">
              {stat.value}
            </span>
            <span className="mt-2 block font-semibold text-ink">{stat.label}</span>
            {stat.note && <span className="mt-1 block text-sm text-ink-mute">{stat.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
