interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-sans bg-[var(--color-linen)] text-[var(--color-oak)] rounded-sm ${className}`}
    >
      {children}
    </span>
  );
}
