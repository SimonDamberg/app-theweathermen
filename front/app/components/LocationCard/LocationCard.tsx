import React, { useEffect, useState } from "react";
import CurrentWeatherCardComponent from "./CardComponents/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./CardComponents/ForecastGraphCardComponent";
import AirHumidityComponent from "./CardComponents/AirHumidityComponent";
import CurrentPrecipitationCardComponent from "./CardComponents/CurrentPrecipitationCardComponent";
import CurrentAirPressureCardComponent from "./CardComponents/CurrentAirPressureCardComponent"
import WindCardComponent from "./CardComponents/WindCardComponent";
import XDaysForecastComponent from "./CardComponents/XDaysForecastComponent/XDaysForecastComponent";
import { useTranslation } from "react-i18next";
import CircleButtonComponent from "../CircleButtonComponent";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import LocationEditDialog from "./EditDialog/LocationEditDialog";
import { useAuthContext } from "@/context/AuthContext";
import { providerToBgColor, providerToBorderColor } from "@/utils/colors";
import {
  ICardComponent,
  dataToSuffix,
  dataTypes,
  providerToTS,
} from "@/utils/location";
import { apiGET } from "@/utils/requestWrapper";

interface ILocationCardProps {
  locationID: string;
  enabledComponents: ICardComponent[];
  setEnabledComponents: (components: ICardComponent[]) => void;
}

const LocationCard = (props: ILocationCardProps) => {
  const { locationID, enabledComponents, setEnabledComponents } = props;
  const { theme } = useAuthContext();
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState([
    "SMHI",
    "WeatherAPI",
    "OpenWeatherMap",
  ]);

  const [numForecastDays, setNumForecastDays] = useState(5);

  useEffect(() => {
    // fetch data from API for locationID
    apiGET(`/location/${locationID}`).then((res) => {
      setData(res);
    });
  }, [locationID]);

  return (
    <div
      className={`w-300 h-auto my-14 p-10 rounded-xl bg-${theme}-700 shadow-sm hover:shadow-lg shadow-${theme}-600 hover:shadow-${theme}-600 transition-all ease-in-out duration-300`}>
      {data && (
        <>
          <div className="flex flex-row justify-between content-center">
            {/* HEADER */}
            <p className={`text-4xl text-${theme}-100 self-center`}>
              {data.name}
            </p>
            <div className="flex flex-col self-center">
              {/* PROVIDER TOGGLE */}
              <div className="flex flex-row justify-center self-center">
                {Object.keys(providerToTS).map((provider) => (
                  <div
                    key={provider}
                    className={`rounded-xl ${enabledProviders.includes(provider)
                      ? "opacity-100"
                      : "opacity-40"
                      } p-4 m-2 cursor-pointer justify-center text-center text-${theme}-100 border-2 ${providerToBorderColor[provider.toLowerCase()]
                      } ${providerToBgColor[provider.toLowerCase()]
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
              className={`bg-${theme}-600 p-4 rounded-xl m-6`}
              iconClassName={`text-lg text-${theme}-100`}
              icon={faPen}
              onClick={() => setShowEditDialog(true)}
            />
            <LocationEditDialog
              open={showEditDialog}
              setOpen={setShowEditDialog}
              locationName={data.name}
              enabledCards={enabledComponents}
              setEnabledCards={setEnabledComponents}
            />
          </div>
          <div className="flex flex-col">
            {enabledComponents.map((row, index) => {
              if (row.component === 0) {
                return (
                  <div
                    key={row.component + String(row.data ?? "") + index}
                    className="flex justify-center my-4">
                    <ForecastGraphCardComponent
                      setNumForecastDays={setNumForecastDays}
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
                } else if (row.data === 2) {

                  return (
                    <div
                      key={row.component + String(row.data ?? "") + index}
                      className="flex flex-row p-4 justify-center">
                      {enabledProviders.map((provider) => (

                        <CurrentPrecipitationCardComponent
                          key={provider}
                          precipitation={
                            data[providerToTS[provider]][0].meanPrecipitationIntensity
                          }
                          provider={provider}
                        />
                      ))}
                    </div>
                  );
                } else if (row.data === 3) {

                  return (
                    <div
                      key={row.component + String(row.data ?? "") + index}
                      className="flex flex-row p-4 justify-center">
                      {enabledProviders.map((provider) => (

                        <CurrentAirPressureCardComponent
                          key={provider}
                          airPressure={
                            data[providerToTS[provider]][0].airPressure
                          }
                          provider={provider}
                        />
                      ))}
                    </div>
                  );
                }
                else if (row.data === 5) {
                  return (
                    <div
                      key={row.component + String(row.data ?? "") + index}
                      className="flex flex-row p-4 justify-center">
                      {enabledProviders.map((provider) => (
                        <AirHumidityComponent
                          key={provider}
                          airHumidity={
                            data[providerToTS[provider]][0].relativeHumidity
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
