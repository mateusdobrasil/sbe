import { twMerge } from "tailwind-merge";

/**
 * Concatena classes resolvendo conflitos do Tailwind.
 *
 * Sem twMerge, passar "hidden" por cima de um componente cujo estilo base já
 * tem "inline-flex" não funciona: quem vence é a ordem no CSS gerado, não a
 * ordem no atributo class. Foi assim que o botão Agendar apareceu no celular
 * e empurrou o menu hambúrguer para fora da tela.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(" "));
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Normaliza texto para busca: sem acentos, minúsculo. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
