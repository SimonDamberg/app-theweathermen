import React from "react";
import { providerToBorderColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";
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
        <p className={`text-${theme}-100 text-2xl mx-2 self-center`}>
          <span>
            {airHumidity.toLocaleString(i18n.language, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </span>
          <span className="text-lg">{t("%")}</span>
        </p>
      </div>
    </div>
  );
};

export default AirHumidityComponent;
