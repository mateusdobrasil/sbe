/**
 * Converte o Markdown das notícias em HTML.
 *
 * Deliberadamente mínimo: cobre o subconjunto que a redação da SBE usa
 * (títulos, listas, links, ênfase, parágrafos) sem arrastar uma cadeia
 * remark/rehype inteira para o bundle.
 *
 * Compartilhado entre o adaptador de conteúdo local (que lê .md do disco)
 * e o painel administrativo (que roda esta mesma função ao salvar uma
 * notícia, e de novo no navegador para a prévia ao vivo) — assim o que a
 * equipe vê ao editar é exatamente o que vai para o ar.
 */
export function renderMarkdown(md: string): string {
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
