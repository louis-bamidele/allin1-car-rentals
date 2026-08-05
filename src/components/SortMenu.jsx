import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "./Icons";

/**
 * Custom dropdown used for the price-sort filter across Fleet, OurCars and
 * Admin. Replaces the native <select> so we can style it to match the
 * pill-button aesthetic (cream background, gold accent, rounded, shadow).
 *
 * Props:
 *   value    — currently selected option value
 *   onChange — called with new value when the user picks an option
 *   options  — [{ value, label }, ...]
 *   variant  — "light" (cream pill, for customer pages) or "admin" (white box)
 *   label    — optional; if provided, trigger button always shows this string
 *              instead of the current selection's label (e.g. "Sort price").
 *              The selected option is still marked inside the open panel.
 */
export default function SortMenu({ value, onChange, options, variant = "light", label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const currentLabel = options.find((o) => o.value === value)?.label ?? "";
  const triggerLabel = label ?? currentLabel;

  const triggerCls =
    variant === "admin"
      ? "bg-white border border-navy-100 hover:border-navy-300 text-navy-900"
      : "bg-cream-50 hover:bg-cream-100 text-navy-900 border-0";

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 ${triggerCls} rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold-500/40`}
      >
        <SortIcon className="w-4 h-4 text-navy-700" />
        <span className="whitespace-nowrap">{triggerLabel}</span>
        <ChevronIcon
          className={`w-3.5 h-3.5 text-navy-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-60 origin-top-right bg-white rounded-2xl shadow-2xl border border-navy-100 py-2 z-30"
          >
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                    selected
                      ? "text-navy-900 font-semibold bg-cream-50"
                      : "text-slate-700 hover:bg-cream-50 hover:text-navy-900"
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected && <CheckIcon className="w-4 h-4 text-gold-600 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
