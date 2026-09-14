/**
 * Contrato de conteúdo do site.
 *
 * Todas as páginas consomem estes tipos através de `@/lib/content`.
 * Trocar a origem dos dados (arquivos locais <-> WordPress headless)
 * não exige alterar nenhuma página.
 */

export type Specialty =
  | "Alergologia"
  | "Cardiologia"
  | "Exames laboratoriais"
  | "Fisioterapia"
  | "Fonoaudiologia"
  | "Gastroenterologia"
  | "Mamografia"
  | "Nutrição"
  | "Oftalmologia"
  | "Otorrinolaringologia"
  | "Psicologia"
  | "Raio X"
  | "Ressonância magnética"
  | "Tomografia"
  | "Ultrassonografia"
  | "Cirurgia vascular"
  | "Consultas clínicas"
  | "Medicina do sono";

/** Clínica, laboratório ou hospital da rede credenciada. */
export interface Provider {
  slug: string;
  name: string;
  specialties: Specialty[];
  district?: string;
  address?: string;
  phone?: string;
  logo?: string;
  /** Desconto médio para associados, em porcentagem. */
  discount?: number;
  featured?: boolean;
}

/** Serviço prestado na sede da SBE. */
export interface Service {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon: ServiceIcon;
  /** "Gratuito", "Valor social" ou faixa de preço. */
  price?: string;
  /** Como o beneficiário acessa o serviço. */
  howTo?: string[];
  category: "Saúde" | "Assistência social" | "Apoio";
}

export type ServiceIcon =
  | "stethoscope"
  | "flask"
  | "scan"
  | "heart"
  | "basket"
  | "users"
  | "book"
  | "shield";

export interface ImpactStat {
  value: string;
  label: string;
  note?: string;
}

export interface Leader {
  name: string;
  role: string;
  photo?: string;
  term?: string;
}

/** Documento público de prestação de contas. */
export interface TransparencyDoc {
  title: string;
  year: number;
  type: "Relatório anual" | "Demonstração financeira" | "Estatuto" | "Certidão" | "Ata";
  file: string;
  size?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** HTML já renderizado, pronto para `dangerouslySetInnerHTML`. */
  content: string;
  date: string;
  category: string;
  cover?: string;
  author?: string;
}

export interface MembershipPlan {
  slug: string;
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  benefits: string[];
  note?: string;
}

/** Superfície completa exposta pelos adaptadores de conteúdo. */
export interface ContentAdapter {
  getProviders(): Promise<Provider[]>;
  getServices(): Promise<Service[]>;
  getStats(): Promise<ImpactStat[]>;
  getLeaders(): Promise<Leader[]>;
  getTransparencyDocs(): Promise<TransparencyDoc[]>;
  getTestimonials(): Promise<Testimonial[]>;
  getFaq(): Promise<FaqItem[]>;
  getPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | null>;
  getMembershipPlans(): Promise<MembershipPlan[]>;
}
