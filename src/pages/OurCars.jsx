import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { fleet, categories } from "../data/fleet";
import { SeatIcon, GearIcon, FuelIcon, ArrowIcon } from "../components/Icons";
import CarsLoader from "../components/CarsLoader";

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
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const messageTimer = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, 3));
    }, MESSAGE_STEP_MS);

    const imagesToPreload = [
      ...fleet.map((c) => c.image),
      ...fleet.flatMap((c) => (c.gallery ? c.gallery.slice(0, 1) : [])),
    ];

    Promise.all(imagesToPreload.map(preloadImage)).then(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
      setTimeout(() => {
        if (!cancelled) setLoading(false);
      }, remaining);
    });

    return () => {
      cancelled = true;
      clearInterval(messageTimer);
    };
  }, []);

  const cars =
    active === "All" ? fleet : fleet.filter((c) => c.category === active);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <CarsLoader key="loader" messageIndex={messageIndex} />
      ) : (
        <motion.div key="content" variants={page} initial="initial" animate="animate" exit="exit">
          <section className="pt-28 sm:pt-32 lg:pt-40 pb-10 bg-navy-900 text-white relative overflow-hidden">
            <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="container-x relative">
              <span className="eyebrow text-gold-400">Our Cars</span>
              <h1 className="mt-3 text-white text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight">
                Meet the full fleet.
              </h1>
              <p className="mt-4 max-w-2xl text-white/80 text-sm sm:text-base">
                Compact runners, comfortable cruisers, and roomy SUVs. Every
                car is inspected and cleaned before pickup. Tap a car to see
                photos, features, and rates.
              </p>
            </div>
          </section>

          <section className="section">
            <div className="container-x">
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      active === c
                        ? "bg-navy-900 text-white"
                        : "bg-cream-50 text-navy-900 hover:bg-cream-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {cars.map((car) => (
                  <article
                    key={car.id}
                    className="card overflow-hidden p-0 flex flex-col transition hover:-translate-y-1.5 hover:shadow-cta"
                  >
                    <Link to={`/car/${car.id}`} className="block group">
                      <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                          {car.category}
                        </span>
                        <div className="text-2xl font-display font-bold text-navy-900">
                          ${car.dailyRate}
                          <span className="text-sm font-normal text-slate-500"> / day</span>
                        </div>
                      </div>
                      <h2 className="mt-1 text-xl font-semibold">
                        <Link
                          to={`/car/${car.id}`}
                          className="hover:text-gold-600 transition"
                        >
                          {car.name}
                        </Link>
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">{car.description}</p>
                      <ul className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600 border-t border-navy-100 pt-4">
                        <li className="flex items-center gap-1.5">
                          <SeatIcon className="w-4 h-4 text-navy-700" /> {car.seats} seats
                        </li>
                        <li className="flex items-center gap-1.5">
                          <GearIcon className="w-4 h-4 text-navy-700" /> {car.transmission}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <FuelIcon className="w-4 h-4 text-navy-700" /> {car.fuel}
                        </li>
                      </ul>
                      <Link to={`/car/${car.id}`} className="btn-secondary mt-5">
                        More about this car <ArrowIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
