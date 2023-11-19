import React from "react";
import CurrentWeatherCardComponent from "./LocationCards/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./LocationCards/ForecastGraphCardComponent";
import WindCardComponent from "./LocationCards/WindCardComponent";
import { providerToBgColor } from "../utils/colors";
//import XDaysForecastComponent from "./LocationCards/XDaysForecastComponent";

interface ILocationProps {
  data?: any;
}

const providerToTS: { [key: string]: string } = {
  SMHI: "smhiTS",
  WeatherAPI: "waTS",
  OpenWeatherMap: "owmTS",
};

const LocationComponent = (props: ILocationProps) => {
  const { data } = props;

  const [enabledProviders, setEnabledProviders] = React.useState(["SMHI", "WeatherAPI", "OpenWeatherMap"]);
  const numForecastDays = 5;

  return (
    <div className="w-300 h-full p-10 rounded-xl bg-sky-700 shadow-sm hover:shadow-lg shadow-sky-600 hover:shadow-sky-600 transition-all ease-in-out duration-300">
      {data && (
        <>
          <div className="flex flex-row justify-between">
            {/* HEADER */}
            <p className="text-4xl text-sky-100 self-center">{data.name}</p>
            <div className="flex flex-col">
              {/* PROVIDER TOGGLE */}
              <div className="flex flex-row justify-center self-center">
                {Object.keys(providerToTS).map((provider) => (
                  <div
                    key={provider}
                    className={`rounded-xl ${enabledProviders.includes(provider) ? 'opacity-100' : 'opacity-40'} p-4 m-2 justify-center text-center text-sky-100 ${providerToBgColor[provider.toLowerCase()]} hover:opacity-70 transition-all ease-in-out duration-200`}
                    onClick={() => {
                      if (enabledProviders.includes(provider)) {
                        setEnabledProviders(enabledProviders.filter((p) => p !== provider));
                      } else {
                        setEnabledProviders([...enabledProviders, provider]);
                      }
                    }}
                  >
                    {provider}
                  </div>
                ))}
              </div>
              {/* <div className={`rounded-xl p-4 justify-center text-center text-sky-100 ${providerToBgColor["smhi"]} hover:opacity-80 transition-all ease-in-out duration-200`}>
                SMHI
              </div> */}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row p-4 justify-center">
              {/* CURRENT WEATHER */}
              {enabledProviders.map((provider) => (
                <CurrentWeatherCardComponent
                  key={provider}
                  airTemperature={data[providerToTS[provider]][0].airTemperature}
                  symbol={data[providerToTS[provider]][0].weatherSymbol}
                  provider={provider}
                />
              ))}
            </div>
            <div className="flex flex-row p-4 justify-center">
              {/* WIND */}
              {enabledProviders.map((provider) => (
                <WindCardComponent
                  key={provider}
                  windDirection={data[providerToTS[provider]][0].windDirection}
                  windSpeed={data[providerToTS[provider]][0].windSpeed}
                  windGustSpeed={data[providerToTS[provider]][0].windGustSpeed}
                  provider={provider}
                />
              ))}
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"windSpeed"}
                suffix={"m/s"}
                name={"Wind Speed"}
                numForecastDays={numForecastDays}
                enabledProviders={enabledProviders}
              />
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"airTemperature"}
                name={"Air Temperature"}
                suffix={"°C"}
                numForecastDays={numForecastDays}
                enabledProviders={enabledProviders}
              />
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"meanPrecipitationIntensity"}
                suffix={"mm"}
                name={"Precipitation"}
                numForecastDays={numForecastDays}
                enabledProviders={enabledProviders}
              />
            </div>
            <div className="flex justify-center my-4">
              <ForecastGraphCardComponent
                data={data}
                dataField={"airPressure"}
                suffix={"hPa"}
                name={"Air Pressure"}
                numForecastDays={numForecastDays}
                enabledProviders={enabledProviders}
              />
            </div>
            <div className="flex justify-center my-4">
              {/* <XDaysForecastComponent
                location={data.name}
                numForecastDays={numForecastDays}
              /> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationComponent;
