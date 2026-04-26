import mongoose, { Schema, Document } from "mongoose";

export type User = Document & {
  fullName: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
}

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
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<User>("User", UserSchema);