import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import ApiCellComponent, { IDailyStats } from "./ApiCellComponent";

interface IXDaysForecastComponentProps {
  name: string;
  numForecastDays: number;
}

interface IDailyLocationStats {
  date: Date;
  smhi: IDailyStats | null;
  owm: IDailyStats | null;
  wa: IDailyStats | null;
}

const XDaysForecastComponent = (props: IXDaysForecastComponentProps) => {
  const { name, numForecastDays } = props;
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
        <p>Loading...</p>
      </>
    );
  } else {
    return (
      <div className="bg-sky-800 rounded-xl p-4 text-sky-100">
        <table className="table-auto border-separate border-spacing-y-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>SMHI</th>
              <th>WA</th>
              <th>OWM</th>
            </tr>
          </thead>
          <tbody>
            {dailyStats.map((row) => {
              return (
                <tr className="bg-sky-900">
                  <td>
                    <p className="m-2 mr-4">
                      {new Date(row.date).toLocaleDateString("en-EN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </td>
                  <td>
                    <ApiCellComponent stats={row.smhi} provider={"smhi"} />
                  </td>
                  <td>
                    <ApiCellComponent stats={row.wa} provider={"weatherapi"} />
                  </td>
                  <td>
                    <ApiCellComponent
                      stats={row.owm}
                      provider={"openweathermap"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default XDaysForecastComponent;
