"use client";

import { useEffect, useMemo, useState } from "react";
import { ProviderCard } from "./ProviderCard";
import { Icon } from "@/components/ui/Icon";
import { cn, normalize } from "@/lib/utils";
import type { Provider, Specialty } from "@/lib/content/types";

/**
 * Busca da rede credenciada.
 *
 * A filtragem acontece no cliente: com ~26 credenciados não compensa uma ida
 * ao servidor e o resultado é instantâneo. Se a rede crescer muito, trocar
 * por consulta paginada ao Supabase sem alterar a interface deste componente.
 *
 * O filtro inicial vem da query string, mas é lido em efeito e não por
 * useSearchParams: este componente precisa ser pré-renderizado no HTML
 * estático para que os nomes dos credenciados cheguem ao Google. Com
 * useSearchParams o Next desiste de prerenderizar a subárvore inteira.
 */
export function NetworkExplorer({ providers }: { providers: Provider[] }) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");

  // Aplica ?especialidade=… depois da hidratação, preservando o HTML do servidor.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("especialidade");
    if (fromUrl) setSpecialty(fromUrl);
  }, []);

  const specialties = useMemo(
    () =>
      [...new Set(providers.flatMap((p) => p.specialties))].sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [providers],
  );

  const results = useMemo(() => {
    const q = normalize(query);
    return providers.filter((p) => {
      const matchesSpecialty = !specialty || p.specialties.includes(specialty as Specialty);
      const matchesQuery =
        !q ||
        normalize(p.name).includes(q) ||
        p.specialties.some((s) => normalize(s).includes(q)) ||
        (p.district ? normalize(p.district).includes(q) : false);
      return matchesSpecialty && matchesQuery;
    });
  }, [providers, query, specialty]);

  const hasFilters = Boolean(query || specialty);

  return (
    <div>
      <div className="rounded-2xl border border-line bg-paper-alt p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rede-busca" className="mb-2 block text-sm font-semibold text-ink">
              Buscar por nome, exame ou bairro
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-mute"
              />
              <input
                id="rede-busca"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: ultrassom, Centro, laboratório"
                className="w-full rounded-xl border border-line bg-paper py-3 pr-4 pl-12 text-ink placeholder:text-ink-mute focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="rede-especialidade" className="mb-2 block text-sm font-semibold text-ink">
              Especialidade
            </label>
            <div className="relative">
              <select
                id="rede-especialidade"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full appearance-none rounded-xl border border-line bg-paper py-3 pr-10 pl-4 text-ink focus:border-brand-500"
              >
                <option value="">Todas as especialidades</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron"
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-mute"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => setSpecialty("")}
            aria-pressed={!specialty}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              !specialty
                ? "bg-deep-800 text-white"
                : "bg-paper text-ink-soft hover:bg-brand-50 hover:text-brand-800",
            )}
          >
            Todas ({providers.length})
          </button>
          {specialties.map((s) => {
            const count = providers.filter((p) => p.specialties.includes(s)).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSpecialty(s)}
                aria-pressed={specialty === s}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  specialty === s
                    ? "bg-deep-800 text-white"
                    : "bg-paper text-ink-soft hover:bg-brand-50 hover:text-brand-800",
                )}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-ink-soft">
          <strong className="font-semibold text-ink">{results.length}</strong>{" "}
          {results.length === 1 ? "credenciado encontrado" : "credenciados encontrados"}
          {specialty && (
            <>
              {" "}em <strong className="font-semibold text-ink">{specialty}</strong>
            </>
          )}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSpecialty("");
            }}
            className="text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <ProviderCard key={p.slug} provider={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper-alt p-12 text-center">
          <Icon name="search" className="mx-auto size-10 text-ink-mute" />
          <p className="mt-4 font-semibold text-ink">Nenhum credenciado para essa busca</p>
          <p className="mt-1 text-ink-soft">
            Tente outro termo ou fale com a gente — a rede é atualizada com frequência.
          </p>
        </div>
      )}
    </div>
  );
}
