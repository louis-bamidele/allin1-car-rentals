import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BookingForm from "./BookingForm";
import { CheckIcon } from "./Icons";
import { useLang } from "../contexts/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

function inItem(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  };
}

export default function Hero() {
  const { t } = useLang();
  return (
    <section
      id="home"
      className="relative pt-14 sm:pt-20 lg:pt-28 pb-14 sm:pb-20 lg:pb-28 overflow-hidden"
    >
      <motion.img
        src="/images/curacao.webp"
        alt=""
        aria-hidden="true"
        // Largest Contentful Paint candidate — load with high priority
        fetchPriority="high"
        decoding="async"
        width="1344"
        height="896"
        className="absolute inset-0 w-full h-full object-cover object-center"
        initial={{ scale: 1.08, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-navy-500/30 blur-3xl" />

      <div className="container-x relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <div className="lg:col-span-7 text-white">
          <motion.span
            {...inItem(0.05)}
            className="eyebrow text-gold-400 block"
          >
            {t.hero.eyebrow}
          </motion.span>
          <motion.h1
            {...inItem(0.12)}
            className="mt-3 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight"
          >
            {t.hero.heading}{" "}
            <span className="text-gold-400">{t.hero.headingAccent}</span>
          </motion.h1>
          <motion.p
            {...inItem(0.2)}
            className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/85 max-w-xl"
          >
            {t.hero.body}
          </motion.p>
          <motion.ul
            {...inItem(0.28)}
            className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 sm:gap-y-3"
          >
            {t.hero.highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-2 text-sm text-white/90"
              >
                <span className="grid place-items-center w-6 h-6 rounded-full bg-gold-500 text-navy-900 shrink-0">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                {h}
              </li>
            ))}
          </motion.ul>

          <motion.div
            {...inItem(0.36)}
            className="mt-7 flex flex-col sm:flex-row gap-3"
          >
            <Link to="/cars" className="btn-primary w-full sm:w-auto">
              {t.hero.browseFleet}
            </Link>
            <a
              href="https://wa.me/59995178686"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
            >
              {t.hero.chatWhatsapp}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="lg:col-span-5 w-full"
        >
          <div
            id="book"
            className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur p-2 border border-white/15"
          >
            <div className="text-center text-white/90 text-sm pt-2 pb-3">
              {t.hero.quickBooking}
            </div>
            <BookingForm compact />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
