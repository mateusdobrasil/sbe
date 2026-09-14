import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Accordion } from "@/components/ui/Accordion";
import { LeadForm } from "@/components/forms/LeadForm";
import { content } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Seja associado — planos e benefícios",
  description:
    "Associe-se à SBE Cuiabá e tenha acesso à rede credenciada com descontos de até 35%, prioridade no agendamento e cobertura para dependentes, sem carência.",
  alternates: { canonical: "/seja-associado" },
};

export default async function SejaAssociadoPage() {
  const [plans, faq, providers] = await Promise.all([
    content.getMembershipPlans(),
    content.getFaq(),
    content.getProviders(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Seja associado"
        title="Um valor mensal que abre a porta de toda a rede"
        description={`Acesso a ${providers.length} clínicas e laboratórios credenciados, prioridade no agendamento e descontos maiores — sem carência desde o primeiro mês.`}
      >
        <Button href="#planos" size="lg">
          Ver planos
          <Icon name="arrow" className="size-5" />
        </Button>
      </PageHero>
      <Breadcrumbs items={[{ label: "Seja associado" }]} />

      {/* Comparativo */}
      <Section tone="paper" size="wide">
        <SectionHeader
          eyebrow="A diferença"
          title="Associado e não associado, lado a lado"
          description="A SBE atende os dois. A associação muda a prioridade, o tamanho do desconto e a cobertura da família."
        />

        {/*
          A tabela tinha min-w-[38rem] dentro de um contêiner rolável: em 390px
          a coluna "Associado" — o ponto inteiro da comparação — ficava fora da
          tela, e nada indicava que dava para arrastar. Agora ela cabe: as
          células quebram linha e o respiro diminui no celular.
        */}
        <div className="mt-12">
          <table className="w-full table-fixed border-collapse text-left text-sm sm:text-base">
            <caption className="sr-only">
              Comparação entre o atendimento a não associados e a associados da SBE
            </caption>
            <thead>
              <tr className="border-b-2 border-line">
                <th scope="col" className="w-[42%] py-3 pr-2 font-semibold text-ink sm:py-4 sm:pr-4">
                  Benefício
                </th>
                <th scope="col" className="w-[29%] px-2 py-3 font-semibold text-ink-soft sm:px-4 sm:py-4">
                  Não associado
                </th>
                <th scope="col" className="w-[29%] px-2 py-3 font-semibold text-brand-800 sm:px-4 sm:py-4">
                  Associado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                ["Atendimento na sede", "Sim", "Sim"],
                ["Acesso à rede credenciada", "Sim", "Sim"],
                ["Desconto em exames", "Parcial", "Até 35%"],
                ["Prioridade no agendamento", "Não", "Sim"],
                ["Dependentes inclusos", "Não", "Até 4 no plano familiar"],
                ["Carência", "Não há", "Não há"],
              ].map(([benefit, without, withPlan]) => (
                <tr key={benefit}>
                  <th scope="row" className="py-3 pr-2 font-medium text-ink sm:py-4 sm:pr-4">{benefit}</th>
                  <td className="px-2 py-3 text-ink-soft sm:px-4 sm:py-4">{without}</td>
                  <td className="px-2 py-3 font-semibold text-brand-800 sm:px-4 sm:py-4">{withPlan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Planos */}
      <Section id="planos" tone="alt" size="wide">
        <SectionHeader
          eyebrow="Planos"
          title="Escolha o que cabe no seu orçamento"
          align="center"
        />

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={cn(
                "flex h-full min-w-0 flex-col rounded-2xl border bg-paper p-6 sm:p-8",
                plan.highlight ? "border-2 border-brand-500 shadow-lg shadow-brand-900/5" : "border-line",
              )}
            >
              {plan.note && (
                <span
                  className={cn(
                    "mb-4 self-start rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase",
                    plan.highlight ? "bg-brand-500 text-deep-950" : "bg-deep-50 text-deep-700",
                  )}
                >
                  {plan.note}
                </span>
              )}

              <h3 className="text-2xl text-ink">{plan.name}</h3>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-[family-name:var(--font-bricolage)] text-3xl font-extrabold text-ink sm:text-4xl">
                  {plan.price}
                </span>
                <span className="text-ink-mute">{plan.period}</span>
              </p>

              <ul className="mt-7 flex-1 space-y-3">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                    <span className="leading-relaxed text-ink-soft">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={whatsappLink(`Olá! Quero me associar à SBE no plano ${plan.name}.`)}
                variant={plan.highlight ? "primary" : "outline"}
                size="lg"
                className="mt-8 w-full"
              >
                Quero este plano
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink-mute">
          A SBE não é plano de saúde e não é regulada pela ANS. Trata-se de um programa de
          parceria na assistência à saúde, com valores negociados junto aos credenciados.
        </p>
      </Section>

      {/* Formulário */}
      <Section tone="paper">
        <SectionHeader
          eyebrow="Solicite contato"
          title="Prefere que a gente ligue para você?"
          description="Deixe seus dados e nossa equipe explica os planos, valores e o que é preciso para se associar."
        />
        <div className="mt-10">
          <LeadForm
            kind="associado"
            subjects={plans.map((p) => `Plano ${p.name}`)}
            messageLabel="Alguma dúvida específica?"
            messagePlaceholder="Ex.: quantos dependentes posso incluir?"
            submitLabel="Solicitar contato"
          />
        </div>
      </Section>

      <Section tone="alt">
        <SectionHeader eyebrow="Dúvidas frequentes" title="Antes de decidir" align="center" />
        <div className="mt-12">
          <Accordion items={faq} />
        </div>
      </Section>
    </>
  );
}
