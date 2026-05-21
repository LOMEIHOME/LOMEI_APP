import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-dark)] text-[var(--color-white)] hover:bg-[var(--color-camel)]",
  secondary:
    "border border-[var(--color-sand)] text-[var(--color-dark)] hover:border-[var(--color-camel)] hover:text-[var(--color-camel)] bg-transparent",
  ghost:
    "text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] bg-transparent",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans font-normal transition-all duration-400 rounded-sm ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
