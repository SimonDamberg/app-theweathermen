import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CountrySelector() {
  const { i18n } = useTranslation();
  // await i18n.changeLanguage(language.key);

  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="toggleB"
            className="sr-only"
            onChange={() => {
              if (i18n.language === "sv") {
                i18n.changeLanguage("en");
              } else {
                i18n.changeLanguage("sv");
              }
            }}
          />
          <div className={`block bg-sky-100 w-16 h-8 rounded-full `}></div>
          <div
            className={`dot absolute ${
              i18n.language === "sv" ? "left-0 ml-0.5" : "translate-x-8"
            } top-0.5 w-7 h-7 rounded-full transition-transform duration-500 ease-in-out`}>
            <img src={`/images/flags/${i18n.language}.png`} />
          </div>
        </div>
      </label>
    </div>
  );
}
