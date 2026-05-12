import { Link } from "react-router-dom";
import { CheckIcon } from "./Icons";
import Reveal, { fadeUp } from "./motion/Reveal";

const points = [
  "Locally owned and operated on Curaçao",
  "Fleet of well kept Kia, Hyundai, and Toyota models",
  "Free airport delivery and hotel drop off",
  "Flexible daily, weekly, and monthly rates",
];

export default function About() {
  return (
    <section id="about" className="section bg-cream-50">
      <div className="container-x grid lg:grid-cols-12 gap-8 md:gap-10 items-center">
        <Reveal className="lg:col-span-6" variants={fadeUp}>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/7688161/pexels-photo-7688161.jpeg"
              alt="Friendly team handing over a rental car"
              className="rounded-3xl shadow-card w-full object-cover aspect-[4/3]"
            />
            <div className="hidden md:block absolute -bottom-6 -right-6 bg-navy-900 text-white p-6 rounded-2xl shadow-card max-w-xs">
              <div className="text-3xl font-display font-bold text-gold-400">
                10+
              </div>
              <p className="text-sm text-white/80 mt-1">
                Years helping travelers find the right car on the island.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-6" variants={fadeUp}>
          <span className="eyebrow">About All in 1</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            A small team that cares about your trip.
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            All in 1 Car Rentals started with a simple idea. Travelers should
            get a clean, reliable car and friendly local support without paying
            big agency prices. We pick our fleet for comfort and fuel economy,
            and we keep our service personal. When you book with us you talk to
            a real person who knows the island.
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {points.map((p) => (
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
              See our cars
            </Link>
            <a href="#contact" className="btn-ghost">
              Get in touch
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
