export const componentTypes = [
  { name: "graph", id: 0 },
  { name: "todayWeather", id: 1 },
  { name: "forecastTable", id: 2 },
];

export const dataTypes = [
  { name: "airTemperature", id: 0 },
  { name: "windSpeed", id: 1 },
  { name: "meanPrecipitationIntensity", id: 2 },
  { name: "airPressure", id: 3 },
  { name: "horizontalVisibility", id: 4 },
  { name: "relativeHumidity", id: 5 },
  { name: "totalCloudCover", id: 6 },
];

export interface ITrackedCard {
  location_id: string;
  card_components: Array<ICardComponent>;
}

export interface ICardComponent {
  component: number;
  data: number | null;
}

export const dataToSuffix: { [key: string]: string } = {
  airTemperature: "°C",
  windSpeed: "m/s",
  meanPrecipitationIntensity: "mm",
  airPressure: "hPa",
  horizontalVisibility: "km",
  relativeHumidity: "%",
  totalCloudCover: "%",
};

export const providerToTS: { [key: string]: string } = {
  SMHI: "smhiTS",
  WeatherAPI: "waTS",
  OpenWeatherMap: "owmTS",
  Average: "avgTS",
};
