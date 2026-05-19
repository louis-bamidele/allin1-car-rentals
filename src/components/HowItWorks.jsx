import { motion } from "framer-motion";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";
import { useLang } from "../contexts/LanguageContext";

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how" className="section bg-navy-900 text-white relative overflow-hidden">
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-x relative">
        <Reveal className="max-w-2xl" variants={fadeUp}>
          <span className="eyebrow text-gold-400">{t.howItWorks.eyebrow}</span>
          <h2 className="mt-3 text-white text-2xl sm:text-3xl md:text-4xl font-bold">
            {t.howItWorks.heading}
          </h2>
        </Reveal>
        <Reveal
          variants={stagger}
          className="mt-8 md:mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6"
        >
          {t.howItWorks.steps.map((s) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur"
            >
              <div className="text-5xl font-display font-bold text-gold-400">
                {s.n}
              </div>
              <h3 className="mt-3 text-white text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
