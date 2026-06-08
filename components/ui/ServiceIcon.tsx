interface ServiceIconProps {
  iconId: string;
  className?: string;
}

function IconSvg({ iconId }: { iconId: string }) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-8 h-8 md:w-10 md:h-10",
  };

  switch (iconId) {
    /* Burbuja de dialogo */
    case "asesoria":
      return (
        <svg {...props}>
          <path d="M10 12h28a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H22l-8 6v-6h-4a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" />
          <circle cx="18" cy="21" r="1" fill="currentColor" stroke="none" />
          <circle cx="24" cy="21" r="1" fill="currentColor" stroke="none" />
          <circle cx="30" cy="21" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    /* Sofa / sillon */
    case "styling":
      return (
        <svg {...props}>
          <path d="M10 28V20a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v8" />
          <path d="M8 24v8a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2z" />
          <path d="M14 34v2M34 34v2" />
          <path d="M16 24v-4h16v4" />
        </svg>
      );

    /* Lapiz + regla */
    case "custom-design":
      return (
        <svg {...props}>
          <path d="M30 8l10 10-20 20H10V28z" />
          <path d="M26 12l10 10" />
          <path d="M8 8v32h4V8z" />
          <path d="M8 14h4M8 20h4M8 26h4M8 32h4" />
        </svg>
      );

    /* Plano de planta */
    case "interiorismo":
      return (
        <svg {...props}>
          <rect x="8" y="8" width="32" height="32" rx="1" />
          <path d="M8 24h16v16" />
          <path d="M24 8v10h16" />
          <path d="M14 8v6M34 24v6" />
        </svg>
      );

    /* Documento tecnico / blueprint */
    case "proyecto-ejecutivo":
      return (
        <svg {...props}>
          <path d="M14 8h14l8 8v24a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
          <path d="M28 8v8h8" />
          <path d="M18 22h12M18 28h12M18 34h8" />
        </svg>
      );

    /* Planta / arbol */
    case "paisajismo":
      return (
        <svg {...props}>
          <path d="M24 40V26" />
          <path d="M24 10c-6 0-10 4-10 9s4 9 10 9 10-4 10-9-4-9-10-9z" />
          <path d="M18 22c-3-1-5-4-5-7 0-4 3-7 7-7" />
          <path d="M30 22c3-1 5-4 5-7 0-4-3-7-7-7" />
          <path d="M20 40h8" />
        </svg>
      );

    /* Casco de obra */
    case "ejecucion":
      return (
        <svg {...props}>
          <path d="M8 28h32v4H8z" />
          <path d="M12 28V18a12 12 0 0 1 24 0v10" />
          <path d="M24 8v10" />
          <path d="M14 34v4M34 34v4" />
        </svg>
      );

    /* Mesa / mueble */
    case "fabricacion":
      return (
        <svg {...props}>
          <rect x="8" y="14" width="32" height="6" rx="1" />
          <path d="M12 20v18M36 20v18" />
          <path d="M12 30h24" />
        </svg>
      );

    default:
      return (
        <svg {...props}>
          <circle cx="24" cy="24" r="14" />
        </svg>
      );
  }
}

export default function ServiceIcon({ iconId, className = "" }: ServiceIconProps) {
  return (
    <div
      className={`
        flex items-center justify-center rounded-full flex-none
        w-24 h-24
        bg-[var(--color-linen)]
        text-[var(--color-camel)]
        transition-colors duration-400
        hover:bg-[var(--color-sand)]
        ${className}
      `}
    >
      <IconSvg iconId={iconId} />
    </div>
  );
}
