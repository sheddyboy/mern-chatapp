import { model, Schema } from "mongoose";
import chatModel from "./chatModel";

const messageModel = new Schema(
  {
    sender: {
      _id: { type: Schema.Types.ObjectId, ref: "User" },
      name: String,
      picture: String,
      email: String,
    },
    message: { type: String, trim: true },
    chat: {
      _id: { type: Schema.Types.ObjectId, ref: "Chat" },
      chatName: String,
      isGroupChat: Boolean,
      users: [{ _id: { type: Schema.Types.ObjectId, ref: "User" } }],
    },
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
