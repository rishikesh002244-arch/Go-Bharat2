import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHotel extends Document {
  name: string;
  destination: string;
  state: string;
  pricePerNight: number;
  budgetTier: "Budget" | "Moderate" | "Luxury";
  rating: number;
  reviewsCount: number;
  amenities: string[];
  image: string;
  address: string;
  bookingUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      index: true,
    },
    destination: {
      type: String,
      required: [true, "Destination city/town is required"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: 0,
    },
    budgetTier: {
      type: String,
      required: true,
      enum: ["Budget", "Moderate", "Luxury"],
      index: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: [true, "Hotel image URL is required"],
    },
    address: {
      type: String,
      default: "",
    },
    bookingUrl: {
      type: String,
      default: "#",
    },
  },
  {
    timestamps: true,
  }
);

HotelSchema.index({ destination: 1, budgetTier: 1, pricePerNight: 1 });

export const Hotel: Model<IHotel> =
  mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", HotelSchema);

export default Hotel;
