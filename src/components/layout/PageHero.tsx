import { Container } from "@/components/ui/Container";

/** Cabeçalho padrão das páginas internas. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-deep-800 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(48rem 26rem at 88% -30%, rgba(224,138,11,0.26), transparent 62%)",
        }}
      />
      <Container size="wide" className="relative">
        <div className="max-w-3xl py-14 sm:py-18">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold tracking-wide text-brand-300 uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-[1.1] text-white sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-5 text-lg leading-relaxed text-deep-100">{description}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
