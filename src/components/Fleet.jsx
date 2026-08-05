import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCars, getCategories } from "../lib/api";
import { imgUrl } from "../lib/cloudinary";
import { SeatIcon, GearIcon, FuelIcon, ArrowIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";
import SortMenu from "./SortMenu";
import { useLang } from "../contexts/LanguageContext";

// Resolve a Category's display name for the active language, falling back
// to the canonical English name.
function catLabel(cat, lang) {
  return (cat.translations && cat.translations[lang]) || cat.name;
}

export default function Fleet() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState("default");
  const [fleet, setFleet] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { t, lang } = useLang();

  useEffect(() => {
    Promise.all([getCars(), getCategories()])
      .then(([cars, cats]) => { setFleet(cars); setCategories(cats); })
      .catch(() => { setFleet([]); setCategories([]); })
      .finally(() => setFetching(false));
  }, []);

  // Filter tabs: virtual "All" first, then every category (ordered by admin).
  const tabs = [{ _id: "all", name: "All", isAll: true }, ...categories];
  const activeTab = tabs[activeIndex] || tabs[0];
  const filtered = activeTab.isAll
    ? fleet
    : fleet.filter((c) => c.category === activeTab.name);
  // Sort BEFORE slicing so, e.g., "price low→high" shows the 6 cheapest.
  const cars = [...filtered].sort((a, b) => {
    if (sortOrder === "price-asc") return (a.dailyRate || 0) - (b.dailyRate || 0);
    if (sortOrder === "price-desc") return (b.dailyRate || 0) - (a.dailyRate || 0);
    return 0;
  });
  const visible = cars.slice(0, 6);

  // Look up a car's category label in the active language, falling back to
  // the canonical name if the category isn't found (e.g. legacy data).
  const catMap = new Map(categories.map((c) => [c.name, c]));
  const labelFor = (carCategory) => {
    const cat = catMap.get(carCategory);
    return cat ? catLabel(cat, lang) : carCategory;
  };

  return (
    <section id="fleet" className="section">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Reveal className="max-w-xl" variants={fadeUp}>
            <span className="eyebrow">{t.fleet.eyebrow}</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
              {t.fleet.heading}
            </h2>
            <p className="mt-3 text-slate-600">
              {t.fleet.body}
            </p>
          </Reveal>
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab, i) => (
              <motion.button
                key={tab._id || tab.name}
                onClick={() => setActiveIndex(i)}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeIndex === i
                    ? "bg-navy-900 text-white"
                    : "bg-cream-50 text-navy-900 hover:bg-cream-100"
                }`}
              >
                {tab.isAll ? t.fleet.allLabel : catLabel(tab, lang)}
              </motion.button>
            ))}
            {/* Sort selector — custom dropdown matching the pill aesthetic */}
            <SortMenu
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                { value: "default",    label: t.fleet.sortDefault },
                { value: "price-asc",  label: t.fleet.sortPriceAsc },
                { value: "price-desc", label: t.fleet.sortPriceDesc },
              ]}
            />
          </div>
        </div>

        {fetching && (
          <div className="mt-10 flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-navy-100 border-t-gold-500 animate-spin" />
          </div>
        )}

        {!fetching && visible.length === 0 && (
          <div className="mt-8 md:mt-10 py-16 text-center">
            <p className="text-lg font-semibold text-navy-900">{t.fleet.emptyTitle}</p>
            <p className="mt-2 text-sm text-slate-500">{t.fleet.emptyBody}</p>
          </div>
        )}

        {!fetching && visible.length > 0 && (
          <Reveal
            variants={stagger}
            key={activeIndex}
            className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {visible.map((car, index) => (
              <motion.article
                key={car._id || car.slug}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className={`card overflow-hidden p-0 flex flex-col${index >= 3 ? " hidden sm:flex" : ""}`}
              >
                <Link to={`/car/${car.slug}`} className="block group">
                  <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100">
                    <motion.img
                      src={imgUrl(car.image, { width: 600 })}
                      alt={`${car.name} rental car in Curaçao`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
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
                        {t.fleet.startingFrom}
                      </div>
                      <div className="text-2xl font-display font-bold text-navy-900 leading-tight">
                        ${car.dailyRate}
                        <span className="text-sm font-normal text-slate-500"> {t.fleet.perDay}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-1 text-xl font-semibold">
                    <Link to={`/car/${car.slug}`} className="hover:text-gold-600 transition">
                      {car.name}
                    </Link>
                  </h3>
                  {car.description && (
                    <p className="mt-2 text-sm text-slate-600">{car.description}</p>
                  )}
                  <ul className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600 border-t border-navy-100 pt-4">
                    {car.seats && (
                      <li className="flex items-center gap-1.5">
                        <SeatIcon className="w-4 h-4 text-navy-700" /> {car.seats} {t.fleet.seats}
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
                    {t.fleet.moreAbout} <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </Reveal>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/cars" className="btn-ghost">
            {t.fleet.seeAll} <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
