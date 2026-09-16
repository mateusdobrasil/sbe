"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8 shadow-sm">
      <h1 className="text-xl font-bold text-ink">Painel SBE</h1>
      <p className="mt-1 text-sm text-ink-mute">Acesso restrito à equipe da instituição.</p>

      <input type="hidden" name="redirect" value={redirectTo} />

      <div className="mt-6">
        <label htmlFor="username" className="block text-sm font-semibold text-ink">
          Usuário
        </label>
        <input
          id="username"
          name="username"
          required
          autoFocus
          autoComplete="username"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:border-brand-500"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="password" className="block text-sm font-semibold text-ink">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:border-brand-500"
        />
      </div>

      {state.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-lg bg-deep-800 py-2.5 font-semibold text-white transition-colors hover:bg-deep-700 disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
