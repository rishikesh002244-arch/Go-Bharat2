import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmergencyContacts {
  police: string;
  ambulance: string;
  touristHelpline: string;
  fire?: string;
}

export interface ILocationSafety extends Document {
  location: string;
  locationSlug: string;
  emergencyContacts: IEmergencyContacts;
  generalPrecautions: string[];
  healthWarnings: string[];
  localScamsToAvoid: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LocationSafetySchema = new Schema<ILocationSafety>(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    locationSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    emergencyContacts: {
      police: { type: String, default: "100" },
      ambulance: { type: String, default: "102" },
      touristHelpline: { type: String, default: "1363" },
      fire: { type: String, default: "101" },
    },
    generalPrecautions: {
      type: [String],
      default: [],
    },
    healthWarnings: {
      type: [String],
      default: [],
    },
    localScamsToAvoid: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const LocationSafety: Model<ILocationSafety> =
  mongoose.models.LocationSafety ||
  mongoose.model<ILocationSafety>("LocationSafety", LocationSafetySchema);

export default LocationSafety;
