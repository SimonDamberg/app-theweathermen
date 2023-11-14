import { Schema, model, InferSchemaType } from 'mongoose';

// Create a Schema corresponding to the document interface.
export const smhiTSSchema = new Schema(
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
    thunderProbability: { type: Number, required: true, min: 0, max: 100 },
    totalCloudCover: { type: Number, required: true, min: 0, max: 8 },
    minPrecipitationIntensity: { type: Number, required: true },
    meanPrecipitationIntensity: { type: Number, required: true },
    maxPrecipitationIntensity: { type: Number, required: true },
    precipitationCategory: { type: Number, required: true, min: 0, max: 6 },
    frozenPrecipitationFraction: { type: Number, required: true, min: -9, max: 100 },
    weatherSymbol: { type: Number, required: true, min: 1, max: 27 },
  }, 
  {
    timeseries: {
      timeField: 'timeStamp',
      metaField: 'locationId', // label, i.e. ID, name, coords, or metadata dictfield
      granularity: 'hours',
    },
  }
);

export type smhiTSType = InferSchemaType<typeof smhiTSSchema>;

// Create a Model.
export const smhiTS = model<smhiTSType>('smhiTimeSeries', smhiTSSchema);