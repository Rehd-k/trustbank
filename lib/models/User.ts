import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface ISecurityQA {
  question: string;
  answer: string;
}

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address?: string;
  securityQuestions: ISecurityQA[];
  accounts: Types.ObjectId[];
  currency: string;
  cards: Types.ObjectId[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  role: UserRole;
  isBlocked: boolean;
  transfersDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const SecurityQASchema = new Schema<ISecurityQA>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    address: { type: String, default: "" },
    securityQuestions: {
      type: [SecurityQASchema],
      default: [],
      validate: {
        validator: (v: ISecurityQA[]) => v.length <= 5,
        message: "Max 5 security Q&A",
      },
    },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    currency: { type: String, default: "USD" },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    transfersDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
