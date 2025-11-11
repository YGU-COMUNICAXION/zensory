import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  PropsWithChildren,
} from "react";
import { useEffect, useCallback } from "react";
import closeIcon from "@assets/svg/close.svg?url";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  closeLabel?: string;
  dialogClassName?: string;
  showCloseButton?: boolean;
  closeButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

const baseOverlayClasses =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10";
const baseDialogClasses =
  "relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-primary text-accent shadow-2xl max-h-[min(90vh,40rem)]";
const baseCloseButtonClasses =
  "absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-200 hover:bg-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Modal({
  open,
  onClose,
  closeLabel = "Cerrar",
  className = "",
  dialogClassName = "",
  children,
  showCloseButton = true,
  closeButtonProps,
  ...attrs
}: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
      return () => {
        document.body.classList.remove("overflow-hidden");
      };
    }

    document.body.classList.remove("overflow-hidden");
    return undefined;
  }, [open]);

  const handleOverlayClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      {...attrs}
      className={`${baseOverlayClasses} ${className}`.trim()}
      onClick={handleOverlayClick}
    >
      <div role="document" className={`${baseDialogClasses} ${dialogClassName}`.trim()}>
        {showCloseButton ? (
          <button
            type="button"
            {...closeButtonProps}
            aria-label={closeLabel}
            className={`${baseCloseButtonClasses} ${closeButtonProps?.className ?? ""}`.trim()}
            onClick={(event) => {
              closeButtonProps?.onClick?.(event);
              if (!event.defaultPrevented) {
                onClose();
              }
            }}
          >
            <img src={closeIcon} alt={closeLabel} className="h-5 w-5" loading="lazy" />
          </button>
        ) : null}
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
