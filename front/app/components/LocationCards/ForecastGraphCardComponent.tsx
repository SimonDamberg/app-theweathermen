import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { apiToColor } from "@/app/utils/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface IForecastGraphCardComponentProps {
  data: any;
  numForecastDays: number;
  dataField: string;
  name: string;
  suffix?: string;
  prefix?: string;
  enabledProviders: string[];
}

const ForecastGraphCardComponent = (
  props: IForecastGraphCardComponentProps
) => {
  const { data, numForecastDays, dataField, name, suffix, prefix, enabledProviders } = props;

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
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#f0f9ff",
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
              return labels[index].toLocaleDateString("en-EN", {
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
      return {
        label: label,
        smhi: smhi ? smhi[dataField] : null,
        owm: owm ? owm[dataField] : null,
        wa: wa ? wa[dataField] : null,
      };
    });

    return {
      labels: labels.map((label: any) => {
        return formatLabel(label);
      }),
      datasets: [
        {
          label: "SMHI",
          data: enabledProviders.includes("SMHI") ? chartData.map((forecast: any) => {
            return forecast.smhi;
          }) : [],
          borderColor: apiToColor["smhi"],
          backgroundColor: apiToColor["smhi"],
        },
        {
          label: "WA",
          data: enabledProviders.includes("WeatherAPI") ? chartData.map((forecast: any) => {
            return forecast.wa;
          }) : [],
          borderColor: apiToColor["wa"],
          backgroundColor: apiToColor["wa"],
        },
        {
          label: "OWM",
          data: enabledProviders.includes("OpenWeatherMap") ? chartData.map((forecast: any) => {
            return forecast.owm;
          }) : [],
          borderColor: apiToColor["owm"],
          backgroundColor: apiToColor["owm"],
        },
      ],
    };
  };

  return (
    <div className="bg-sky-800 w-10/12 h-full rounded-xl p-4 content-center">
      <p className="text-sky-100 text-2xl">{name}</p>
      <Chart type="line" data={getChartData()} options={options} />
    </div>
  );
};

export default ForecastGraphCardComponent;
