import { model, Schema } from "mongoose";

const chatModel = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

chatModel.pre("findOne", function () {
  this.populate("users", "-password").populate({
    path: "latestMessage",
    populate: { path: "sender", select: "-password" },
  });
});
chatModel.pre("findOneAndUpdate", function () {
  this.populate("users", "-password").populate({
    path: "latestMessage",
    populate: { path: "sender", select: "-password" },
  });
});
chatModel.pre("find", function () {
  this.populate("users groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: { path: "sender", select: "-password" },
    })
    .sort({
      updatedAt: -1,
    });
});

export default model("Chat", chatModel);
