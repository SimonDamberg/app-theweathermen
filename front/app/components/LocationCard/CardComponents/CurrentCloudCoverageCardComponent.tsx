import React from "react";
import Image from "next/image";
import { providerToBorderColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";

interface ICurrentCloudCoverageCardProps {
  coverage: number;
  provider: string;
}

const CurrentCloudCoverageCard = (props: ICurrentCloudCoverageCardProps) => {
  const { coverage, provider } = props;
  const { t, i18n } = useTranslation();
  const { theme } = useAuthContext();

  return (
    <div
      className={`flex flex-col bg-${theme}-800 rounded-xl p-4 mx-4 border-2 ${
        providerToBorderColor[provider.toLowerCase()]
      }`}>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center">
          <Image
            src={`/images/weatherSymbols/3.png`}
            width={32}
            height={32}
            alt=""
          />
        </div>
        <p className={`text-${theme}-100 text-2xl mx-2`}>
          {coverage.toLocaleString(i18n.language, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }) + " %"}
        </p>
      </div>
    </div>
  );
};

export default CurrentCloudCoverageCard;
