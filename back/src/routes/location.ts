import express, { Router, Request, Response, NextFunction } from "express";
import { Location, LocationType } from "../schemas/location";
import { parseSMHIToTS, parseOWMToTS } from "../utils/parsing";
import { smhiTS, smhiTSType } from "../schemas/smhiTimeSeries";
import { owmTS, owmTSType } from "../schemas/owmTimeSeries";

const locRouter: Router = express.Router();

interface ILocationWeather extends LocationType {
  smhiTS: smhiTSType[];
  owmTS: owmTSType[];
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
locRouter.get("/:name", async (req: Request, res: Response, next: NextFunction) => {
  const loc = await Location.findOne({ name: req.params.name.toLowerCase() });

  if (!loc) {
    return res.status(404).send("Location not found");
  }

  // Find all TS objects with locationId = loc._id
  const smhi = await smhiTS.find({ locationId: loc._id });
  const owm = await owmTS.find({ locationId: loc._id });

  // Create a new object with the location and the smhiTS
  const locWeather: ILocationWeather = {
    ...loc.toObject(),
    smhiTS: smhi,
    owmTS: owm,
  };

  res.send(locWeather);
});

locRouter.post("/new", async (req: Request, res: Response, next: NextFunction) => {
  const loc = new Location(req.body);
  await loc.save();
  res.send(loc);
});

// ======= fetch new data from APIs =======
locRouter.get("/update/:name", async (req: Request, res: Response, next: NextFunction) => {
  // Get relevant Location object from DB
  const loc: LocationType | null = await Location.findOne({ name: req.params.name.toLowerCase() });

  if (!loc) {
    return res.status(404).send("Location not found");
  }

  // Fetch data from SMHI API
  console.log("Fetching data from SMHI API");
  const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${loc.lon}/lat/${loc.lat}/data.json`;
  const smhiResp = await fetch(smhiURL);
  const smhiData = await smhiResp.json();
  // Remove all old smhiTS objects with locationId = loc._id
  await smhiTS.deleteMany({ locationId: loc._id });
  // Parse data from SMHI API
  const parsedSMHI: smhiTSType[] = parseSMHIToTS(smhiData, loc._id);
  parsedSMHI.forEach(async (data) => {
    const ts = new smhiTS(data);
    await ts.save();
  });

  // Fetch data from OpenWeatherMapAPI
  console.log("Fetching data from OpenWeatherMap API");
  const owmURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
  console.log(owmURL);
  const owmResp = await fetch(owmURL);
  const owmData = await owmResp.json();
  // Remove all old smhiTS objects with locationId = loc._id
  await owmTS.deleteMany({ locationId: loc._id });
  // Parse data from OpenWeatherMap API
  const parsedOWM: owmTSType[] = parseOWMToTS(owmData, loc._id);
  parsedOWM.forEach(async (data) => {
    const ts = new owmTS(data);
    await ts.save();
  });

  return res.send({"status": "OK"});
});

export default locRouter;