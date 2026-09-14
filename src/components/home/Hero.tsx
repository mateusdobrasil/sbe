import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { site, whatsappLink } from "@/lib/site";

const highlights = [
  { icon: "check" as const, text: "Sem carência" },
  { icon: "check" as const, text: "Sem limite de uso" },
  { icon: "check" as const, text: "Associados e não associados" },
];

export function Hero({ providerCount, specialtyCount }: { providerCount: number; specialtyCount: number }) {
  return (
    <section className="relative overflow-hidden bg-deep-800 text-white">
      {/* Textura de fundo: gradiente radial, sem custo de imagem */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(60rem 40rem at 85% -10%, rgba(224,138,11,0.22), transparent 60%), radial-gradient(45rem 30rem at 5% 110%, rgba(23,120,140,0.5), transparent 65%)",
        }}
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-200">
              <Icon name="flame" className="size-4" />
              {site.kind} · {site.address.city}/{site.address.state}
            </p>

            <h1 className="mt-6 text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Cuidado em saúde ao{" "}
              <span className="text-brand-300">alcance de quem precisa</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-deep-100">
              Há décadas a SBE aproxima famílias de Cuiabá de consultas, exames e
              assistência social por valores que cabem no orçamento — com{" "}
              <strong className="font-semibold text-white">{providerCount} clínicas e laboratórios credenciados</strong>{" "}
              e {specialtyCount} especialidades disponíveis.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
              {highlights.map((item) => (
                <li key={item.text} className="flex items-center gap-2 text-deep-100">
                  <Icon name={item.icon} className="size-5 shrink-0 text-brand-400" />
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={whatsappLink("Olá! Gostaria de agendar uma consulta na SBE.")} size="lg">
                <Icon name="whatsapp" className="size-5" />
                Agendar atendimento
              </Button>
              <Button href="/rede-credenciada" variant="onDark" size="lg">
                Ver rede credenciada
                <Icon name="arrow" className="size-5" />
              </Button>
            </div>

            <p className="mt-6 text-sm text-deep-200">
              Prefere ligar?{" "}
              <a href={`tel:${site.phone.tel}`} className="font-semibold text-brand-300 underline underline-offset-4">
                {site.phone.display}
              </a>{" "}
              · Seg a sex, 07h às 17h
            </p>
          </div>

          {/* Cartão de versículo — identidade da instituição, sem imagem pesada */}
          <div className="relative">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm sm:p-10">
              <Icon name="heartHand" className="size-10 text-brand-400" />
              <blockquote className="mt-6">
                <p className="font-[family-name:var(--font-bricolage)] text-2xl leading-snug text-white sm:text-3xl">
                  “{site.verse.text}”
                </p>
                <cite className="mt-4 block text-base not-italic text-brand-300">{site.verse.ref}</cite>
              </blockquote>
              <p className="mt-7 border-t border-white/15 pt-6 leading-relaxed text-deep-100">
                Atendemos sem distinção de credo, origem ou condição social.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
