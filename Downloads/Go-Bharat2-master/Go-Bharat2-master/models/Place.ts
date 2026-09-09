import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlace extends Document {
  name: string;
  state: string;
  region: string;
  category: "Heritage" | "Nature" | "Beach" | "Spiritual" | "Hill Station" | "Adventure";
  description: string;
  image: string;
  rating: number;
  bestTimeToVisit: string;
  highlights: string[];
  entryFee: string;
  timings: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Heritage", "Nature", "Beach", "Spiritual", "Hill Station", "Adventure"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    bestTimeToVisit: {
      type: String,
      default: "Year-round",
    },
    highlights: {
      type: [String],
      default: [],
    },
    entryFee: {
      type: String,
      default: "Free entry",
    },
    timings: {
      type: String,
      default: "Open all day",
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
PlaceSchema.index({ name: "text", state: "text", description: "text" });

export const Place: Model<IPlace> =
  mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema);

export default Place;
