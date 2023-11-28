import express, { Router, Request, Response, NextFunction } from "express";
import { Location, LocationType } from "../schemas/location";
import { parseSMHIToTS, parseOWMToTS, parseWAToTS } from "../utils/parsing";
import { tsModel, tsType } from "../schemas/timeSeries";
import { getDailyStats, IDailyStats } from "../utils/stats";

const locRouter: Router = express.Router();

interface ILocationWeather extends LocationType {
  smhiTS: tsType[];
  owmTS: tsType[];
  waTS: tsType[];
}

interface IDailyLocationStats {
  date: Date;
  smhi: IDailyStats | null;
  owm: IDailyStats | null;
  wa: IDailyStats | null;
}

// ======= serve data from database =======
/**
 * GET /location
 */
locRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const locs = await Location.find();
  res.send(locs);
});

/**
 * GET /location/weather
 */
locRouter.get(
  "/weather",
  async (req: Request, res: Response, next: NextFunction) => {
    const locsWeather: ILocationWeather[] = [];
    const locs = await Location.find();
    let numFetchedLocs = 0;
    locs.forEach(async (loc) => {
      if (!loc) {
        return res.status(404).send("Location not found");
      }
      const smhi = await tsModel.find({ locationId: loc._id, source: "smhi" });
      const owm = await tsModel.find({ locationId: loc._id, source: "owm" });
      const wa = await tsModel.find({ locationId: loc._id, source: "wa" });
      const locationWeather: ILocationWeather = loc.toObject();

      locationWeather.name =
        loc.name.charAt(0).toUpperCase() + loc.name.slice(1);
      locationWeather.smhiTS = smhi.sort((a, b) => {
        return a.timeStamp.getTime() - b.timeStamp.getTime();
      });
      locationWeather.owmTS = owm.sort((a, b) => {
        return a.timeStamp.getTime() - b.timeStamp.getTime();
      });
      locationWeather.waTS = wa.sort((a, b) => {
        return a.timeStamp.getTime() - b.timeStamp.getTime();
      });
      locsWeather.push(locationWeather);
      numFetchedLocs++;

      if (numFetchedLocs == locs.length) {
        res.send(locsWeather);
      }
    });
  }
);

/**
 * GET /location/daily/:name+numForecastDays
 *
 */
locRouter.get(
  "/daily/:namePlusNumForecastDays",
  async (req: Request, res: Response, next: NextFunction) => {
    const nameAndNumForecastDays =
      req.params.namePlusNumForecastDays.split("+");
    const loc = await Location.findOne({
      name: nameAndNumForecastDays[0].toLowerCase(),
    });

    if (!loc) {
      return res.status(404).send("Location not found");
    }

    const dailyStatsList: IDailyLocationStats[] = [];

    const smhi = await tsModel.find({ locationId: loc._id, source: "smhi" });
    const owm = await tsModel.find({ locationId: loc._id, source: "owm" });
    const wa = await tsModel.find({ locationId: loc._id, source: "wa" });

    const waDateDict: any[][] = [];
    wa.forEach((element: any) => {
      const date = new Date(element.timeStamp).getDate();
      if (date in waDateDict) {
        waDateDict[date].push(element);
      } else {
        waDateDict[date] = [element];
      }
    });
    const smhiDateDict: any[][] = [];
    smhi.forEach((element: any) => {
      const date = new Date(element.timeStamp).getDate();
      if (date in smhiDateDict) {
        smhiDateDict[date].push(element);
      } else {
        smhiDateDict[date] = [element];
      }
    });
    const owmDateDict: any[][] = [];
    owm.forEach((element: any) => {
      const date = new Date(element.timeStamp).getDate();
      if (date in owmDateDict) {
        owmDateDict[date].push(element);
      } else {
        owmDateDict[date] = [element];
      }
    });

    const firstDate = new Date(wa[0].timeStamp).getDate();
    for (
      let i = firstDate;
      i < firstDate + Number(nameAndNumForecastDays[1]);
      i++
    ) {
      let waStats: IDailyStats | null = null;
      if (i in waDateDict) {
        waStats = getDailyStats(waDateDict[i]);
      }
      let smhiStats: IDailyStats | null = null;
      if (i in smhiDateDict) {
        smhiStats = getDailyStats(smhiDateDict[i]);
      }
      let owmStats: IDailyStats | null = null;
      if (i in owmDateDict) {
        owmStats = getDailyStats(owmDateDict[i]);
      }
      const dailyDate = new Date(wa[0].timeStamp);
      dailyDate.setDate(i + 1);
      dailyDate.setHours(0);
      dailyDate.setMinutes(0);
      dailyDate.setSeconds(0);

      const dailyStats: IDailyLocationStats = {
        date: dailyDate,
        smhi: smhiStats,
        owm: owmStats,
        wa: waStats,
      };
      dailyStatsList.push(dailyStats);
    }
    res.send(dailyStatsList);
  }
);

/**
 * GET /location/:id
 * TODO
 */
locRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const loc = await Location.findOne({ _id: req.params.id });

    if (!loc) {
      return res.status(404).send("Location not found");
    }

    // Find all TS objects with locationId = loc._id
    const smhi = await tsModel.find({ locationId: loc._id, source: "smhi" });
    const owm = await tsModel.find({ locationId: loc._id, source: "owm" });
    const wa = await tsModel.find({ locationId: loc._id, source: "wa" });

    const locationWeather: ILocationWeather = loc.toObject();
    // Update name to capitalized
    locationWeather.name = loc.name.charAt(0).toUpperCase() + loc.name.slice(1);
    locationWeather.smhiTS = smhi;
    locationWeather.owmTS = owm;
    locationWeather.waTS = wa;
    res.send(locationWeather);
  }
);

locRouter.post(
  "/new",
  async (req: Request, res: Response, next: NextFunction) => {
    const loc = new Location(req.body);
    await loc.save();
    res.send(loc);
  }
);

// ======= fetch new data from APIs =======
locRouter.get(
  "/update/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    // Get relevant Location object from DB
    const loc: LocationType | null = await Location.findOne({
      name: req.params.name.toLowerCase(),
    });

    if (!loc) {
      return res.status(404).send("Location not found");
    }

    await tsModel.deleteMany({ locationId: loc._id });

    // Fetch data from SMHI API
    console.log("Fetching data from SMHI API");
    const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${loc.lon}/lat/${loc.lat}/data.json`;
    const smhiResp = await fetch(smhiURL);
    const smhiData = await smhiResp.json();
    // Parse data from SMHI API
    const parsedSMHI: tsType[] = parseSMHIToTS(smhiData, loc._id);
    parsedSMHI.forEach(async (data) => {
      const ts = new tsModel(data);
      await ts.save();
    });

    // Fetch data from OpenWeatherMapAPI
    console.log("Fetching data from OpenWeatherMap API");
    const owmURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
    const owmResp = await fetch(owmURL);
    const owmData = await owmResp.json();
    // Parse data from OpenWeatherMap API
    const parsedOWM: tsType[] = parseOWMToTS(owmData, loc._id);
    parsedOWM.forEach(async (data) => {
      const ts = new tsModel(data);
      await ts.save();
    });

    // Fetch data from WeatherAPI
    console.log("Fetching data from WeatherAPI");
    const waURL = `https://api.weatherapi.com/v1/forecast.json?q=${loc.lat},${loc.lon}&days=14&key=${process.env.WEATHERAPI_API_KEY}`;
    const waResp = await fetch(waURL);
    const waData = await waResp.json();
    // Parse data from WeatherAPI
    const parsedWA: tsType[] = parseWAToTS(waData, loc._id);
    parsedWA.forEach(async (data) => {
      const ts = new tsModel(data);
      await ts.save();
    });

    return res.send({ status: "OK" });
  }
);

export default locRouter;
