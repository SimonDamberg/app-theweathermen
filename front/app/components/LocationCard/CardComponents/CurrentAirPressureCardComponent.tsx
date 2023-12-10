import React from "react";
import { providerToBorderColor } from "@/utils/colors";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/AuthContext";

interface ICurrentAirPressureCardProps {
    airPressure: number;
    provider: string;
}

const CurrentPrecipitationCard = (props: ICurrentAirPressureCardProps) => {
    const { airPressure, provider } = props;
    const { theme } = useAuthContext();

    return (
        <div
            className={`flex flex-col bg-${theme}-800 rounded-xl p-4 mx-4 border-2 ${providerToBorderColor[provider.toLowerCase()]
                }`}>
            <div className="flex flex-row justify-center">
                <p className={`text-${theme}-100 text-2xl mx-2`}>
                    {airPressure.toString() + " hPa"}
                </p>
                <div className="flex flex-col justify-center">
                </div>
            </div>
        </div>
    );
};

export default CurrentPrecipitationCard;
