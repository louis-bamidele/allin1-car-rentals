import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getCar, getCars } from "../lib/api";
import { imgUrl } from "../lib/cloudinary";
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
import { useLang } from "../contexts/LanguageContext";

const page = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const { t } = useLang();

  useEffect(() => {
    setFetching(true);
    setActiveImg(0);
    getCar(id)
      .then((data) => {
        setCar(data);
        return getCars();
      })
      .then((all) => {
        setRelated(all.filter((c) => c.slug !== id && c.category === car?.category).slice(0, 3));
      })
      .catch(() => navigate("/cars", { replace: true }))
      .finally(() => setFetching(false));
  }, [id]);

  useEffect(() => {
    if (car) {
      getCars().then((all) =>
        setRelated(all.filter((c) => c.slug !== id && c.category === car.category).slice(0, 3))
      ).catch(() => {});
    }
  }, [car]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-gold-500 animate-spin" />
      </div>
    );
  }

  if (!car) return null;

  const today = new Date().toISOString().split("T")[0];

  function buildReserveLink() {
    const msg = encodeURIComponent(
      t.carDetails.whatsappMsg
        .replace("{name}", car.name)
        .replace("{rate}", car.dailyRate)
        .replace("{pickupDate}", pickupDate)
        .replace("{returnDate}", returnDate)
    );
    return `https://wa.me/59995178686?text=${msg}`;
  }

  function handleConfirmReserve() {
    window.open(buildReserveLink(), "_blank");
  }

  const askLink = `https://wa.me/59995178686?text=${encodeURIComponent(
    `Hi All in 1, I have a question about the ${car.name}.`
  )}`;

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit">
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 bg-navy-900 text-white">
        <div className="container-x">
          <nav className="text-xs sm:text-sm text-white/70">
            <Link to="/" className="hover:text-gold-400">{t.carDetails.breadcrumbHome}</Link>
            <span className="px-2">/</span>
            <Link to="/cars" className="hover:text-gold-400">{t.carDetails.breadcrumbCars}</Link>
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
                  src={imgUrl(car.gallery[activeImg], { width: 1200 })}
                  alt={`${car.name} photo ${activeImg + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  fetchPriority="high"
                  decoding="async"
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
                  <img src={imgUrl(src, { width: 300 })} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
            {car.description && (
              <p className="mt-2 text-slate-600 text-sm sm:text-base">
                {car.description}
              </p>
            )}

            <div className="mt-5 flex items-baseline gap-2">
              <div className="text-3xl sm:text-4xl font-display font-bold text-navy-900">
                ${car.dailyRate}
              </div>
              <div className="text-slate-500 text-sm">{t.carDetails.perDay}</div>
            </div>
            {(car.weeklyRate > 0 || car.monthlyRate > 0) && (
              <div className="mt-1 text-xs text-slate-500">
                {car.weeklyRate > 0 && <span>{t.carDetails.weekly} ${car.weeklyRate}</span>}
                {car.weeklyRate > 0 && car.monthlyRate > 0 && <span> &middot; </span>}
                {car.monthlyRate > 0 && <span>{t.carDetails.monthly} ${car.monthlyRate}</span>}
              </div>
            )}

            <ul className="mt-5 grid grid-cols-3 gap-2 text-xs text-slate-600 border-y border-navy-100 py-4">
              <li className="flex items-center gap-1.5">
                <SeatIcon className="w-4 h-4 text-navy-700" /> {car.seats} {t.carDetails.seats}
              </li>
              <li className="flex items-center gap-1.5">
                <GearIcon className="w-4 h-4 text-navy-700" /> {car.transmission}
              </li>
              <li className="flex items-center gap-1.5">
                <FuelIcon className="w-4 h-4 text-navy-700" /> {car.fuel}
              </li>
            </ul>

            <button
              onClick={() => setShowPicker((v) => !v)}
              className="btn-primary w-full mt-5"
            >
              {t.carDetails.reserveCar} <ArrowIcon className="w-4 h-4" />
            </button>

            {/* Inline date picker */}
            <AnimatePresence initial={false}>
              {showPicker && (
                <motion.div
                  key="picker"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-xl border border-navy-100 bg-cream-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-navy-900">
                      {t.carDetails.selectDates}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-navy-900/70 uppercase tracking-wide">
                          {t.carDetails.pickupDate}
                        </label>
                        <input
                          type="date"
                          value={pickupDate}
                          min={today}
                          onChange={(e) => {
                            const newPickup = e.target.value;
                            setPickupDate(newPickup);
                            // clear return date only if it falls before the new pickup
                            if (returnDate && returnDate < newPickup) setReturnDate("");
                          }}
                          className="mt-1 w-full rounded-lg border border-navy-100 px-2.5 py-2 text-navy-900 text-sm outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-navy-900/70 uppercase tracking-wide">
                          {t.carDetails.returnDate}
                        </label>
                        <input
                          type="date"
                          value={returnDate}
                          min={pickupDate || today}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-navy-100 px-2.5 py-2 text-navy-900 text-sm outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleConfirmReserve}
                        disabled={!pickupDate || !returnDate}
                        className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        {t.carDetails.confirmReserve}
                      </button>
                      <button
                        onClick={() => setShowPicker(false)}
                        className="px-4 py-2.5 rounded-xl border border-navy-200 text-navy-900 text-sm font-semibold hover:bg-navy-50 transition"
                      >
                        {t.carDetails.cancelDates}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <a
              href={askLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:opacity-90 transition"
            >
              <WhatsAppIcon className="w-5 h-5" /> {t.carDetails.askWhatsapp}
            </a>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <ShieldIcon className="w-4 h-4 mt-0.5 text-gold-600 shrink-0" />
                {t.carDetails.insuranceNote}
              </li>
              <li className="flex items-start gap-2">
                <PlaneIcon className="w-4 h-4 mt-0.5 text-gold-600 shrink-0" />
                {t.carDetails.deliveryNote}
              </li>
              <li className="flex items-start gap-2">
                <ClockIcon className="w-4 h-4 mt-0.5 text-gold-600 shrink-0" />
                {t.carDetails.cancellationNote}
              </li>
            </ul>
          </motion.aside>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-7" variants={fadeUp}>
            <span className="eyebrow">{t.carDetails.aboutCar}</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
              {t.carDetails.aboutHeading}
            </h2>
            {car.longDescription && (
              <p className="mt-4 text-slate-600 leading-relaxed">
                {car.longDescription}
              </p>
            )}

            {car.features?.length > 0 && (
              <>
                <h3 className="mt-8 font-display font-semibold text-lg text-navy-900">
                  {t.carDetails.featuresHeading}
                </h3>
                <Reveal
                  variants={stagger}
                  className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3"
                >
                  {car.features.map((f, i) => (
                    <motion.li
                      key={i}
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
              </>
            )}
          </Reveal>

          <Reveal className="lg:col-span-5" variants={fadeUp}>
            <div className="card">
              <h3 className="font-display font-semibold text-lg">{t.carDetails.specsHeading}</h3>
              <dl className="mt-4 divide-y divide-navy-100 text-sm">
                <Row label={t.carDetails.specsLabels.category} value={car.category} />
                <Row label={t.carDetails.specsLabels.year} value={car.year} />
                <Row label={t.carDetails.specsLabels.color} value={car.color} />
                <Row label={t.carDetails.specsLabels.seats} value={car.seats} />
                <Row label={t.carDetails.specsLabels.doors} value={car.doors} />
                <Row label={t.carDetails.specsLabels.transmission} value={car.transmission} />
                <Row label={t.carDetails.specsLabels.fuel} value={car.fuel} />
                <Row label={t.carDetails.specsLabels.consumption} value={car.consumption} />
                <Row label={t.carDetails.specsLabels.luggageLabel} value={car.bags ? `${car.bags} ${t.carDetails.specsLabels.luggage}` : null} />
              </dl>
            </div>

            {car.highlights?.length > 0 && (
              <div className="card mt-6">
                <h3 className="font-display font-semibold text-lg">{t.carDetails.whyHeading}</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {car.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 grid place-items-center w-5 h-5 rounded-full bg-gold-500 text-navy-900 shrink-0">
                        <CheckIcon className="w-3 h-3" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-cream-50">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="eyebrow">{t.carDetails.alsoLike}</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold">
                  {t.carDetails.moreOptions}
                </h2>
              </div>
              <Link to="/cars" className="btn-ghost">
                {t.carDetails.seeAll} <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
            <Reveal
              variants={stagger}
              className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {related.map((c) => (
                <motion.div key={c._id || c.slug} variants={fadeUp} whileHover={{ y: -4 }}>
                  <Link
                    to={`/car/${c.slug}`}
                    className="card p-0 overflow-hidden block"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={imgUrl(c.image, { width: 600 })}
                        alt={c.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                        {c.category}
                      </div>
                      <div className="mt-1 font-semibold text-navy-900">{c.name}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        ${c.dailyRate} {t.carDetails.perDay}
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
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="py-2 flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-navy-900 font-medium">{value}</dd>
    </div>
  );
}
