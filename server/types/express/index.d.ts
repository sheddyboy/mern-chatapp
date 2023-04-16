import { Document, Types } from "mongoose";
import { IUser } from "../../models/userModel";

export {};
declare global {
  namespace Express {
    export interface Request {
      user: Document<unknown, {}, IUser> &
        Omit<
          IUser & {
            _id: Types.ObjectId;
          },
          never
        >;
    }
  }
}
