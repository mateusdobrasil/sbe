import Link from "next/link";
import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { QuickSearch } from "@/components/home/QuickSearch";
import { ImpactStats } from "@/components/home/ImpactStats";
import { ServiceCard } from "@/components/home/ServiceCard";
import { ProviderCard } from "@/components/rede/ProviderCard";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Accordion } from "@/components/ui/Accordion";
import { content } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [providers, services, stats, faq, posts] = await Promise.all([
    content.getProviders(),
    content.getServices(),
    content.getStats(),
    content.getFaq(),
    content.getPosts(),
  ]);

  const specialties = [...new Set(providers.flatMap((p) => p.specialties))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const featured = providers.filter((p) => p.featured).slice(0, 6);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <Hero providerCount={providers.length} specialtyCount={specialties.length} />

      <Suspense fallback={null}>
        <QuickSearch specialties={specialties} />
      </Suspense>

      <Section tone="paper" size="wide" className="pt-14">
        <ImpactStats stats={stats} />
      </Section>

      {/* Serviços */}
      <Section tone="alt" size="wide" className="pt-4">
        <SectionHeader
          eyebrow="O que fazemos"
          title="Saúde e assistência para quem mais precisa"
          description="Da consulta agendada ao apoio a famílias em vulnerabilidade, tudo em um só lugar e a valores acessíveis."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      {/* Rede credenciada */}
      <Section tone="paper" size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Rede credenciada"
            title={`${providers.length} clínicas e laboratórios parceiros`}
            description="Programa de Parceria na Assistência à Saúde: valores negociados, sem carência e sem limite de uso."
          />
          <Button href="/rede-credenciada" variant="outline">
            Ver rede completa
            <Icon name="arrow" className="size-5" />
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((provider) => (
            <ProviderCard key={provider.slug} provider={provider} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {specialties.map((s) => (
            <Link
              key={s}
              href={`/rede-credenciada?especialidade=${encodeURIComponent(s)}`}
              className="inline-flex min-h-10 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
            >
              {s}
            </Link>
          ))}
        </div>
      </Section>

      {/* Associação */}
      <Section tone="deep" size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Seja associado"
              tone="dark"
              title="Um valor mensal que abre a porta de toda a rede"
              description="Associados têm prioridade no agendamento, descontos maiores e cobertura para dependentes — sem carência desde o primeiro mês."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/seja-associado" size="lg">
                Ver planos e benefícios
              </Button>
              <Button href={whatsappLink("Olá! Quero saber como me associar à SBE.")} variant="onDark" size="lg">
                <Icon name="whatsapp" className="size-5" />
                Tirar dúvidas
              </Button>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "check" as const, title: "Sem carência", text: "Use o benefício já no primeiro mês." },
              { icon: "users" as const, title: "Família inclusa", text: "Titular e até 4 dependentes no plano familiar." },
              { icon: "clock" as const, title: "Prioridade", text: "Agendamento preferencial em consultas e exames." },
              { icon: "shield" as const, title: "Sem limite de uso", text: "Quantos atendimentos você precisar." },
            ].map((item) => (
              <li key={item.title} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <Icon name={item.icon} className="size-7 text-brand-400" />
                <h3 className="mt-4 text-lg text-white">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-deep-100">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Doação */}
      <Section tone="brand" size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeader
              eyebrow="Como ajudar"
              title="Sua doação vira consulta, exame e cesta na mesa"
              description="Contribuições sustentam o atendimento em saúde, o apoio a famílias em vulnerabilidade e a manutenção da sede. Toda a destinação é publicada na página de Transparência."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/doe" size="lg">
                <Icon name="heartHand" className="size-5" />
                Doar via PIX
              </Button>
              <Button href="/transparencia" variant="outline" size="lg">
                Ver prestação de contas
              </Button>
            </div>
          </div>

          <ul className="space-y-4">
            {[
              { title: "Doação em dinheiro", text: "PIX com QR Code, em qualquer valor, pontual ou recorrente." },
              { title: "Produtos e serviços", text: "Alimentos, roupas, materiais e serviços profissionais." },
              { title: "Empresas e institutos", text: "Parcerias para projetos sociais e institucionais." },
              { title: "Seu tempo", text: "Voluntariado em atendimento, eventos e apoio administrativo." },
            ].map((item) => (
              <li key={item.title} className="flex gap-4 rounded-2xl bg-paper p-5">
                <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-0.5 text-ink-soft">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Notícias */}
      {latestPosts.length > 0 && (
        <Section tone="paper" size="wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader eyebrow="Notícias" title="O que tem acontecido na SBE" />
            <Button href="/noticias" variant="outline">
              Todas as notícias
              <Icon name="arrow" className="size-5" />
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/noticias/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-line p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <span className="self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-wide text-brand-800 uppercase">
                  {post.category}
                </span>
                <h3 className="mt-4 text-lg leading-snug text-ink group-hover:text-brand-800">{post.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{post.excerpt}</p>
                <time dateTime={post.date} className="mt-5 block border-t border-line pt-4 text-sm text-ink-mute">
                  {formatDate(post.date)}
                </time>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section tone="alt">
        <SectionHeader
          eyebrow="Dúvidas frequentes"
          title="Perguntas que mais recebemos"
          align="center"
        />
        <div className="mt-12">
          <Accordion items={faq} />
        </div>
        <p className="mt-8 text-center text-ink-soft">
          Não encontrou sua dúvida?{" "}
          <Link href="/contato" className="font-semibold text-brand-700 underline underline-offset-4">
            Fale com a gente
          </Link>
          .
        </p>
      </Section>

      {/* Contato */}
      <section className="bg-deep-900 py-16 text-white sm:py-20">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl text-white sm:text-4xl">Venha nos visitar</h2>
              <p className="mt-4 text-lg leading-relaxed text-deep-100">
                Estamos no CPA IV, em {site.address.city}. Traga seu pedido médico ou apenas
                sua dúvida — nossa equipe atende pessoalmente.
              </p>

              <dl className="mt-8 space-y-4">
                <div className="flex gap-3">
                  <dt><Icon name="pin" className="size-5 text-brand-400" /><span className="sr-only">Endereço</span></dt>
                  <dd className="text-deep-100">
                    {site.address.street} — {site.address.district}
                    <br />
                    {site.address.city}/{site.address.state}, CEP {site.address.zip}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt><Icon name="clock" className="size-5 text-brand-400" /><span className="sr-only">Horário</span></dt>
                  <dd className="text-deep-100">
                    {site.hours.map((h) => (
                      <span key={h.days} className="block">
                        <strong className="font-semibold text-white">{h.days}:</strong> {h.time}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={whatsappLink()} size="lg">
                  <Icon name="whatsapp" className="size-5" />
                  Chamar no WhatsApp
                </Button>
                <Button href={`tel:${site.phone.tel}`} variant="onDark" size="lg">
                  <Icon name="phone" className="size-5" />
                  {site.phone.display}
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15">
              <iframe
                title={`Mapa da localização da SBE em ${site.address.city}`}
                src="https://www.google.com/maps?q=Av.%20dos%20Expedicion%C3%A1rios%2C%2065%20-%20CPA%20IV%2C%20Cuiab%C3%A1%20-%20MT%2C%2078058-513&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full lg:h-96"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
