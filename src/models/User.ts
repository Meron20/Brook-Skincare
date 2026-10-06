import mongoose, { Schema, Document } from "mongoose";

export type User = Document & {
  fullName: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
};

const UserSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<User>("User", UserSchema);