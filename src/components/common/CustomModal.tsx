import { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "7xl";

type IconTone =
  | "blue"
  | "green"
  | "red"
  | "amber"
  | "purple"
  | "slate"
  | "cyan";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconTone?: IconTone;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  headerRight?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  /** Block close until parent allows it. Useful for "discard changes?" confirms. */
  beforeClose?: () => boolean | Promise<boolean>;
  className?: string;
  bodyClassName?: string;
}

const SIZE_MAP: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "7xl": "max-w-7xl",
};

const TONE_MAP: Record<IconTone, { bg: string; gradient: string }> = {
  blue: {
    bg: "bg-blue-600",
    gradient: "from-blue-50/80 via-white to-blue-50/80",
  },
  green: {
    bg: "bg-emerald-600",
    gradient: "from-emerald-50/80 via-white to-emerald-50/80",
  },
  red: { bg: "bg-red-600", gradient: "from-red-50/80 via-white to-red-50/80" },
  amber: {
    bg: "bg-amber-500",
    gradient: "from-amber-50/80 via-white to-amber-50/80",
  },
  purple: {
    bg: "bg-purple-600",
    gradient: "from-purple-50/80 via-white to-purple-50/80",
  },
  slate: {
    bg: "bg-slate-700",
    gradient: "from-slate-50/80 via-white to-slate-50/80",
  },
  cyan: {
    bg: "bg-cyan-600",
    gradient: "from-cyan-50/80 via-white to-cyan-50/80",
  },
};

const CustomModal = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  iconTone = "blue",
  size = "2xl",
  children,
  footer,
  headerRight,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  beforeClose,
  className = "",
  bodyClassName = "",
}: CustomModalProps) => {
  // body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleClose = async () => {
    if (beforeClose) {
      const ok = await beforeClose();
      if (!ok) return;
    }
    onClose();
  };

  // ESC key
  useEffect(() => {
    if (!closeOnEsc) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closeOnEsc]);

  if (!open) return null;

  const tone = TONE_MAP[iconTone];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={closeOnOverlayClick ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-modal-title"
          className={`bg-white rounded-2xl overflow-hidden w-full ${SIZE_MAP[size]} max-h-[90vh]
            flex flex-col pointer-events-auto border border-slate-200
            shadow-2xl transform transition-all duration-300
            animate-in zoom-in-95 slide-in-from-bottom-4 ${className}`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b border-slate-100
              bg-gradient-to-r ${tone.gradient}
              sticky top-0 z-20 rounded-t-2xl`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {icon && (
                <div
                  className={`relative p-3 ${tone.bg} rounded-xl shadow-lg shrink-0
                    transform transition-transform hover:scale-105 text-white`}
                >
                  {icon}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h1
                  id="custom-modal-title"
                  className="text-xl font-bold text-slate-900 truncate"
                >
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-slate-500 mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4 shrink-0">
              {headerRight}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl transition-all duration-200 group
                    hover:scale-110 active:scale-95 hover:bg-slate-100"
                  aria-label="Close modal"
                >
                  <IoClose className="w-6 h-6 text-slate-500 group-hover:text-slate-900 transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div
            className={`flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/40 to-white ${bodyClassName}`}
          >
            <div className="p-6">{children}</div>
          </div>

          {/* Footer */}
          {footer && (
            <div
              className="border-t border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50
                px-6 py-4 sticky bottom-0 z-20 rounded-b-2xl"
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomModal;
