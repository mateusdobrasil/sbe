export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const mainNav: NavItem[] = [
  { label: "Quem somos", href: "/quem-somos", description: "História, missão e diretoria" },
  { label: "Serviços", href: "/servicos", description: "Consultas, exames e assistência social" },
  { label: "Rede credenciada", href: "/rede-credenciada", description: "26 clínicas e laboratórios parceiros" },
  { label: "Seja associado", href: "/seja-associado", description: "Planos e benefícios" },
  { label: "Transparência", href: "/transparencia", description: "Prestação de contas e documentos" },
  { label: "Notícias", href: "/noticias", description: "Ações e comunicados" },
  { label: "Contato", href: "/contato", description: "Endereço, horários e formulário" },
];

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
