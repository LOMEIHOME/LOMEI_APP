interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTag({ children, className = "" }: SectionTagProps) {
  return (
    <span
      className={`text-[10px] tracking-[0.25em] uppercase text-[var(--color-warm-gray)] font-sans font-normal ${className}`}
    >
      {children}
    </span>
  );
}
