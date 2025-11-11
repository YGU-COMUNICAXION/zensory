import { useMemo, useState } from "react";
import type { Module } from "../data/modules";
import Modal from "./Modal";

type ModuleMobileExperienceProps = {
  modules: Module[];
};

const triggerBaseClasses =
  "flex w-full items-center gap-4 rounded-full bg-[#2A1A2B] px-5 py-4 text-left text-accent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-[#3B263D] active:bg-[#4A2E4E]";

const ModuleMobileExperience = ({ modules }: ModuleMobileExperienceProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeModule = useMemo(() => {
    if (activeIndex === null) {
      return null;
    }

    return modules[activeIndex] ?? null;
  }, [activeIndex, modules]);

  const closeModal = () => setActiveIndex(null);

  const goToIndex = (index: number) => {
    if (index < 0 || index >= modules.length) {
      return;
    }

    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (activeIndex === null) {
      return;
    }

    goToIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex === null) {
      return;
    }

    goToIndex(activeIndex + 1);
  };

  const isFirst = activeIndex === 0;
  const isLast = activeIndex !== null && activeIndex === modules.length - 1;

  return (
    <>
      <ul className="flex flex-col gap-3">
        {modules.map((module, index) => (
          <li key={module.number}>
            <button
              type="button"
              className={triggerBaseClasses}
              onClick={() => setActiveIndex(index)}
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-lg font-semibold text-accent">
                {module.number}
              </span>
              <span className="flex-1 text-left font-heading text-lg font-semibold italic leading-snug text-accent">
                Módulo {module.number}: {module.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={Boolean(activeModule)} onClose={closeModal} closeLabel="Cerrar módulo" className="lg:hidden">
        {activeModule ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-10">
              <header className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-lg font-semibold text-accent">
                  {activeModule.number}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-xl font-semibold italic">
                    Módulo {activeModule.number}: {activeModule.title}
                  </span>
                  {activeModule.subtitle ? (
                    <span className="text-xs uppercase tracking-[0.35em] text-accent/60">
                      {activeModule.subtitle}
                    </span>
                  ) : null}
                </div>
              </header>
              <div
                className="mt-6 space-y-6 text-base leading-relaxed text-accent/90"
                dangerouslySetInnerHTML={{ __html: activeModule.modalContent ?? "" }}
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-accent/15 bg-primary/90 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 shrink-0">
              <button
                type="button"
                className="flex-1 rounded-full bg-accent/10 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-accent transition-colors duration-200 hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                onClick={handlePrev}
                disabled={isFirst}
              >
                Módulo anterior
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                onClick={handleNext}
                disabled={isLast}
              >
                Siguiente módulo
              </button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default ModuleMobileExperience;
