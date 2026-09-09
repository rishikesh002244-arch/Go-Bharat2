import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISIHArtisan extends Document {
  name: string;
  craft: string;
  location: string;
  state: string;
  story: string;
  image: string;
  verified: boolean;
  contactUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SIHArtisanSchema = new Schema<ISIHArtisan>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    craft: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    state: { type: String, required: true, trim: true, maxlength: 80, index: true },
    story: { type: String, required: true, trim: true, maxlength: 1200 },
    image: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    contactUrl: { type: String, trim: true },
    coordinates: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
    },
  },
  { timestamps: true }
);

SIHArtisanSchema.index({ name: "text", craft: "text", location: "text", state: "text" });

export const SIH_Artisan: Model<ISIHArtisan> =
  (mongoose.models.SIH_Artisan as Model<ISIHArtisan>) ||
  mongoose.model<ISIHArtisan>("SIH_Artisan", SIHArtisanSchema);

export default SIH_Artisan;
