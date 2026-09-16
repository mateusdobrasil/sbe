import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/common/WhatsAppFab";
import { CookieConsent } from "@/components/common/CookieConsent";
import { JsonLd } from "@/components/common/JsonLd";
import { site, fullAddress } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `SBE Cuiabá — Consultas, exames e assistência social | ${site.legalName}`,
    template: `%s | SBE Cuiabá`,
  },
  description:
    "A Sociedade Beneficente Evangélica oferece consultas, exames e assistência social a preços acessíveis em Cuiabá, com 26 clínicas e laboratórios credenciados, sem carência.",
  keywords: [
    "SBE Cuiabá", "Sociedade Beneficente Evangélica", "convênio médico Cuiabá",
    "exames baratos Cuiabá", "consulta popular Cuiabá", "assistência social Cuiabá",
    "clínica credenciada Cuiabá", "ONG saúde Mato Grosso",
  ],
  authors: [{ name: site.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: `${site.name} — ${site.legalName}`,
    title: "SBE Cuiabá — Cuidado em saúde ao alcance de quem precisa",
    description:
      "Consultas, exames e assistência social a valores acessíveis em Cuiabá. 26 clínicas e laboratórios credenciados, sem carência.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SBE Cuiabá — Cuidado em saúde ao alcance de quem precisa",
    description:
      "Consultas, exames e assistência social a valores acessíveis em Cuiabá, com 26 credenciados e sem carência.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3b46",
  width: "device-width",
  initialScale: 1,
};

/** Schema.org — permite ao Google exibir endereço, telefone e horário. */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["NGO", "MedicalOrganization"],
  "@id": `${site.url}/#organizacao`,
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  description:
    "Organização da Sociedade Civil sem fins lucrativos que oferece assistência em saúde e amparo social a famílias em Cuiabá/MT.",
  foundingDate: String(site.foundedYear),
  // taxID é só o número — o "(Matriz)" em site.cnpj é qualificador para
  // exibição humana, não faz parte do identificador fiscal em si.
  taxID: site.cnpj.replace(/\s*\(.*\)\s*$/, ""),
  email: site.email.general,
  telephone: site.phone.tel,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: site.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.address.lat,
    longitude: site.address.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "07:00",
      closes: "11:00",
    },
  ],
  sameAs: [site.social.instagram, site.social.facebook],
  areaServed: { "@type": "City", name: "Cuiabá" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${display.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only rounded-full bg-deep-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Pular para o conteúdo
        </a>

        <Header />
        <main id="conteudo">{children}</main>
        <Footer />

        <WhatsAppFab />
        <CookieConsent />
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
