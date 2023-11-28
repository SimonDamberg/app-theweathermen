import React, { useState } from "react";
import CurrentWeatherCardComponent from "./CardComponents/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./CardComponents/ForecastGraphCardComponent";
import WindCardComponent from "./CardComponents/WindCardComponent";
import XDaysForecastComponent from "./CardComponents/XDaysForecastComponent/XDaysForecastComponent";
import {
  providerToBgColor,
  providerToBorderColor,
} from "../../../utils/colors";
import { useTranslation } from "react-i18next";
import CircleButtonComponent from "../CircleButtonComponent";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import LocationEditDialog from "./EditDialog/LocationEditDialog";

interface ILocationCardProps {
  data?: any;
  colour: string;
}

const providerToTS: { [key: string]: string } = {
  SMHI: "smhiTS",
  WeatherAPI: "waTS",
  OpenWeatherMap: "owmTS",
};

export const componentTypes = [
  { name: "graph", id: 0 },
  { name: "todayWeather", id: 1 },
  { name: "forecastTable", id: 2 },
];

export const dataTypes = [
  { name: "airTemperature", id: 0 },
  { name: "windSpeed", id: 1 },
  { name: "meanPrecipitationIntensity", id: 2 },
  { name: "airPressure", id: 3 },
  { name: "horizontalVisibility", id: 4 },
  { name: "relativeHumidity", id: 5 },
  { name: "totalCloudCover", id: 6 },
];

export const dataToSuffix: { [key: string]: string } = {
  airTemperature: "°C",
  windSpeed: "m/s",
  meanPrecipitationIntensity: "mm",
  airPressure: "hPa",
  horizontalVisibility: "km",
  relativeHumidity: "%",
  totalCloudCover: "%",
};

const LocationCard = (props: ILocationCardProps) => {
  const { data, colour } = props;
  const { t } = useTranslation();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState([
    "SMHI",
    "WeatherAPI",
    "OpenWeatherMap",
  ]);

  const [enabledCards, setEnabledCards] = useState([
    { component: 1, data: 0 },
    { component: 1, data: 1 },
    { component: 0, data: 1 },
    { component: 0, data: 0 },
    { component: 0, data: 2 },
    { component: 0, data: 3 },
    { component: 2, data: null },
  ]);

  const [numForecastDays, setNumForecastDays] = useState(5);

  return (
    <div
      className={`w-300 h-auto my-14 p-10 rounded-xl bg-${colour}-700 shadow-sm hover:shadow-lg shadow-${colour}-600 hover:shadow-${colour}-600 transition-all ease-in-out duration-300`}>
      {data && (
        <>
          <div className="flex flex-row justify-between content-center">
            {/* HEADER */}
            <p className={`text-4xl text-${colour}-100 self-center`}>
              {data.name}
            </p>
            <div className="flex flex-col self-center">
              {/* PROVIDER TOGGLE */}
              <div className="flex flex-row justify-center self-center">
                {Object.keys(providerToTS).map((provider) => (
                  <div
                    key={provider}
                    className={`rounded-xl ${
                      enabledProviders.includes(provider)
                        ? "opacity-100"
                        : "opacity-40"
                    } p-4 m-2 cursor-pointer justify-center text-center text-${colour}-100 border-2 ${
                      providerToBorderColor[provider.toLowerCase()]
                    } ${
                      providerToBgColor[provider.toLowerCase()]
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
              className={`bg-${colour}-600 p-4 rounded-xl m-6`}
              iconClassName={`text-lg text-${colour}-100`}
              icon={faPen}
              onClick={() => setShowEditDialog(true)}
            />
            <LocationEditDialog
              colour={colour}
              open={showEditDialog}
              setOpen={setShowEditDialog}
              locationName={data.name}
              enabledCards={enabledCards}
              setEnabledCards={setEnabledCards}
            />
          </div>
          <div className="flex flex-col">
            {enabledCards.map((row, index) => {
              if (row.component === 0) {
                return (
                  <div
                    key={row.component + String(row.data ?? "") + index}
                    className="flex justify-center my-4">
                    <ForecastGraphCardComponent
                      setNumForecastDays={setNumForecastDays}
                      colour={colour}
                      data={data}
                      numForecastDays={numForecastDays}
                      enabledProviders={enabledProviders}
                      dataField={dataTypes[row.data ?? 0].name}
                      suffix={dataToSuffix[dataTypes[row.data ?? 0].name]}
                    />
                  </div>
                );
              } else if (row.component === 1) {
                if (row.data === 0) {
                  return (
                    <div
                      key={row.component + String(row.data ?? "") + index}
                      className="flex flex-row p-4 justify-center">
                      {enabledProviders.map((provider) => (
                        <CurrentWeatherCardComponent
                          colour={colour}
                          key={provider}
                          airTemperature={
                            data[providerToTS[provider]][0].airTemperature
                          }
                          symbol={data[providerToTS[provider]][0].weatherSymbol}
                          provider={provider}
                        />
                      ))}
                    </div>
                  );
                } else if (row.data === 1) {
                  return (
                    <div
                      key={row.component + String(row.data ?? "") + index}
                      className="flex flex-row p-4 justify-center">
                      {enabledProviders.map((provider) => (
                        <WindCardComponent
                          colour={colour}
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
                  );
                }
              } else if (row.component === 2) {
                return (
                  <div
                    key={row.component + String(row.data ?? "") + index}
                    className="flex justify-center my-4">
                    <XDaysForecastComponent
                      colour={colour}
                      name={data.name}
                      enabledProviders={enabledProviders}
                      numForecastDays={numForecastDays}
                      setNumForecastDays={setNumForecastDays}
                    />
                  </div>
                );
              }
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LocationCard;
