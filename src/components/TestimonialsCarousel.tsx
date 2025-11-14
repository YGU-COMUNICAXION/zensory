import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Testimonial } from "../data/testimonials";
import { TestimonialCard } from "./TestimonialCard";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const DESKTOP_BREAKPOINT = 1024;
const GAP_REM = 1.5;
const SWIPE_THRESHOLD_PX = 50;

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [itemOffsetPx, setItemOffsetPx] = useState(0);
  const dragState = useRef({
    pointerId: null as number | null,
    startX: 0,
    isDragging: false,
  });
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const updateItemOffset = () => {
      const track = trackRef.current;
      if (!track) return;

      const children = track.children;
      if (children.length <= 1) {
        const viewportWidth = viewportRef.current?.clientWidth ?? 0;
        const singleWidth = (children[0] as HTMLElement | undefined)?.offsetWidth ?? viewportWidth;
        setItemOffsetPx(singleWidth);
        return;
      }

      const firstChild = children[0] as HTMLElement;
      const secondChild = children[1] as HTMLElement;
      const offsetLeftDifference = secondChild.offsetLeft - firstChild.offsetLeft;

      if (offsetLeftDifference > 0) {
        setItemOffsetPx(offsetLeftDifference);
        return;
      }

      const rectDifference = secondChild.getBoundingClientRect().left - firstChild.getBoundingClientRect().left;
      setItemOffsetPx(rectDifference > 0 ? rectDifference : firstChild.offsetWidth);
    };

    updateItemOffset();
    window.addEventListener("resize", updateItemOffset);

    return () => {
      window.removeEventListener("resize", updateItemOffset);
    };
  }, [itemsPerView, testimonials.length]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goToPrev = useCallback(() => {
    setCurrentIndex((value) => Math.max(0, value - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((value) => Math.min(maxIndex, value + 1));
  }, [maxIndex]);

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        !dragState.current.isDragging ||
        dragState.current.pointerId !== event.pointerId
      ) {
        return;
      }

      const deltaX = event.clientX - dragState.current.startX;

      if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
        if (deltaX > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }

      dragState.current = {
        pointerId: null,
        startX: 0,
        isDragging: false,
      };
      setIsPointerActive(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [goToNext, goToPrev]
  );

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      isDragging: true,
    };
    setIsPointerActive(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !dragState.current.isDragging ||
      dragState.current.pointerId !== event.pointerId
    ) {
      return;
    }

    event.preventDefault();
  }, []);

  const handlePointerCancel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      dragState.current.pointerId !== event.pointerId ||
      !dragState.current.isDragging
    ) {
      return;
    }

    dragState.current = {
      pointerId: null,
      startX: 0,
      isDragging: false,
    };
    setIsPointerActive(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const trackStyles = useMemo(() => {
    return {
      transform: `translateX(-${currentIndex * itemOffsetPx}px)`,
      gap: `${GAP_REM}rem`,
    };
  }, [currentIndex, itemOffsetPx]);

  const itemWidth = useMemo(
    () => `calc((100% - ${(itemsPerView - 1) * GAP_REM}rem) / ${itemsPerView})`,
    [itemsPerView]
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => canGoPrev && goToPrev()}
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-accent disabled:cursor-not-allowed disabled:border-primary/30 disabled:text-primary/30 lg:flex"
          disabled={!canGoPrev}
          aria-label="Testimonio anterior"
        >
          <span aria-hidden="true">❮</span>
        </button>
        <div ref={viewportRef} className="relative w-full overflow-hidden">
          <div
            ref={trackRef}
            className={`flex w-full transition-transform duration-500 ease-in-out touch-pan-y ${
              isPointerActive ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={trackStyles}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
            onPointerCancel={handlePointerCancel}
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
          onClick={() => canGoNext && goToNext()}
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
