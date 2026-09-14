import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Logotipo da SBE.
 *
 * O original era um PNG de 785 KB com bisel 3D e sombra projetada. Aqui a
 * chama é um SVG de poucos bytes e o lettering é texto real — nítido em
 * qualquer densidade de tela e legível por leitores de tela.
 *
 * A variante `wordmark` mostra só a chama e "SBE": no cabeçalho o nome por
 * extenso ficava em corpo 8px, ilegível, e o bloco de três linhas tornava
 * impossível alinhar o logo com os itens do menu na mesma linha de base.
 */
export function Logo({
  className,
  tone = "light",
  variant = "full",
}: {
  className?: string;
  tone?: "light" | "dark";
  variant?: "full" | "wordmark";
}) {
  return (
    <span className={cn("flex items-center gap-2.5 text-[16px] leading-none", className)}>
      <svg viewBox="0 0 48 56" className="h-[2.1em] w-auto shrink-0" aria-hidden="true">
        <path
          d="M30 2c1.8 10-5.3 13-8.6 18.9-4.1 7.4.9 12.7 4.2 13.6-1.5-4.8 1.1-8.8 3.9-10.9.6 4.8 3.8 6.5 6.4 9.8 3.3 3.8 3 8.8-.3 12.1C43.1 41.3 47 34.5 47 26.6 47 14.1 37.6 7.2 30 2Z"
          fill="#e08a0b"
        />
        <path
          d="M14 14c1.2 6.4-3.4 8.3-5.5 12.1-2.7 4.7.6 8.1 2.7 8.7-1-3.1.7-5.6 2.5-7 .4 3.1 2.4 4.2 4.1 6.3 2.1 2.4 1.9 5.6.2 7.7 4.8-1.6 7.3-6 7.3-11 0-8-6.6-13.5-11.3-16.8Z"
          fill="#f2a036"
        />
      </svg>

      <span className="flex flex-col justify-center gap-[0.28em]">
        <span
          className={cn(
            "font-[family-name:var(--font-bricolage)] text-[1.6em] leading-[0.85] font-extrabold tracking-[-0.03em]",
            tone === "light" ? "text-ink" : "text-white",
          )}
        >
          SBE
        </span>
        {variant === "full" && (
          <span
            className={cn(
              "text-[0.56em] leading-[1.25] font-semibold tracking-[0.06em] uppercase",
              tone === "light" ? "text-ink-mute" : "text-deep-200",
            )}
          >
            Sociedade Beneficente
            <br />
            Evangélica
          </span>
        )}
      </span>

      <span className="sr-only">
        {site.name} — {site.legalName}
      </span>
    </span>
  );
}
