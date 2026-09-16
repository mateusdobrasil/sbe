"use client";

/**
 * Botão de exclusão com confirmação.
 *
 * `action` é uma Server Action já pré-associada ao registro (via `.bind`).
 * O `onSubmit` roda no cliente só para poder cancelar o envio — a exclusão
 * em si continua sendo uma Server Action normal, sem API própria.
 */
export function DeleteForm({
  action,
  confirmText,
  label = "Excluir",
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="inline"
    >
      <button type="submit" className="font-semibold text-red-700 hover:text-red-800">
        {label}
      </button>
    </form>
  );
}
