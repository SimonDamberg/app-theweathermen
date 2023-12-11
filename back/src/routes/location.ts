import express, { Router, Request, Response, NextFunction } from "express";
import { ILocation, Location } from "../schemas/location";
import {
  parseSMHIToTS,
  parseOWMToTS,
  parseWAToTS,
  parseAvgToTS,
} from "../utils/parsing";
import { ITimeSeries, tsModel } from "../schemas/timeSeries";
import { getDailyStats, IDailyStats } from "../utils/stats";
import { User } from "../schemas/user";
import {
  getOWMData,
  getSMHIData,
  getWAData,
  updateWeatherData,
} from "../utils/providers";

const locRouter: Router = express.Router();

interface ILocationWeather extends ILocation {
  smhiTS: ITimeSeries[];
  owmTS: ITimeSeries[];
  waTS: ITimeSeries[];
  avgTS: ITimeSeries[];
}

interface IDailyLocationStats {
  date: Date;
  smhi: IDailyStats | null;
  owm: IDailyStats | null;
  wa: IDailyStats | null;
  avg: IDailyStats | null;
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
      const avg = await tsModel.find({ locationId: loc._id, source: "avg" });
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
      locationWeather.avgTS = avg.sort((a, b) => {
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
    const avg = await tsModel.find({ locationId: loc._id, source: "avg" });

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
    const avgDateDict: any[][] = [];
    avg.forEach((element: any) => {
      const date = new Date(element.timeStamp).getDate();
      if (date in avgDateDict) {
        avgDateDict[date].push(element);
      } else {
        avgDateDict[date] = [element];
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
      let avgStats: IDailyStats | null = null;
      if (i in avgDateDict) {
        avgStats = getDailyStats(avgDateDict[i]);
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
        avg: avgStats,
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
    const avg = await tsModel.find({ locationId: loc._id, source: "avg" });

    const locationWeather: ILocationWeather = loc.toObject();
    // Update name to capitalized
    locationWeather.name = loc.name.charAt(0).toUpperCase() + loc.name.slice(1);
    locationWeather.smhiTS = smhi;
    locationWeather.owmTS = owm;
    locationWeather.waTS = wa;
    locationWeather.avgTS = avg;
    res.send(locationWeather);
  }
);

locRouter.post(
  "/add",
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name.toLowerCase();
    const adress = req.body.adress;
    const fb_id = req.body.fb_id;

    // Check if location already exists
    const loc = await Location.findOne({
      name: name.toLowerCase(),
    });

    // Check if user exists
    const user = await User.findOne({ fb_id: fb_id });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (loc) {
      const userHasLoc = user.tracked_cards.find(
        (card) => card.location_id == loc._id
      );
      if (userHasLoc) {
        return res.status(409).send("Location already exists");
      } else {
        user.tracked_cards.push({
          location_id: loc._id,
          card_components: [],
        });
        user.save();
        return res.send({ status: "OK" });
      }
    }

    // Fetch coords from Geocode API
    const geocodeURL = `https://geocode.maps.co/search?q=${adress.toLowerCase()}`;
    const geocodeResp = await fetch(geocodeURL);
    const geocodeData = await geocodeResp.json();

    if (geocodeData.length == 0) {
      return res.status(404).send("Location not found");
    }

    const lat = parseFloat(geocodeData[0].lat);
    const lon = parseFloat(geocodeData[0].lon);

    // Create new Location object
    const newLoc = new Location({
      name: name.toLowerCase(),
      adress: adress,
      lat: lat.toFixed(5),
      lon: lon.toFixed(5),
    });
    await newLoc.save();

    // Add location to user
    user.tracked_cards.push({
      location_id: newLoc._id,
      card_components: [],
    });
    await user.save();

    // Update new location with weather data
    updateWeatherData(newLoc._id, newLoc.lat, newLoc.lon)
      .then(() => {
        return res.send({ status: "OK" });
      })
      .catch((err) => {
        return res.status(500).send({ status: "ERROR", error: err });
      });
  }
);

// ======= fetch new data from APIs =======
locRouter.get(
  "/update/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    // Get relevant Location object from DB
    const loc = await Location.findOne({
      name: req.params.name.toLowerCase(),
    });

    if (!loc) {
      return res.status(404).send("Location not found");
    }

    // Update weather data
    updateWeatherData(loc._id, loc.lat, loc.lon)
      .then(() => {
        return res.send({ status: "OK" });
      })
      .catch((err) => {
        return res.status(500).send({ status: "ERROR", error: err });
      });
  }
);

export default locRouter;
