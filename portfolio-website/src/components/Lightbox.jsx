import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../styles/Lightbox.css';

/**
 * Full-screen image viewer. Controlled by the parent:
 *   images: [{ src, alt }]
 *   index:  number | null   — null means closed
 */
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const open = index !== null && index >= 0;
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const go = useCallback(
    (delta) => {
      if (!open) return;
      const next = (index + delta + images.length) % images.length;
      onNavigate(next);
    },
    [open, index, images, onNavigate],
  );

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const items = dialogRef.current
          ? Array.from(dialogRef.current.querySelectorAll('button:not([disabled])'))
          : [];
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, go, onClose]);

  if (!open) return null;

  const current = images[index];

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      ref={dialogRef}
    >
      <button className="lightbox__close" onClick={onClose} aria-label="Close" ref={closeRef}>
        &times;
      </button>
      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label="Previous image"
        >
          &#8249;
        </button>
      )}
      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img src={current.src} alt={current.alt || ''} />
        {current.alt && <figcaption>{current.alt}</figcaption>}
      </figure>
      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label="Next image"
        >
          &#8250;
        </button>
      )}
    </div>,
    document.body,
  );
}
