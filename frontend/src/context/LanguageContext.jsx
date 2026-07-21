import { createContext, useContext, useEffect, useState } from "react";

export const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

const copy = {
  en: { home: "Home", recommendations: "Recommendations", dashboard: "Dashboard", profile: "Profile", login: "Login", logout: "Log out", welcome: "Welcome", editProfile: "Edit profile", language: "Language", save: "Save changes", account: "Account", getStarted: "Get Started" },
  hi: { home: "होम", recommendations: "सिफारिशें", dashboard: "डैशबोर्ड", profile: "प्रोफ़ाइल", login: "लॉग इन", logout: "लॉग आउट", welcome: "स्वागत है", editProfile: "प्रोफ़ाइल संपादित करें", language: "भाषा", save: "बदलाव सहेजें", account: "खाता", getStarted: "शुरू करें" },
  mr: { home: "मुख्यपृष्ठ", recommendations: "शिफारसी", dashboard: "डॅशबोर्ड", profile: "प्रोफाइल", login: "लॉग इन", logout: "लॉग आउट", welcome: "स्वागत", editProfile: "प्रोफाइल संपादित करा", language: "भाषा", save: "बदल जतन करा", account: "खाते", getStarted: "सुरू करा" },
  es: { home: "Inicio", recommendations: "Recomendaciones", dashboard: "Panel", profile: "Perfil", login: "Iniciar sesión", logout: "Cerrar sesión", welcome: "Bienvenido", editProfile: "Editar perfil", language: "Idioma", save: "Guardar cambios", account: "Cuenta", getStarted: "Comenzar" },
  fr: { home: "Accueil", recommendations: "Recommandations", dashboard: "Tableau de bord", profile: "Profil", login: "Connexion", logout: "Déconnexion", welcome: "Bienvenue", editProfile: "Modifier le profil", language: "Langue", save: "Enregistrer", account: "Compte", getStarted: "Commencer" },
};
const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem("mv_language") || "en");
  const setLanguage = (value) => {
    const nextLanguage = languages.some((item) => item.code === value) ? value : "en";
    localStorage.setItem("mv_language", nextLanguage);
    setLanguageState(nextLanguage);
  };
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const t = (key) => copy[language]?.[key] || copy.en[key] || key;
  return <LanguageContext.Provider value={{ language, languages, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const context = useContext(LanguageContext); if (!context) throw new Error("useLanguage must be used within LanguageProvider"); return context; }
