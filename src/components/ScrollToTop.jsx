import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NAV_OFFSET = 125; // must match Navbar's scroll offset

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    function scrollToEl(el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
        behavior: "smooth",
      });
    }

    const el = document.querySelector(hash);
    if (el) {
      scrollToEl(el);
      return;
    }

    // AnimatePresence exit animation (~200ms) delays the new page mounting.
    // Poll every 100ms until the element appears (give up after 1s).
    let attempts = 0;
    const interval = setInterval(() => {
      const found = document.querySelector(hash);
      if (found) {
        scrollToEl(found);
        clearInterval(interval);
      } else if (++attempts >= 10) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [pathname, hash]);

  return null;
}
