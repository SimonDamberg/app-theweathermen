import { owmTSType } from "../schemas/owmTimeSeries";
import { smhiTSType } from "../schemas/smhiTimeSeries";

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

// Parse OWM request to OWMTimeSeries object
const parseOWMToTS = (data: IOWMResponse, locID: string): owmTSType[] => {
    console.log(data);
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

export { parseSMHIToTS, parseOWMToTS };