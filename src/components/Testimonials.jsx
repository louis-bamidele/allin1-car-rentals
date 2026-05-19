import { motion } from "framer-motion";
import { StarIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";
import { useLang } from "../contexts/LanguageContext";

export default function Testimonials() {
  const { t } = useLang();
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="max-w-2xl" variants={fadeUp}>
          <span className="eyebrow">{t.testimonials.eyebrow}</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            {t.testimonials.heading}
          </h2>
        </Reveal>
        <Reveal variants={stagger} className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {t.testimonials.reviews.map((r) => (
            <motion.figure
              key={r.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="card"
            >
              <div className="flex gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4" />
                ))}
              </div>
              <blockquote className="mt-4 text-slate-700 leading-relaxed">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t border-navy-100">
                <div className="font-semibold text-navy-900">{r.name}</div>
                <div className="text-xs text-slate-500">{r.trip}</div>
              </figcaption>
            </motion.figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
