import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { MenuIcon, CloseIcon, PhoneIcon } from "./Icons";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/cars", label: "Our Cars" },
  { to: "/#services", label: "Services", hash: "#services" },
  { to: "/#how", label: "How it works", hash: "#how" },
  { to: "/#about", label: "About", hash: "#about" },
  { to: "/#contact", label: "Contact", hash: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-50 transition ${
        scrolled || open
          ? "bg-white/95 backdrop-blur shadow-card"
          : "bg-white/90 backdrop-blur"
      }`}
    >
      <div className="bg-navy-900 text-white text-[11px] sm:text-xs">
        <div className="container-x flex items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <a href="tel:+59995178686" className="flex items-center gap-1.5 truncate">
              <PhoneIcon className="w-3.5 h-3.5 shrink-0" /> +5999 517 8686
            </a>
            <span className="hidden md:inline text-white/60">|</span>
            <span className="hidden md:inline">Open daily 8:00 AM to 5:00 PM</span>
          </div>
          <a
            href="https://wa.me/59995178686"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-gold-400 hover:text-gold-300"
          >
            WhatsApp us
          </a>
        </div>
      </div>

      <nav className="container-x flex items-center justify-between py-3">
        <Link to="/" className="flex items-center shrink-0">
          <Logo className="h-10 sm:h-12 lg:h-14 w-auto" />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) =>
            l.hash ? (
              <li key={l.to}>
                <a
                  href={l.to}
                  className="text-sm font-semibold text-navy-900/80 hover:text-gold-600 transition"
                >
                  {l.label}
                </a>
              </li>
            ) : (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition ${
                      isActive
                        ? "text-gold-600"
                        : "text-navy-900/80 hover:text-gold-600"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/#book"
            className="hidden sm:inline-flex btn-primary py-2 sm:py-2.5 px-4 sm:px-5 text-xs sm:text-sm"
          >
            Book now
          </Link>
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg text-navy-900"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-white border-t border-navy-100 animate-[fadeIn_.2s_ease-out]">
          <ul className="container-x py-4 flex flex-col gap-1">
            {links.map((l) =>
              l.hash ? (
                <li key={l.to}>
                  <a
                    href={l.to}
                    className="block px-2 py-2 rounded-lg text-navy-900 font-semibold hover:bg-cream-50"
                  >
                    {l.label}
                  </a>
                </li>
              ) : (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `block px-2 py-2 rounded-lg font-semibold ${
                        isActive
                          ? "text-gold-600 bg-cream-50"
                          : "text-navy-900 hover:bg-cream-50"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              )
            )}
            <li className="pt-2">
              <Link to="/#book" className="btn-primary w-full">
                Book now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
