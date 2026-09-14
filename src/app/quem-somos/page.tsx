import type { Metadata } from "next";
import institucional from "../../../content/institucional.json";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quem somos — história, missão e diretoria",
  description:
    "Conheça a Sociedade Beneficente Evangélica de Cuiabá: missão, visão, valores, história e a diretoria responsável pela instituição.",
  alternates: { canonical: "/quem-somos" },
};

export default async function QuemSomosPage() {
  const leaders = await content.getLeaders();

  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Uma instituição feita de gente que decidiu não se cansar de fazer o bem"
        description={`${site.kind} sem fins lucrativos, a SBE atua em ${site.address.city} aproximando famílias do cuidado em saúde e do amparo social.`}
      />
      <Breadcrumbs items={[{ label: "Quem somos" }]} />

      {/* Missão, visão e valores */}
      <Section tone="paper" size="wide">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-line bg-paper-alt p-8">
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-500 text-deep-950">
              <Icon name="flame" className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl text-ink">Nossa missão</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{institucional.mission}</p>
            <p className="mt-4 font-semibold text-brand-700">{institucional.missionRef}</p>
          </article>

          <article className="rounded-2xl border border-line bg-paper-alt p-8">
            <span className="flex size-12 items-center justify-center rounded-xl bg-deep-800 text-brand-300">
              <Icon name="heartHand" className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl text-ink">Nossa visão</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{institucional.vision}</p>
            <p className="mt-4 font-semibold text-brand-700">{institucional.visionRef}</p>
          </article>
        </div>
      </Section>

      {/* Valores */}
      <Section tone="alt" size="wide" className="pt-0">
        <SectionHeader
          eyebrow={`Valores · ${institucional.valuesRef}`}
          title="O que não se negocia"
          description="Seis compromissos que orientam cada decisão da instituição, do atendimento na recepção à aplicação de cada real recebido."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {institucional.values.map((value) => (
            <div key={value.name} className="rounded-2xl border border-line bg-paper p-7">
              <h3 className="flex items-center gap-2.5 text-lg text-ink">
                <Icon name="check" className="size-5 text-brand-600" />
                {value.name}
              </h3>
              <p className="mt-2.5 leading-relaxed text-ink-soft">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* História */}
      <Section tone="paper" size="wide">
        <SectionHeader eyebrow="Nossa história" title="Décadas servindo Cuiabá" />
        <ol className="mt-12 space-y-0">
          {institucional.history.map((item, i) => (
            <li key={i} className="relative grid gap-4 border-l-2 border-line pb-10 pl-8 last:border-transparent last:pb-0 sm:grid-cols-[8rem_1fr] sm:gap-8">
              <span
                aria-hidden="true"
                className="absolute top-1 -left-[0.5625rem] size-4 rounded-full border-4 border-paper bg-brand-500"
              />
              <span className="font-[family-name:var(--font-bricolage)] text-xl font-bold text-brand-700">
                {item.year}
              </span>
              <div>
                <h3 className="text-lg text-ink">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Diretoria */}
      <Section tone="alt" size="wide">
        <SectionHeader
          eyebrow="Governança"
          title="Quem responde pela instituição"
          description="A SBE é dirigida por uma diretoria eleita em assembleia, com mandato definido e fiscalização de um conselho independente."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader) => (
            <div key={leader.role} className="rounded-2xl border border-line bg-paper p-6">
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-full bg-deep-800 text-brand-300"
              >
                <Icon name="users" className="size-7" />
              </span>
              <h3 className="mt-4 text-lg text-ink">{leader.name}</h3>
              <p className="mt-1 font-medium text-brand-700">{leader.role}</p>
              {leader.term && <p className="mt-0.5 text-sm text-ink-mute">{leader.term}</p>}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-paper p-7">
          <h3 className="text-lg text-ink">Documentos de governança</h3>
          <p className="mt-2 text-ink-soft">
            Estatuto social, atas de eleição e prestação de contas estão publicados na área de
            transparência, abertos a qualquer pessoa.
          </p>
          <Button href="/transparencia" variant="outline" className="mt-5">
            Ver transparência
            <Icon name="arrow" className="size-5" />
          </Button>
        </div>
      </Section>
    </>
  );
}
