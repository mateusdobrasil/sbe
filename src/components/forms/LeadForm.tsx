"use client";

import { useState } from "react";
import { ButtonAction } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/site";
import type { LeadKind } from "@/app/api/contato/route";

type Status = { state: "idle" | "sending" } | { state: "sent"; notice?: string } | { state: "error"; message: string };

const field =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink-mute focus:border-brand-500";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

/**
 * Formulário de contato reutilizado em contato, voluntariado e associação.
 *
 * Grava no Supabase pela rota /api/contato. Sem banco configurado, ainda
 * responde com sucesso e orienta o usuário ao WhatsApp, em vez de falhar.
 */
export function LeadForm({
  kind,
  subjects,
  messageLabel = "Mensagem",
  messagePlaceholder,
  submitLabel = "Enviar mensagem",
}: {
  kind: LeadKind;
  subjects?: string[];
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ state: "sending" });

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind }),
      });
      const json = (await res.json()) as { error?: string; notice?: string };

      if (!res.ok) {
        setStatus({ state: "error", message: json.error ?? "Não foi possível enviar." });
        return;
      }
      form.reset();
      setStatus({ state: "sent", notice: json.notice });
    } catch {
      setStatus({
        state: "error",
        message: "Falha de conexão. Tente novamente ou fale conosco pelo WhatsApp.",
      });
    }
  }

  if (status.state === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-brand-50 p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-500 text-deep-950">
          <Icon name="check" className="size-7" />
        </span>
        <h3 className="mt-5 text-xl text-ink">Mensagem enviada</h3>
        <p className="mt-2 text-ink-soft">
          {status.notice ?? "Nossa equipe entra em contato em até 2 dias úteis."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-deep-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-deep-700"
          >
            <Icon name="whatsapp" className="size-4" />
            Falar agora no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setStatus({ state: "idle" })}
            className="text-sm font-semibold text-brand-700 underline underline-offset-4"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Isca anti-spam — escondida de gente, visível para robôs. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`site-${kind}`}>Não preencha este campo</label>
        <input id={`site-${kind}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`nome-${kind}`} className={labelClass}>
            Nome completo <span className="text-brand-700">*</span>
          </label>
          <input id={`nome-${kind}`} name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor={`tel-${kind}`} className={labelClass}>
            Telefone / WhatsApp <span className="text-brand-700">*</span>
          </label>
          <input
            id={`tel-${kind}`}
            name="phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(65) 99999-9999"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`email-${kind}`} className={labelClass}>
          E-mail <span className="text-brand-700">*</span>
        </label>
        <input
          id={`email-${kind}`}
          name="email"
          required
          type="email"
          autoComplete="email"
          className={field}
        />
      </div>

      {subjects && (
        <div>
          <label htmlFor={`assunto-${kind}`} className={labelClass}>
            Assunto
          </label>
          <div className="relative">
            <select id={`assunto-${kind}`} name="subject" className={`${field} appearance-none pr-10`}>
              {subjects.map((s) => (
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
      )}

      <div>
        <label htmlFor={`msg-${kind}`} className={labelClass}>
          {messageLabel}
        </label>
        <textarea
          id={`msg-${kind}`}
          name="message"
          rows={5}
          placeholder={messagePlaceholder}
          className={`${field} resize-y`}
        />
      </div>

      {status.state === "error" && (
        <p role="alert" className="rounded-xl border border-brand-300 bg-brand-50 p-4 text-sm text-brand-900">
          {status.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <ButtonAction type="submit" size="lg" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Enviando…" : submitLabel}
        </ButtonAction>
        <p className="text-sm text-ink-mute">
          Seus dados são usados apenas para retorno deste contato.
        </p>
      </div>
    </form>
  );
}
