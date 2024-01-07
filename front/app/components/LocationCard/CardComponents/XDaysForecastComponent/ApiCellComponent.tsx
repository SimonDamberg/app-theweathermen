import { providerToBorderColor } from "@/utils/colors";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";

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
  const { t, i18n } = useTranslation();
  const { theme } = useAuthContext();

  if (stats) {
    return (
      <div
        className={`md:text-base text-xs flex flex-col w-22 md:w-36 rounded-xl my-2 md:my-4 p-1 md:p-4 mx-1 md:mx-2 border-2 ${
          providerToBorderColor[provider.toLowerCase()]
        }`}>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col items-center mr-2 md:mr-4">
            <p>{t("lowShort").toUpperCase()}</p>
            <p>{stats?.minTemp.toFixed(0)}°C</p>
          </div>
          <div className="flex flex-col items-center">
            <p>{t("highShort").toUpperCase()}</p>
            <p>{stats?.maxTemp.toFixed(0)}°C</p>
          </div>
        </div>
        <div className={`border-b-2 border-${theme}-700 my-2`}></div>
        <div className="flex flex-row items-center">
          <div className="w-8 md:w-16 mr-2 md:mr-7">
            <Image
              src={`/images/weatherSymbols/${stats?.weatherSymbol}.png`}
              width={36}
              height={36}
              alt=""
              className=""
            />
          </div>
          <p>{stats?.totPrecip.toFixed(0)} mm</p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`flex flex-col rounded-xl p-2 mx-4 border-2 ${
          providerToBorderColor[provider.toLowerCase()]
        }`}>
        <p>{t("noData")}</p>
      </div>
    );
  }
};

export default ApiCellComponent;
