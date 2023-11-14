import { owmTSType } from "../schemas/owmTimeSeries";
import { smhiTSType } from "../schemas/smhiTimeSeries";
import { waTSType } from "../schemas/waTimeSeries";

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
    day: any // irrelevant atm
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

const parseWAToTS = (data: IWAResponse, locID: string): waTSType[] => {
    // For each forecastday, loop through each hour
    const parsed: waTSType[] = data.forecast.forecastday.map((day) => {
        const parsedDay: waTSType[] = day.hour.map((hour) => {
            const parsedHour: waTSType = {
                locationId: locID,
                timeStamp: new Date(hour.time_epoch * 1000),
                lastUpdated: new Date(),
                airPressure: hour.pressure_mb,
                airTemperature: hour.temp_c,
                horizontalVisibility: hour.vis_km,
                windDirection: hour.wind_degree,
                windSpeed: hour.wind_kph,
                windGustSpeed: hour.gust_kph,
                relativeHumidity: hour.humidity,
                totalCloudCover: hour.cloud,
                meanPrecipitationIntensity: hour.precip_mm,
                weatherSymbol: hour.condition.code,
                //sunrise: new Date(day.astro.sunrise), is in local time of location (not UTC) in format 07:43 AM
                //sunset: new Date(day.astro.sunset),
            };
            return parsedHour;
        });
        return parsedDay;
    }).flat();
    return parsed;
}

// Parse OWM request to OWMTimeSeries object
const parseOWMToTS = (data: IOWMResponse, locID: string): owmTSType[] => {
    const parsed: owmTSType[] = data.list.map((ts) => {
        const parsedTS: owmTSType = {
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
            weatherSymbol: ts.weather[0].id,
            meanPrecipitationIntensity: ts.rain ? ts.rain["3h"] : ts.snow ? ts.snow["3h"] : 0,
            sunrise: new Date(data.city.sunrise * 1000),
            sunset: new Date(data.city.sunset * 1000),
        };
        return parsedTS;
    })
    return parsed;
}

// Parse SMHI request to SMHITimeSeries object
const parseSMHIToTS = (data: ISMHIResponse, locID: string): smhiTSType[] => {
    // For each timeSeries in data.timeSeries, create a new smhiType object
    const parsed: smhiTSType[] = data.timeSeries.map((ts) => {
        // Create a new smhiType object
        const parsedTS: smhiTSType = {
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
                    parsedTS.totalCloudCover = param.values[0];
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
                    parsedTS.weatherSymbol = param.values[0];
                    break;
            }
        });
        return parsedTS;
    })
    return parsed;
}

export { parseSMHIToTS, parseOWMToTS, parseWAToTS };