import { Link } from "react-router-dom";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "./Icons";
import { useLang } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-x py-12 md:py-14 grid sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-10">
        <div className="sm:col-span-2 md:col-span-4">
          <img
            src="/logo.webp"
            alt="All in 1 Car Rentals"
            className="h-16 sm:h-20 w-auto object-contain select-none"
            draggable="false"
            // Footer is below the fold — defer loading
            loading="lazy"
            decoding="async"
            width="1200"
            height="419"
          />
          <p className="mt-4 text-sm text-white/75 max-w-sm">
            {t.footer.tagline}
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
          <h4 className="text-white font-semibold">{t.footer.exploreHeading}</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link to="/" className="hover:text-gold-400">
                {t.footer.links.home}
              </Link>
            </li>
            <li>
              <Link to="/cars" className="hover:text-gold-400">
                {t.footer.links.ourCars}
              </Link>
            </li>
            <li>
              <a href="/#services" className="hover:text-gold-400">
                {t.footer.links.services}
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-gold-400">
                {t.footer.links.about}
              </a>
            </li>
            <li>
              <a href="/#contact" className="hover:text-gold-400">
                {t.footer.links.contact}
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-white font-semibold">{t.footer.contactHeading}</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <a href="tel:+59995178686" className="hover:text-gold-400 transition">
                +5999 517 8686
              </a>
            </li>
            <li>
              <a href="mailto:allin1reservation@gmail.com" className="hover:text-gold-400 transition break-all">
                allin1reservation@gmail.com
              </a>
            </li>
            <li>Curaçao, Caribbean</li>
            <li>{t.footer.hours}</li>
          </ul>
        </div>

        <div className="sm:col-span-2 md:col-span-3">
          <h4 className="text-white font-semibold">{t.footer.ctaHeading}</h4>
          <p className="mt-3 text-sm text-white/75">
            {t.footer.ctaBody}
          </p>
          <Link to="/cars" className="btn-primary mt-4">
            {t.footer.bookNow}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} All in 1 Car Rentals. {t.footer.copyright}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-gold-400">
              {t.footer.terms}
            </Link>
            <Link to="/terms#privacy" className="hover:text-gold-400">
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
