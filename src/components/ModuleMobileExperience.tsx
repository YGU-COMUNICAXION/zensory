import { useMemo, useState } from "react";
import Modal from "./Modal";

type ModuleDefinition = {
  number: number;
  title: string;
  subtitle?: string;
  modalContent?: string;
};

type ModuleMobileExperienceProps = {
  modules: ModuleDefinition[];
};

const triggerBaseClasses =
  "flex w-full items-center gap-4 rounded-full border border-accent/25 bg-primary/10 px-5 py-4 text-left text-accent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-primary/20 active:bg-primary/30";

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
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-xl font-semibold text-accent">
                  {module.number}
                </span>
                <div className="flex flex-col">
                  <span className="font-heading text-lg font-semibold italic text-accent">
                    Módulo {module.number}
                  </span>
                  <span className="text-sm text-accent/70">{module.title}</span>
                </div>
              </div>
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
            <div className="flex flex-col gap-3 border-t border-accent/15 bg-primary/90 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
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
