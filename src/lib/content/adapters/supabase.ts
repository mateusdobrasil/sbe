import { getSupabase } from "@/lib/supabase";
import type {
  ContentAdapter, FaqItem, ImpactStat, Leader, MembershipPlan,
  Post, Provider, Service, Testimonial, TransparencyDoc,
} from "../types";
import { localAdapter } from "./local";

/**
 * Lê o conteúdo do Postgres do Supabase.
 *
 * Cada consulta cai de volta no adaptador local se a tabela ainda não
 * existir ou vier vazia — assim o site continua de pé durante a migração,
 * tabela por tabela, em vez de quebrar tudo de uma vez.
 */
async function fromTable<T>(
  table: string,
  fallback: () => Promise<T[]>,
  order?: { column: string; ascending?: boolean },
): Promise<T[]> {
  const db = getSupabase();
  if (!db) return fallback();

  let query = db.from(table).select("*");
  if (order) query = query.order(order.column, { ascending: order.ascending ?? true });

  const { data, error } = await query;
  if (error || !data?.length) {
    if (error) console.warn(`[content] tabela "${table}" indisponível, usando /content: ${error.message}`);
    return fallback();
  }
  return data as T[];
}

export const supabaseAdapter: ContentAdapter = {
  getProviders: () =>
    fromTable<Provider>("providers", localAdapter.getProviders, { column: "name" }),

  getServices: () =>
    fromTable<Service>("services", localAdapter.getServices, { column: "name" }),

  getStats: () =>
    fromTable<ImpactStat>("impact_stats", localAdapter.getStats, { column: "sort_order" }),

  getLeaders: () =>
    fromTable<Leader>("leaders", localAdapter.getLeaders, { column: "sort_order" }),

  getTransparencyDocs: () =>
    fromTable<TransparencyDoc>("transparency_docs", localAdapter.getTransparencyDocs, {
      column: "year", ascending: false,
    }),

  getTestimonials: () =>
    fromTable<Testimonial>("testimonials", localAdapter.getTestimonials, { column: "sort_order" }),

  getFaq: () =>
    fromTable<FaqItem>("faq", localAdapter.getFaq, { column: "sort_order" }),

  getMembershipPlans: () =>
    fromTable<MembershipPlan>("membership_plans", localAdapter.getMembershipPlans, {
      column: "sort_order",
    }),

  async getPosts() {
    const db = getSupabase();
    if (!db) return localAdapter.getPosts();

    const { data, error } = await db
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false });

    if (error || !data?.length) return localAdapter.getPosts();
    return data as Post[];
  },

  async getPost(slug) {
    const db = getSupabase();
    if (!db) return localAdapter.getPost(slug);

    const { data, error } = await db
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return localAdapter.getPost(slug);
    return data as Post;
  },
};
