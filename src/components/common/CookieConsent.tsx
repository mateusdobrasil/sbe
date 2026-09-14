"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonAction } from "@/components/ui/Button";

const STORAGE_KEY = "sbe-consentimento-cookies";

/**
 * Aviso de cookies conforme a LGPD.
 *
 * Só grava a escolha após a ação do usuário — nenhum script de medição
 * deve ser carregado antes do aceite.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Navegação privada ou cookies bloqueados: não insiste.
    }
  }, []);

  const decide = (choice: "aceito" | "recusado") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignora */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-line bg-paper p-5 shadow-xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:max-w-md"
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        Usamos cookies essenciais para o funcionamento do site e, com sua permissão,
        cookies de medição de audiência. Saiba mais na{" "}
        <Link href="/politica-de-privacidade" className="font-semibold text-brand-700 underline underline-offset-2">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2.5">
        <ButtonAction size="sm" onClick={() => decide("aceito")}>
          Aceitar
        </ButtonAction>
        <ButtonAction size="sm" variant="ghost" onClick={() => decide("recusado")}>
          Somente essenciais
        </ButtonAction>
      </div>
    </div>
  );
}
