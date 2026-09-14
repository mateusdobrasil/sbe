/**
 * Configuração central da instituição.
 * Único lugar a alterar quando telefone, endereço ou redes mudarem.
 */

const PRODUCTION_URL = "https://sbecuiaba.com.br";

/** Descarta valores ausentes OU vazios. */
function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Resolve a URL pública do site.
 *
 * Uma variável definida como string vazia na Vercel não é capturada por `??`
 * — e `new URL("")` derruba o build inteiro em `metadataBase`. Por isso a
 * checagem é por valor, não por ausência.
 *
 * Em pré-visualizações, usa o domínio do próprio deploy para que links
 * canônicos e imagens de compartilhamento apontem para a branch correta.
 *
 * As leituras de `process.env` são escritas com acesso estático de
 * propriedade: é assim que o Next substitui `NEXT_PUBLIC_*` no bundle do
 * cliente. Com índice dinâmico (`process.env[nome]`) a substituição não
 * acontece e o valor chega vazio no navegador.
 */
function resolveSiteUrl(): string {
  // VERCEL_ENV e VERCEL_URL não têm o prefixo NEXT_PUBLIC_: só existem no servidor.
  const isPreview = clean(process.env.VERCEL_ENV) !== undefined
    && clean(process.env.VERCEL_ENV) !== "production";

  const candidate =
    clean(process.env.NEXT_PUBLIC_SITE_URL) ??
    (isPreview ? clean(process.env.VERCEL_URL) : undefined) ??
    PRODUCTION_URL;

  const withProtocol = /^https?:\/\//.test(candidate) ? candidate : `https://${candidate}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    // Valor malformado no ambiente: o build não pode cair por causa disso.
    return PRODUCTION_URL;
  }
}

export const site = {
  name: "SBE",
  legalName: "Sociedade Beneficente Evangélica",
  kind: "Organização da Sociedade Civil",
  tagline: "Cuidado em saúde ao alcance de quem precisa",
  url: resolveSiteUrl(),

  // TODO SBE: confirmar CNPJ e data de fundação — não constam no site atual.
  cnpj: "00.000.000/0001-00",
  foundedYear: 1998,

  verse: {
    text: "Um ao outro ajudou, e ao seu irmão disse: Esforça-te.",
    ref: "Isaías 41:6",
  },

  address: {
    street: "Av. dos Expedicionários, 65",
    district: "CPA IV",
    city: "Cuiabá",
    state: "MT",
    zip: "78058-513",
    country: "BR",
    lat: -15.5709,
    lng: -56.0709,
    mapsUrl: "https://goo.gl/maps/93AWZ22DacQUDcGz7",
  },

  phone: { display: "(65) 3644-2768", tel: "+556536442768" },
  whatsapp: {
    number: "5565992003755",
    display: "(65) 99200-3755",
    defaultMessage: "Olá! Vim pelo site e gostaria de mais informações.",
  },
  email: {
    general: "contato@sbecuiaba.com.br",
    donations: "doacaosocial@sbecuiaba.com.br",
  },
  pixKey: "65992003755",

  hours: [
    { days: "Segunda a sexta", time: "07h00 às 17h00" },
    { days: "Sábado", time: "07h00 às 11h00" },
    { days: "Domingo e feriados", time: "Fechado" },
  ],

  social: {
    instagram: "https://www.instagram.com/sbe_mt/",
    facebook: "https://www.facebook.com/sbemt/",
  },
} as const;

export function whatsappLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const fullAddress = `${site.address.street} — ${site.address.district}, ${site.address.city}/${site.address.state}, CEP ${site.address.zip}`;
