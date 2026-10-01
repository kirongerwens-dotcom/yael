import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
export function Reveal({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
export function Section({
  id,
  number,
  title,
  children,
  light = false,
  className = "",
}) {
  return (
    <section id={id} className={`chapter ${light ? "light" : ""} ${className}`}>
      <div className="section-inner">
        <Reveal>
          <p className="eyebrow">
            {number} / {title}
          </p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        autoFocus
        className="close icon-button"
        onClick={onClose}
        aria-label="Schließen"
      >
        <X size={22} />
      </button>
      <p className="eyebrow">{title}</p>
      {children}
    </dialog>
  );
}
export function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Die Seite funktioniert auch ohne Browser-Speicher. */
  }
}
