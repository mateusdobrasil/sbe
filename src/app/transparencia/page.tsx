import type { Metadata } from "next";
import transparencia from "../../../content/transparencia.json";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Transparência — prestação de contas e documentos",
  description:
    "Relatórios anuais, demonstrações financeiras, estatuto social e certidões da Sociedade Beneficente Evangélica de Cuiabá, abertos para consulta e download.",
  alternates: { canonical: "/transparencia" },
};

export default async function TransparenciaPage() {
  const docs = await content.getTransparencyDocs();
  const years = [...new Set(docs.map((d) => d.year))].sort((a, b) => b - a);

  return (
    <>
      <PageHero
        eyebrow="Transparência"
        title="Quem doa tem o direito de saber para onde o dinheiro foi"
        description="Todos os documentos institucionais e financeiros da SBE ficam publicados aqui, permanentemente e sem necessidade de solicitação."
      />
      <Breadcrumbs items={[{ label: "Transparência" }]} />

      {/* Identificação */}
      <Section tone="paper" size="wide">
        <SectionHeader eyebrow="Identificação" title="Dados institucionais" />
        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { term: "Razão social", value: site.legalName },
            { term: "CNPJ", value: site.cnpj },
            { term: "Natureza jurídica", value: site.kind },
            { term: "Sede", value: `${site.address.city}/${site.address.state}` },
          ].map((item) => (
            <div key={item.term} className="bg-paper p-6">
              <dt className="text-sm font-semibold tracking-wide text-ink-mute uppercase">{item.term}</dt>
              <dd className="mt-2 text-lg font-medium text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Aplicação dos recursos */}
      <Section tone="alt" size="wide">
        <SectionHeader
          eyebrow="Aplicação dos recursos"
          title="Como cada real é distribuído"
          description="Percentuais referentes ao último exercício com demonstração financeira publicada."
        />
        <ul className="mt-12 space-y-6">
          {transparencia.allocation.map((item) => (
            <li key={item.label}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-lg font-semibold text-ink">{item.label}</span>
                <span className="font-[family-name:var(--font-bricolage)] text-xl font-bold text-brand-700">
                  {item.percent}%
                </span>
              </div>
              <div
                className="mt-2.5 h-3 overflow-hidden rounded-full bg-line"
                role="img"
                aria-label={`${item.label}: ${item.percent}% dos recursos`}
              >
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${item.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Documentos */}
      <Section tone="paper" size="wide">
        <SectionHeader
          eyebrow="Documentos"
          title="Downloads"
          description="Arquivos em PDF, abertos a qualquer pessoa, sem cadastro."
        />

        <div className="mt-12 space-y-10">
          {years.map((year) => (
            <div key={year}>
              <h3 className="flex items-center gap-4 text-xl text-ink">
                {year}
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
              </h3>
              <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                {docs
                  .filter((d) => d.year === year)
                  .map((doc) => (
                    <li key={doc.file}>
                      <a
                        href={doc.file}
                        className="group flex items-center gap-4 bg-paper p-5 transition-colors hover:bg-paper-alt"
                        download
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                          <Icon name="book" className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-ink group-hover:text-brand-800">
                            {doc.title}
                          </span>
                          <span className="mt-0.5 block text-sm text-ink-mute">
                            {doc.type}
                            {doc.size && doc.size !== "TODO" && ` · PDF, ${doc.size}`}
                          </span>
                        </span>
                        <Icon name="download" className="size-5 shrink-0 text-ink-mute group-hover:text-brand-700" />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-paper-alt p-8">
          <h3 className="text-xl text-ink">Não encontrou o que procurava?</h3>
          <p className="mt-2.5 leading-relaxed text-ink-soft">
            Qualquer pessoa pode solicitar esclarecimentos sobre a aplicação dos recursos.
            Escrevemos de volta em até 10 dias úteis.
          </p>
          <Button href={`mailto:${site.email.donations}`} variant="outline" className="mt-6">
            <Icon name="mail" className="size-5" />
            {site.email.donations}
          </Button>
        </div>
      </Section>
    </>
  );
}
