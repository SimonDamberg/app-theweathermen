import { Schema, model, InferSchemaType } from 'mongoose';

// Create a Schema corresponding to the document interface.
export const smhiSchema = new Schema({
  test: { type: String, required: true },
});

export type SMHIType = InferSchemaType<typeof smhiSchema>;

// Create a Model.
export const SMHI = model<SMHIType>('SMHI', smhiSchema);