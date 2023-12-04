import { Schema, model, InferSchemaType } from "mongoose";

export interface ITrackedCard {
  location_id: string;
  card_components: Array<ICardComponent>;
}

export interface ICardComponent {
  component: number;
  data: number | null;
}

export interface IUser {
  fb_id: string;
  theme: string;
  tracked_cards: Array<ITrackedCard>;
}

// Create a Schema corresponding to the document interface.
export const UserSchema = new Schema({
  fb_id: { type: String, required: true },
  theme: { type: String, required: true },
  tracked_cards: { type: Array<ITrackedCard>, required: false },
});

// Create a Model.
export const User = model<IUser>("User", UserSchema);
