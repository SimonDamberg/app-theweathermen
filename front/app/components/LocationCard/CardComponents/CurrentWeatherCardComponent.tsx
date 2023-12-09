import React from "react";
import Image from "next/image";
import { providerToBorderColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";

interface ICurrentWeatherCardProps {
  airTemperature: number;
  symbol: Number;
  provider: string;
}

const CurrentWeatherCard = (props: ICurrentWeatherCardProps) => {
  const { airTemperature, symbol, provider } = props;
  const { t, i18n } = useTranslation();
  const { theme } = useAuthContext();

  return (
    <div
      className={`flex bg-${theme}-800 rounded-xl p-4 mx-2 border-2 ${
        providerToBorderColor[provider.toLowerCase()]
      }`}>
      <div className="flex flex-row justify-center">
        <p className={`text-${theme}-100 text-2xl mx-2`}>
          {airTemperature.toLocaleString(i18n.language, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          °C
        </p>
        <div className="flex justify-center">
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
