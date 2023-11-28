import windDirectionFromDegrees from "@/utils/weather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { providerToBorderColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";

interface IWindCardComponentProps {
  windDirection: number;
  windSpeed: number;
  windGustSpeed: number;
  provider: string;
}

const WindCardComponent = (props: IWindCardComponentProps) => {
  const { windDirection, windSpeed, windGustSpeed, provider } = props;
  const { t, i18n } = useTranslation();
  const { theme } = useAuthContext();

  return (
    <div
      className={`flex flex-col bg-${theme}-800 rounded-xl p-4 mx-4 border-2 ${
        providerToBorderColor[provider.toLowerCase()]
      }`}>
      <div className="flex flex-row justify-center content-center">
        <p className={`text-${theme}-100 text-lg mx-2 self-center`}>
          {t(windDirectionFromDegrees(windDirection))}
        </p>
        <FontAwesomeIcon
          className="self-center"
          icon={faArrowUp}
          size={"lg"}
          style={{
            transform: `rotate(${180 + windDirection}deg)`,
            color: "#e0f2fe",
          }}
        />
        <p className={`text-${theme}-100 text-lg mx-2 self-center`}>
          <span className="font-bold">{windSpeed.toFixed(0)}</span> (
          {windGustSpeed.toFixed(0)}){" "}
          <span className="text-xs">{t("meterPerSecond")}</span>
        </p>
      </div>
    </div>
  );
};

export default WindCardComponent;
