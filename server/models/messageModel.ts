import { model, Schema } from "mongoose";
import chatModel from "./chatModel";

const messageModel = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

messageModel.pre("save", async function () {
  try {
    await chatModel.findOneAndUpdate(
      { _id: this.chat },
      { latestMessage: this._id }
    );
  } catch (err) {
    console.log(err);
  }
});

export default model("Message", messageModel);
