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
import { ITrackedCard } from "@/utils/location";
import { apiPOST } from "@/utils/requestWrapper";

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
  const { user, theme, trackedCards, setTrackedCards } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      console.log(user);
    }
  }, [user, router]);

  const updateTrackedCards = (newTrackedCards: ITrackedCard[]) => {
    // save to db
    apiPOST(`/user/tracked_cards`, {
      fb_id: user?.uid,
      tracked_cards: newTrackedCards,
    })
      .then((res) => {
        console.log(res);
        setTrackedCards(newTrackedCards);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(trackedCards);

  return (
    <div className={`bg-${theme}-950 ${lexend.className} h-screen`}>
      <NavbarComponent />
      <div className="grid grid-rows-1 grid-flow-col gap-16 mx-16">
        {trackedCards.map((card) => (
          <div key={card.location_id}>
            <LocationCard
              locationID={card.location_id}
              enabledComponents={card.card_components}
              setEnabledComponents={(components) => {
                const newTrackedCards = [...trackedCards];
                const cardIndex = newTrackedCards.findIndex(
                  (c) => c.location_id === card.location_id
                );
                newTrackedCards[cardIndex].card_components = components;
                updateTrackedCards(newTrackedCards);
              }}
            />
          </div>
        ))}
      </div>
      <div className="fixed right-0 bottom-0 flex flex-row">
        <div className="-mr-8">
          <CircleButtonComponent
            className={`bg-${theme}-600 w-16 h-16 m-6 text-${theme}-100`}
            icon={faPen}
            onClick={() => null}
          />
        </div>
        <CircleButtonComponent
          className={`bg-${theme}-600 w-16 h-16 m-6 text-${theme}-100`}
          icon={faPlus}
          onClick={() => null}
        />
      </div>
    </div>
  );
}
