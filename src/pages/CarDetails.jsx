import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { findCar, fleet } from "../data/fleet";
import {
  SeatIcon,
  GearIcon,
  FuelIcon,
  CheckIcon,
  ArrowIcon,
  WhatsAppIcon,
  ShieldIcon,
  PlaneIcon,
  ClockIcon,
} from "../components/Icons";
import Reveal, { fadeUp, stagger } from "../components/motion/Reveal";

const page = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function CarDetails() {
  const { id } = useParams();
  const car = findCar(id);
  const [activeImg, setActiveImg] = useState(0);

  if (!car) return <Navigate to="/cars" replace />;

  const related = fleet.filter((c) => c.id !== car.id && c.category === car.category).slice(0, 3);
  const reserveText = encodeURIComponent(
    `Hi All in 1, I would like to reserve the ${car.name} at $${car.dailyRate}/day. Please share availability.`
  );
  const reserveLink = `https://wa.me/59995178686?text=${reserveText}`;

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit">
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 bg-navy-900 text-white">
        <div className="container-x">
          <nav className="text-xs sm:text-sm text-white/70">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <span className="px-2">/</span>
            <Link to="/cars" className="hover:text-gold-400">Our Cars</Link>
            <span className="px-2">/</span>
            <span className="text-white">{car.name}</span>
          </nav>
        </div>
      </section>

      <section className="bg-navy-900 pb-12 sm:pb-16">
        <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={car.gallery[activeImg]}
                  alt={`${car.name} photo ${activeImg + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
              {car.gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition ${
                    activeImg === i
                      ? "border-gold-500"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-5 bg-white rounded-2xl shadow-card p-6 sm:p-7"
          >
            <span className="eyebrow">{car.category}</span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-display font-bold">
              {car.name}
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              {car.description}
            </p>

            <div className="mt-5 flex items-baseline gap-2">
              <div className="text-3xl sm:text-4xl font-display font-bold text-navy-900">
                ${car.dailyRate}
              </div>
              <div className="text-slate-500 text-sm">/ day</div>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Weekly ${car.weeklyRate} &middot; Monthly ${car.monthlyRate}
            </div>

            <ul className="mt-5 grid grid-cols-3 gap-2 text-xs text-slate-600 border-y border-navy-100 py-4">
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

            <a
              href={reserveLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full mt-5"
            >
              Reserve this car <ArrowIcon className="w-4 h-4" />
            </a>
            <a
              href={reserveLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:opacity-90 transition"
            >
              <WhatsAppIcon className="w-5 h-5" /> Ask on WhatsApp
            </a>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <ShieldIcon className="w-4 h-4 mt-0.5 text-gold-600 shrink-0" />
                Standard insurance is included.
              </li>
              <li className="flex items-start gap-2">
                <PlaneIcon className="w-4 h-4 mt-0.5 text-gold-600 shrink-0" />
                Free delivery at Hato Airport.
              </li>
              <li className="flex items-start gap-2">
                <ClockIcon className="w-4 h-4 mt-0.5 text-gold-600 shrink-0" />
                Free cancellation up to 24 hours before pickup.
              </li>
            </ul>
          </motion.aside>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-7" variants={fadeUp}>
            <span className="eyebrow">About this car</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
              Built for an easy island drive.
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              {car.longDescription}
            </p>

            <h3 className="mt-8 font-display font-semibold text-lg text-navy-900">
              Features and comfort
            </h3>
            <Reveal
              variants={stagger}
              className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3"
            >
              {car.features.map((f) => (
                <motion.li
                  key={f}
                  variants={fadeUp}
                  className="flex items-start gap-2 text-sm text-navy-900/85 list-none"
                >
                  <span className="mt-0.5 grid place-items-center w-5 h-5 rounded-full bg-gold-500 text-navy-900 shrink-0">
                    <CheckIcon className="w-3 h-3" />
                  </span>
                  {f}
                </motion.li>
              ))}
            </Reveal>
          </Reveal>

          <Reveal className="lg:col-span-5" variants={fadeUp}>
            <div className="card">
              <h3 className="font-display font-semibold text-lg">Specs</h3>
              <dl className="mt-4 divide-y divide-navy-100 text-sm">
                <Row label="Category" value={car.category} />
                <Row label="Year" value={car.year} />
                <Row label="Color" value={car.color} />
                <Row label="Seats" value={car.seats} />
                <Row label="Doors" value={car.doors} />
                <Row label="Transmission" value={car.transmission} />
                <Row label="Fuel" value={car.fuel} />
                <Row label="Consumption" value={car.consumption} />
                <Row label="Luggage" value={`${car.bags} bags`} />
              </dl>
            </div>

            <div className="card mt-6">
              <h3 className="font-display font-semibold text-lg">Why this car</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {car.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-0.5 grid place-items-center w-5 h-5 rounded-full bg-gold-500 text-navy-900 shrink-0">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-cream-50">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold">
                  More {car.category.toLowerCase()} options.
                </h2>
              </div>
              <Link to="/cars" className="btn-ghost">
                See all cars <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
            <Reveal
              variants={stagger}
              className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {related.map((c) => (
                <motion.div key={c.id} variants={fadeUp} whileHover={{ y: -4 }}>
                  <Link
                    to={`/car/${c.id}`}
                    className="card p-0 overflow-hidden block"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                        {c.category}
                      </div>
                      <div className="mt-1 font-semibold text-navy-900">{c.name}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        ${c.dailyRate} / day
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </motion.div>
  );
}

function Row({ label, value }) {
  return (
    <div className="py-2 flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-navy-900 font-medium">{value}</dd>
    </div>
  );
}
