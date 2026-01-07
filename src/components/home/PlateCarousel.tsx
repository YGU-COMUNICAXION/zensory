import { useEffect, useId, useMemo, useState } from "react";

type Dish = {
  title: string;
  image: string;
};

type PlateCarouselProps = {
  dishes: Dish[];
  interval?: number;
};

const AUTOPLAY_MS = 4000;

export default function PlateCarousel({
  dishes,
  interval = AUTOPLAY_MS,
}: PlateCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pathId = useId();
  const safeDishes = useMemo(() => dishes.filter(Boolean), [dishes]);

  useEffect(() => {
    if (safeDishes.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeDishes.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, safeDishes.length]);

  if (safeDishes.length === 0) {
    return null;
  }

  const current = safeDishes[activeIndex];

  const goToSlide = (index: number) => {
    const nextIndex = (index + safeDishes.length) % safeDishes.length;
    setActiveIndex(nextIndex);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex h-72 w-72 items-center justify-center md:h-[420px] md:w-[420px]">
        <img
          src={current.image}
          alt={current.title}
          className="h-full w-full rounded-full object-cover shadow-[0_20px_60px_rgba(176,122,79,0.25)]"
          loading="lazy"
        />
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <path
              id={pathId}
              d="M100,10 a90,90 0 1,1 0,180 a90,90 0 1,1 0,-180"
            />
          </defs>
          <text
            className="fill-[#b07a4f] text-[12px] font-semibold uppercase tracking-[0.4em] md:text-[13px]"
          >
            <textPath
              href={`#${pathId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {current.title}
            </textPath>
          </text>
        </svg>
      </div>

      <div className="flex items-center gap-6 text-[#b07a4f]">
        <button
          type="button"
          onClick={() => goToSlide(activeIndex - 1)}
          className="rounded-full border border-[#b07a4f] px-3 py-1 text-2xl transition hover:bg-[#b07a4f] hover:text-white"
          aria-label="Platillo anterior"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          {safeDishes.map((dish, index) => (
            <button
              key={dish.title}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === activeIndex ? "bg-[#b07a4f]" : "bg-[#e8d6c3]"
              }`}
              aria-label={`Ir a ${dish.title}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goToSlide(activeIndex + 1)}
          className="rounded-full border border-[#b07a4f] px-3 py-1 text-2xl transition hover:bg-[#b07a4f] hover:text-white"
          aria-label="Siguiente platillo"
        >
          ›
        </button>
      </div>
    </div>
  );
}
