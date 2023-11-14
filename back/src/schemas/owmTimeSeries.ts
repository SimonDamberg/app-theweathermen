import { Schema, model, InferSchemaType } from 'mongoose';

// Create a Schema corresponding to the document interface.
export const owmTSSchema = new Schema(
  {
    locationId: {type: String, required: true},
    timeStamp: { type: Date, required: true },
    lastUpdated: { type: Date, required: true },
    airPressure: { type: Number, required: true },
    airTemperature: { type: Number, required: true },
    horizontalVisibility: { type: Number, required: true },
    windDirection: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    windGustSpeed: { type: Number, required: true },
    relativeHumidity: { type: Number, required: true, min: 0, max: 100 },
    totalCloudCover: { type: Number, required: true },
    meanPrecipitationIntensity: { type: Number},
    weatherSymbol: { type: Number, required: true },
    sunrise: { type: Date, required: true },
    sunset: { type: Date, required: true },
  }, 
  {
    timeseries: {
      timeField: 'timeStamp',
      metaField: 'locationId', // label, i.e. ID, name, coords, or metadata dictfield
      granularity: 'hours',
    },
  }
);

export type owmTSType = InferSchemaType<typeof owmTSSchema>;

// Create a Model.
export const owmTS = model<owmTSType>('owmTimeSeries', owmTSSchema);