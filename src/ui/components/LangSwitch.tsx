import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoLanguageSharp } from "react-icons/io5";
import { Switch } from "./ui/switch";

const LangSwitch = () => {
  const { i18n } = useTranslation();
  

  const currentLocale = i18n.language || "sr-Latn";
  const [isCyrillic, setIsCyrillic] = useState(currentLocale === "sr-Cyrl");

  useEffect(() => {
    setIsCyrillic(i18n.language === "sr-Cyrl");
  }, [i18n.language]);

  const handleLanguageToggle = async () => {
    const newLocale = isCyrillic ? "sr-Latn" : "sr-Cyrl";
    await i18n.changeLanguage(newLocale);
    setIsCyrillic(!isCyrillic);
    // Nema navigacije – aplikacija ostaje na istoj ruti
  };
  

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="language-mode"
        checked={isCyrillic}
        onCheckedChange={handleLanguageToggle}
      />
      <IoLanguageSharp className="text-xl text-accent dark:text-accentDark" />
    </div>
  );
};

export default LangSwitch;
