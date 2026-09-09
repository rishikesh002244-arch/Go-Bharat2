import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGuide extends Document {
  name: string;
  location: string;
  locationSlug: string;
  languages: string[];
  govtLicenseId: string;
  licenseFormatValid: boolean;
  isVerified: boolean;
  status: "pending" | "verified" | "rejected";
  profileImage: string;
  bio: string;
  contact: string;
  experienceYears: number;
  createdAt: Date;
  updatedAt: Date;
}

const GuideSchema = new Schema<IGuide>(
  {
    name: {
      type: String,
      required: [true, "Guide name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },
    locationSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    languages: {
      type: [String],
      default: ["Hindi", "English"],
    },
    govtLicenseId: {
      type: String,
      required: [true, "Government license ID is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },
    licenseFormatValid: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: [800, "Bio cannot exceed 800 characters"],
    },
    contact: {
      type: String,
      required: [true, "Contact information is required"],
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 1,
      min: 0,
      max: 50,
    },
  },
  {
    timestamps: true,
  }
);

GuideSchema.index({ locationSlug: 1, isVerified: 1 });

export const Guide: Model<IGuide> =
  mongoose.models.Guide || mongoose.model<IGuide>("Guide", GuideSchema);

export default Guide;
