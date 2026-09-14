import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/quem-somos", priority: 0.8, freq: "monthly" },
    { path: "/servicos", priority: 0.9, freq: "monthly" },
    { path: "/rede-credenciada", priority: 0.9, freq: "weekly" },
    { path: "/seja-associado", priority: 0.9, freq: "monthly" },
    { path: "/doe", priority: 0.9, freq: "monthly" },
    { path: "/transparencia", priority: 0.7, freq: "monthly" },
    { path: "/voluntariado", priority: 0.6, freq: "monthly" },
    { path: "/noticias", priority: 0.7, freq: "weekly" },
    { path: "/contato", priority: 0.8, freq: "monthly" },
    { path: "/politica-de-privacidade", priority: 0.3, freq: "yearly" },
  ];

  const posts = await content.getPosts();

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.freq,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/noticias/${post.slug}`,
      lastModified: new Date(`${post.date}T12:00:00`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
