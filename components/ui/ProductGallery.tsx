"use client";

import { useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/sections/FadeIn";

interface ProductGalleryProps {
  images: string[];
  name: string;
  badge?: string;
}

export default function ProductGallery({ images, name, badge }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <FadeIn>
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--color-linen)]">
          <Image
            src={images[activeIndex]}
            alt={name}
            fill
            className="object-cover transition-opacity duration-500"
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
          />
          {badge && (
            <div className="absolute top-4 left-4">
              <Badge>{badge}</Badge>
            </div>
          )}
        </div>
      </FadeIn>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <FadeIn key={i} delay={0.05 * i}>
              <button
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-square overflow-hidden rounded-sm bg-[var(--color-linen)] w-full cursor-pointer transition-opacity duration-300 ${
                  i === activeIndex ? "ring-1 ring-[var(--color-oak)] opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} — vista ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="15vw"
                />
              </button>
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
