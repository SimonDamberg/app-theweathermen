import React, { useState } from "react";
import CurrentWeatherCardComponent from "./CardComponents/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./CardComponents/ForecastGraphCardComponent";
import WindCardComponent from "./CardComponents/WindCardComponent";
import XDaysForecastComponent from "./CardComponents/XDaysForecastComponent/XDaysForecastComponent";
import { providerToBgColor } from "../../utils/colors";
import { useTranslation } from "react-i18next";
import CircleButtonComponent from "../CircleButtonComponent";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import LocationEditDialog from "./LocationEditDialog";

interface ILocationCardProps {
  data?: any;
}

const providerToTS: { [key: string]: string } = {
  SMHI: "smhiTS",
  WeatherAPI: "waTS",
  OpenWeatherMap: "owmTS",
};

const LocationCard = (props: ILocationCardProps) => {
  const { data } = props;
  const { t, i18n } = useTranslation();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState([
    "SMHI",
    "WeatherAPI",
    "OpenWeatherMap",
  ]);
  const [enabledCards, setEnabledCards] = useState([
    "weather",
    "wind",
    "airTemperatureGraph",
    "windSpeedGraph",
    "meanPrecipitationIntensityGraph",
    "airPressureGraph",
    "xDaysTable",
  ]);

  const resetEnabledCards = () => {
    setEnabledCards([
      "weather",
      "wind",
      "airTemperatureGraph",
      "windSpeedGraph",
      "meanPrecipitationIntensityGraph",
      "airPressureGraph",
      "xDaysTable",
    ]);
  };

  const numForecastDays = 5;

  return (
    <div className="w-300 h-auto my-14 p-10 rounded-xl bg-sky-700 shadow-sm hover:shadow-lg shadow-sky-600 hover:shadow-sky-600 transition-all ease-in-out duration-300">
      {data && (
        <>
          <div className="flex flex-row justify-between content-center">
            {/* HEADER */}
            <p className="text-4xl text-sky-100 self-center">{data.name}</p>
            <div className="flex flex-col self-center">
              {/* PROVIDER TOGGLE */}
              <div className="flex flex-row justify-center self-center">
                {Object.keys(providerToTS).map((provider) => (
                  <div
                    key={provider}
                    className={`rounded-xl ${enabledProviders.includes(provider)
                      ? "opacity-100"
                      : "opacity-40"
                      } p-4 m-2 cursor-pointer justify-center text-center text-sky-100 ${providerToBgColor[provider.toLowerCase()]
                      } hover:opacity-70 transition-all ease-in-out duration-200`}
                    onClick={() => {
                      if (enabledProviders.includes(provider)) {
                        setEnabledProviders(
                          enabledProviders.filter((p) => p !== provider)
                        );
                      } else {
                        setEnabledProviders([...enabledProviders, provider]);
                      }
                    }}>
                    {provider}
                  </div>
                ))}
              </div>
            </div>
            <CircleButtonComponent
              className={"bg-sky-600 p-4 rounded-xl"}
              iconClassName="text-lg"
              icon={faPen}
              onClick={() => setShowEditDialog(true)}
            />
            <LocationEditDialog
              resetEnabledCards={resetEnabledCards}
              open={showEditDialog}
              setOpen={setShowEditDialog}
              locationName={data.name}
              enabledCards={enabledCards}
              setEnabledCards={setEnabledCards}
            />
          </div>
          <div className="flex flex-col">
            {enabledCards.includes("weather") && (
              <div className="flex flex-row p-4 justify-center">
                {/* CURRENT WEATHER */}
                {enabledProviders.map((provider) => (
                  <CurrentWeatherCardComponent
                    key={provider}
                    airTemperature={
                      data[providerToTS[provider]][0].airTemperature
                    }
                    symbol={data[providerToTS[provider]][0].weatherSymbol}
                    provider={provider}
                  />
                ))}
              </div>
            )}
            {enabledCards.includes("wind") && (
              <div className="flex flex-row p-4 justify-center">
                {/* WIND */}
                {enabledProviders.map((provider) => (
                  <WindCardComponent
                    key={provider}
                    windDirection={
                      data[providerToTS[provider]][0].windDirection
                    }
                    windSpeed={data[providerToTS[provider]][0].windSpeed}
                    windGustSpeed={
                      data[providerToTS[provider]][0].windGustSpeed
                    }
                    provider={provider}
                  />
                ))}
              </div>
            )}
            {enabledCards.includes("windSpeedGraph") && (
              <div className="flex justify-center my-4">
                <ForecastGraphCardComponent
                  data={data}
                  dataField={"windSpeed"}
                  suffix={t("meterPerSecond")}
                  name={t("windSpeed")}
                  numForecastDays={numForecastDays}
                  enabledProviders={enabledProviders}
                />
              </div>
            )}
            {enabledCards.includes("airTemperatureGraph") && (
              <div className="flex justify-center my-4">
                <ForecastGraphCardComponent
                  data={data}
                  dataField={"airTemperature"}
                  name={t("airTemperature")}
                  suffix={"°C"}
                  numForecastDays={numForecastDays}
                  enabledProviders={enabledProviders}
                />
              </div>
            )}
            {enabledCards.includes("meanPrecipitationIntensityGraph") && (
              <div className="flex justify-center my-4">
                <ForecastGraphCardComponent
                  data={data}
                  dataField={"meanPrecipitationIntensity"}
                  suffix={"mm"}
                  name={t("precipitation")}
                  numForecastDays={numForecastDays}
                  enabledProviders={enabledProviders}
                />
              </div>
            )}
            {enabledCards.includes("airPressureGraph") && (
              <div className="flex justify-center my-4">
                <ForecastGraphCardComponent
                  data={data}
                  dataField={"airPressure"}
                  suffix={"hPa"}
                  name={t("airPressure")}
                  numForecastDays={numForecastDays}
                  enabledProviders={enabledProviders}
                />
              </div>
            )}
            {enabledCards.includes("xDaysTable") && (
              <div className="flex justify-center my-4">
                <XDaysForecastComponent
                  name={data.name}
                  enabledProviders={enabledProviders}
                  numForecastDays={numForecastDays}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LocationCard;
