export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

/**
 * Navegação em dois níveis.
 *
 * Sete itens em uma linha não cabem: no layout anterior "Quem somos", "Rede
 * credenciada" e "Seja associado" quebravam em duas linhas, cada um com uma
 * baseline diferente. A divisão abaixo dá a cada barra um trabalho próprio —
 * a de cima responde "que instituição é essa?", a principal responde "o que
 * eu consigo aqui?".
 */

/** Barra principal: o que a pessoa vem buscar. */
export const mainNav: NavItem[] = [
  { label: "Serviços", href: "/servicos", description: "Consultas, exames e assistência social" },
  { label: "Rede credenciada", href: "/rede-credenciada", description: "26 clínicas e laboratórios parceiros" },
  { label: "Seja associado", href: "/seja-associado", description: "Planos e benefícios" },
  { label: "Transparência", href: "/transparencia", description: "Prestação de contas e documentos" },
  { label: "Contato", href: "/contato", description: "Endereço, horários e formulário" },
];

/** Barra superior: quem é a instituição. */
export const secondaryNav: NavItem[] = [
  { label: "Quem somos", href: "/quem-somos", description: "História, missão e diretoria" },
  { label: "Notícias", href: "/noticias", description: "Ações e comunicados" },
  { label: "Voluntariado", href: "/voluntariado", description: "Doe o seu tempo" },
];

/** Tudo junto, para o menu do celular e para a página 404. */
export const allNav: NavItem[] = [...mainNav, ...secondaryNav];

export const footerNav = {
  institucional: [
    { label: "Quem somos", href: "/quem-somos" },
    { label: "Transparência", href: "/transparencia" },
    { label: "Notícias", href: "/noticias" },
    { label: "Política de privacidade", href: "/politica-de-privacidade" },
  ],
  atendimento: [
    { label: "Serviços", href: "/servicos" },
    { label: "Rede credenciada", href: "/rede-credenciada" },
    { label: "Seja associado", href: "/seja-associado" },
    { label: "Contato", href: "/contato" },
  ],
  participe: [
    { label: "Doe agora", href: "/doe" },
    { label: "Seja voluntário", href: "/voluntariado" },
    { label: "Seja um credenciado", href: "/contato?assunto=credenciamento" },
  ],
} satisfies Record<string, NavItem[]>;
