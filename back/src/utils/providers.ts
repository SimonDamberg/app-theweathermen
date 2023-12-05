import { Types } from "mongoose";
import { ILocation } from "../schemas/location";
import { ITimeSeries, tsModel } from "../schemas/timeSeries";
import { parseOWMToTS, parseSMHIToTS, parseWAToTS } from "./parsing";

export const updateWeatherData = async (
  locationID: Types.ObjectId,
  lat: number,
  lon: number
) => {
  await tsModel.deleteMany({ locationId: locationID });

  // Fetch and parse data from SMHI API
  const smhiData = await getSMHIData(lat, lon);
  const parsedSMHI: ITimeSeries[] = parseSMHIToTS(smhiData, locationID);
  parsedSMHI.forEach(async (data) => {
    const ts = new tsModel(data);
    await ts.save();
  });

  // Fetch data from OpenWeatherMapAPI
  const owmData = await getOWMData(lat, lon);
  // Parse data from OpenWeatherMap API
  const parsedOWM: ITimeSeries[] = parseOWMToTS(owmData, locationID);
  parsedOWM.forEach(async (data) => {
    const ts = new tsModel(data);
    await ts.save();
  });

  // Fetch data from WeatherAPI
  const waData = await getWAData(lat, lon);
  // Parse data from WeatherAPI
  const parsedWA: ITimeSeries[] = parseWAToTS(waData, locationID);
  parsedWA.forEach(async (data) => {
    const ts = new tsModel(data);
    await ts.save();
  });
};

export const getSMHIData = async (lat: number, lon: number) => {
  console.log("Fetching data from SMHI API");
  const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;
  console.log(smhiURL);
  const smhiResp = await fetch(smhiURL);
  const smhiData = await smhiResp.json();
  return smhiData;
};

export const getOWMData = async (lat: number, lon: number) => {
  console.log("Fetching data from OpenWeatherMap API");
  const owmURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
  const owmResp = await fetch(owmURL);
  const owmData = await owmResp.json();
  return owmData;
};

export const getWAData = async (lat: number, lon: number) => {
  console.log("Fetching data from WeatherAPI");
  const waURL = `https://api.weatherapi.com/v1/forecast.json?q=${lat},${lon}&days=14&key=${process.env.WEATHERAPI_API_KEY}`;
  const waResp = await fetch(waURL);
  const waData = await waResp.json();
  return waData;
};
