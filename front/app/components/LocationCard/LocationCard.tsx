import React, { useEffect, useState } from "react";
import CurrentWeatherCardComponent from "./CardComponents/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./CardComponents/ForecastGraphCardComponent";
import AirHumidityComponent from "./CardComponents/AirHumidityComponent";
import CurrentPrecipitationCardComponent from "./CardComponents/CurrentPrecipitationCardComponent";
import CurrentVisibilityCardComponent from "./CardComponents/CurrentVisibilityCardComponent";
import CurrentAirPressureCardComponent from "./CardComponents/CurrentAirPressureCardComponent";
import CurrentCloudCoverageCardComponent from "./CardComponents/CurrentCloudCoverageCardComponent";
import WindCardComponent from "./CardComponents/WindCardComponent";
import XDaysForecastComponent from "./CardComponents/XDaysForecastComponent/XDaysForecastComponent";
import { useTranslation } from "react-i18next";
import CircleButtonComponent from "../CircleButtonComponent";
import {
  faCheck,
  faCross,
  faPen,
  faPlus,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "@/context/AuthContext";
import { providerToBgColor, providerToBorderColor } from "@/utils/colors";
import {
  ICardComponent,
  dataToSuffix,
  dataTypes,
  providerToTS,
} from "@/utils/location";
import { apiGET, apiPOST } from "@/utils/requestWrapper";
import MoveCardComponent from "./MoveCardComponent";
import ListBoxSelectComponent from "./EditDialog/ListBoxSelectComponent";
import { getAverageRightNowData } from "@/utils/weather";
import { alertFailure, alertSuccess } from "@/utils/notify";

interface ILocationCardProps {
  locationID: string;
  enabledComponents: ICardComponent[];
  setEnabledComponents: (components: ICardComponent[]) => void;
}

const LocationCard = (props: ILocationCardProps) => {
  const { locationID, enabledComponents, setEnabledComponents } = props;
  const { theme, user, updateLocationsCallback } = useAuthContext();
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);

  const [enabledProviders, setEnabledProviders] = useState([
    "SMHI",
    "WeatherAPI",
    "OpenWeatherMap",
    "Average",
  ]);

  const [availableProviders, setAvailableProviders] = useState([
    "SMHI",
    "WeatherAPI",
    "OpenWeatherMap",
    "Average",
  ]);

  const [editing, setEditing] = useState(false);

  const [numForecastDays, setNumForecastDays] = useState(5);

  const onlyAvgProvider = () => {
    return enabledProviders.length == 1 && enabledProviders.includes("Average");
  };

  const handleAdd = () => {
    const newData = [...enabledComponents];
    newData.push({ component: 0, data: 0 });
    setEnabledComponents(newData);
  };

  const handleDelete = () => {
    apiPOST(`/user/deleteLocation`, {
      fb_id: user?.uid,
      location_id: locationID,
    })
      .then((res) => {
        console.log(res);
        if (res) {
          updateLocationsCallback();
          alertSuccess(t("locationDeleted"));
        }
      })
      .catch((err) => {
        console.log(err);
        alertFailure(t("somethingWentWrong"));
      });
  };

  useEffect(() => {
    // fetch data from API for locationID
    apiGET(`/location/${locationID}`).then((res) => {
      setData(res);
      let newAvailableProviders = [
        "SMHI",
        "WeatherAPI",
        "OpenWeatherMap",
        "Average",
      ];
      if (res.smhiTS.length == 0) {
        newAvailableProviders = newAvailableProviders.filter(
          (p) => p !== "SMHI"
        );
      }
      if (res.owmTS.length == 0) {
        newAvailableProviders = newAvailableProviders.filter(
          (p) => p !== "OpenWeatherMap"
        );
      }
      if (res.waTS.length == 0) {
        newAvailableProviders = newAvailableProviders.filter(
          (p) => p !== "WeatherAPI"
        );
      }
      setAvailableProviders(newAvailableProviders);
      setEnabledProviders(newAvailableProviders);
    });
  }, [locationID]);

  return (
    <div
      className={`w-full h-auto p-10 rounded-xl bg-${theme}-700 shadow-sm hover:shadow-lg shadow-${theme}-600 hover:shadow-${theme}-600 transition-all ease-in-out duration-300`}>
      {data && (
        <>
          <div className="flex flex-row justify-between pb-4">
            {/* HEADER */}
            <p
              className={`text-4xl text-${theme}-100 self-center justify-center`}>
              {data.name.split(",")[0]}
            </p>
            <div className="flex flex-col self-center justify-center">
              {/* PROVIDER TOGGLE */}
              <div className="grid grid-cols-2 justify-center self-center">
                {availableProviders.map((provider) => (
                  <div
                    key={provider}
                    className={`rounded-xl ${
                      enabledProviders.includes(provider)
                        ? "opacity-100"
                        : "opacity-40"
                    } p-3 m-2 cursor-pointer justify-center text-center text-${theme}-100 border-2 ${
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
            <div className="grid grid-cols-2 self-center gap-2">
              <CircleButtonComponent
                className={`bg-${theme}-600 p-4 rounded-xl transition-all ease-in-out`}
                iconClassName={`text-lg ${
                  editing ? "text-green-500" : `text-${theme}-100`
                }`}
                icon={editing ? faCheck : faPen}
                onClick={() => setEditing(!editing)}
              />
              <CircleButtonComponent
                className={`bg-${theme}-600 p-4 rounded-xl transition-all ease-in-out`}
                iconClassName={`text-lg text-red-500`}
                icon={faTrash}
                onClick={handleDelete}
              />
              {(editing || enabledComponents.length == 0) && (
                <CircleButtonComponent
                  className={`bg-${theme}-600 col-span-2 p-4 rounded-xl transition-all ease-in-out ${
                    enabledComponents.length == 0 ? "animate-bounce" : ""
                  }`}
                  iconClassName={`text-lg text-${theme}-100`}
                  icon={faPlus}
                  onClick={handleAdd}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            {enabledComponents.map((row, index) => {
              if (row.component === 0) {
                return (
                  <div
                    key={row.component + String(row.data ?? "") + index}
                    className="flex flex-row justify-center">
                    <ForecastGraphCardComponent
                      setNumForecastDays={setNumForecastDays}
                      data={data}
                      numForecastDays={numForecastDays}
                      enabledProviders={enabledProviders}
                      dataField={dataTypes[row.data ?? 0].name}
                      suffix={dataToSuffix[dataTypes[row.data ?? 0].name]}
                      editing={editing}
                      enabledCards={enabledComponents}
                      setEnabledCards={setEnabledComponents}
                      index={index}
                    />
                    <MoveCardComponent
                      editing={editing}
                      enabledCards={enabledComponents}
                      setEnabledCards={setEnabledComponents}
                      index={index}
                    />
                  </div>
                );
              } else if (row.component === 1) {
                return (
                  <div
                    key={row.component + String(row.data ?? "") + index}
                    className={`flex flex-row justify-center`}>
                    <div
                      className={`flex flex-col justify-center w-full my-4 rounded-xl transition-all ease-in-out duration-500 ${
                        editing ? `bg-${theme}-800 p-4` : "p-0"
                      }`}>
                      <div className="grid grid-cols-2 justify-center gap-4">
                        {row.data === 0 &&
                          !onlyAvgProvider() &&
                          enabledProviders.map(
                            (provider) =>
                              data[providerToTS[provider]].length > 0 && (
                                <CurrentWeatherCardComponent
                                  key={provider}
                                  airTemperature={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "airTemperature",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .airTemperature
                                  }
                                  symbol={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "weatherSymbol",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .weatherSymbol
                                  }
                                  provider={provider}
                                />
                              )
                          )}
                        {row.data === 1 &&
                          !onlyAvgProvider() &&
                          enabledProviders.map(
                            (provider) =>
                              data[providerToTS[provider]].length > 0 && (
                                <WindCardComponent
                                  key={provider}
                                  windDirection={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "windDirection",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .windDirection
                                  }
                                  windSpeed={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "windSpeed",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .windSpeed
                                  }
                                  windGustSpeed={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "windGustSpeed",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .windGustSpeed
                                  }
                                  provider={provider}
                                />
                              )
                          )}
                        {row.data === 2 &&
                          !onlyAvgProvider() &&
                          enabledProviders.map(
                            (provider) =>
                              data[providerToTS[provider]].length > 0 && (
                                <CurrentPrecipitationCardComponent
                                  key={provider}
                                  precipitation={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "meanPrecipitationIntensity",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .meanPrecipitationIntensity
                                  }
                                  provider={provider}
                                />
                              )
                          )}
                        {row.data === 3 &&
                          !onlyAvgProvider() &&
                          enabledProviders.map(
                            (provider) =>
                              data[providerToTS[provider]].length > 0 && (
                                <CurrentAirPressureCardComponent
                                  key={provider}
                                  airPressure={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "airPressure",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .airPressure
                                  }
                                  provider={provider}
                                />
                              )
                          )}
                        {row.data === 4 &&
                          !onlyAvgProvider() &&
                          enabledProviders.map(
                            (provider) =>
                              data[providerToTS[provider]].length > 0 && (
                                <CurrentVisibilityCardComponent
                                  key={provider}
                                  visibility={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "horizontalVisibility",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .horizontalVisibility
                                  }
                                  provider={provider}
                                />
                              )
                          )}
                        {row.data === 5 &&
                          !onlyAvgProvider() &&
                          enabledProviders.map(
                            (provider) =>
                              data[providerToTS[provider]].length > 0 && (
                                <AirHumidityComponent
                                  key={provider}
                                  airHumidity={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "relativeHumidity",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .relativeHumidity
                                  }
                                  provider={provider}
                                />
                              )
                          )}
                        {row.data === 6 &&
                          !onlyAvgProvider() &&
                          enabledProviders.map(
                            (provider) =>
                              data[providerToTS[provider]].length > 0 && (
                                <CurrentCloudCoverageCardComponent
                                  key={provider}
                                  coverage={
                                    provider === "Average"
                                      ? getAverageRightNowData(
                                          data,
                                          "totalCloudCover",
                                          enabledProviders
                                        )
                                      : data[providerToTS[provider]][0]
                                          .totalCloudCover
                                  }
                                  provider={provider}
                                />
                              )
                          )}
                        {row.data! >= 7 && (
                          <p className={`text-${theme}-100`}>
                            Not implemented yet
                          </p>
                        )}
                      </div>

                      <div
                        className={`rounded-xl flex flex-row justify-center transition-all ease-in-out duration-500 ${
                          editing ? "opacity-100 p-4" : "opacity-0 p-0 h-0"
                        }`}>
                        <div className="mx-2 self-center">
                          <ListBoxSelectComponent
                            rowIdx={index}
                            setEnabledCards={setEnabledComponents}
                            isData={true}
                            enabledCards={enabledComponents}
                          />
                        </div>
                        <div className="mx-2 self-center">
                          <ListBoxSelectComponent
                            rowIdx={index}
                            setEnabledCards={setEnabledComponents}
                            isData={false}
                            enabledCards={enabledComponents}
                          />
                        </div>
                      </div>
                    </div>
                    <MoveCardComponent
                      editing={editing}
                      enabledCards={enabledComponents}
                      setEnabledCards={setEnabledComponents}
                      index={index}
                    />
                  </div>
                );
              } else if (row.component === 2) {
                return (
                  <div
                    key={row.component + String(row.data ?? "") + index}
                    className="flex flex-row justify-center">
                    <div className="flex justify-center my-4">
                      <XDaysForecastComponent
                        name={data.name}
                        enabledProviders={enabledProviders}
                        numForecastDays={numForecastDays}
                        setNumForecastDays={setNumForecastDays}
                        editing={editing}
                        enabledCards={enabledComponents}
                        setEnabledCards={setEnabledComponents}
                        index={index}
                      />
                    </div>
                    <MoveCardComponent
                      editing={editing}
                      enabledCards={enabledComponents}
                      setEnabledCards={setEnabledComponents}
                      index={index}
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
