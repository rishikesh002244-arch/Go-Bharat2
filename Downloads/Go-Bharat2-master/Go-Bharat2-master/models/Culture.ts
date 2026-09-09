import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICulture extends Document {
  title: string;
  state: string;
  region: string;
  type: "Festival" | "Dance & Art" | "Music" | "Architecture" | "Tradition";
  description: string;
  image: string;
  season: string;
  significance: string;
  createdAt: Date;
  updatedAt: Date;
}

const CultureSchema = new Schema<ICulture>(
  {
    title: {
      type: String,
      required: [true, "Culture title is required"],
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
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Festival", "Dance & Art", "Music", "Architecture", "Tradition"],
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
    season: {
      type: String,
      default: "Year-round",
    },
    significance: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

CultureSchema.index({ type: 1, state: 1, title: 1 });

export const Culture: Model<ICulture> =
  mongoose.models.Culture || mongoose.model<ICulture>("Culture", CultureSchema);

export default Culture;
