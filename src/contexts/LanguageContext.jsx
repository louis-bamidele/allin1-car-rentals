import { createContext, useContext, useState } from "react";
import { translations } from "../lib/translations";

const LanguageContext = createContext();

function detectLang() {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;
  const browser = (navigator.language || navigator.userLanguage || "en")
    .toLowerCase()
    .slice(0, 2);
  if (browser === "es") return "es";
  if (browser === "nl") return "nl";
  return "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLang);
  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }
  return (
    <LanguageContext.Provider value={{ lang, switchLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
