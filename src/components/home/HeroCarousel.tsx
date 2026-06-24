"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/images/banner_1_1_hero_banner_1440x480pixel.jpg",    alt: "SkyRoute hero banner" },
  { src: "/images/banner_1_1_price-wise-1440x480pixel.jpg",     alt: "Price-wise fares" },
  { src: "/images/banner_1_1_preferred_seats_1440x480pixel.jpg",alt: "Preferred seats" },
  { src: "/images/banner_1_1_excess_baggage_1440x480_pixel.jpg",alt: "Excess baggage options" },
  { src: "/images/banner_1_1_get_upfront_1440x480.jpg",         alt: "Get upfront pricing" },
];

export function HeroCarousel() {
  const [index, setIndex]   = useState(0);
  const [prev, setPrev]     = useState<number | null>(null);
  const [dir, setDir]       = useState<1 | -1>(1);

  const go = useCallback((next: number, direction: 1 | -1) => {
    setPrev(index);
    setDir(direction);
    setIndex(next);
  }, [index]);

  const next = useCallback(() => go((index + 1) % slides.length, 1),  [go, index]);
  const goTo = useCallback((i: number) => go(i, i > index ? 1 : -1), [go, index]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  /* Clear "prev" after transition completes */
  useEffect(() => {
    const t = setTimeout(() => setPrev(null), 700);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div className="relative h-[340px] w-full overflow-hidden sm:h-[420px] lg:h-[480px]">
      {slides.map((slide, i) => {
        const isCurrent = i === index;
        const isLeaving = i === prev;
        return (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              isCurrent && "opacity-100 translate-x-0",
              isLeaving && (dir === 1 ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8"),
              !isCurrent && !isLeaving && "opacity-0 translate-x-0"
            )}
            style={{ zIndex: isCurrent ? 2 : isLeaving ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/65 via-navy-950/15 to-transparent" />
          </div>
        );
      })}

      {/* Controls */}
      <button
        onClick={() => go((index - 1 + slides.length) % slides.length, -1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900/70 text-white backdrop-blur-sm hover:bg-navy-900 hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900/70 text-white backdrop-blur-sm hover:bg-navy-900 hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-7 bg-amber-400" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}
