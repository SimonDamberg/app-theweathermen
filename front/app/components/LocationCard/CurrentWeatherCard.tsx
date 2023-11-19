import React from "react";
import Image from "next/image";

interface ICurrentWeatherCardProps {
  airTemperature: string;
  symbol: Number;
  provider: string;
}

const CurrentWeatherCard = (props: ICurrentWeatherCardProps) => {
  const { airTemperature, symbol, provider } = props;
  return (
    <div className="flex flex-col bg-sky-800 rounded-xl p-4 m-4">
      <div className="flex flex-row justify-center">
        <p className="text-sky-100 text-2xl mx-2">{airTemperature}°C</p>
        <div className="flex flex-col justify-center">
          <Image
            src={`/images/weatherSymbols/${symbol}.png`}
            width={32}
            height={32}
            alt=""
          />
        </div>
      </div>
      <div>
        <p className="flex text-sky-100 justify-center">{provider}</p>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
