import { Schema, model, InferSchemaType } from "mongoose";

// Create a Schema corresponding to the document interface.
export const LocationSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

export type LocationType = InferSchemaType<typeof LocationSchema>;

// Create a Model.
export const Location = model<LocationType>("Location", LocationSchema);
