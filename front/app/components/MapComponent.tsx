import React from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
import { useAuthContext } from "@/context/AuthContext";
import { t } from "i18next";

interface IMapComponentProps {
  setLocationName: (locationName: string) => void;
  setLocationAdress: (locationAdress: string) => void;
}

const MapComponent = (props: IMapComponentProps) => {
  const { setLocationName, setLocationAdress } = props;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_API_KEY!,
    libraries: ["places"],
  });

  const { theme } = useAuthContext();
  const [searchBox, setSearchbox] = React.useState<any>(null);

  const onLoad = (ref) => setSearchbox(ref);

  const onPlacesChanged = () => {
    console.log(searchBox.getPlaces());
    setLocationAdress(searchBox.getPlaces()[0].formatted_address);
    setLocationName(searchBox.getPlaces()[0].name);
  };

  return isLoaded ? (
    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
      <div className="mx-auto w-full mt-4">
        <div className="flex flex-col">
          <label
            htmlFor="locationName"
            className={`text-md font-medium text-${theme}-100`}>
            {t("location")}
          </label>
          <input
            type="text"
            placeholder=""
            className={`mt-2 p-1 block w-full border-${theme}-300 rounded-md bg-${theme}-500 text-${theme}-100 focus:outline-none`}
          />
        </div>
      </div>
    </StandaloneSearchBox>
  ) : (
    <></>
  );
};

export default React.memo(MapComponent);
