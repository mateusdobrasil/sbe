"use client";

import { useState } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/**
 * Editor de Markdown com prévia ao vivo.
 *
 * A textarea fica sempre no DOM (só escondida com `hidden`, nunca
 * desmontada) para que seu valor continue fazendo parte do FormData no
 * envio, não importa qual aba esteja visível. A prévia roda a mesma
 * `renderMarkdown` usada ao salvar — o que a equipe vê aqui é o que vai
 * para o ar.
 */
export function MarkdownEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [tab, setTab] = useState<"editar" | "visualizar">("editar");

  return (
    <div>
      <div className="flex gap-1">
        {(["editar", "visualizar"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-t-lg border border-b-0 border-line px-3 py-1.5 text-sm font-semibold capitalize",
              tab === t ? "bg-paper-alt text-ink" : "bg-paper text-ink-mute hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={18}
        hidden={tab !== "editar"}
        className="w-full rounded-b-lg rounded-tr-lg border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink focus:border-brand-500"
      />

      {tab === "visualizar" && (
        <div
          className="rich-text min-h-40 rounded-b-lg rounded-tr-lg border border-line bg-paper p-5"
          dangerouslySetInnerHTML={{
            __html: value.trim() ? renderMarkdown(value) : "<p>Nada para mostrar ainda.</p>",
          }}
        />
      )}
    </div>
  );
}
