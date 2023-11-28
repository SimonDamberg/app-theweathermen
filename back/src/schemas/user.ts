import { Schema, model, InferSchemaType } from "mongoose";

export interface ITrackedCard {
  location_id: string;
  card_components: Array<ICardComponent>;
}

export interface ICardComponent {
  component: number;
  data: number;
}

// Create a Schema corresponding to the document interface.
export const UserSchema = new Schema({
  fb_id: { type: String, required: true },
  theme: { type: String, required: true },
  tracked_cards: { type: Array<ITrackedCard>, required: false },
});

export type UserType = InferSchemaType<typeof UserSchema>;

// Create a Model.
export const User = model<UserType>("User", UserSchema);
