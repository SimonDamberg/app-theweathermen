import { useState } from "react";
import { useTranslation } from "react-i18next";
import { faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PropsMode{
    mode: Boolean,
    changer: any
}

export default function ModeSelector(props:PropsMode) {
  // await i18n.changeLanguage(language.key);
  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="toggleB"
            className="sr-only"
            onClick={() => {
              props.changer(!props.mode)
            }}
          />
          <div className={`block bg-sky-100 w-16 h-8 rounded-full `}></div>
          <div
            className={`dot absolute ${
              props.mode === false ? "right-0 ml-0.5" : "translate-x-8"
            } top-0.5 w-7 h-7 rounded-full transition-transform duration-500 ease-in-out`}>
            <FontAwesomeIcon
                icon={props.mode ? faMoon : faSun}
                className="text-black text-2xl self-center self-align w-7 h-7"
            />
          </div>
        </div>
      </label>
    </div>
  );
}
