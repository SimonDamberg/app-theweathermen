import React from "react";
import CurrentWeatherCardComponent from "./LocationCards/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./LocationCards/ForecastGraphCardComponent";
import WindCardComponent from "./LocationCards/WindCardComponent";
import XDaysForecastComponent from "./LocationCards/XDaysForecastComponent/XDaysForecastComponent";

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
            <div className="flex flex-row p-4 justify-center">
              <WindCardComponent
                windDirection={data.smhiTS[0].windDirection}
                windSpeed={data.smhiTS[0].windSpeed}
                windGustSpeed={data.smhiTS[0].windGustSpeed}
                provider="SMHI"
              />
              <WindCardComponent
                windDirection={data.waTS[0].windDirection}
                windSpeed={data.waTS[0].windSpeed}
                windGustSpeed={data.waTS[0].windGustSpeed}
                provider="WeatherAPI"
              />
              <WindCardComponent
                windDirection={data.owmTS[0].windDirection}
                windSpeed={data.owmTS[0].windSpeed}
                windGustSpeed={data.owmTS[0].windGustSpeed}
                provider="OpenWeatherMap"
              />
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"windSpeed"}
                suffix={"m/s"}
                name={"Wind Speed"}
                numForecastDays={numForecastDays}
              />
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"airTemperature"}
                name={"Air Temperature"}
                suffix={"°C"}
                numForecastDays={numForecastDays}
              />
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"meanPrecipitationIntensity"}
                suffix={"mm"}
                name={"Precipitation"}
                numForecastDays={numForecastDays}
              />
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"airPressure"}
                suffix={"hPa"}
                name={"Air Pressure"}
                numForecastDays={numForecastDays}
              />
            </div>
            <div className="flex justify-center my-4">
              <XDaysForecastComponent
                name={data.name}
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
