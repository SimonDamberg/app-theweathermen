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
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SpinnerComponent from "./components/SpinnerComponent";

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

  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      console.log(user);
    }
  }, [user]);

  useEffect(() => {
    // Loop through all locations and fetch data for each
    if (user) {
      fetch(`http://localhost:8000/location/weather`)
        .then((response) => response.json())
        .then((data) => {
          setLocationData(data);
        });
    }
  }, [user]);

  return (
    <div className={`bg-${colour}-950 ${lexend.className}`}>
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
    </div>
  );
}
