import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getCars, getCategories } from "../lib/api";
import { imgUrl } from "../lib/cloudinary";
import { SeatIcon, GearIcon, FuelIcon, ArrowIcon } from "../components/Icons";
import CarsLoader from "../components/CarsLoader";
import Seo from "../components/Seo";
import SortMenu from "../components/SortMenu";
import { useLang } from "../contexts/LanguageContext";

function catLabel(cat, lang) {
  return (cat.translations && cat.translations[lang]) || cat.name;
}

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const MIN_LOADER_MS = 2400;
const MESSAGE_STEP_MS = 700;

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

export default function OurCars() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [fleet, setFleet] = useState([]);
  const [categories, setCategories] = useState([]);
  const { t, lang } = useLang();

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const messageTimer = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, 3));
    }, MESSAGE_STEP_MS);

    Promise.all([getCars(), getCategories()]).then(([data, cats]) => {
      if (!cancelled) { setFleet(data); setCategories(cats); }
      const imagesToPreload = data.map((c) => c.image);
      return Promise.all(imagesToPreload.map(preloadImage));
    }).then(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
      setTimeout(() => {
        if (!cancelled) setLoading(false);
      }, remaining);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      clearInterval(messageTimer);
    };
  }, []);

  const tabs = [{ _id: "all", name: "All", isAll: true }, ...categories];
  const activeTab = tabs[activeIndex] || tabs[0];
  const filtered = activeTab.isAll
    ? fleet
    : fleet.filter((c) => c.category === activeTab.name);
  const cars = [...filtered].sort((a, b) => {
    if (sortOrder === "price-asc") return (a.dailyRate || 0) - (b.dailyRate || 0);
    if (sortOrder === "price-desc") return (b.dailyRate || 0) - (a.dailyRate || 0);
    return 0;
  });

  const catMap = new Map(categories.map((c) => [c.name, c]));
  const labelFor = (carCategory) => {
    const cat = catMap.get(carCategory);
    return cat ? catLabel(cat, lang) : carCategory;
  };

  return (
    <>
      <Seo
        title="Rental Car Fleet in Curaçao — Economy, Comfort & SUV | All in 1"
        description="Browse the full All in 1 fleet of rental cars in Curaçao. Kia Picanto, Rio, Soul, Sportage, Toyota Yaris, Hyundai Tucson. Free Hato Airport delivery, unlimited mileage, all-inclusive pricing."
        path="/cars"
      />
      <AnimatePresence mode="wait">
      {loading ? (
        <CarsLoader key="loader" messageIndex={messageIndex} />
      ) : (
        <motion.div key="content" variants={page} initial="initial" animate="animate" exit="exit">
          <section className="pt-28 sm:pt-32 lg:pt-40 pb-10 bg-navy-900 text-white relative overflow-hidden">
            {/* Gold glow blob */}
            <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />

            {/* Decorative line drawing — pure SVG, zero network cost */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                {/* Fine diagonal lines repeating tile */}
                <pattern id="oc-diag" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="30" x2="30" y2="0" stroke="white" strokeWidth="0.5" strokeOpacity="0.06" />
                </pattern>
              </defs>

              {/* Base diagonal texture */}
              <rect width="100%" height="100%" fill="url(#oc-diag)" />

              {/* Concentric arcs radiating from top-right corner */}
              <g stroke="white" strokeWidth="0.8" fill="none" strokeOpacity="0.07">
                <circle cx="100%" cy="0" r="140" />
                <circle cx="100%" cy="0" r="230" />
                <circle cx="100%" cy="0" r="320" />
                <circle cx="100%" cy="0" r="410" />
                <circle cx="100%" cy="0" r="500" />
              </g>

              {/* Horizontal speed lines — left side, varying lengths */}
              <g stroke="white" strokeWidth="0.7" strokeOpacity="0.05">
                <line x1="0" y1="60%" x2="55%" y2="60%" />
                <line x1="0" y1="72%" x2="40%" y2="72%" />
                <line x1="0" y1="84%" x2="25%" y2="84%" />
              </g>

              {/* Cross-hatch accent — bottom-left corner */}
              <g stroke="white" strokeWidth="0.5" strokeOpacity="0.05">
                <line x1="0" y1="100%" x2="12%" y2="0%" />
                <line x1="5%" y1="100%" x2="17%" y2="0%" />
                <line x1="10%" y1="100%" x2="22%" y2="0%" />
              </g>
            </svg>

            <div className="container-x relative">
              <span className="eyebrow text-gold-400">{t.ourCars.eyebrow}</span>
              <h1 className="mt-3 text-white text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight">
                {t.ourCars.heading}
              </h1>
              <p className="mt-4 max-w-2xl text-white/80 text-sm sm:text-base">
                {t.ourCars.body}
              </p>
            </div>
          </section>

          <section className="section">
            <div className="container-x">
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {tabs.map((tab, i) => (
                  <button
                    key={tab._id || tab.name}
                    onClick={() => setActiveIndex(i)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      activeIndex === i
                        ? "bg-navy-900 text-white"
                        : "bg-cream-50 text-navy-900 hover:bg-cream-100"
                    }`}
                  >
                    {tab.isAll ? t.ourCars.allLabel : catLabel(tab, lang)}
                  </button>
                ))}
                {/* Sort selector — custom dropdown, right-aligned on ≥sm */}
                <div className="sm:ml-auto">
                  <SortMenu
                    value={sortOrder}
                    onChange={setSortOrder}
                    label={t.ourCars.sortLabel}
                    options={[
                      { value: "default",    label: t.ourCars.sortDefault },
                      { value: "price-asc",  label: t.ourCars.sortPriceAsc },
                      { value: "price-desc", label: t.ourCars.sortPriceDesc },
                    ]}
                  />
                </div>
              </div>

              {cars.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-lg font-semibold text-navy-900">{t.ourCars.emptyTitle}</p>
                  <p className="mt-2 text-sm text-slate-500">{t.ourCars.emptyBody}</p>
                </div>
              )}

              {cars.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {cars.map((car) => (
                  <article
                    key={car._id || car.slug}
                    className="card overflow-hidden p-0 flex flex-col transition hover:-translate-y-1.5 hover:shadow-cta"
                  >
                    <Link to={`/car/${car.slug}`} className="block group">
                      <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100">
                        <img
                          src={imgUrl(car.image, { width: 600 })}
                          alt={`${car.name} rental car in Curaçao`}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </Link>
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                          {labelFor(car.category)}
                        </span>
                        <div className="text-right">
                          <div className="text-[11px] uppercase tracking-widest text-gold-600 font-bold">
                            {t.ourCars.startingFrom}
                          </div>
                          <div className="text-2xl font-display font-bold text-navy-900 leading-tight">
                            ${car.dailyRate}
                            <span className="text-sm font-normal text-slate-500"> {t.ourCars.perDay}</span>
                          </div>
                        </div>
                      </div>
                      <h2 className="mt-1 text-xl font-semibold">
                        <Link
                          to={`/car/${car.slug}`}
                          className="hover:text-gold-600 transition"
                        >
                          {car.name}
                        </Link>
                      </h2>
                      {car.description && (
                        <p className="mt-2 text-sm text-slate-600">{car.description}</p>
                      )}
                      <ul className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600 border-t border-navy-100 pt-4">
                        {car.seats && (
                          <li className="flex items-center gap-1.5">
                            <SeatIcon className="w-4 h-4 text-navy-700" /> {car.seats} {t.ourCars.seats}
                          </li>
                        )}
                        {car.transmission && (
                          <li className="flex items-center gap-1.5">
                            <GearIcon className="w-4 h-4 text-navy-700" /> {car.transmission}
                          </li>
                        )}
                        {car.fuel && (
                          <li className="flex items-center gap-1.5">
                            <FuelIcon className="w-4 h-4 text-navy-700" /> {car.fuel}
                          </li>
                        )}
                      </ul>
                      <Link to={`/car/${car.slug}`} className="btn-secondary mt-5">
                        {t.ourCars.moreAbout} <ArrowIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              )}
            </div>
          </section>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
