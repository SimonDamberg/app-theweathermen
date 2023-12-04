import { Schema, Types } from "mongoose";
import { ITimeSeries } from "../schemas/timeSeries";

export interface ISMHIResponse {
  approvedTime: string;
  referenceTime: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  timeSeries: ISMHITimeSeriesResponse[];
}

export interface ISMHITimeSeriesResponse {
  validTime: string;
  parameters: {
    name: string;
    levelType: string;
    level: number;
    values: number[];
  }[];
}

export interface IOWMResponse {
  cod: string;
  message: number;
  cnt: number;
  list: IOWMTimeSeriesResponse[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface IOWMTimeSeriesResponse {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
  rain?: {
    "3h": number;
  };
  snow?: {
    "3h": number;
  };
}

export interface IWAResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: any; // irrelevant atm
  forecast: {
    forecastday: IWAForecastDayResponse[];
  };
}

export interface IWAForecastDayResponse {
  date: string;
  date_epoch: number;
  day: any; // irrelevant atm
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
  };
  hour: IWAHourResponse[];
}

export interface IWAHourResponse {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

const parseWaWeatherSymbol = (code: number): number => {
  if (code === 1000) return 1;
  if (code === 1003) return 2;
  if (code === 1006) return 3;
  if (code === 1009) return 4;
  if (code === 1030 || code === 1135 || code === 1147) return 5;
  if (code === 1063 || code === 1180 || code === 1186 || code === 1240)
    return 6;
  if (code === 1066 || code === 1210 || code === 1216 || code === 1255)
    return 7;
  if (code === 1069 || code === 1249) return 8;
  if (
    code === 1087 ||
    code === 1273 ||
    code === 1276 ||
    code === 1276 ||
    code === 1282
  )
    return 9;
  if (code === 1150 || code === 1153 || code === 1183 || code === 1189)
    return 10;
  if (code === 1192 || code === 1243) return 11;
  if (code === 1195) return 12;
  if (
    code === 1072 ||
    code === 1168 ||
    code === 1171 ||
    code === 1198 ||
    code === 1201 ||
    code === 1204 ||
    code === 1207
  )
    return 13;
  if (code === 1114 || code === 1219 || code === 1213) return 14;
  if (code === 1222 || code === 1258) return 15;
  if (code === 1117 || code === 1225) return 16;
  if (code === 1237 || code === 1261 || code === 1264) return 17;
  if (code === 1246) return 18;
  if (code === 1252) return 19;
  return 0;
};

const parseWaSunriseSunset = (time: string): Date => {
  const hour = parseInt(time.substring(0, 2));
  const minute = parseInt(time.substring(3, 5));
  const ampm = time.substring(6, 8);
  const date = new Date();
  if (ampm === "AM") {
    date.setHours(hour);
  } else {
    date.setHours(hour + 12);
  }
  date.setMinutes(minute);
  date.setSeconds(0);
  return date;
};

const parseWAToTS = (
  data: IWAResponse,
  locID: Types.ObjectId
): ITimeSeries[] => {
  // For each forecastday, loop through each hour
  const parsed: ITimeSeries[] = data.forecast.forecastday
    .map((day) => {
      const parsedDay: ITimeSeries[] = day.hour.map((hour) => {
        const parsedHour: ITimeSeries = {
          locationId: locID,
          timeStamp: new Date(hour.time_epoch * 1000),
          lastUpdated: new Date(),
          airPressure: hour.pressure_mb,
          airTemperature: hour.temp_c,
          horizontalVisibility: hour.vis_km,
          windDirection: hour.wind_degree,
          windSpeed: hour.wind_kph / 3.6, // Convert from km/h to m/s
          windGustSpeed: hour.gust_kph / 3.6, // Convert from km/h to m/s
          relativeHumidity: hour.humidity,
          totalCloudCover: hour.cloud,
          meanPrecipitationIntensity: hour.precip_mm,
          precipitationCategory: parseWAPrecipitationCategory(
            hour.condition.code
          ),
          weatherSymbol: parseWaWeatherSymbol(hour.condition.code),
          sunrise: parseWaSunriseSunset(day.astro.sunrise),
          sunset: parseWaSunriseSunset(day.astro.sunset),
          source: "wa",
        };
        return parsedHour;
      });
      return parsedDay;
    })
    .flat();
  return parsed;
};

const parseOwmWeatherSymbol = (code: number): number => {
  if (code === 800) return 1;
  if (code === 801 || code === 802) return 2;
  if (code === 803) return 3;
  if (code === 804) return 4;
  if (
    code === 701 ||
    code === 711 ||
    code === 721 ||
    code === 731 ||
    code === 741 ||
    code === 751 ||
    code === 761 ||
    code === 762 ||
    code === 771 ||
    code === 781
  )
    return 5;
  if (code === 520) return 6;
  if (code === 620) return 7;
  if (code === 612) return 8;
  if (
    code === 200 ||
    code === 201 ||
    code === 202 ||
    code === 210 ||
    code === 211 ||
    code === 212 ||
    code === 221 ||
    code === 230 ||
    code === 231 ||
    code === 232
  )
    return 9;
  if (
    code === 300 ||
    code === 301 ||
    code === 310 ||
    code === 311 ||
    code === 500 ||
    code === 501
  )
    return 10;
  if (code === 313 || code === 521) return 11;
  if (
    code === 302 ||
    code === 312 ||
    code === 502 ||
    code === 503 ||
    code === 504
  )
    return 12;
  if (code === 511 || code === 611 || code === 615 || code === 616) return 13;
  if (code === 600 || code === 601) return 14;
  if (code === 621 || code === 622) return 15;
  if (code === 602) return 16;
  // No 17
  if (code === 314 || code === 522 || code === 531) return 18;
  if (code === 613) return 19;
  return 0;
};

const parseOWMPrecipitationCategory = (code: number): number => {
  if (
    code == 600 ||
    code == 601 ||
    code == 602 ||
    code == 620 ||
    code == 621 ||
    code == 622
  )
    return 1;
  if (code == 611 || code == 612 || code == 613 || code == 615 || code == 616)
    return 2;
  if (
    code == 200 ||
    code == 201 ||
    code == 202 ||
    (("" + code)[0] == "5" && code != 511)
  )
    return 3;
  if (("" + code)[0] == "3" || code == 230 || code == 231 || code == 232)
    return 4;
  if (code == 511) return 5;
  // No 6
  return 0;
};

const parseWAPrecipitationCategory = (code: number): number => {
  if (
    code == 1066 ||
    code == 1114 ||
    code == 1117 ||
    code == 1210 ||
    code == 1213 ||
    code == 1216 ||
    code == 1219 ||
    code == 1222 ||
    code == 1225 ||
    code == 1237 ||
    code == 1255 ||
    code == 1258 ||
    code == 1261 ||
    code == 1264 ||
    code == 1279 ||
    code == 1282
  )
    return 1;
  if (
    code == 1069 ||
    code == 1204 ||
    code == 1207 ||
    code == 1249 ||
    code == 1252
  )
    return 2;
  if (
    code == 1063 ||
    code == 1180 ||
    code == 1183 ||
    code == 1186 ||
    code == 1189 ||
    code == 1192 ||
    code == 1195 ||
    code == 1240 ||
    code == 1243 ||
    code == 1246 ||
    code == 1273 ||
    code == 1276
  )
    return 3;
  if (code == 1150 || code == 1153) return 4;
  if (code == 1198 || code == 1201) return 5;
  if (code == 1072 || code == 1168 || code == 1171) return 6;
  return 0;
};

// Parse OWM request to OWMTimeSeries object
const parseOWMToTS = (
  data: IOWMResponse,
  locID: Types.ObjectId
): ITimeSeries[] => {
  const parsed: ITimeSeries[] = data.list.map((ts) => {
    const parsedTS: ITimeSeries = {
      locationId: locID,
      timeStamp: new Date(ts.dt_txt),
      lastUpdated: new Date(),
      airPressure: ts.main.pressure,
      airTemperature: ts.main.temp,
      horizontalVisibility: ts.visibility,
      windDirection: ts.wind.deg,
      windSpeed: ts.wind.speed,
      windGustSpeed: ts.wind.gust,
      relativeHumidity: ts.main.humidity,
      totalCloudCover: ts.clouds.all,
      weatherSymbol: parseOwmWeatherSymbol(ts.weather[0].id),
      meanPrecipitationIntensity: ts.rain
        ? ts.rain["3h"]
        : ts.snow
        ? ts.snow["3h"]
        : 0,
      precipitationCategory: parseOWMPrecipitationCategory(ts.weather[0].id),
      sunrise: new Date((data.city.sunrise + data.city.timezone) * 1000), // In local time
      sunset: new Date((data.city.sunset + data.city.timezone) * 1000), // In local time
      source: "owm",
    };
    return parsedTS;
  });
  return parsed;
};

const parseSmhiWeatherSymbol = (code: number): number => {
  if (code === 1) return 1;
  if (code === 2 || code === 3 || code === 4) return 2;
  if (code === 5) return 3;
  if (code === 6) return 4;
  if (code === 7) return 5;
  if (code === 8) return 6;
  if (code === 15) return 7;
  if (code === 12) return 8;
  if (code === 11 || code === 21) return 9;
  if (code === 18 || code === 19) return 10;
  if (code === 9) return 11;
  if (code === 20) return 12;
  if (code === 22 || code === 23 || code === 24) return 13;
  if (code === 25 || code === 26) return 14;
  if (code === 16 || code === 17) return 15;
  if (code === 27) return 16;
  //No 17
  if (code === 10) return 18;
  if (code === 13 || code === 14) return 19;
  return 0;
};

// Parse SMHI request to SMHITimeSeries object
const parseSMHIToTS = (
  data: ISMHIResponse,
  locID: Types.ObjectId
): ITimeSeries[] => {
  // For each timeSeries in data.timeSeries, create a new smhiType object
  const parsed: ITimeSeries[] = data.timeSeries.map((ts) => {
    // Create a new smhiType object
    const parsedTS: ITimeSeries = {
      locationId: locID,
      timeStamp: new Date(ts.validTime),
      lastUpdated: new Date(data.referenceTime),
      airPressure: 0,
      airTemperature: 0,
      horizontalVisibility: 0,
      windDirection: 0,
      windSpeed: 0,
      windGustSpeed: 0,
      relativeHumidity: 0,
      thunderProbability: 0,
      totalCloudCover: 0,
      minPrecipitationIntensity: 0,
      meanPrecipitationIntensity: 0,
      maxPrecipitationIntensity: 0,
      precipitationCategory: 0,
      frozenPrecipitationFraction: 0,
      weatherSymbol: 0,
      source: "smhi",
    };

    // For each parameter in ts.parameters, add the value to the parsedTS object
    ts.parameters.forEach((param) => {
      switch (param.name) {
        case "msl":
          parsedTS.airPressure = param.values[0];
          break;
        case "t":
          parsedTS.airTemperature = param.values[0];
          break;
        case "vis":
          parsedTS.horizontalVisibility = param.values[0];
          break;
        case "wd":
          parsedTS.windDirection = param.values[0];
          break;
        case "ws":
          parsedTS.windSpeed = param.values[0];
          break;
        case "gust":
          parsedTS.windGustSpeed = param.values[0];
          break;
        case "r":
          parsedTS.relativeHumidity = param.values[0];
          break;
        case "tstm":
          parsedTS.thunderProbability = param.values[0];
          break;
        case "tcc_mean":
          parsedTS.totalCloudCover = param.values[0] * 12.5; // Convert from okta to % cloud cover
          break;
        case "pmin":
          parsedTS.minPrecipitationIntensity = param.values[0];
          break;
        case "pmean":
          parsedTS.meanPrecipitationIntensity = param.values[0];
          break;
        case "pmax":
          parsedTS.maxPrecipitationIntensity = param.values[0];
          break;
        case "pcat":
          parsedTS.precipitationCategory = param.values[0];
          break;
        case "spp":
          parsedTS.frozenPrecipitationFraction = param.values[0];
          break;
        case "Wsymb2":
          parsedTS.weatherSymbol = parseSmhiWeatherSymbol(param.values[0]);
          break;
      }
    });
    return parsedTS;
  });
  return parsed;
};

export { parseSMHIToTS, parseOWMToTS, parseWAToTS };
