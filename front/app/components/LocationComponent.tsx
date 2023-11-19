import React from "react";
import CurrentWeatherCardComponent from "./LocationCard/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./LocationCard/ForecastGraphCardComponent";

interface ILocationProps {
  data?: any;
}

const LocationComponent = (props: ILocationProps) => {
  const { data } = props;

  const numForecastDays = 5;

  return (
    <div className="w-300 h-full p-10 rounded-xl bg-sky-700 shadow-sm hover:shadow-lg shadow-sky-600 hover:shadow-sky-600 transition-all ease-in-out duration-300">
      {data && (
        <>
          <p className="text-4xl text-sky-100">{data.name}</p>
          <div className="flex flex-col">
            <div className="flex flex-row p-4 justify-center">
              <CurrentWeatherCardComponent
                airTemperature={data.smhiTS[0].airTemperature}
                symbol={data.smhiTS[0].weatherSymbol}
                provider="SMHI"
              />
              <CurrentWeatherCardComponent
                airTemperature={data.waTS[0].airTemperature}
                symbol={data.waTS[0].weatherSymbol}
                provider="WeatherAPI"
              />
              <CurrentWeatherCardComponent
                airTemperature={data.owmTS[0].airTemperature}
                symbol={data.owmTS[0].weatherSymbol}
                provider="OpenWeatherMap"
              />
            </div>
            <div className="flex justify-center">
              <ForecastGraphCardComponent
                data={data}
                numForecastDays={numForecastDays}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationComponent;
