interface ServiceIconProps {
  iconId: string;
  className?: string;
  size?: "sm" | "md";
}

/* ============================================================
   Iconos abstractos LOMEI — Estilo «Duotono»
   Misma geometría simétrica del estilo línea, con una forma
   base rellena en sand (--color-sand) bajo el trazo camel.
   ============================================================ */
function IconSvg({ iconId, size }: { iconId: string; size: "sm" | "md" }) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: size === "sm" ? "w-8 h-8" : "w-8 h-8 md:w-10 md:h-10",
  };
  // Relleno sand para la forma base de cada motivo
  const sand = { fill: "var(--color-sand)", stroke: "none" };

  switch (iconId) {
    /* Diálogo — dos círculos que se intersecan; el punto es el acuerdo */
    case "asesoria":
      return (
        <svg {...props}>
          <circle cx="18.5" cy="24" r="9" {...sand} />
          <circle cx="29.5" cy="24" r="9" />
          <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );

    /* Composición — esfera sobre el plano, punto que corona */
    case "styling":
      return (
        <svg {...props}>
          <circle cx="24" cy="26" r="8" {...sand} />
          <path d="M10 34h28" />
          <circle cx="24" cy="13" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );

    /* Pieza única — rombo inscrito en cuadrado */
    case "custom-design":
      return (
        <svg {...props}>
          <rect x="12" y="12" width="24" height="24" />
          <polygon points="24,16 32,24 24,32 16,24" {...sand} />
        </svg>
      );

    /* Espacio — planta en cuadrantes con núcleo */
    case "interiorismo":
      return (
        <svg {...props}>
          <rect x="11" y="11" width="26" height="26" />
          <rect x="20" y="20" width="8" height="8" {...sand} />
          <path d="M24 11v9M24 28v9M11 24h9M28 24h9" />
        </svg>
      );

    /* Precisión — plomada sobre niveles */
    case "proyecto-ejecutivo":
      return (
        <svg {...props}>
          <circle cx="24" cy="12" r="2.4" {...sand} />
          <path d="M24 12v24" />
          <path d="M12 19h24M15 25h18M18 31h12" />
        </svg>
      );

    /* Naturaleza — arcos que brotan del plano */
    case "paisajismo":
      return (
        <svg {...props}>
          <path d="M18 34a6 6 0 0 1 12 0" {...sand} />
          <path d="M13 34a11 11 0 0 1 22 0" />
          <path d="M8 34a16 16 0 0 1 32 0" />
          <path d="M8 34h32" />
        </svg>
      );

    /* Obra — estructura sobre el terreno */
    case "ejecucion":
      return (
        <svg {...props}>
          <polygon points="24,11 38,32 10,32" />
          <polygon points="24,20 29.5,29 18.5,29" {...sand} />
          <path d="M8 38h32" />
        </svg>
      );

    /* Ensamble — pórtico: dintel, apoyos y eje */
    case "fabricacion":
      return (
        <svg {...props}>
          <rect x="10" y="13" width="28" height="4" {...sand} />
          <path d="M14 17v19M34 17v19M14 27h20" />
          <circle cx="24" cy="31.5" r="1.4" fill="currentColor" stroke="none" />
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

export default function ServiceIcon({ iconId, className = "", size = "md" }: ServiceIconProps) {
  const sizeClasses = size === "sm" ? "w-[4.25rem] h-[4.25rem]" : "w-24 h-24";
  return (
    <div
      className={`
        flex items-center justify-center rounded-full flex-none
        ${sizeClasses}
        border border-[var(--color-sand)]/70
        text-[var(--color-camel)]
        transition-colors duration-400
        hover:bg-[var(--color-linen)]
        ${className}
      `}
    >
      <IconSvg iconId={iconId} size={size} />
    </div>
  );
}
