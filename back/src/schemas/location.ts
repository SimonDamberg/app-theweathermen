import { Schema, model, InferSchemaType } from "mongoose";

// Interface to use in code
export interface ILocation {
  name: string;
  adress: string;
  lat: number;
  lon: number;
}

// Create a Schema corresponding to the document interface.
export const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  adress: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

// Create a Model.
export const Location = model<ILocation>("Location", LocationSchema);
