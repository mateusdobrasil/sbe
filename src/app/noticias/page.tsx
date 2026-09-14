import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { content } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notícias — ações e comunicados",
  description:
    "Acompanhe mutirões de saúde, campanhas, novos credenciados e comunicados da Sociedade Beneficente Evangélica de Cuiabá.",
  alternates: { canonical: "/noticias" },
};

export default async function NoticiasPage() {
  const posts = await content.getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Notícias"
        title="O que tem acontecido na SBE"
        description="Mutirões, campanhas, novos credenciados e prestação de contas — publicados aqui em primeira mão."
      />
      <Breadcrumbs items={[{ label: "Notícias" }]} />

      {posts.length === 0 ? (
        <Section tone="paper">
          <div className="rounded-2xl border border-dashed border-line bg-paper-alt p-14 text-center">
            <Icon name="book" className="mx-auto size-10 text-ink-mute" />
            <p className="mt-4 font-semibold text-ink">Ainda não há notícias publicadas</p>
            <p className="mt-1 text-ink-soft">Volte em breve para acompanhar as ações da instituição.</p>
          </div>
        </Section>
      ) : (
        <Section tone="paper" size="wide">
          {/* Destaque */}
          <Link
            href={`/noticias/${featured.slug}`}
            className="group grid gap-8 rounded-2xl border border-line bg-paper-alt p-8 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 sm:p-10 lg:grid-cols-[2fr_1fr] lg:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold tracking-wide text-deep-950 uppercase">
                  {featured.category}
                </span>
                <time dateTime={featured.date} className="text-sm text-ink-mute">
                  {formatDate(featured.date)}
                </time>
              </div>
              <h2 className="mt-5 text-3xl leading-tight text-ink group-hover:text-brand-800 sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{featured.excerpt}</p>
            </div>
            <p className="flex items-center gap-2 font-semibold text-brand-700 lg:justify-end">
              Ler notícia
              <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>

          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/noticias/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-line p-7 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
                >
                  <span className="self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-wide text-brand-800 uppercase">
                    {post.category}
                  </span>
                  <h2 className="mt-4 text-xl leading-snug text-ink group-hover:text-brand-800">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 flex-1 leading-relaxed text-ink-soft">{post.excerpt}</p>
                  <time
                    dateTime={post.date}
                    className="mt-5 block border-t border-line pt-4 text-sm text-ink-mute"
                  >
                    {formatDate(post.date)}
                  </time>
                </Link>
              ))}
            </div>
          )}
        </Section>
      )}
    </>
  );
}
