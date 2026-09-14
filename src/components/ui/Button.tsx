import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

/*
 * min-h-11 garante 44px de altura — a diretriz de alvo de toque da Apple e
 * o nível AAA da WCAG 2.5.5. Importa especialmente aqui: boa parte de quem
 * procura a SBE é idosa e usa o site pelo celular.
 */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-center font-semibold transition-colors duration-150 disabled:opacity-60 disabled:pointer-events-none";

/* Cada par cor/fundo abaixo foi verificado em WCAG AA (mínimo 4.5:1). */
const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-deep-950 hover:bg-brand-400",
  secondary: "bg-deep-800 text-white hover:bg-deep-700",
  outline: "border-2 border-deep-800 text-deep-800 hover:bg-deep-800 hover:text-white",
  ghost: "text-deep-800 hover:bg-deep-50",
  onDark: "border-2 border-white/70 text-white hover:bg-white hover:text-deep-900",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "min-h-13 px-7 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function ButtonAction({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
