import { Link } from "react-router-dom";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-x py-12 md:py-14 grid sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-10">
        <div className="sm:col-span-2 md:col-span-4">
          <img
            src="/logo.png"
            alt="All in 1 Car Rentals"
            className="h-16 sm:h-20 w-auto object-contain select-none"
            draggable="false"
          />
          <p className="mt-4 text-sm text-white/75 max-w-sm">
            Your key to a rental car on Curaçao. Friendly local service, clean
            and reliable vehicles, and pricing without surprises.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://wa.me/59995178686"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold-500 hover:text-navy-900 transition"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/Allin1carrental"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold-500 hover:text-navy-900 transition"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/Allin1carrental"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold-500 hover:text-navy-900 transition"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link to="/" className="hover:text-gold-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cars" className="hover:text-gold-400">
                Our Cars
              </Link>
            </li>
            <li>
              <a href="/#services" className="hover:text-gold-400">
                Services
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-gold-400">
                About
              </a>
            </li>
            <li>
              <a href="/#contact" className="hover:text-gold-400">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-white font-semibold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>+5999 517 8686</li>
            <li>Curaçao, Caribbean</li>
            <li>Daily, 8:00 AM to 5:00 PM</li>
          </ul>
        </div>

        <div className="sm:col-span-2 md:col-span-3">
          <h4 className="text-white font-semibold">Need a car this week?</h4>
          <p className="mt-3 text-sm text-white/75">
            Send us your dates and we will confirm availability the same day.
          </p>
          <Link to="/#book" className="btn-primary mt-4">
            Book now
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} All in 1 Car Rentals. All rights
            reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold-400">
              Terms and Conditions
            </a>
            <a href="#" className="hover:text-gold-400">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
