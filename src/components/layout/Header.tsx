"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { mainNav, secondaryNav } from "@/lib/nav";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Marca o item ativo, incluindo subpáginas como /noticias/algum-post. */
function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const isActive = useIsActive();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Com o menu aberto: trava a rolagem do fundo e marca o body.
   *
   * A marcação some com o botão flutuante do WhatsApp e com o aviso de
   * cookies (regra em globals.css) — os dois ficavam por cima do menu no
   * celular e cobriam os últimos itens da lista.
   */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) document.body.dataset.menu = "aberto";
    else delete document.body.dataset.menu;
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.menu;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Barra superior: institucional + contato ───────────────────── */}
      <div className="hidden bg-deep-900 text-deep-200 lg:block">
        <Container size="wide">
          <div className="flex h-10 items-center justify-between gap-6 text-[0.8125rem]">
            <nav aria-label="Navegação institucional">
              <ul className="flex items-center gap-1">
                {secondaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-8 items-center rounded px-2.5 whitespace-nowrap transition-colors",
                        isActive(item.href) ? "text-brand-300" : "hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-5 whitespace-nowrap">
              <span className="hidden items-center gap-1.5 xl:flex">
                <Icon name="clock" className="size-3.5 text-brand-400" />
                Seg a sex, 07h–17h
              </span>
              <a
                href={`tel:${site.phone.tel}`}
                className="flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-300"
              >
                <Icon name="phone" className="size-3.5 text-brand-400" />
                {site.phone.display}
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-300"
              >
                <Icon name="whatsapp" className="size-3.5 text-brand-400" />
                {site.whatsapp.display}
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Barra principal ──────────────────────────────────────────── */}
      <div
        className={cn(
          "border-b bg-paper/95 backdrop-blur transition-shadow",
          scrolled ? "border-line shadow-sm" : "border-line/60",
        )}
      >
        <Container size="wide">
          <div className="flex h-18 items-center justify-between gap-4 lg:h-20 lg:gap-8">
            <Link
              href="/"
              aria-label="SBE — página inicial"
              className="flex min-h-11 shrink-0 items-center rounded-lg focus-visible:outline-offset-4"
            >
              {/* No celular o nome por extenso fica em corpo 8px e disputa
                  espaço com o botão Doar — ali vale só a marca. */}
              <Logo variant="wordmark" className="text-[16px] md:hidden" />
              <Logo variant="full" className="hidden text-[15px] md:flex lg:text-[15.5px]" />
            </Link>

            {/* whitespace-nowrap é o que impedia os itens de quebrarem em duas linhas */}
            <nav aria-label="Navegação principal" className="hidden min-w-0 lg:block">
              <ul className="flex items-center gap-0.5 xl:gap-1">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-full px-3 py-2 text-[0.9rem] font-medium whitespace-nowrap transition-colors xl:px-3.5 xl:text-[0.9375rem]",
                        isActive(item.href)
                          ? "bg-brand-50 text-brand-800"
                          : "text-ink-soft hover:bg-paper-alt hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* Instagram logo após o último item (Contato) na mesma lista. */}
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram da SBE"
                    className="flex min-h-10 items-center rounded-full px-2.5 text-ink-soft transition-colors hover:bg-paper-alt hover:text-ink xl:px-3"
                  >
                    <Icon name="instagram" className="size-5" />
                  </a>
                </li>
              </ul>
            </nav>

            {/* Entre tablet e desktop o menu já saiu mas ainda sobra espaço:
                melhor preencher com o que um visitante procura no celular. */}
            <div className="hidden items-center gap-6 text-[0.9rem] md:flex lg:hidden">
              <a
                href={`tel:${site.phone.tel}`}
                className="flex items-center gap-2 font-semibold text-deep-800 transition-colors hover:text-brand-700"
              >
                <Icon name="phone" className="size-4 text-brand-600" />
                {site.phone.display}
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold text-deep-800 transition-colors hover:text-brand-700"
              >
                <Icon name="whatsapp" className="size-4 text-brand-600" />
                {site.whatsapp.display}
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button href="/doe" size="sm" className="px-4">
                <Icon name="heartHand" className="size-4" />
                Doar
              </Button>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-movel"
                className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-alt lg:hidden"
              >
                <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Menu do celular ──────────────────────────────────────────── */}
      <div
        id="menu-movel"
        hidden={!open}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-paper shadow-lg lg:hidden"
      >
        <Container size="wide">
          <nav aria-label="Navegação principal (celular)" className="py-5">
            <p className="px-4 pb-2 text-xs font-bold tracking-wider text-ink-mute uppercase">
              Atendimento
            </p>
            <ul className="space-y-0.5">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <MobileLink item={item} active={isActive(item.href)} />
                </li>
              ))}
              {/* Instagram logo abaixo do último item (Contato), na mesma lista. */}
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-paper-alt"
                >
                  <Icon name="instagram" className="size-5 text-brand-600" />
                  <span className="font-semibold text-ink">Instagram</span>
                  <span className="text-ink-mute">{site.social.instagramHandle}</span>
                </a>
              </li>
            </ul>

            <p className="mt-5 px-4 pb-2 text-xs font-bold tracking-wider text-ink-mute uppercase">
              A instituição
            </p>
            <ul className="space-y-0.5">
              {secondaryNav.map((item) => (
                <li key={item.href}>
                  <MobileLink item={item} active={isActive(item.href)} />
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-2.5 border-t border-line pt-5 sm:grid-cols-2">
              <Button href="/doe" size="lg">
                <Icon name="heartHand" className="size-5" />
                Fazer uma doação
              </Button>
              <Button href={whatsappLink()} variant="secondary" size="lg">
                <Icon name="whatsapp" className="size-5" />
                Agendar no WhatsApp
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
              <a
                href={`tel:${site.phone.tel}`}
                className="flex min-h-11 items-center gap-2 font-semibold text-deep-800"
              >
                <Icon name="phone" className="size-4 text-brand-600" />
                {site.phone.display}
              </a>
              <span className="flex items-center gap-2 text-ink-mute">
                <Icon name="clock" className="size-4 text-brand-600" />
                Seg a sex, 07h–17h
              </span>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}

function MobileLink({
  item,
  active,
}: {
  item: { label: string; href: string; description?: string };
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-xl px-4 py-3 transition-colors",
        active ? "bg-brand-50" : "hover:bg-paper-alt",
      )}
    >
      <span className={cn("block font-semibold", active ? "text-brand-800" : "text-ink")}>
        {item.label}
      </span>
      {item.description && (
        <span className="mt-0.5 block text-sm text-ink-mute">{item.description}</span>
      )}
    </Link>
  );
}
