import { useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/5 flex items-center justify-center p-4 backdrop-blur-[1px] transition-all duration-300"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-amber-50 p-3 w-full max-w-lg rounded-lg shadow-2xl transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3>{title}</h3>

          <button className="cursor-pointer" onClick={onClose}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main */}
        <div>{children}</div>

        {/* Footer */}
        <div>Footer</div>
      </div>
    </div>,
    document.body,
  );
};
