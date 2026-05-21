import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { MenuIcon, CloseIcon, PhoneIcon } from "./Icons";
import LangSwitcher from "./LangSwitcher";
import { useLang } from "../contexts/LanguageContext";

const HASH_LINKS = [
  { to: "/#how", hash: "how", labelKey: "howItWorks" },
  { to: "/#services", hash: "services", labelKey: "services" },
  { to: "/#about", hash: "about", labelKey: "about" },
  { to: "/#contact", hash: "contact", labelKey: "contact" },
];

// Must be in DOM order (matches Home.jsx render sequence)
const SECTION_IDS = ["how", "services", "about", "contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overBanner, setOverBanner] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const headerRef = useRef(null);
  const { t } = useLang();

  const isHome = location.pathname === "/";
  const transparent = isHome && overBanner && !open;

  // Build the full links list inline so labels are always reactive to lang
  const links = [
    { to: "/", label: t.nav.home, end: true },
    { to: "/cars", label: t.nav.ourCars },
    { to: "/#how", label: t.nav.howItWorks, hash: "how" },
    { to: "/#services", label: t.nav.services, hash: "services" },
    { to: "/#about", label: t.nav.about, hash: "about" },
    { to: "/#contact", label: t.nav.contact, hash: "contact" },
  ];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setOverBanner(y < window.innerHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view on the home page
  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }
    // Threshold must exceed max navbar height (info bar ~40px + nav ~80px = 120px)
    const THRESHOLD = 140;
    function detect() {
      let active = "";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= THRESHOLD) active = id;
      }
      setActiveSection(active);
    }
    detect();
    window.addEventListener("scroll", detect, { passive: true });
    return () => window.removeEventListener("scroll", detect);
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // When already on home, scroll directly; otherwise let Link navigate (ScrollToTop handles the hash)
  function handleHashClick(e, id) {
    if (isHome) {
      e.preventDefault();
      setActiveSection(id); // instant highlight — don't wait for scroll to complete
      const el = document.getElementById(id);
      if (el) {
        // 125px offset keeps the section header clear of the tallest navbar state
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 125,
          behavior: "smooth",
        });
      }
      setOpen(false);
    }
  }

  function navLinkClass(isActive) {
    const base = "text-sm font-semibold transition duration-300";
    if (transparent)
      return `${base} [text-shadow:0_1px_2px_rgba(13,11,97,0.5),0_0_3px_rgba(13,11,97,0.2)] ${isActive ? "text-gold-300" : "text-white hover:text-gold-300"}`;
    return `${base} ${isActive ? "text-gold-600" : "text-navy-900/80 hover:text-gold-600"}`;
  }

  function hashLinkClass(id) {
    return navLinkClass(activeSection === id);
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : scrolled || open
            ? "bg-white/95 backdrop-blur shadow-card"
            : "bg-white/90 backdrop-blur"
      }`}
    >
      {/* Top info bar - hidden while over banner */}
      <div
        className={`bg-navy-900 text-white text-[11px] sm:text-xs overflow-hidden transition-all duration-300 ${
          transparent ? "max-h-0" : "max-h-10"
        }`}
      >
        <div className="container-x flex items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <a
              href="tel:+59995178686"
              className="flex items-center gap-1.5 truncate"
            >
              <PhoneIcon className="w-3.5 h-3.5 shrink-0" /> +5999 517 8686
            </a>
            <span className="hidden md:inline text-white/60">|</span>
            <span className="hidden md:inline">{t.infoBar.openHours}</span>
          </div>
          <a
            href="https://wa.me/59995178686"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-gold-400 hover:text-gold-300"
          >
            {t.infoBar.whatsapp}
          </a>
        </div>
      </div>

      <nav className="container-x flex items-center justify-between py-3">
        <Link to="/" className="flex items-center shrink-0">
          <Logo
            className="h-16 
          \sm:h-18 lg:h-20 w-auto transition-all duration-300"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) =>
            l.hash ? (
              <li key={l.to} className="text-shadow-black">
                <Link
                  to={l.to}
                  onClick={(e) => handleHashClick(e, l.hash)}
                  className={hashLinkClass(l.hash)}
                >
                  {l.label}
                </Link>
              </li>
            ) : (
              <li key={l.to} className="text-shadow-black">
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    navLinkClass(isActive && (!l.end || !activeSection))
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitcher />
          <Link
            to="/cars"
            className="hidden sm:inline-flex rounded-full btn-primary py-2 sm:py-2.5 px-4 sm:px-5 text-xs sm:text-sm"
          >
            {t.nav.bookNow}
          </Link>
          <button
            className={`lg:hidden p-2 -mr-2 rounded-lg transition duration-300 ${
              transparent ? "text-navy" : "text-navy-900"
            }`}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <CloseIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-navy-100 animate-[fadeIn_.2s_ease-out]">
          <ul className="container-x py-4 flex flex-col gap-1">
            {links.map((l) =>
              l.hash ? (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={(e) => handleHashClick(e, l.hash)}
                    className={`block px-2 py-2 rounded-lg font-semibold ${
                      activeSection === l.hash
                        ? "text-gold-600 bg-cream-50"
                        : "text-navy-900 hover:bg-cream-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `block px-2 py-2 rounded-lg font-semibold ${
                        isActive && (!l.end || !activeSection)
                          ? "text-gold-600 bg-cream-50"
                          : "text-navy-900 hover:bg-cream-50"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ),
            )}
            <li className="pt-2">
              <Link to="/cars" className="btn-primary w-full">
                {t.nav.bookNow}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
