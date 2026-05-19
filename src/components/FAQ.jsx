import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";
import { useLang } from "../contexts/LanguageContext";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const { t } = useLang();
  return (
    <section className="section bg-cream-50">
      <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10">
        <Reveal className="lg:col-span-4" variants={fadeUp}>
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            {t.faq.heading}
          </h2>
          <p className="mt-3 text-slate-600">
            {t.faq.body}
          </p>
        </Reveal>
        <Reveal variants={stagger} className="lg:col-span-8 space-y-3">
          {t.faq.items.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl bg-white shadow-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
              >
                <span className="font-display font-semibold text-navy-900">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0, backgroundColor: open === i ? "#D8A24A" : "#FAF6EE" }}
                  className="w-8 h-8 grid place-items-center rounded-full text-navy-900"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
