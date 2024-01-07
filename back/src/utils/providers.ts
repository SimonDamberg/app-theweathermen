import { Types } from "mongoose";
import { ITimeSeries, tsModel } from "../schemas/timeSeries";
import {
  IOWMResponse,
  ISMHIResponse,
  IWAResponse,
  parseAvgToTS,
  parseOWMToTS,
  parseSMHIToTS,
  parseWAToTS,
} from "./parsing";
import axios from "axios";

export const updateWeatherData = async (
  locationID: Types.ObjectId,
  lat: number,
  lon: number
) => {
  await tsModel.deleteMany({ locationId: locationID });

  let parsedSMHI: ITimeSeries[] = [];
  let parsedOWM: ITimeSeries[] = [];
  let parsedWA: ITimeSeries[] = [];

  // Fetch and parse data from SMHI API
  try {
    const smhiData = await getSMHIData(lat, lon);
    parsedSMHI = parseSMHIToTS(smhiData, locationID);
    parsedSMHI.forEach(async (data) => {
      const ts = new tsModel(data);
      await ts.save();
    });
  } catch (err) {
    console.log(`Error fetching data from SMHI API: ${err}`);
  }

  // Fetch data from OpenWeatherMapAPI
  try {
    const owmData = await getOWMData(lat, lon);
    // Parse data from OpenWeatherMap API
    parsedOWM = parseOWMToTS(owmData, locationID);
    parsedOWM.forEach(async (data) => {
      const ts = new tsModel(data);
      await ts.save();
    });
  } catch (err) {
    console.log(`Error fetching data from OpenWeatherMap API: ${err}`);
  }

  // Fetch data from WeatherAPI
  try {
    const waData = await getWAData(lat, lon);
    // Parse data from WeatherAPI
    parsedWA = parseWAToTS(waData, locationID);
    parsedWA.forEach(async (data) => {
      const ts = new tsModel(data);
      await ts.save();
    });
  } catch (err) {
    console.log(`Error fetching data from WeatherAPI: ${err}`);
  }

  console.log("Average data");
  const parsedAvg: ITimeSeries[] = parseAvgToTS(
    parsedSMHI,
    parsedOWM,
    parsedWA,
    locationID
  );
  parsedAvg.forEach(async (data) => {
    const ts = new tsModel(data);
    await ts.save();
  });
};

export const getSMHIData = async (lat: number, lon: number) => {
  console.log("Fetching data from SMHI API");
  const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;
  console.log(smhiURL);
  const smhiResp = await axios.get(smhiURL);
  const smhiData: ISMHIResponse = smhiResp.data;
  return smhiData;
};

export const getOWMData = async (lat: number, lon: number) => {
  console.log("Fetching data from OpenWeatherMap API");
  const owmURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
  const owmResp = await axios.get(owmURL);
  const owmData: IOWMResponse = owmResp.data;
  return owmData;
};

export const getWAData = async (lat: number, lon: number) => {
  console.log("Fetching data from WeatherAPI");
  const waURL = `https://api.weatherapi.com/v1/forecast.json?q=${lat},${lon}&days=14&key=${process.env.WEATHERAPI_API_KEY}`;
  const waResp = await axios.get(waURL);
  const waData: IWAResponse = waResp.data;
  return waData;
};
