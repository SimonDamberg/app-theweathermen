import React, { useEffect, useState } from "react";
import ApiCellComponent, { IDailyStats } from "./ApiCellComponent";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";
import ListBoxSelectComponent from "../../EditDialog/ListBoxSelectComponent";
import { apiGET } from "@/utils/requestWrapper";

interface IXDaysForecastComponentProps {
  enabledProviders: string[];
  name: string;
  numForecastDays: number;
  setNumForecastDays: (num: number) => void;
  editing: boolean;
  enabledCards: { component: number; data: number | null }[];
  setEnabledCards: (
    cards: { component: number; data: number | null }[]
  ) => void;
  index: number;
}

interface IDailyLocationStats {
  date: Date;
  smhi: IDailyStats | null;
  owm: IDailyStats | null;
  wa: IDailyStats | null;
  avg: IDailyStats | null;
}

const XDaysForecastComponent = (props: IXDaysForecastComponentProps) => {
  const {
    name,
    enabledProviders,
    numForecastDays,
    setNumForecastDays,
    editing,
    enabledCards,
    setEnabledCards,
    index,
  } = props;
  const { t, i18n } = useTranslation();
  const { theme } = useAuthContext();

  const callString = name + "+" + numForecastDays;
  const [dailyStats, setDailyStats] = useState<IDailyLocationStats[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  useEffect(() => {
    apiGET(`/location/daily/${callString}`)
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
        className={`bg-${theme}-800 w-[40rem] rounded-xl p-4 text-${theme}-100 max-h-[49rem] overflow-y-auto overflow-x-hidden flex flex-col`}>
        <div className="flex justify-between content-center m-4">
          {editing ? (
            <div className="flex flex-col mx-2 self-center">
              <ListBoxSelectComponent
                rowIdx={index}
                setEnabledCards={setEnabledCards}
                isData={false}
                enabledCards={enabledCards}
              />
            </div>
          ) : (
            <p className={`text-${theme}-100 text-2xl self-center`}>
              {t("xForecastDays")}
            </p>
          )}

          <div className="flex flex-col w-1/4">
            <p className={`text-center text-md mb-2 text-${theme}-100`}>
              {t("horizon")}
            </p>
            <div></div>
            <div className="relative content-center justify-center self-center">
              <input
                id="numForecastDays"
                type="range"
                min="1"
                max="10"
                value={numForecastDays}
                step="1"
                onChange={(e) => setNumForecastDays(parseInt(e.target.value))}
                className={`h-2 bg-${theme}-500 rounded-lg appearance-none cursor-pointer `}
              />
              <span
                className={`text-xs text-${theme}-100 absolute start-0 -bottom-6`}>
                1 {t("day")}
              </span>
              <span
                className={`text-xs text-${theme}-100  absolute end-0 -bottom-6`}>
                10 {t("days")}
              </span>
            </div>
          </div>
        </div>
        <table className="table-auto text-sm md:text-base border-separate border-spacing-y-4 self-center">
          <thead>
            <tr>
              <th>{t("date")}</th>
              {enabledProviders.includes("SMHI") && <th>SMHI</th>}
              {enabledProviders.includes("WeatherAPI") && <th>WeatherAPI</th>}
              {enabledProviders.includes("OpenWeatherMap") && <th>OWM</th>}
            </tr>
          </thead>
          <tbody>
            {dailyStats.map((row, idx) => {
              if (row.smhi || row.wa || row.owm || row.avg) {
                return (
                  <tr className={`bg-${theme}-900`} key={idx}>
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
                        <ApiCellComponent stats={row.smhi} provider={"smhi"} />
                      </td>
                    )}
                    {enabledProviders.includes("WeatherAPI") && (
                      <td>
                        <ApiCellComponent
                          stats={row.wa}
                          provider={"weatherapi"}
                        />
                      </td>
                    )}
                    {enabledProviders.includes("OpenWeatherMap") && (
                      <td>
                        <ApiCellComponent
                          stats={row.owm}
                          provider={"openweathermap"}
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
