import { Link } from "react-router-dom";
import { CheckIcon } from "./Icons";
import Reveal, { fadeUp } from "./motion/Reveal";
import { useLang } from "../contexts/LanguageContext";

export default function About() {
  const { t } = useLang();
  return (
    <section id="about" className="section bg-cream-50">
      <div className="container-x grid lg:grid-cols-12 gap-8 md:gap-10 items-center">
        <Reveal className="lg:col-span-6" variants={fadeUp}>
          <div className="relative">
            <img
              src="/images/about.jpeg"
              alt="Friendly team handing over a rental car"
              className="rounded-3xl shadow-card w-full object-cover aspect-[4/3]"
            />
            <div className="hidden md:block absolute -bottom-6 -right-6 bg-navy-900 text-white p-6 rounded-2xl shadow-card max-w-xs">
              <div className="text-3xl font-display font-bold text-gold-400">
                5+
              </div>
              <p className="text-sm text-white/80 mt-1">{t.about.yearsLabel}</p>
            </div>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-6" variants={fadeUp}>
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            {t.about.heading}
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">{t.about.body}</p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {t.about.points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 text-sm text-navy-900/85"
              >
                <span className="mt-0.5 grid place-items-center w-5 h-5 rounded-full bg-gold-500 text-navy-900">
                  <CheckIcon className="w-3 h-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/cars" className="btn-primary">
              {t.about.seeCars}
            </Link>
            <a href="#contact" className="btn-ghost">
              {t.about.getInTouch}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
