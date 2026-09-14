import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { mainNav } from "@/lib/nav";
import { whatsappLink } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28">
      <Container size="narrow">
        <p className="font-[family-name:var(--font-bricolage)] text-6xl font-extrabold text-brand-500">404</p>
        <h1 className="mt-4 text-3xl text-ink sm:text-4xl">Esta página não existe mais</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          O endereço pode ter mudado. Veja abaixo para onde você provavelmente queria ir — ou
          fale direto com a gente.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" size="lg">
            Voltar ao início
          </Button>
          <Button href={whatsappLink()} variant="outline" size="lg">
            <Icon name="whatsapp" className="size-5" />
            Falar no WhatsApp
          </Button>
        </div>

        <nav aria-label="Páginas do site" className="mt-12 border-t border-line pt-8">
          <h2 className="text-sm font-bold tracking-wide text-ink-mute uppercase">Páginas do site</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium text-deep-800 transition-colors hover:bg-paper-alt hover:text-brand-800"
                >
                  <Icon name="arrow" className="size-4 text-brand-600" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
