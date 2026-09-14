"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/lib/nav";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Impede rolagem do fundo enquanto o menu móvel está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Barra de utilidade — telefone e horário sempre visíveis em desktop */}
      <div className="hidden bg-deep-900 text-deep-100 lg:block">
        <Container size="wide">
          <div className="flex items-center justify-between py-2 text-[0.8rem]">
            <p className="flex items-center gap-2">
              <Icon name="pin" className="size-4 text-brand-300" />
              {site.address.street} — {site.address.district}, {site.address.city}/{site.address.state}
            </p>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2">
                <Icon name="clock" className="size-4 text-brand-300" />
                Seg a sex, 07h–17h
              </span>
              <a href={`tel:${site.phone.tel}`} className="flex items-center gap-2 font-semibold hover:text-white">
                <Icon name="phone" className="size-4 text-brand-300" />
                {site.phone.display}
              </a>
            </div>
          </div>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-paper/95 backdrop-blur transition-shadow",
          scrolled ? "border-line shadow-sm" : "border-transparent",
        )}
      >
        <Container size="wide">
          <div className="flex h-18 items-center justify-between gap-4 py-3">
            <Link href="/" aria-label="SBE — página inicial" className="shrink-0">
              <Logo className="text-[14px] sm:text-[15px]" />
            </Link>

            <nav aria-label="Navegação principal" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {mainNav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-full px-3 py-2 text-[0.92rem] font-medium transition-colors",
                          active
                            ? "bg-brand-50 text-brand-800"
                            : "text-ink-soft hover:bg-paper-alt hover:text-ink",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Button href="/doe" size="sm" className="hidden sm:inline-flex">
                <Icon name="heartHand" className="size-4" />
                Doar
              </Button>
              <Button
                href={whatsappLink("Olá! Gostaria de agendar uma consulta.")}
                variant="secondary"
                size="sm"
                className="hidden md:inline-flex"
              >
                <Icon name="whatsapp" className="size-4" />
                Agendar
              </Button>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-movel"
                className="rounded-full p-2.5 text-ink hover:bg-paper-alt xl:hidden"
              >
                <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                  {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>
        </Container>

        {/* Menu móvel */}
        <div
          id="menu-movel"
          hidden={!open}
          className="border-t border-line bg-paper xl:hidden"
        >
          <Container size="wide">
            <nav aria-label="Navegação principal (móvel)" className="py-4">
              <ul className="space-y-1">
                {mainNav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
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
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 grid gap-2.5 border-t border-line pt-5 sm:grid-cols-2">
                <Button href="/doe" size="lg">
                  <Icon name="heartHand" className="size-5" />
                  Fazer uma doação
                </Button>
                <Button href={whatsappLink()} variant="secondary" size="lg">
                  <Icon name="whatsapp" className="size-5" />
                  WhatsApp
                </Button>
              </div>

              <a
                href={`tel:${site.phone.tel}`}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-deep-800"
              >
                <Icon name="phone" className="size-4" />
                {site.phone.display}
              </a>
            </nav>
          </Container>
        </div>
      </header>
    </>
  );
}
