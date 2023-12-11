import React from "react";
import Image from "next/image";
import { providerToBorderColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";

interface ICurrentPrecipitationCardProps {
  precipitation: number;
  provider: string;
}

const CurrentPrecipitationCard = (props: ICurrentPrecipitationCardProps) => {
  const { precipitation, provider } = props;
  const { theme } = useAuthContext();
  const { t, i18n } = useTranslation();
  return (
    <div
      className={`flex flex-col bg-${theme}-800 rounded-xl p-4 mx-4 border-2 ${
        providerToBorderColor[provider.toLowerCase()]
      }`}>
      <div className="flex flex-row justify-center">
        <p className={`text-${theme}-100 text-2xl mx-2`}>
          {precipitation.toLocaleString(i18n.language, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }) + " mm"}
        </p>
      </div>
    </div>
  );
};

export default CurrentPrecipitationCard;
