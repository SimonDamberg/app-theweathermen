import { Schema, model, InferSchemaType } from "mongoose";

// Create a Schema corresponding to the document interface.
export const tsSchema = new Schema(
  {
    locationId: { type: String, required: true },
    timeStamp: { type: Date, required: true },
    lastUpdated: { type: Date, required: true },
    airPressure: { type: Number, required: true },
    airTemperature: { type: Number, required: true },
    horizontalVisibility: { type: Number, required: true },
    windDirection: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    windGustSpeed: { type: Number, required: true },
    relativeHumidity: { type: Number, required: true, min: 0, max: 100 },
    thunderProbability: { type: Number, min: 0, max: 100 }, // Only SMHI
    totalCloudCover: { type: Number, required: true, min: 0, max: 100 },
    minPrecipitationIntensity: { type: Number }, // Only SMHI
    meanPrecipitationIntensity: { type: Number, required: true },
    maxPrecipitationIntensity: { type: Number }, // Only SMHI
    precipitationCategory: { type: Number, required: true, min: 0, max: 6 },
    frozenPrecipitationFraction: {
      type: Number,
      min: -9,
      max: 100,
    }, // Only SMHI
    weatherSymbol: { type: Number, required: true, min: 0, max: 19 },
    sunrise: { type: Date }, // Only WA and OWM
    sunset: { type: Date }, // Only WA and OWM
    source: { type: String, required: true },
  },
  {
    timeseries: {
      timeField: "timeStamp",
      metaField: "locationId",
      granularity: "hours",
    },
  }
);

export type tsType = InferSchemaType<typeof tsSchema>;

// Create a Model.
export const tsModel = model<tsType>("timeSeries", tsSchema);
