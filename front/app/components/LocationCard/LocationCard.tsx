import React, { useEffect, useState } from "react";
import CurrentWeatherCardComponent from "./CardComponents/CurrentWeatherCardComponent";
import ForecastGraphCardComponent from "./CardComponents/ForecastGraphCardComponent";
import WindCardComponent from "./CardComponents/WindCardComponent";
import XDaysForecastComponent from "./CardComponents/XDaysForecastComponent/XDaysForecastComponent";
import { useTranslation } from "react-i18next";
import CircleButtonComponent from "../CircleButtonComponent";
import { faCheck, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "@/context/AuthContext";
import { providerToBgColor, providerToBorderColor } from "@/utils/colors";
import {
  ICardComponent,
  dataToSuffix,
  dataTypes,
  providerToTS,
} from "@/utils/location";
import { apiGET } from "@/utils/requestWrapper";
import MoveCardComponent from "./MoveCardComponent";
import ListBoxSelectComponent from "./EditDialog/ListBoxSelectComponent";
import { getAverageRightNowData } from "@/utils/weather";

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

  const [enabledProviders, setEnabledProviders] = useState([
    "SMHI",
    "WeatherAPI",
    "OpenWeatherMap",
    "Average",
  ]);

  const [editing, setEditing] = useState(false);

  const [numForecastDays, setNumForecastDays] = useState(5);

  const handleAdd = () => {
    const newData = [...enabledComponents];
    newData.push({ component: 0, data: 0 });
    setEnabledComponents(newData);
  };

  useEffect(() => {
    // fetch data from API for locationID
    apiGET(`/location/${locationID}`).then((res) => {
      setData(res);
    });
  }, [locationID]);

  return (
    <div
      className={`w-[54rem] h-auto p-10 rounded-xl bg-${theme}-700 shadow-sm hover:shadow-lg shadow-${theme}-600 hover:shadow-${theme}-600 transition-all ease-in-out duration-300`}>
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
            <div className="w-20 flex flex-row self-center justify-center">
              {enabledComponents.length > 0 && (
                <CircleButtonComponent
                  className={`bg-${theme}-600 p-4 rounded-xl mr-2`}
                  iconClassName={`text-lg ${
                    editing ? "text-green-500" : `text-${theme}-100`
                  }`}
                  icon={editing ? faCheck : faPen}
                  onClick={() => setEditing(!editing)}
                />
              )}
              {(editing || enabledComponents.length == 0) && (
                <CircleButtonComponent
                  className={`bg-${theme}-600 p-4 rounded-xl ${
                    enabledComponents.length == 0 ? "animate-bounce" : ""
                  }`}
                  iconClassName={`text-lg text-${theme}-100`}
                  icon={faPlus}
                  onClick={handleAdd}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            {enabledComponents.map((row, index) => {
              if (row.component === 0) {
                return (
                  <div
                    key={row.component + String(row.data ?? "") + index}
                    className="flex flex-row ">
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
                    className={`flex flex-row`}>
                    <div
                      className={`flex flex-col justify-center w-[40rem] my-4 ml-16 rounded-xl transition-all ease-in-out duration-500 ${
                        editing ? `bg-${theme}-800 p-4` : "p-0"
                      }`}>
                      <div className="grid grid-cols-2 justify-center gap-4">
                        {row.data === 0 &&
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
                        {row.data! >= 2 && (
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
                    className="flex flex-row">
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
