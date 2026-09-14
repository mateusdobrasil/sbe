import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/common/JsonLd";
import { content } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Serviços — consultas, exames e assistência social",
  description:
    "Consultas médicas agendadas, exames laboratoriais e de imagem, apoio psicológico e assistência a famílias em Cuiabá, com valores acessíveis e sem carência.",
  alternates: { canonical: "/servicos" },
};

const categoryOrder = ["Saúde", "Assistência social", "Apoio"] as const;

export default async function ServicosPage() {
  const services = await content.getServices();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Serviços da SBE Cuiabá",
    itemListElement: services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.summary,
        provider: { "@id": `${site.url}/#organizacao` },
        areaServed: { "@type": "City", name: site.address.city },
      },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title="Tudo o que a SBE oferece, em detalhe"
        description="Sem letras miúdas: o que é cada serviço, quanto custa e exatamente o que fazer para ser atendido."
      >
        <Button href={whatsappLink("Olá! Gostaria de agendar um atendimento na SBE.")} size="lg">
          <Icon name="whatsapp" className="size-5" />
          Agendar atendimento
        </Button>
      </PageHero>
      <Breadcrumbs items={[{ label: "Serviços" }]} />

      {categoryOrder.map((category, index) => {
        const items = services.filter((s) => s.category === category);
        if (items.length === 0) return null;

        return (
          <Section key={category} tone={index % 2 === 0 ? "paper" : "alt"} size="wide">
            <SectionHeader
              eyebrow={category}
              title={
                category === "Saúde"
                  ? "Atendimento em saúde"
                  : category === "Assistência social"
                    ? "Assistência social"
                    : "Programas de apoio"
              }
            />

            <div className="mt-12 space-y-6">
              {items.map((service) => (
                <article
                  key={service.slug}
                  id={service.slug}
                  className="scroll-mt-32 rounded-2xl border border-line bg-paper p-7 sm:p-9"
                >
                  <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                      <div className="flex items-start gap-4">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                          <Icon name={service.icon} className="size-6" />
                        </span>
                        <div>
                          <h3 className="text-2xl text-ink">{service.name}</h3>
                          {service.price && (
                            <span className="mt-2 inline-block rounded-full bg-deep-50 px-3 py-1 text-sm font-semibold text-deep-700">
                              {service.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-5 text-lg leading-relaxed text-ink-soft">{service.description}</p>
                    </div>

                    {service.howTo && (
                      <div className="rounded-xl bg-paper-alt p-6">
                        <h4 className="text-base font-bold text-ink">Como ser atendido</h4>
                        <ol className="mt-4 space-y-3">
                          {service.howTo.map((step, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-deep-950">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed text-ink-soft">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        );
      })}

      <Section tone="deep" size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeader
            tone="dark"
            eyebrow="Ainda com dúvida?"
            title="Fale com a recepção antes de vir"
            description="Assim você já chega sabendo o que trazer, se precisa de jejum e qual o valor do seu caso."
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button href={whatsappLink()} size="lg">
              <Icon name="whatsapp" className="size-5" />
              WhatsApp
            </Button>
            <Button href={`tel:${site.phone.tel}`} variant="onDark" size="lg">
              <Icon name="phone" className="size-5" />
              {site.phone.display}
            </Button>
          </div>
        </div>
      </Section>

      <JsonLd data={schema} />
    </>
  );
}
