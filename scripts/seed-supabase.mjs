/**
 * Carrega o conteúdo de /content para o Supabase.
 *
 *   node scripts/seed-supabase.mjs
 *
 * Exige NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente
 * (ou em .env.local). Use upsert: rodar duas vezes não duplica nada.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

const root = process.cwd();
const contentDir = path.join(root, "content");

// Carrega .env.local sem depender de pacote extra.
try {
  const env = await readFile(path.join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // Sem .env.local: assume variáveis já exportadas no shell.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Defina em .env.local (veja .env.example) antes de rodar.",
  );
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const json = async (file) => JSON.parse(await readFile(path.join(contentDir, file), "utf8"));

async function upsert(table, rows, conflictKey) {
  if (!rows.length) {
    console.log(`  ${table}: nada a inserir`);
    return;
  }

  // Tabelas sem chave natural (id autoincremento apenas) não têm o que
  // usar como onConflict: um upsert vira INSERT puro, e rodar o script
  // duas vezes duplica cada linha. Como este script é a fonte de verdade
  // para essas tabelas, o jeito seguro de repetir é limpar antes de inserir.
  if (!conflictKey) {
    const { error: delError } = await db.from(table).delete().gte("id", 0);
    if (delError) {
      console.error(`  ${table}: FALHOU ao limpar antes de inserir — ${delError.message}`);
      return;
    }
  }

  const { error } = await db.from(table).upsert(rows, conflictKey ? { onConflict: conflictKey } : {});
  if (error) {
    console.error(`  ${table}: FALHOU — ${error.message}`);
    return;
  }
  console.log(`  ${table}: ${rows.length} registro(s)`);
}

console.log("Carregando conteúdo para o Supabase…\n");

const { providers } = await json("rede-credenciada.json");
// "featured" é not-null no schema, mas só os credenciados em destaque têm a
// chave no JSON. Num upsert em lote, o Postgrest envia NULL explícito para
// a chave ausente em vez de aplicar o DEFAULT da coluna — por isso o valor
// precisa vir preenchido aqui antes de enviar.
await upsert(
  "providers",
  providers.map((p) => ({ ...p, featured: p.featured ?? false })),
  "slug",
);

const { services } = await json("servicos.json");
await upsert(
  "services",
  services.map((s, i) => ({
    slug: s.slug,
    name: s.name,
    summary: s.summary,
    description: s.description,
    icon: s.icon,
    category: s.category,
    price: s.price ?? null,
    how_to: s.howTo ?? [],
    sort_order: i,
  })),
  "slug",
);

const institucional = await json("institucional.json");
await upsert(
  "impact_stats",
  institucional.stats.map((s, i) => ({ value: s.value, label: s.label, note: s.note ?? null, sort_order: i })),
);
await upsert(
  "leaders",
  institucional.leaders.map((l, i) => ({ name: l.name, role: l.role, term: l.term ?? null, sort_order: i })),
);

const transparencia = await json("transparencia.json");
await upsert(
  "transparency_docs",
  transparencia.docs.map((d) => ({
    title: d.title,
    year: d.year,
    type: d.type,
    file: d.file,
    size: d.size === "TODO" ? null : d.size,
  })),
);

const { items: faq } = await json("faq.json");
await upsert("faq", faq.map((f, i) => ({ question: f.question, answer: f.answer, sort_order: i })));

const { plans } = await json("associado.json");
await upsert(
  "membership_plans",
  plans.map((p, i) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    period: p.period,
    highlight: p.highlight ?? false,
    benefits: p.benefits,
    note: p.note ?? null,
    sort_order: i,
  })),
  "slug",
);

const { testimonials } = await json("depoimentos.json");
await upsert(
  "testimonials",
  testimonials.map((t, i) => ({ quote: t.quote, author: t.author, role: t.role ?? null, sort_order: i })),
);

// Notícias: o Markdown é enviado como está. O editor do painel passa a ser a
// fonte de verdade a partir daqui — o HTML final é renderizado na leitura.
const postsDir = path.join(contentDir, "noticias");
const files = (await readdir(postsDir)).filter((f) => f.endsWith(".md"));
const posts = await Promise.all(
  files.map(async (file) => {
    const { data, content } = matter(await readFile(path.join(postsDir, file), "utf8"));
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title ?? file,
      excerpt: data.excerpt ?? "",
      content,
      date: data.date ?? new Date().toISOString().slice(0, 10),
      category: data.category ?? "Notícias",
      author: data.author ?? null,
      published: false, // revise no painel antes de publicar
    };
  }),
);
await upsert("posts", posts, "slug");

console.log("\nPronto. As notícias entraram como rascunho (published = false).");
console.log("Defina CONTENT_SOURCE=supabase na Vercel para o site passar a ler do banco.");
