import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowIcon } from "../components/Icons";
import { useLang } from "../contexts/LanguageContext";

const UPDATED = "May 15, 2026";

/** Converts **bold** markers in a string to <strong> elements. */
function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function Bullets({ items }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-[15px] text-slate-600 leading-relaxed"
        >
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ id, n, title, children }) {
  return (
    <div
      id={id}
      className="scroll-mt-32 pb-9 border-b border-slate-100 last:border-0 last:pb-0"
    >
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-xs font-bold text-gold-500 tracking-widest shrink-0">
          {n}
        </span>
        <h2 className="text-xl font-display font-bold text-navy-900">
          {title}
        </h2>
      </div>
      <div className="space-y-3 pl-7">{children}</div>
    </div>
  );
}

function P({ children }) {
  return (
    <p className="text-[15px] text-slate-600 leading-relaxed">{children}</p>
  );
}

/** Renders a single content item from the translation content array. */
function ContentItem({ item }) {
  if (item.type === "p") {
    return <P>{renderBold(item.text)}</P>;
  }
  if (item.type === "bullets") {
    return <Bullets items={item.items} />;
  }
  if (item.type === "contact") {
    return (
      <div className="mt-4 bg-cream-50 rounded-2xl border border-navy-100 p-5 space-y-1.5">
        <p className="text-sm font-bold text-navy-900">All in 1 Car Rentals</p>
        <p className="text-sm text-slate-600">{item.address}</p>
        <p className="text-sm text-slate-600">
          {item.phoneLabel}{" "}
          <a
            href="tel:+59995178686"
            className="text-gold-600 hover:underline font-medium"
          >
            +5999 517 8686
          </a>
        </p>
        <p className="text-sm text-slate-600">
          {item.hoursLabel} {item.hours}
        </p>
      </div>
    );
  }
  return null;
}

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Terms() {
  const { t } = useLang();
  const tr = t.terms;

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit">
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-14 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

        {/* SVG line drawing */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="tc-diag"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="30"
                x2="30"
                y2="0"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.06"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tc-diag)" />
          <g stroke="white" strokeWidth="0.8" fill="none" strokeOpacity="0.06">
            <circle cx="0" cy="100%" r="180" />
            <circle cx="0" cy="100%" r="290" />
            <circle cx="0" cy="100%" r="400" />
          </g>
          <g stroke="white" strokeWidth="0.6" strokeOpacity="0.04">
            <line x1="40%" y1="0" x2="100%" y2="100%" />
            <line x1="55%" y1="0" x2="110%" y2="100%" />
          </g>
        </svg>

        <div className="container-x relative">
          <span className="eyebrow text-gold-400">{tr.eyebrow}</span>
          <h1 className="mt-3 text-gold-400 text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight">
            {tr.headingLine1}
            <br className="block" />
            {tr.headingLine2}
          </h1>
          <p className="mt-4 max-w-2xl text-white/70 text-sm sm:text-base leading-relaxed">
            {tr.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
            <span>{tr.lastUpdated} {UPDATED}</span>
            <span>·</span>
            <span>{tr.appliesTo}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href="#eligibility"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-4 py-2 rounded-full transition"
            >
              {tr.jumpTerms}
            </a>
            <a
              href="#privacy"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-4 py-2 rounded-full transition"
            >
              {tr.jumpPrivacy}
            </a>
          </div>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="container-x py-14 lg:py-20 grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
        {/* Sticky sidebar */}
        <aside className="hidden lg:block sticky top-32 space-y-4">
          <div className="bg-cream-50 rounded-2xl border border-navy-100 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-900/40 mb-3">
              {tr.sidebar.tcLabel}
            </p>
            <nav className="space-y-0.5">
              {tr.tc.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-gold-600 hover:bg-white transition group"
                >
                  <span className="font-mono font-bold text-gold-500 w-5 text-[11px] group-hover:text-gold-600">
                    {s.n}
                  </span>
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-navy-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy-900/40 mb-3">
                {tr.sidebar.ppLabel}
              </p>
              <nav className="space-y-0.5">
                {tr.pp.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-gold-600 hover:bg-white transition group"
                  >
                    <span className="font-mono font-bold text-gold-500 w-5 text-[11px] group-hover:text-gold-600">
                      {s.n}
                    </span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="bg-navy-900 rounded-2xl p-5 text-white">
            <p className="font-semibold text-sm">{tr.sidebar.helpTitle}</p>
            <p className="mt-1 text-white/60 text-xs leading-relaxed">
              {tr.sidebar.helpHours}
            </p>
            <a
              href="https://wa.me/59995178686"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-semibold transition"
            >
              {tr.sidebar.helpChat} <ArrowIcon className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0">
          {/* ── T&C ── */}
          <div className="mb-10 pb-8 border-b-2 border-navy-900">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-900">
              {tr.tcHeading}
            </h2>
            <p className="mt-2 text-sm text-slate-400">{tr.tcSubheading}</p>
          </div>

          <div className="space-y-9">
            {tr.tc.map((section) => (
              <Block
                key={section.id}
                id={section.id}
                n={section.n}
                title={section.title}
              >
                {section.content.map((item, i) => (
                  <ContentItem key={i} item={item} />
                ))}
              </Block>
            ))}
          </div>

          {/* ── Privacy Policy ── */}
          <div id="privacy" className="scroll-mt-32 mt-20">
            <div className="rounded-2xl bg-navy-900 text-white p-7 sm:p-9 relative overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="pp-grid"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="24"
                      x2="24"
                      y2="0"
                      stroke="white"
                      strokeWidth="0.4"
                      strokeOpacity="0.07"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pp-grid)" />
                <circle
                  cx="100%"
                  cy="0"
                  r="220"
                  stroke="white"
                  strokeWidth="0.7"
                  fill="none"
                  strokeOpacity="0.07"
                />
                <circle
                  cx="100%"
                  cy="0"
                  r="340"
                  stroke="white"
                  strokeWidth="0.7"
                  fill="none"
                  strokeOpacity="0.07"
                />
              </svg>
              <div className="relative">
                <span className="eyebrow text-gold-400">{tr.ppEyebrow}</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold">
                  {tr.ppHeading}
                </h2>
                <p className="mt-2 text-white/60 text-sm leading-relaxed max-w-xl">
                  {tr.ppBody}
                </p>
                <p className="mt-3 text-white/30 text-xs">
                  {tr.lastUpdated} {UPDATED}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-9">
            {tr.pp.map((section) => (
              <Block
                key={section.id}
                id={section.id}
                n={section.n}
                title={section.title}
              >
                {section.content.map((item, i) => (
                  <ContentItem key={i} item={item} />
                ))}
              </Block>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Link to="/cars" className="btn-primary">
              {tr.cta.browse} <ArrowIcon className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/59995178686"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              {tr.cta.ask}
            </a>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
