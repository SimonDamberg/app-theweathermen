import windDirectionFromDegrees from "@/utils/weather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { providerToBorderColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";
import { faTint } from "@fortawesome/free-solid-svg-icons";
import { WiHumidity } from "react-icons/wi";

interface IAirHumidityComponentProps {
  airHumidity: number;
  provider: string;
}

const AirHumidityComponent = (props: IAirHumidityComponentProps) => {
  const { airHumidity, provider } = props;
  const { t, i18n } = useTranslation();
  const { theme } = useAuthContext();

  return (
    <div
      className={`flex flex-col bg-${theme}-800 rounded-xl p-4 mx-4 border-2 ${
        providerToBorderColor[provider.toLowerCase()]
      }`}>
      <div className="flex flex-row justify-center content-center">
      <div className="self-center text-white text-3xl">
        <WiHumidity />
      </div>
        <p className={`text-${theme}-100 text-lg mx-2 self-center`}>
          <span className="font-bold">{airHumidity}</span>
          <span className="text-xs">{t("%")}</span>
        </p>
      </div>
    </div>
  );
};

export default AirHumidityComponent;
