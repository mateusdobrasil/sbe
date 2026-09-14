/**
 * Ícones em SVG inline.
 *
 * O site antigo carregava 153 imagens, muitas delas ícones em PNG.
 * Aqui cada ícone custa alguns bytes de markup e nenhuma requisição.
 */
import type { ServiceIcon } from "@/lib/content/types";

const paths: Record<string, React.ReactNode> = {
  stethoscope: (
    <>
      <path d="M4 3v6a5 5 0 0 0 10 0V3" />
      <path d="M9 14v2a5 5 0 0 0 10 0v-1" />
      <circle cx="19" cy="12" r="2.5" />
      <path d="M2 3h4M12 3h4" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3v6.5L4 18a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-5-8.5V3" />
      <path d="M8 3h8M6.5 14h11" />
    </>
  ),
  scan: (
    <>
      <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M7 12h10" />
    </>
  ),
  heart: <path d="M12 20s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 7a4.1 4.1 0 0 1 7 3.6C19 15.4 12 20 12 20Z" />,
  basket: (
    <>
      <path d="M4 9h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 9Z" />
      <path d="M8 9 10 3M16 9 14 3M9.5 13v4M14.5 13v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4M17.5 20a6 6 0 0 0-2-4.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v4H6.5A2.5 2.5 0 0 1 4 19.5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 20 6v6c0 4.6-3.3 8.4-8 9.5-4.7-1.1-8-4.9-8-9.5V6l8-3.5Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.7-4.7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  phone: (
    <path d="M6.3 3h3l1.6 4-2 1.4a12.5 12.5 0 0 0 5.7 5.7l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.3 5.2 2 2 0 0 1 6.3 3Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.7 6.6 8.3 6 8.3-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  whatsapp: (
    <path
      d="M12.04 2C6.6 2 2.2 6.4 2.2 11.8c0 1.9.5 3.7 1.5 5.3L2 22l5.1-1.6a9.9 9.9 0 0 0 4.9 1.3c5.4 0 9.8-4.4 9.8-9.8S17.5 2 12.04 2Zm5.7 13.9c-.24.68-1.4 1.3-1.94 1.34-.5.05-1.13.07-1.82-.11a16.6 16.6 0 0 1-1.65-.6c-2.9-1.26-4.8-4.2-4.95-4.4-.14-.2-1.18-1.57-1.18-3s.75-2.12 1.02-2.42c.27-.29.58-.36.78-.36l.56.01c.18 0 .42-.07.66.5.24.6.83 2.03.9 2.18.07.14.12.31.02.5-.1.2-.15.32-.3.5l-.44.51c-.14.14-.29.3-.13.59.17.29.74 1.22 1.58 1.98 1.09.97 2 1.27 2.29 1.42.29.14.46.12.63-.07.17-.2.72-.85.92-1.14.19-.29.39-.24.65-.14.27.1 1.7.8 1.98.95.3.14.49.21.56.33.07.12.07.69-.17 1.37Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path
      d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2a1 1 0 0 1 1-1Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h13m-5.5-5.5L18.5 12l-6 6" />,
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2.5" />
      <path d="M6 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V6" />
    </>
  ),
  download: <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 19h16" />,
  chevron: <path d="m7 10 5 5 5-5" />,
  flame: (
    <path d="M12 2c.6 3.4-1.8 4.4-2.9 6.4-1.4 2.5.3 4.3 1.4 4.6-.5-1.6.4-3 1.3-3.7.2 1.6 1.3 2.2 2.2 3.3 1.1 1.3 1 3-.1 4.1 2.6-.9 4.1-3.2 4.1-5.9C18 6.6 14.6 3.7 12 2Z" />
  ),
  heartHand: (
    <>
      <path d="M3 13h3l3 2h3a1.5 1.5 0 0 1 0 3H9" />
      <path d="M6 21h9l5-4.5a1.9 1.9 0 0 0-2.6-2.8L14 16.5" />
      <path d="M12.5 8.5s-3-1.7-3-3.6a1.8 1.8 0 0 1 3-1.1 1.8 1.8 0 0 1 3 1.1c0 1.9-3 3.6-3 3.6Z" />
    </>
  ),
};

export function Icon({
  name,
  className = "size-6",
  ...rest
}: {
  name: ServiceIcon | keyof typeof paths;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {paths[name] ?? paths.heart}
    </svg>
  );
}
