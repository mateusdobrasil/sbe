/**
 * Campo de formulário padrão do painel.
 *
 * Componente de servidor puro (sem "use client") — os formulários do
 * painel usam Server Actions e não precisam de estado no navegador, exceto
 * onde indicado (ex.: o editor de Markdown das notícias).
 */
export function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  disabled,
  hint,
  textarea,
  rows = 4,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  hint?: string;
  textarea?: boolean;
  rows?: number;
  step?: string;
}) {
  const className =
    "mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:border-brand-500 disabled:bg-paper-alt disabled:text-ink-mute";

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${className} resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          step={step}
          defaultValue={defaultValue ?? ""}
          required={required}
          disabled={disabled}
          className={className}
        />
      )}
      {hint && <p className="mt-1 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 rounded border-line text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

export function SubmitButton({ children = "Salvar" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-brand-500 px-6 py-2.5 font-semibold text-deep-950 transition-colors hover:bg-brand-400"
    >
      {children}
    </button>
  );
}
