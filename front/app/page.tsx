"use client";

import CircleButtonComponent from "./components/CircleButtonComponent";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import LocationComponent from "./components/LocationComponent";
import { useEffect, useState } from "react";

interface IsmhiTS {
  locationId: String
  timeStamp: Date
  lastUpdated: Date
  airPressure: Number
  airTemperature: Number
  horizontalVisibility: Number
  windDirection: Number
  windSpeed: Number
  windGustSpeed: Number
  relativeHumidity: Number
  thunderProbability: Number
  totalCloudCover: Number
  minPrecipitationIntensity: Number
  meanPrecipitationIntensity: Number
  maxPrecipitationIntensity: Number
  precipitationCategory: Number
  frozenPrecipitationFraction: Number
  weatherSymbol: Number
};

interface ILocationData {
  _id: String
  name: String
  lat: Number
  lon: Number
  smhiTS: IsmhiTS[]
  owmTS: any[]
  waTS: any[]
}

// import Image from "next/image";
// import { useEffect, useState } from "react";

// Logic and styling for main page

export default function Home() {

  const [locations, setLocations] = useState(["uppsala", "kiruna", "västerås"]);
  const [locationData, setLocationData] = useState<ILocationData[]>([]);

  useEffect(() => {

    let locData: ILocationData[] = [];
    // Loop through all locations and fetch data for each
    locations.forEach((location) => {
      fetch(`http://localhost:8000/location/${location}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          locData.push(data)
        });
    });
    setLocationData(locData);
  }, [locations]);

  console.log(locations);
  console.log(locationData);

  return (
    <>
      {locationData.length > 0 &&
        <div className="grid grid-rows-2 grid-flow-col gap-16 m-16">
          <div className="row-span-1">
            <LocationComponent data={locationData[0]} />
          </div>
          <LocationComponent data={locationData[1]} />
          <LocationComponent data={locationData[2]} />
        </div >}
      <div className="fixed right-0 bottom-0 flex flex-row">
        <div className="-mr-8">
          <CircleButtonComponent icon={faPen} onClick={() => null} />
        </div>
        <CircleButtonComponent icon={faPlus} onClick={() => null} />
      </div>
    </>
  );
}
