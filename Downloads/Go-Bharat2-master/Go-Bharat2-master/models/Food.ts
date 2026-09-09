import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFood extends Document {
  name: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast";
  state: string;
  type: "Vegetarian" | "Non-Vegetarian" | "Street Food" | "Dessert" | "Beverage";
  description: string;
  image: string;
  famousIn: string;
  priceRange: string;
  flavorProfile: string;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      index: true,
    },
    region: {
      type: String,
      required: true,
      enum: ["North", "South", "East", "West", "Central", "Northeast"],
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Vegetarian", "Non-Vegetarian", "Street Food", "Dessert", "Beverage"],
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
    famousIn: {
      type: String,
      default: "",
    },
    priceRange: {
      type: String,
      default: "₹100 - ₹300",
    },
    flavorProfile: {
      type: String,
      default: "Savory & aromatic",
    },
  },
  {
    timestamps: true,
  }
);

FoodSchema.index({ type: 1, region: 1, name: 1 });

export const Food: Model<IFood> =
  mongoose.models.Food || mongoose.model<IFood>("Food", FoodSchema);

export default Food;
