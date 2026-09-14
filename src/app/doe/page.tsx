import type { Metadata } from "next";
import Link from "next/link";
import transparencia from "../../../content/transparencia.json";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PixBox } from "@/components/doe/PixBox";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Doe — apoie a assistência em saúde em Cuiabá",
  description:
    "Doe para a Sociedade Beneficente Evangélica por PIX, com QR Code e copia-e-cola. Sua contribuição vira consulta, exame e cesta básica para famílias de Cuiabá.",
  alternates: { canonical: "/doe" },
};

const otherWays = [
  {
    icon: "basket" as const,
    title: "Produtos e alimentos",
    text: "Alimentos não perecíveis, roupas em bom estado, material de higiene e limpeza. Entregue na sede ou combine a coleta pelo WhatsApp.",
  },
  {
    icon: "shield" as const,
    title: "Empresas e institutos",
    text: "Doações financeiras, de produtos ou de serviços profissionais. Emitimos recibo e prestamos contas da aplicação.",
  },
  {
    icon: "users" as const,
    title: "Seu tempo",
    text: "Voluntariado no atendimento, em eventos, na organização de doações e no apoio administrativo.",
    href: "/voluntariado",
    linkLabel: "Quero ser voluntário",
  },
];

export default function DoePage() {
  return (
    <>
      <PageHero
        eyebrow="Como ajudar"
        title="Sua doação vira consulta, exame e cesta na mesa"
        description="Escolha o valor, gere o QR Code e doe em segundos. Cada real recebido tem destino publicado na nossa prestação de contas."
      />
      <Breadcrumbs items={[{ label: "Doe" }]} />

      <Section tone="paper" size="wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <SectionHeader
              eyebrow="Doação via PIX"
              title="Doe em menos de um minuto"
              description="Gere o código, abra o app do seu banco e confirme. Não é preciso digitar chave nem valor à mão."
            />

            <div className="mt-8 space-y-5">
              {[
                { label: "R$ 25", text: "custeia uma consulta clínica a valor social" },
                { label: "R$ 50", text: "cobre um pacote de exames laboratoriais de rotina" },
                { label: "R$ 100", text: "monta uma cesta básica completa para uma família" },
                { label: "R$ 200", text: "viabiliza um exame de imagem de maior complexidade" },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-4 border-b border-line pb-4 last:border-0">
                  <span className="w-20 shrink-0 font-[family-name:var(--font-bricolage)] text-xl font-bold text-brand-700">
                    {item.label}
                  </span>
                  <span className="leading-relaxed text-ink-soft">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 rounded-xl bg-paper-alt p-4 text-sm leading-relaxed text-ink-mute">
              As equivalências acima são referências de custo médio dos nossos programas, não
              uma vinculação contratual do valor doado a um beneficiário específico.
            </p>

            <p className="mt-6 text-ink-soft">
              Precisa de recibo? Envie o comprovante com nome completo e CPF para{" "}
              <a
                href={`mailto:${site.email.donations}`}
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                {site.email.donations}
              </a>
              .
            </p>
          </div>

          <PixBox pixKey={site.pixKey} />
        </div>
      </Section>

      {/* Para onde vai */}
      <Section tone="alt" size="wide">
        <SectionHeader
          eyebrow="Transparência"
          title="Para onde vai o que você doa"
          description="A destinação abaixo segue a última demonstração financeira publicada. Os documentos completos estão abertos para consulta."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <ul className="space-y-5">
            {transparencia.allocation.map((item) => (
              <li key={item.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold text-ink">{item.label}</span>
                  <span className="font-[family-name:var(--font-bricolage)] text-lg font-bold text-brand-700">
                    {item.percent}%
                  </span>
                </div>
                <div
                  className="mt-2 h-2.5 overflow-hidden rounded-full bg-line"
                  role="img"
                  aria-label={`${item.label}: ${item.percent}% dos recursos`}
                >
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${item.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-line bg-paper p-7">
            <Icon name="book" className="size-9 text-brand-600" />
            <h3 className="mt-4 text-xl text-ink">Prestação de contas aberta</h3>
            <p className="mt-2.5 leading-relaxed text-ink-soft">
              Relatórios anuais, demonstrações financeiras, estatuto e certidões ficam
              permanentemente disponíveis para download — sem precisar pedir.
            </p>
            <Button href="/transparencia" variant="outline" className="mt-6">
              Ver documentos
              <Icon name="arrow" className="size-5" />
            </Button>
          </div>
        </div>
      </Section>

      {/* Outras formas */}
      <Section tone="paper" size="wide">
        <SectionHeader eyebrow="Outras formas de ajudar" title="Nem toda doação é em dinheiro" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {otherWays.map((way) => (
            <div key={way.title} className="flex flex-col rounded-2xl border border-line bg-paper-alt p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={way.icon} className="size-6" />
              </span>
              <h3 className="mt-5 text-lg text-ink">{way.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{way.text}</p>
              {way.href && (
                <Link
                  href={way.href}
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800"
                >
                  {way.linkLabel}
                  <Icon name="arrow" className="size-4" />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-deep-800 p-8 text-white">
          <div>
            <h3 className="text-xl text-white">Quer combinar uma doação?</h3>
            <p className="mt-1.5 text-deep-100">
              Fale com a equipe para alinhar entrega, coleta ou parceria institucional.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={whatsappLink("Olá! Gostaria de fazer uma doação para a SBE.")} size="lg">
              <Icon name="whatsapp" className="size-5" />
              WhatsApp
            </Button>
            <Button href={`mailto:${site.email.donations}`} variant="onDark" size="lg">
              <Icon name="mail" className="size-5" />
              E-mail
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
