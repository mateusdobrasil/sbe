/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "sbecuiaba.com.br" },
      { protocol: "https", hostname: "**.sbecuiaba.com.br" },
    ],
  },
  async redirects() {
    // Preserva o SEO das URLs do site WordPress antigo.
    return [
      { source: "/inicio", destination: "/", permanent: true },
      { source: "/institucional", destination: "/quem-somos", permanent: true },
      { source: "/servicos-internos", destination: "/servicos", permanent: true },
      { source: "/convenio", destination: "/rede-credenciada", permanent: true },
      { source: "/como-ajudar", destination: "/doe", permanent: true },
    ];
  },
};
export default nextConfig;
