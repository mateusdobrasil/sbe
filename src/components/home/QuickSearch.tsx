"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonAction } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Busca rápida do topo da home.
 *
 * Encaminha para /rede-credenciada com a especialidade pré-selecionada.
 * No site antigo não havia nenhum caminho de busca a partir da home.
 */
export function QuickSearch({ specialties }: { specialties: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const go = (specialty: string) => {
    router.push(`/rede-credenciada?especialidade=${encodeURIComponent(specialty)}`);
  };

  const popular = ["Exames laboratoriais", "Ultrassonografia", "Cardiologia", "Oftalmologia", "Fisioterapia"];

  return (
    <div className="relative z-10 -mt-10 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-paper p-5 shadow-xl shadow-deep-950/10 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value) go(value);
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1">
            <label htmlFor="busca-especialidade" className="mb-2 block text-sm font-semibold text-ink">
              Do que você precisa?
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-mute"
              />
              <select
                id="busca-especialidade"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full appearance-none rounded-xl border border-line bg-paper py-3.5 pr-10 pl-12 text-ink focus:border-brand-500"
              >
                <option value="">Escolha uma especialidade ou exame</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Icon
                name="chevron"
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-mute"
              />
            </div>
          </div>

          <div className="flex items-end">
            <ButtonAction type="submit" size="lg" className="w-full sm:w-auto" disabled={!value}>
              Buscar credenciados
            </ButtonAction>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="text-sm text-ink-mute">Mais procurados:</span>
          {popular.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => go(s)}
              className="inline-flex min-h-10 items-center rounded-full bg-paper-alt px-3.5 text-sm font-medium text-deep-800 transition-colors hover:bg-brand-50 hover:text-brand-800"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
