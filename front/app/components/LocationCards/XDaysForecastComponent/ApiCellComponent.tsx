import { providerToBorderColor } from "@/app/utils/colors";
import Image from "next/image";

export interface IDailyStats {
  minTemp: number;
  maxTemp: number;
  weatherSymbol: number;
  totPrecip: number;
}

interface IApiCellComponentProps {
  stats: IDailyStats | null;
  provider: string;
}

const ApiCellComponent = (props: IApiCellComponentProps) => {
  const { stats, provider } = props;
  if (stats) {
    return (
      <div
        className={`flex flex-col rounded-xl my-4 p-2 mx-2 border-2 ${
          providerToBorderColor[provider.toLowerCase()]
        }`}>
        <div className="flex flex-row">
          <div className="flex flex-col items-center mr-4">
            <p>L</p>
            <p>{stats?.minTemp.toFixed(1)}°C</p>
          </div>
          <div className="flex flex-col items-center">
            <p>H</p>
            <p>{stats?.maxTemp.toFixed(1)}°C</p>
          </div>
        </div>
        <div className="border-b-2 border-sky-700 my-2"></div>
        <div className="flex flex-row items-center">
          <Image
            src={`/images/weatherSymbols/${stats?.weatherSymbol}.png`}
            width={36}
            height={36}
            alt=""
            className="mr-7"
          />
          <p>{stats?.totPrecip.toFixed(1)} mm</p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`flex flex-col rounded-xl p-2 mx-4 border-2 ${
          providerToBorderColor[provider.toLowerCase()]
        }`}>
        <p>No data</p>
      </div>
    );
  }
};

export default ApiCellComponent;
