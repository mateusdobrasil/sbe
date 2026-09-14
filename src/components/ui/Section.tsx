import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  id,
  className,
  children,
  tone = "paper",
  size = "default",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: "paper" | "alt" | "brand" | "deep";
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        tone === "paper" && "bg-paper",
        tone === "alt" && "bg-paper-alt",
        tone === "brand" && "bg-brand-50",
        tone === "deep" && "bg-deep-800 text-white",
        className,
      )}
    >
      <Container size={size}>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold tracking-wide uppercase",
            tone === "light" ? "text-brand-700" : "text-brand-300",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl",
          tone === "light" ? "text-ink" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            tone === "light" ? "text-ink-soft" : "text-deep-100",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
