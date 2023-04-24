import { Document, model, Schema, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  picture: string;
  friends: [Types.ObjectId];
}

const userModel = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    friends: [{ type: Types.ObjectId, ref: "User" }],
    password: { type: String, required: true },
    picture: {
      type: String,
      default: "uploads/userAvatar/defaultUser.jpg",
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userModel);
