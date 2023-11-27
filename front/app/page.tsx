"use client";

import CircleButtonComponent from "./components/CircleButtonComponent";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import LocationCard from "./components/LocationCard/LocationCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import React from "react";
import "./i18n";
import { Lexend } from "next/font/google";
import NavbarComponent from "./components/NavbarComponent";

const lexend = Lexend({ subsets: ["latin"] });

interface IsmhiTS {
  locationId: String;
  timeStamp: Date;
  lastUpdated: Date;
  airPressure: Number;
  airTemperature: Number;
  horizontalVisibility: Number;
  windDirection: Number;
  windSpeed: Number;
  windGustSpeed: Number;
  relativeHumidity: Number;
  thunderProbability: Number;
  totalCloudCover: Number;
  minPrecipitationIntensity: Number;
  meanPrecipitationIntensity: Number;
  maxPrecipitationIntensity: Number;
  precipitationCategory: Number;
  frozenPrecipitationFraction: Number;
  weatherSymbol: Number;
}

interface ILocationData {
  _id: String;
  name: String;
  lat: Number;
  lon: Number;
  smhiTS: IsmhiTS[];
  owmTS: any[];
  waTS: any[];
}

export default function Home() {
  const [locationData, setLocationData] = useState<ILocationData[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const { t, i18n } = useTranslation();
  const [colour, setColour] = React.useState("slate");

  useEffect(() => {
    // Loop through all locations and fetch data for each
    fetch(`http://localhost:8000/location/weather`)
      .then((response) => response.json())
      .then((data) => {
        setLocationData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <body className={`bg-${colour}-950 ${lexend.className}`}>
        <NavbarComponent colour={colour} setColour={setColour} />
        <div className="h-screen flex items-center justify-center">
          <svg
            aria-hidden="true"
            className={`w-12 h-12 animate-spin text-sky-100 fill-${colour}-700 text-center`}
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only " suppressHydrationWarning>
            {t("loading")}...
          </span>
        </div>
      </body>
    );
  } else {
    return (
      <body className={`bg-${colour}-950 ${lexend.className}`}>
        <NavbarComponent colour={colour} setColour={setColour} />
        <div className="grid grid-rows-2 grid-flow-col gap-16 mx-16">
          <div className="row-span-2">
            <LocationCard data={locationData[1]} colour={colour} />
          </div>
          <div>
            <LocationCard data={locationData[2]} colour={colour} />
            <LocationCard data={locationData[0]} colour={colour} />
          </div>
          {/* <div>
            <LocationCard data={locationData[2]} />
          </div> */}
        </div>
        <div className="fixed right-0 bottom-0 flex flex-row">
          <div className="-mr-8">
            <CircleButtonComponent
              className={`bg-${colour}-600 w-16 h-16 m-6 text-${colour}-100`}
              icon={faPen}
              onClick={() => null}
            />
          </div>
          <CircleButtonComponent
            className={`bg-${colour}-600 w-16 h-16 m-6 text-${colour}-100`}
            icon={faPlus}
            onClick={() => null}
          />
        </div>
      </body>
    );
  }
}
