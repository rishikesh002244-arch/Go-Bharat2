import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type SIHBadgeTier = "bronze" | "silver" | "gold";

export interface ISIHEarnedBadge {
  code: string;
  name: string;
  description: string;
  icon: string;
  tier: SIHBadgeTier;
  earnedAt: Date;
}

export interface ISIHUserProgress extends Document {
  userId: Types.ObjectId;
  points: number;
  visitedLocationIds: string[];
  badges: ISIHEarnedBadge[];
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SIHBadgeSchema = new Schema<ISIHEarnedBadge>(
  {
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    tier: { type: String, enum: ["bronze", "silver", "gold"], required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SIHUserProgressSchema = new Schema<ISIHUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    points: { type: Number, default: 0, min: 0 },
    visitedLocationIds: { type: [String], default: [] },
    badges: { type: [SIHBadgeSchema], default: [] },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SIH_UserProgress: Model<ISIHUserProgress> =
  (mongoose.models.SIH_UserProgress as Model<ISIHUserProgress>) ||
  mongoose.model<ISIHUserProgress>("SIH_UserProgress", SIHUserProgressSchema);

export default SIH_UserProgress;
