import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type {
  ContentAdapter, FaqItem, ImpactStat, Leader, MembershipPlan,
  Post, Provider, Service, Testimonial, TransparencyDoc,
} from "../types";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

/**
 * Converte o Markdown dos posts em HTML.
 *
 * Deliberadamente mínimo: cobre o subconjunto que a redação da SBE usa
 * (títulos, listas, links, ênfase, parágrafos) sem arrastar uma cadeia
 * remark/rehype inteira para o bundle. Quando o conteúdo migrar para o
 * Supabase, o editor entrega HTML pronto e isto deixa de ser usado.
 */
function renderMarkdown(md: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const inline = (s: string) =>
    escape(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  const out: string[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length) {
      out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`);
      list = [];
    }
  };

  for (const line of md.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) { flushList(); continue; }

    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushList();
      const level = heading[1].length + 1; // # vira <h2>: o <h1> é o título da página
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bullet) { list.push(bullet[1]); continue; }

    flushList();
    out.push(`<p>${inline(trimmed)}</p>`);
  }
  flushList();
  return out.join("\n");
}

async function loadPosts(): Promise<Post[]> {
  const dir = path.join(CONTENT_DIR, "noticias");
  let files: string[];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? file),
        excerpt: String(data.excerpt ?? ""),
        content: renderMarkdown(content),
        date: String(data.date ?? new Date().toISOString().slice(0, 10)),
        category: String(data.category ?? "Notícias"),
        cover: data.cover ? String(data.cover) : undefined,
        author: data.author ? String(data.author) : undefined,
      } satisfies Post;
    }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export const localAdapter: ContentAdapter = {
  async getProviders() {
    const { providers } = await readJson<{ providers: Provider[] }>("rede-credenciada.json");
    return providers;
  },
  async getServices() {
    const { services } = await readJson<{ services: Service[] }>("servicos.json");
    return services;
  },
  async getStats() {
    const { stats } = await readJson<{ stats: ImpactStat[] }>("institucional.json");
    return stats;
  },
  async getLeaders() {
    const { leaders } = await readJson<{ leaders: Leader[] }>("institucional.json");
    return leaders;
  },
  async getTransparencyDocs() {
    const { docs } = await readJson<{ docs: TransparencyDoc[] }>("transparencia.json");
    return docs.sort((a, b) => b.year - a.year);
  },
  async getTestimonials() {
    const { testimonials } = await readJson<{ testimonials: Testimonial[] }>("depoimentos.json");
    return testimonials;
  },
  async getFaq() {
    const { items } = await readJson<{ items: FaqItem[] }>("faq.json");
    return items;
  },
  getPosts: loadPosts,
  async getPost(slug) {
    return (await loadPosts()).find((p) => p.slug === slug) ?? null;
  },
  async getMembershipPlans() {
    const { plans } = await readJson<{ plans: MembershipPlan[] }>("associado.json");
    return plans;
  },
};
