import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";

export default function CarsLoader({ messageIndex = 0 }) {
  const [dots, setDots] = useState("");
  const { t } = useLang();
  const messages = t.carsLoader.messages;

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 350);
    return () => clearInterval(id);
  }, []);

  const message = messages[Math.min(messageIndex, messages.length - 1)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-28 sm:pt-32 lg:pt-40 pb-16 bg-navy-900 text-white relative overflow-hidden"
    >
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 w-96 h-96 rounded-full bg-navy-500/30 blur-3xl" />

      <div className="container-x relative flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <span className="absolute inset-0 rounded-full border-4 border-white/10" />
          <motion.span
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold-500 border-r-gold-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
          />
          <motion.span
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-gold-400/70 border-l-gold-400/70"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
          />
        </div>

        <div className="mt-8 h-7 sm:h-8 relative w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm sm:text-base text-white/85"
            >
              {message}
              <span className="inline-block w-6 text-left text-gold-400">{dots}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-6 h-1 w-44 sm:w-56 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gold-500"
            initial={{ width: "10%" }}
            animate={{ width: ["10%", "60%", "85%", "100%"] }}
            transition={{ duration: 2.6, times: [0, 0.4, 0.75, 1], ease: "easeOut" }}
          />
        </div>

        <p className="mt-6 text-xs text-white/50 max-w-xs">
          {t.carsLoader.footerNote}
        </p>
      </div>
    </motion.div>
  );
}
