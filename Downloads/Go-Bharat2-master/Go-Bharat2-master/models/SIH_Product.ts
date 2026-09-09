import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type SIHProductKind = "product" | "experience";

export interface ISIHProduct extends Document {
  artisanId: Types.ObjectId;
  name: string;
  description: string;
  kind: SIHProductKind;
  category: string;
  price: number;
  currency: "INR";
  image: string;
  stockStatus: "in_stock" | "made_to_order" | "limited";
  sustainabilityNote: string;
  tags: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SIHProductSchema = new Schema<ISIHProduct>(
  {
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: "SIH_Artisan",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 1600 },
    kind: { type: String, enum: ["product", "experience"], default: "product", index: true },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["INR"], default: "INR" },
    image: { type: String, required: true, trim: true },
    stockStatus: {
      type: String,
      enum: ["in_stock", "made_to_order", "limited"],
      default: "in_stock",
    },
    sustainabilityNote: { type: String, required: true, trim: true, maxlength: 300 },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

SIHProductSchema.index({ name: "text", description: "text", category: "text", tags: "text" });

export const SIH_Product: Model<ISIHProduct> =
  (mongoose.models.SIH_Product as Model<ISIHProduct>) ||
  mongoose.model<ISIHProduct>("SIH_Product", SIHProductSchema);

export default SIH_Product;
