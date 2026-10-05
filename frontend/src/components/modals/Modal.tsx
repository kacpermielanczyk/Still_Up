import { X } from "lucide-react";
import { useEffect, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}>;

const sizeClass: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlay = true,
  showCloseButton = true,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return createPortal(
    <div
      className={`
        fixed inset-0 z-100 flex justify-end
        transition-[visibility] duration-200
        ${open ? "visible" : "invisible delay-200"}
      `}
    >
      <button
        type="button"
        onClick={closeOnOverlay ? onClose : undefined}
        className={`
          absolute inset-0 cursor-default bg-modal-overlay backdrop-blur-[2px]
          transition-opacity duration-200 ease-out
          ${open ? "opacity-100" : "opacity-0"}
        `}
      />

      <section
        className={`
          relative z-10 h-full w-[calc(100%-0.75rem)] ${sizeClass[size]}
          overflow-hidden border-l border-border bg-modal text-foreground
          shadow-[-24px_0_60px_rgba(15,23,42,0.16)]
          transition-all duration-200 ease-out
          sm:my-3 sm:mr-3 sm:h-[calc(100%-1.5rem)] sm:rounded-3xl sm:border
          ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-95"}
        `}
      >
        <div className="flex h-full flex-col">
          {(title || description || showCloseButton) && (
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {title && (
                  <h2 className="text-xl font-semibold text-foreground">
                    {title}
                  </h2>
                )}

                {description && (
                  <p className="mt-1 text-sm font-medium leading-relaxed text-text-muted">
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-input-border bg-input text-text-muted outline-none transition-all hover:bg-input-hover hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </header>
          )}

          <div
            className="
              modal-scroll
              min-h-0 flex-1
              overflow-y-auto overscroll-contain
              px-5 py-5 sm:px-6 sm:py-6
            "
          >
            {children}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
