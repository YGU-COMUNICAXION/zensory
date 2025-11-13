import { useEffect, useMemo, useState } from "react";
import type { Testimonial } from "../data/testimonials";
import { TestimonialCard } from "./TestimonialCard";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const DESKTOP_BREAKPOINT = 1024;
const GAP_REM = 1.5;

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getItemsPerView = () =>
      window.innerWidth >= DESKTOP_BREAKPOINT ? 3 : 1;

    const updateItemsPerView = () => {
      setItemsPerView((prev) => {
        const next = getItemsPerView();
        if (prev === next) return prev;
        return next;
      });
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);
  const totalPages = maxIndex + 1;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [itemsPerView, maxIndex]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const trackStyles = useMemo(() => {
    const translatePercentage = (100 / itemsPerView) * currentIndex;
    return {
      transform: `translateX(-${translatePercentage}%)`,
      gap: `${GAP_REM}rem`,
    };
  }, [currentIndex, itemsPerView]);

  const itemWidth = useMemo(
    () => `calc((100% - ${(itemsPerView - 1) * GAP_REM}rem) / ${itemsPerView})`,
    [itemsPerView]
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() =>
            canGoPrev && setCurrentIndex((value) => Math.max(0, value - 1))
          }
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-accent disabled:cursor-not-allowed disabled:border-primary/30 disabled:text-primary/30 lg:flex"
          disabled={!canGoPrev}
          aria-label="Testimonio anterior"
        >
          <span aria-hidden="true">❮</span>
        </button>
        <div className="relative w-full overflow-hidden">
          <div
            className="flex w-full transition-transform duration-500 ease-in-out"
            style={trackStyles}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="flex-shrink-0"
                style={{ flex: `0 0 ${itemWidth}` }}
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            canGoNext &&
            setCurrentIndex((value) => Math.min(maxIndex, value + 1))
          }
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-accent disabled:cursor-not-allowed disabled:border-primary/30 disabled:text-primary/30 lg:flex"
          disabled={!canGoNext}
          aria-label="Siguiente testimonio"
        >
          <span aria-hidden="true">❯</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const isActive = currentIndex === pageIndex;
          return (
            <button
              key={`dot-${pageIndex}`}
              type="button"
              className={`h-3 w-3 rounded-full border border-primary transition ${
                isActive ? "bg-primary" : "bg-transparent"
              }`}
              onClick={() => setCurrentIndex(pageIndex)}
              aria-label={`Ir al testimonio ${pageIndex + 1}`}
              aria-pressed={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}
