import { tsType } from "../schemas/timeSeries";

export interface IDailyStats {
  minTemp: number;
  maxTemp: number;
  weatherSymbol: number;
  totPrecip: number;
}

export const getDailyStats = (ts: tsType[]): IDailyStats => {
  let minTemp = Number.MAX_SAFE_INTEGER;
  let maxTemp = Number.MIN_SAFE_INTEGER;
  let totPrecip = 0;
  let weatherSymbol = ts[Math.floor(ts.length / 2)].weatherSymbol;
  ts.forEach((t) => {
    if (t.airTemperature < minTemp) {
      minTemp = t.airTemperature;
    }
    if (t.airTemperature > maxTemp) {
      maxTemp = t.airTemperature;
    }
    totPrecip += t.meanPrecipitationIntensity;
  });

  return { minTemp, maxTemp, totPrecip, weatherSymbol };
};
