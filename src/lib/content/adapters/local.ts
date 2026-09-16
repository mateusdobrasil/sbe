import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "@/lib/markdown";
import type {
  ContentAdapter, FaqItem, ImpactStat, Leader, MembershipPlan,
  Post, Provider, Service, Testimonial, TransparencyDoc,
} from "../types";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
  return JSON.parse(raw) as T;
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
