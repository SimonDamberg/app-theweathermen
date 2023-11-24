import React, { use, useEffect, useState } from "react";
import ApiCellComponent, { IDailyStats } from "./ApiCellComponent";
import { useTranslation } from "react-i18next";

interface IXDaysForecastComponentProps {
  enabledProviders: string[];
  name: string;
  numForecastDays: number;
  colour: string;
}

interface IDailyLocationStats {
  date: Date;
  smhi: IDailyStats | null;
  owm: IDailyStats | null;
  wa: IDailyStats | null;
}

const XDaysForecastComponent = (props: IXDaysForecastComponentProps) => {
  const { name, enabledProviders, numForecastDays, colour } = props;
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
        className={`bg-${colour}-800 rounded-xl p-4 text-sky-100 max-h-[49rem] overflow-y-auto`}>
        <table className="table-auto border-separate border-spacing-y-4">
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
