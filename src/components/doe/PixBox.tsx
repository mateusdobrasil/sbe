"use client";

import { useState, useTransition } from "react";
import { ButtonAction } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const PRESETS = [25, 50, 100, 200];

interface PixResult {
  payload: string;
  qrDataUrl: string;
}

/**
 * Doação via PIX.
 *
 * O site antigo mostrava só a chave solta, para o doador digitar à mão no app
 * do banco. Aqui o valor é escolhido, o payload BR Code é gerado no servidor
 * e o doador copia ou lê o QR Code — sem digitar nada.
 */
export function PixBox({ pixKey }: { pixKey: string }) {
  const [amount, setAmount] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [result, setResult] = useState<PixResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const effectiveAmount = custom
    ? Number(custom.replace(/[^\d,]/g, "").replace(",", "."))
    : amount;

  async function generate() {
    setError(null);
    setCopied(false);
    const res = await fetch("/api/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: effectiveAmount || undefined }),
    });

    if (!res.ok) {
      setError("Não conseguimos gerar o código agora. Use a chave PIX abaixo.");
      return;
    }
    setResult((await res.json()) as PixResult);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Seu navegador bloqueou a cópia. Selecione o código manualmente.");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <h3 className="text-xl text-ink">Escolha um valor</h3>
      <p className="mt-1.5 text-ink-soft">
        Qualquer quantia ajuda. Você também pode deixar o valor em aberto e definir no app do banco.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {PRESETS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setAmount(value);
              setCustom("");
              setResult(null);
            }}
            aria-pressed={amount === value && !custom}
            className={cn(
              "rounded-xl border-2 py-3 font-semibold transition-colors",
              amount === value && !custom
                ? "border-brand-500 bg-brand-50 text-brand-800"
                : "border-line text-ink-soft hover:border-brand-300",
            )}
          >
            R$ {value}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="pix-valor" className="mb-2 block text-sm font-semibold text-ink">
          Ou digite outro valor
        </label>
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-ink-mute">R$</span>
          <input
            id="pix-valor"
            type="text"
            inputMode="decimal"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setResult(null);
            }}
            placeholder="0,00"
            className="w-full rounded-xl border border-line bg-paper py-3 pr-4 pl-12 text-ink placeholder:text-ink-mute focus:border-brand-500"
          />
        </div>
      </div>

      <ButtonAction
        size="lg"
        className="mt-5 w-full"
        disabled={pending}
        onClick={() => startTransition(() => { void generate(); })}
      >
        <Icon name="heartHand" className="size-5" />
        {pending ? "Gerando…" : "Gerar código PIX"}
      </ButtonAction>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-7 border-t border-line pt-7">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL gerada no servidor */}
            <img
              src={result.qrDataUrl}
              alt="QR Code PIX para doação à SBE"
              width={176}
              height={176}
              className="rounded-xl border border-line"
            />

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">PIX copia e cola</p>
              <p className="mt-1 text-sm text-ink-soft">
                Abra o app do seu banco, escolha PIX &rarr; Copia e cola, e cole o código abaixo.
              </p>

              <code className="mt-3 block max-h-24 overflow-y-auto rounded-xl bg-paper-alt p-3.5 font-mono text-xs break-all text-ink-soft">
                {result.payload}
              </code>

              <ButtonAction
                size="sm"
                variant="secondary"
                className="mt-3 w-full sm:w-auto"
                onClick={() => void copy(result.payload)}
              >
                <Icon name={copied ? "check" : "copy"} className="size-4" />
                {copied ? "Código copiado" : "Copiar código"}
              </ButtonAction>
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink">Prefere usar a chave?</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-paper-alt px-3 py-2 font-mono text-ink">{pixKey}</code>
          <button
            type="button"
            onClick={() => void copy(pixKey)}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Copiar chave
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-mute">Chave do tipo telefone, em nome da Sociedade Beneficente Evangélica.</p>
      </div>
    </div>
  );
}
