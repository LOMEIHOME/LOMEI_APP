"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

interface AddToCartButtonProps {
  slug: string;
  name: string;
  price: number;
  image: string;
  variant?: "icon" | "full";
}

export default function AddToCartButton({
  slug,
  name,
  price,
  image,
  variant = "icon",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ slug, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleAdd}
        className="w-full py-3 bg-[var(--color-dark)] text-white text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors duration-300"
      >
        {added ? "Agregado al carrito" : "Agregar al carrito"}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-300 ${
        added
          ? "bg-[var(--color-oak)] text-white"
          : "bg-[var(--color-white)] text-[var(--color-dark)] hover:bg-[var(--color-oak)] hover:text-white"
      }`}
      title="Agregar al carrito"
    >
      {added ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      )}
    </button>
  );
}
