import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/common/JsonLd";
import { NetworkExplorer } from "@/components/rede/NetworkExplorer";
import { content } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rede credenciada — clínicas e laboratórios parceiros em Cuiabá",
  description:
    "Busque entre as clínicas, laboratórios e hospitais credenciados da SBE em Cuiabá por especialidade ou exame. Valores negociados, sem carência e sem limite de uso.",
  alternates: { canonical: "/rede-credenciada" },
};

export default async function RedeCredenciadaPage() {
  const providers = await content.getProviders();
  const specialties = [...new Set(providers.flatMap((p) => p.specialties))];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rede credenciada da SBE Cuiabá",
    numberOfItems: providers.length,
    itemListElement: providers.map((provider, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalClinic",
        name: provider.name,
        ...(provider.address && {
          address: { "@type": "PostalAddress", streetAddress: provider.address, addressLocality: site.address.city },
        }),
        ...(provider.phone && { telephone: provider.phone }),
        availableService: provider.specialties.map((s) => ({ "@type": "MedicalProcedure", name: s })),
      },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="Programa de Parceria na Assistência à Saúde"
        title={`${providers.length} credenciados. ${specialties.length} especialidades. Um só lugar para procurar.`}
        description="Confiança gera comprometimento. Nossos parceiros oferecem valores negociados a associados e não associados — sem carência e sem limite de uso."
      />
      <Breadcrumbs items={[{ label: "Rede credenciada" }]} />

      <div className="bg-paper py-12 sm:py-16">
        <Container size="wide">
          {/* Ancora os cartões (h3) na hierarquia de títulos da página. */}
          <h2 className="sr-only">Buscar na rede credenciada</h2>
          <NetworkExplorer providers={providers} />
        </Container>
      </div>

      <Section tone="alt" size="wide">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Como usar"
              title="Três passos para ser atendido na rede"
            />
            <ol className="mt-8 space-y-5">
              {[
                "Fale com a SBE informando o exame ou a especialidade que você precisa.",
                "Receba a indicação do credenciado mais próximo e o valor do procedimento.",
                "Agende direto com a clínica, informando que foi encaminhado pela SBE.",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-deep-950">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-lg leading-relaxed text-ink-soft">{step}</p>
                </li>
              ))}
            </ol>
            <Button href={whatsappLink("Olá! Preciso de uma indicação na rede credenciada da SBE.")} size="lg" className="mt-8">
              <Icon name="whatsapp" className="size-5" />
              Pedir indicação
            </Button>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-8">
            <span className="flex size-12 items-center justify-center rounded-xl bg-deep-800 text-brand-300">
              <Icon name="heartHand" className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl text-ink">Sua clínica quer se credenciar?</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              O programa funciona em regime de cooperação mútua: a clínica pratica valores
              reduzidos e a SBE encaminha beneficiários de forma constante, com pagamento
              garantido e divulgação institucional.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "Fluxo constante de pacientes encaminhados",
                "Divulgação no site e nas redes da SBE",
                "Sem mensalidade ou taxa de adesão",
                "Contrato simples, em regime de cooperação",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-ink-soft">
                  <Icon name="check" className="mt-1 size-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/contato?assunto=credenciamento" variant="secondary" className="mt-7">
              Quero credenciar minha clínica
            </Button>
          </div>
        </div>
      </Section>

      <JsonLd data={schema} />
    </>
  );
}
