import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import { apiToColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";
import ListBoxSelectComponent from "../EditDialog/ListBoxSelectComponent";

ChartJS.register(...registerables);

interface IForecastGraphCardComponentProps {
  data: any;
  numForecastDays: number;
  setNumForecastDays: (num: number) => void;
  dataField: string;
  suffix?: string;
  prefix?: string;
  enabledProviders: string[];
  editing: boolean;
  enabledCards: { component: number; data: number | null }[];
  setEnabledCards: (
    cards: { component: number; data: number | null }[]
  ) => void;
  index: number;
}

const ForecastGraphCardComponent = (
  props: IForecastGraphCardComponentProps
) => {
  const {
    data,
    numForecastDays,
    setNumForecastDays,
    dataField,
    suffix,
    prefix,
    enabledProviders,
    editing,
    enabledCards,
    setEnabledCards,
    index,
  } = props;
  const { theme } = useAuthContext();

  const { t, i18n } = useTranslation();

  // Create timestamp labels with each full hour for next 14 days
  const labels = Array.from(Array(numForecastDays * 24).keys()).map(
    (hour: number) => {
      const date = new Date();
      date.setHours(date.getHours() + hour);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    }
  );

  const options = {
    responsive: true,
    //maintainAspectRatio:false, test for mobile
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#f0f9ff",
          boxWidth: 20,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: "#f0f9ff",
          // insert suffix and prefix
          callback: function (val: any, index: number) {
            if (suffix) {
              return `${prefix ? prefix : ""} ${val.toFixed(1)} ${suffix}`;
            } else {
              return `${prefix ? prefix : ""} ${val.toFixed(1)} `;
            }
          },
        },
        grid: {
          color: "#f0f9ff",
        },
      },
      x: {
        ticks: {
          color: "#f0f9ff",
          callback: function (val: any, index: number) {
            // if first value OR first occurence of new day
            if (index == 0 || index % 24 == 0) {
              return labels[index].toLocaleDateString(i18n.language, {
                weekday: "short",
                day: "numeric",
                month: "numeric",
              });
            }
          },
        },
        grid: {
          color: "#f0f9ff",
        },
      },
    },
    elements: {
      point: {
        pointStyle: false as const,
      },
      line: {
        borderWidth: 2,
        spanGaps: true,
        cubicInterpolationMode: "monotone" as const,
      },
    },
  };

  const formatLabel = (label: Date) => {
    return `${label.getDate()}/${label.getMonth() + 1} ${label.getHours()}:00`;
  };
  const getChartData = () => {
    const smhiTS = data.smhiTS.sort(
      (a: any, b: any) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
    const owmTS = data.owmTS.sort(
      (a: any, b: any) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
    const waTS = data.waTS.sort(
      (a: any, b: any) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
    const avgTS = data.avgTS.sort(
      (a: any, b: any) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );

    // Loop through labels and add data to each label

    const chartData = labels.map((label: any) => {
      const smhi = smhiTS.find((forecast: any) => {
        return new Date(forecast.timeStamp).getTime() === label.getTime();
      });
      const owm = owmTS.find((forecast: any) => {
        return new Date(forecast.timeStamp).getTime() === label.getTime();
      });
      const wa = waTS.find((forecast: any) => {
        return new Date(forecast.timeStamp).getTime() === label.getTime();
      });
      const avg = avgTS.find((forecast: any) => {
        return new Date(forecast.timeStamp).getTime() === label.getTime();
      });
      return {
        label: label,
        smhi: smhi ? smhi[dataField] : null,
        owm: owm ? owm[dataField] : null,
        wa: wa ? wa[dataField] : null,
        avg: avg ? avg[dataField] : null,
      };
    });

    return {
      labels: labels.map((label: any) => {
        return formatLabel(label);
      }),
      datasets: [
        {
          label: "SMHI",
          data: enabledProviders.includes("SMHI")
            ? chartData.map((forecast: any) => {
                return forecast.smhi;
              })
            : [],
          borderColor: apiToColor["smhi"],
          backgroundColor: apiToColor["smhi"],
        },
        {
          label: "WA",
          data: enabledProviders.includes("WeatherAPI")
            ? chartData.map((forecast: any) => {
                return forecast.wa;
              })
            : [],
          borderColor: apiToColor["wa"],
          backgroundColor: apiToColor["wa"],
        },
        {
          label: "OWM",
          data: enabledProviders.includes("OpenWeatherMap")
            ? chartData.map((forecast: any) => {
                return forecast.owm;
              })
            : [],
          borderColor: apiToColor["owm"],
          backgroundColor: apiToColor["owm"],
        },
        {
          label: "Average",
          data: enabledProviders.includes("Average")
            ? chartData.map((forecast: any) => {
                return forecast.avg;
              })
            : [],
          borderColor: apiToColor["avg"],
          backgroundColor: apiToColor["avg"],
        },
      ],
    };
  };

  return (
    <div
      className={`bg-${theme}-800 w-full md:w-5/6 mx-2 md:mx-4 md:my-4 my-2 rounded-xl p-4 content-center flex flex-col justify-center`}>
      <div className="flex flex-col md:flex-row align-center md:align-between justify-center my-2 md:my-0 content-center pb-2">
        {editing ? (
          <>
            <div className="flex flex-col my-2 md:mx-2 self-center">
              <ListBoxSelectComponent
                rowIdx={index}
                setEnabledCards={setEnabledCards}
                isData={true}
                enabledCards={enabledCards}
              />
            </div>
            <div className="flex flex-col my-2 md:mx-2 self-center">
              <ListBoxSelectComponent
                rowIdx={index}
                setEnabledCards={setEnabledCards}
                isData={false}
                enabledCards={enabledCards}
              />
            </div>
          </>
        ) : (
          <p className={`text-${theme}-100 text-2xl self-center`}>
            {t(dataField)}
          </p>
        )}
        <div className="flex flex-col w-full md:w-1/4 m-2">
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
              className={`text-xs text-${theme}-100 absolute start-0 -bottom-4`}>
              1 {t("day")}
            </span>
            <span
              className={`text-xs text-${theme}-100 absolute end-0 -bottom-4`}>
              10 {t("days")}
            </span>
          </div>
        </div>
      </div>
      <Chart type="line" data={getChartData()} options={options} />
    </div>
  );
};

export default ForecastGraphCardComponent;
