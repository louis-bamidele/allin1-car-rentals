import { motion } from "framer-motion";
import { PlaneIcon, ClockIcon, CarIcon, ShieldIcon, MapPinIcon, CheckIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";
import { useLang } from "../contexts/LanguageContext";

const ICONS = [PlaneIcon, ClockIcon, CarIcon, ShieldIcon, MapPinIcon, CheckIcon];

export default function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="section">
      <div className="container-x">
        <Reveal className="max-w-2xl" variants={fadeUp}>
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            {t.services.heading}
          </h2>
          <p className="mt-3 text-slate-600">
            {t.services.body}
          </p>
        </Reveal>
        <Reveal variants={stagger} className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {t.services.items.map(({ title, text }, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="card flex gap-4"
              >
                <div className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-cream-50 text-navy-900">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{text}</p>
                </div>
              </motion.div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
