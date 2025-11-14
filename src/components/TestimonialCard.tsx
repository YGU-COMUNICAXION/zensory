import type { Testimonial } from "../data/testimonials";

interface TestimonialCardProps extends Testimonial {
  className?: string;
}

export function TestimonialCard({
  name,
  age,
  message,
  className = "",
}: TestimonialCardProps) {
  return (
    <article
      className={`flex h-full flex-col justify-start rounded-2xl
         bg-accent px-6 py-8 text-primary shadow-lg md:px-10 md:py-12 ${className}`.trim()}
    >
      <header className="mb-6 flex flex-wrap items-end justify-center gap-3 md:mb-8">
        <h3 className="font-heading text-2xl font-semibold italic md:text-4xl">
          {name}
        </h3>
        <span className="font-heading text-base italic text-primary/80 md:text-xl">
          {age} años
        </span>
      </header>
      <p className="font-sans text-center text-sm leading-relaxed md:text-lg md:leading-8">
        {message}
      </p>
    </article>
  );
}
