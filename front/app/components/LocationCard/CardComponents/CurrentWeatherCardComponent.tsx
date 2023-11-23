import React from "react";
import Image from "next/image";
import { providerToBorderColor } from "@/app/utils/colors";
import { useTranslation } from "react-i18next";

interface ICurrentWeatherCardProps {
  airTemperature: number;
  symbol: Number;
  provider: string;
}

const CurrentWeatherCard = (props: ICurrentWeatherCardProps) => {
  const { airTemperature, symbol, provider } = props;
  const { t, i18n } = useTranslation();

  return (
    <div
      className={`flex flex-col bg-sky-800 rounded-xl p-4 mx-4 border-2 ${providerToBorderColor[provider.toLowerCase()]
        }`}>
      <div className="flex flex-row justify-center">
        <p className="text-sky-100 text-2xl mx-2">{airTemperature.toLocaleString(i18n.language, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}°C</p>
        <div className="flex flex-col justify-center">
          <Image
            src={`/images/weatherSymbols/${symbol}.png`}
            width={32}
            height={32}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
