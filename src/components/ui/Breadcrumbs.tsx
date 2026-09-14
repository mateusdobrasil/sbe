import Link from "next/link";
import { Container } from "./Container";
import { JsonLd } from "@/components/common/JsonLd";
import { site } from "@/lib/site";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "Início", href: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };

  return (
    <div className="border-b border-line bg-paper-alt">
      <Container size="wide">
        <nav aria-label="Trilha de navegação" className="py-3.5">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-mute">
            <li>
              <Link href="/" className="hover:text-brand-700">Início</Link>
            </li>
            {items.map((item, i) => (
              <li key={item.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {item.href && i < items.length - 1 ? (
                  <Link href={item.href} className="hover:text-brand-700">{item.label}</Link>
                ) : (
                  <span className="font-medium text-ink" aria-current="page">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
      <JsonLd data={schema} />
    </div>
  );
}
