import React, { use, useEffect, useState } from "react";
import ApiCellComponent, { IDailyStats } from "./ApiCellComponent";
import { useTranslation } from "react-i18next";

interface IXDaysForecastComponentProps {
  enabledProviders: string[];
  name: string;
  numForecastDays: number;
  setNumForecastDays: (num: number) => void;
  colour: string;
}

interface IDailyLocationStats {
  date: Date;
  smhi: IDailyStats | null;
  owm: IDailyStats | null;
  wa: IDailyStats | null;
}

const XDaysForecastComponent = (props: IXDaysForecastComponentProps) => {
  const {
    name,
    enabledProviders,
    numForecastDays,
    setNumForecastDays,
    colour,
  } = props;
  const { t, i18n } = useTranslation();

  const callString = name + "+" + numForecastDays;
  const [dailyStats, setDailyStats] = useState<IDailyLocationStats[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  useEffect(() => {
    fetch(`http://localhost:8000/location/daily/${callString}`)
      .then((response) => response.json())
      .then((data) => {
        setDailyStats(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [callString]);

  if (loading) {
    return (
      <>
        <p>{t("loading")}...</p>
      </>
    );
  } else if (enabledProviders.length > 0) {
    return (
      <div
        className={`bg-${colour}-800 rounded-xl p-4 text-${colour}-100 max-h-[49rem] overflow-y-auto flex flex-col`}>
        <div className="flex justify-between content-center m-4">
          <p className={`text-${colour}-100 text-2xl self-center`}>
            {t("xForecastDays")}
          </p>
          <div className="flex flex-col w-1/4">
            <p className={`text-center text-md mb-2 text-${colour}-100`}>
              {t("horizon")}
            </p>
            <div></div>
            <div className="relative content-center justify-center self-center">
              <input
                id="numForecastDays"
                type="range"
                min="1"
                max="14"
                value={numForecastDays}
                step="1"
                onChange={(e) => setNumForecastDays(parseInt(e.target.value))}
                className={`h-2 bg-${colour}-500 rounded-lg appearance-none cursor-pointer `}
              />
              <span
                className={`text-xs text-${colour}-100 absolute start-0 -bottom-6`}>
                1
              </span>
              <span
                className={`text-xs text-${colour}-100  absolute end-0 -bottom-6`}>
                14
              </span>
            </div>
          </div>
        </div>
        <table className="table-auto border-separate border-spacing-y-4 self-center">
          <thead>
            <tr>
              <th>{t("date")}</th>
              {enabledProviders.includes("SMHI") && <th>SMHI</th>}
              {enabledProviders.includes("WeatherAPI") && <th>WeatherAPI</th>}
              {enabledProviders.includes("OpenWeatherMap") && (
                <th>OpenWeatherMap</th>
              )}
            </tr>
          </thead>
          <tbody>
            {dailyStats.map((row, idx) => {
              if (row.smhi || row.wa || row.owm) {
                return (
                  <tr className={`bg-${colour}-900`} key={idx}>
                    <td>
                      <p className="m-2 mr-4">
                        {new Date(row.date).toLocaleDateString(i18n.language, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </td>
                    {enabledProviders.includes("SMHI") && (
                      <td>
                        <ApiCellComponent
                          stats={row.smhi}
                          provider={"smhi"}
                          colour={colour}
                        />
                      </td>
                    )}
                    {enabledProviders.includes("WeatherAPI") && (
                      <td>
                        <ApiCellComponent
                          stats={row.wa}
                          provider={"weatherapi"}
                          colour={colour}
                        />
                      </td>
                    )}
                    {enabledProviders.includes("OpenWeatherMap") && (
                      <td>
                        <ApiCellComponent
                          stats={row.owm}
                          provider={"openweathermap"}
                          colour={colour}
                        />
                      </td>
                    )}
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <>
        <p>{t("noProvidersSelected")}</p>
      </>
    );
  }
};

export default XDaysForecastComponent;
