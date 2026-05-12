import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fleet, categories } from "../data/fleet";
import { SeatIcon, GearIcon, FuelIcon, ArrowIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";

export default function Fleet() {
  const [active, setActive] = useState("All");
  const cars =
    active === "All" ? fleet : fleet.filter((c) => c.category === active);
  const visible = cars.slice(0, 6);

  return (
    <section id="fleet" className="section">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Reveal className="max-w-xl" variants={fadeUp}>
            <span className="eyebrow">Our fleet</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
              Pick the car that fits your trip.
            </h2>
            <p className="mt-3 text-slate-600">
              Compact runners for the city, comfortable sedans for longer
              drives, and roomy SUVs for the family. All cars are inspected and
              cleaned before every rental.
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <motion.button
                key={c}
                onClick={() => setActive(c)}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  active === c
                    ? "bg-navy-900 text-white"
                    : "bg-cream-50 text-navy-900 hover:bg-cream-100"
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>

        <Reveal
          variants={stagger}
          key={active}
          className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {visible.map((car) => (
            <motion.article
              key={car.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="card overflow-hidden p-0 flex flex-col"
            >
              <Link to={`/car/${car.id}`} className="block group">
                <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100">
                  <motion.img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5 }}
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {car.category}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-navy-900">
                      ${car.dailyRate}
                      <span className="text-sm font-normal text-slate-500"> / day</span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-1 text-xl font-semibold">
                  <Link
                    to={`/car/${car.id}`}
                    className="hover:text-gold-600 transition"
                  >
                    {car.name}
                  </Link>
                </h3>
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
            </motion.article>
          ))}
        </Reveal>

        <div className="mt-10 flex justify-center">
          <Link to="/cars" className="btn-ghost">
            See all our cars <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
