import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { LeadForm } from "@/components/forms/LeadForm";
import { site, fullAddress, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato — endereço, telefone e horários",
  description:
    "Fale com a SBE Cuiabá: Av. dos Expedicionários, 65 — CPA IV. Telefone (65) 3644-2768, WhatsApp (65) 99200-3755. Atendimento de segunda a sexta, das 07h às 17h.",
  alternates: { canonical: "/contato" },
};

const channels = [
  {
    icon: "whatsapp" as const,
    title: "WhatsApp",
    value: site.whatsapp.display,
    href: whatsappLink(),
    note: "Canal mais rápido — agendamentos e dúvidas",
  },
  {
    icon: "phone" as const,
    title: "Telefone",
    value: site.phone.display,
    href: `tel:${site.phone.tel}`,
    note: "Seg a sex, 07h às 17h",
  },
  {
    icon: "mail" as const,
    title: "E-mail",
    value: site.email.general,
    href: `mailto:${site.email.general}`,
    note: "Resposta em até 2 dias úteis",
  },
  {
    icon: "pin" as const,
    title: "Endereço",
    value: `${site.address.street} — ${site.address.district}`,
    href: site.address.mapsUrl,
    note: `${site.address.city}/${site.address.state}, CEP ${site.address.zip}`,
  },
];

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Fale conosco"
        title="Estamos aqui para atender você"
        description={`Venha até a sede, ligue ou chame no WhatsApp. ${fullAddress}.`}
      />
      <Breadcrumbs items={[{ label: "Contato" }]} />

      <Section tone="paper" size="wide">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => (
            <a
              key={channel.title}
              href={channel.href}
              {...(channel.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex flex-col rounded-2xl border border-line bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-500 group-hover:text-deep-950">
                <Icon name={channel.icon} className="size-6" />
              </span>
              <h2 className="mt-5 text-sm font-bold tracking-wide text-ink-mute uppercase">
                {channel.title}
              </h2>
              <p className="mt-1.5 font-semibold text-ink group-hover:text-brand-800">{channel.value}</p>
              <p className="mt-1 text-sm text-ink-mute">{channel.note}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section tone="alt" size="wide" className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeader
              eyebrow="Envie uma mensagem"
              title="Escreva para a gente"
              description="Responderemos em até 2 dias úteis. Para agendamentos, o WhatsApp costuma ser mais rápido."
            />
            <div className="mt-10">
              <LeadForm
                kind="contato"
                subjects={[
                  "Agendamento de consulta ou exame",
                  "Dúvida sobre a rede credenciada",
                  "Quero me associar",
                  "Quero fazer uma doação",
                  "Quero ser voluntário",
                  "Credenciamento da minha clínica",
                  "Prestação de contas",
                  "Outro assunto",
                ]}
                messagePlaceholder="Conte como podemos ajudar"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl text-ink">Horário de atendimento</h2>
            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
              {site.hours.map((hour) => (
                <li key={hour.days} className="flex items-center justify-between gap-4 p-5">
                  <span className="flex items-center gap-3 font-medium text-ink">
                    <Icon name="clock" className="size-5 text-brand-600" />
                    {hour.days}
                  </span>
                  <span className="text-ink-soft">{hour.time}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl text-ink">Como chegar</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-line">
              <iframe
                title={`Mapa da sede da SBE em ${site.address.city}`}
                src="https://www.google.com/maps?q=Av.%20dos%20Expedicion%C3%A1rios%2C%2065%20-%20CPA%20IV%2C%20Cuiab%C3%A1%20-%20MT%2C%2078058-513&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full"
              />
            </div>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
            >
              <Icon name="pin" className="size-5" />
              Abrir rota no Google Maps
            </a>
          </div>
        </div>
      </Section>

      <section className="bg-deep-900 py-14 text-white">
        <Container size="wide">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl text-white">Siga a SBE nas redes</h2>
              <p className="mt-1.5 text-deep-100">Ações, mutirões e comunicados em primeira mão.</p>
            </div>
            <div className="flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/70 px-5 py-2.5 font-semibold hover:bg-white hover:text-deep-900"
              >
                <Icon name="instagram" className="size-5" />
                Instagram
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/70 px-5 py-2.5 font-semibold hover:bg-white hover:text-deep-900"
              >
                <Icon name="facebook" className="size-5" />
                Facebook
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
