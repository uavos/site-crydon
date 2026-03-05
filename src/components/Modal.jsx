"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

let __scrollLocks = 0;

function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;

    __scrollLocks += 1;
    const body = document.body;
    const html = document.documentElement;

    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight
    };

    const scrollbar = window.innerWidth - html.clientWidth;
    const scrollY = window.scrollY;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      __scrollLocks = Math.max(0, __scrollLocks - 1);
      if (__scrollLocks === 0) {
        body.style.overflow = prev.overflow;
        body.style.position = prev.position;
        body.style.top = prev.top;
        body.style.width = prev.width;
        body.style.paddingRight = prev.paddingRight;
        window.scrollTo(0, scrollY);
      }
    };
  }, [active]);
}

export default function Modal({
  open,
  onClose,
  ariaLabel = "Dialog",
  title,
  children,
  maxWidth = 960,
  fit = "media" // "media" | "content"
}) {
  useLockBodyScroll(open);
  if (!open) return null;

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
      className="modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal ${fit === "content" ? "modal--content" : ""}`}
        style={{ maxWidth }}
      >
        {title && (
          <div className="modal-header">
            <div className="modal-title">{title}</div>
          </div>
        )}

        <button onClick={onClose} aria-label="Close" className="modal-close">
          ✕
        </button>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
