import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/common/JsonLd";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await content.getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await content.getPost(slug);
  if (!post) return { title: "Notícia não encontrada" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/noticias/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      url: `${site.url}/noticias/${post.slug}`,
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const post = await content.getPost(slug);
  if (!post) notFound();

  const related = (await content.getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author ?? site.legalName },
    publisher: { "@id": `${site.url}/#organizacao` },
    mainEntityOfPage: `${site.url}/noticias/${post.slug}`,
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Notícias", href: "/noticias" }, { label: post.title }]} />

      <article className="py-12 sm:py-16">
        <Container size="narrow">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-wide text-brand-800 uppercase">
                {post.category}
              </span>
              <time dateTime={post.date} className="text-sm text-ink-mute">
                {formatDate(post.date)}
              </time>
              {post.author && <span className="text-sm text-ink-mute">· {post.author}</span>}
            </div>

            <h1 className="mt-5 text-4xl leading-tight text-ink sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-ink-soft">{post.excerpt}</p>
          </header>

          <div
            className="rich-text mt-10 border-t border-line pt-10"
            // O HTML vem do nosso próprio conteúdo editorial, não de entrada pública.
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-12 border-t border-line pt-8">
            <Link
              href="/noticias"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
            >
              <Icon name="arrow" className="size-5 rotate-180" />
              Todas as notícias
            </Link>
          </footer>
        </Container>
      </article>

      {related.length > 0 && (
        <Section tone="alt" size="wide">
          <h2 className="text-2xl text-ink">Leia também</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/noticias/${item.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <span className="self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-wide text-brand-800 uppercase">
                  {item.category}
                </span>
                <h3 className="mt-4 text-lg leading-snug text-ink group-hover:text-brand-800">
                  {item.title}
                </h3>
                <time dateTime={item.date} className="mt-4 block text-sm text-ink-mute">
                  {formatDate(item.date)}
                </time>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section tone="deep" size="wide">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl text-white">Ajude a SBE a continuar</h2>
            <p className="mt-1.5 text-deep-100">
              Cada doação sustenta o atendimento em saúde e o amparo a famílias de Cuiabá.
            </p>
          </div>
          <Button href="/doe" size="lg">
            <Icon name="heartHand" className="size-5" />
            Fazer uma doação
          </Button>
        </div>
      </Section>

      <JsonLd data={schema} />
    </>
  );
}
