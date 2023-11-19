import express, { Router, Request, Response, NextFunction } from "express";
import { Location, LocationType } from "../schemas/location";
import { parseSMHIToTS, parseOWMToTS, parseWAToTS } from "../utils/parsing";
import { tsModel, tsType } from "../schemas/timeSeries";

const locRouter: Router = express.Router();

interface ILocationWeather extends LocationType {
  smhiTS: tsType[];
  owmTS: tsType[];
  waTS: tsType[];
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
 * GET /location/:name
 * TODO
 */
locRouter.get(
  "/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    const loc = await Location.findOne({ name: req.params.name.toLowerCase() });

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
