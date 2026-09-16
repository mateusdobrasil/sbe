import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { footerNav } from "@/lib/nav";
import { site, whatsappLink } from "@/lib/site";

const groups = [
  { title: "Institucional", items: footerNav.institucional },
  { title: "Atendimento", items: footerNav.atendimento },
  { title: "Participe", items: footerNav.participe },
];

export function Footer() {
  return (
    <footer className="bg-deep-900 text-deep-100">
      <Container size="wide">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo className="text-[16px]" tone="dark" />
            <p className="mt-5 max-w-sm leading-relaxed text-deep-200">
              {site.kind} sem fins lucrativos, atuando em {site.address.city} no amparo a
              famílias e no acesso à saúde para quem mais precisa.
            </p>

            <blockquote className="mt-6 border-l-2 border-brand-500 pl-4">
              <p className="text-[0.95rem] italic text-deep-100">“{site.verse.text}”</p>
              <cite className="mt-1 block text-sm not-italic text-brand-300">{site.verse.ref}</cite>
            </blockquote>

            <div className="mt-7 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 p-3 transition-colors hover:border-brand-400 hover:text-brand-300"
              >
                <span className="sr-only">Instagram da SBE</span>
                <Icon name="instagram" className="size-5" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 p-3 transition-colors hover:border-brand-400 hover:text-brand-300"
              >
                <span className="sr-only">Facebook da SBE</span>
                <Icon name="facebook" className="size-5" />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 p-3 transition-colors hover:border-brand-400 hover:text-brand-300"
              >
                <span className="sr-only">WhatsApp da SBE</span>
                <Icon name="whatsapp" className="size-5" />
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-sm font-bold tracking-wide text-white uppercase">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="inline-flex min-h-10 items-center text-deep-200 transition-colors hover:text-brand-300">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="sm:col-span-2 lg:col-span-3">
              <h2 className="text-sm font-bold tracking-wide text-white uppercase">Onde estamos</h2>
              <div className="mt-4 grid gap-4 text-deep-200 sm:grid-cols-2 lg:grid-cols-3">
                <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-10 gap-3 py-1 hover:text-brand-300">
                  <Icon name="pin" className="mt-0.5 size-5 shrink-0 text-brand-400" />
                  <span>
                    {site.address.street}<br />
                    {site.address.district} — {site.address.city}/{site.address.state}<br />
                    CEP {site.address.zip}
                  </span>
                </a>
                {/*
                  min-w-0: sem isso, o e-mail — uma palavra sem espaço — força
                  a largura mínima da coluna pelo seu tamanho inteiro e vaza
                  por cima da coluna de horários ao lado. overflow-wrap sozinho
                  não resolve: ele só entra em ação depois que o item já pode
                  encolher.
                */}
                <div className="min-w-0 space-y-2.5">
                  <a href={`tel:${site.phone.tel}`} className="flex min-h-10 items-center gap-3 hover:text-brand-300">
                    <Icon name="phone" className="size-5 shrink-0 text-brand-400" />
                    {site.phone.display}
                  </a>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-3 hover:text-brand-300">
                    <Icon name="whatsapp" className="size-5 shrink-0 text-brand-400" />
                    {site.whatsapp.display}
                  </a>
                  <a href={`mailto:${site.email.general}`} className="flex min-h-10 items-center gap-3 hover:text-brand-300">
                    <Icon name="mail" className="size-5 shrink-0 text-brand-400" />
                    <span className="min-w-0 break-all">{site.email.general}</span>
                  </a>
                </div>
                <ul className="space-y-1.5">
                  {site.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4 sm:block">
                      <span className="font-medium text-white">{h.days}</span>
                      <span className="sm:block">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-sm text-deep-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} · CNPJ {site.cnpj}
          </p>
          <p>
            <Link href="/politica-de-privacidade" className="inline-flex min-h-10 items-center hover:text-brand-300">
              Política de privacidade
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
