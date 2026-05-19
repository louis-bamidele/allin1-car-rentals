import { motion } from "framer-motion";
import { ShieldIcon, PlaneIcon, ClockIcon, CheckIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";
import { useLang } from "../contexts/LanguageContext";

const ICONS = [ShieldIcon, PlaneIcon, ClockIcon, CheckIcon];

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section className="section bg-cream-50">
      <div className="container-x">
        <Reveal className="max-w-2xl" variants={fadeUp}>
          <span className="eyebrow">{t.whyUs.eyebrow}</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            {t.whyUs.heading}
          </h2>
          <p className="mt-3 text-slate-600">
            {t.whyUs.body}
          </p>
        </Reveal>
        <Reveal
          variants={stagger}
          className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {t.whyUs.items.map(({ title, text }, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="card"
              >
                <div className="w-12 h-12 grid place-items-center rounded-xl bg-navy-900 text-gold-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
              </motion.div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
