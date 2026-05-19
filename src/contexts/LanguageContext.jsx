import { createContext, useContext, useState } from "react";
import { translations } from "../lib/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || "en"
  );
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
