/**
 * Dados estruturados Schema.org.
 *
 * O site antigo não tinha nenhum — por isso não aparecia com endereço,
 * telefone ou horário nos resultados do Google.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // O conteúdo vem do nosso próprio código, não de entrada do usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
