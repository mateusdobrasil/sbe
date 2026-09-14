import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Voluntariado — doe seu tempo",
  description:
    "Seja voluntário na SBE Cuiabá. Atuação em recepção e acolhimento, organização de doações, eventos, apoio administrativo e voluntariado profissional.",
  alternates: { canonical: "/voluntariado" },
};

const areas = [
  {
    icon: "users" as const,
    title: "Recepção e acolhimento",
    text: "Receber quem chega, orientar sobre serviços e ajudar no encaminhamento. Ideal para quem tem jeito com gente.",
    commitment: "4h por semana",
  },
  {
    icon: "basket" as const,
    title: "Organização de doações",
    text: "Receber, triar e montar cestas e kits de higiene. Trabalho prático e com resultado visível no mesmo dia.",
    commitment: "Meio período, quinzenal",
  },
  {
    icon: "heart" as const,
    title: "Eventos e mutirões",
    text: "Apoio em mutirões de saúde, campanhas sazonais e ações comunitárias em bairros da capital.",
    commitment: "Pontual, por evento",
  },
  {
    icon: "book" as const,
    title: "Apoio administrativo",
    text: "Cadastros, organização de documentos, atendimento telefônico e apoio à comunicação da instituição.",
    commitment: "A combinar",
  },
  {
    icon: "stethoscope" as const,
    title: "Voluntariado profissional",
    text: "Profissionais de saúde, direito, contabilidade, tecnologia e comunicação doando horas da sua especialidade.",
    commitment: "A combinar",
  },
  {
    icon: "shield" as const,
    title: "Conselho e governança",
    text: "Participação em conselho fiscal e comissões, contribuindo com experiência de gestão.",
    commitment: "Reuniões mensais",
  },
];

export default function VoluntariadoPage() {
  return (
    <>
      <PageHero
        eyebrow="Voluntariado"
        title="Doe algo que ninguém consegue comprar: o seu tempo"
        description="A SBE funciona porque há gente disposta a estar presente. Escolha uma área, defina quanto pode dedicar e venha somar."
      />
      <Breadcrumbs items={[{ label: "Voluntariado" }]} />

      <Section tone="paper" size="wide">
        <SectionHeader
          eyebrow="Áreas de atuação"
          title="Onde você pode ajudar"
          description="Não é preciso experiência prévia na maioria das frentes — só disposição e compromisso com o horário combinado."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <article key={area.title} className="flex flex-col rounded-2xl border border-line bg-paper-alt p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={area.icon} className="size-6" />
              </span>
              <h3 className="mt-5 text-lg text-ink">{area.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{area.text}</p>
              <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm font-semibold text-deep-700">
                <Icon name="clock" className="size-4" />
                {area.commitment}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="alt" size="wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeader eyebrow="Como funciona" title="Do cadastro ao primeiro dia" />
            <ol className="mt-8 space-y-6">
              {[
                { title: "Cadastro", text: "Preencha o formulário ao lado indicando sua área de interesse e disponibilidade." },
                { title: "Conversa inicial", text: "Nossa equipe entra em contato para entender seu perfil e explicar a rotina." },
                { title: "Integração", text: "Um encontro presencial na sede apresenta a instituição e as normas de conduta." },
                { title: "Primeiro dia", text: "Você começa acompanhado por um voluntário experiente da sua área." },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-deep-950">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg text-ink">{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-soft">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 rounded-xl border border-line bg-paper p-5 text-sm leading-relaxed text-ink-soft">
              Voluntários menores de 18 anos precisam de autorização por escrito dos
              responsáveis. Atividades com atendimento direto ao público podem exigir
              comprovação de registro profissional.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-7 sm:p-9">
            <h2 className="text-2xl text-ink">Quero ser voluntário</h2>
            <p className="mt-2 text-ink-soft">
              Conte um pouco sobre você e o que gostaria de fazer.
            </p>
            <div className="mt-8">
              <LeadForm
                kind="voluntariado"
                subjects={areas.map((a) => a.title)}
                messageLabel="Disponibilidade e experiência"
                messagePlaceholder="Ex.: tenho as manhãs de terça e quinta livres; sou técnico de enfermagem."
                submitLabel="Quero ser voluntário"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
