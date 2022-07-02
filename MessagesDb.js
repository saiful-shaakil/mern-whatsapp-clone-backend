import mongoose from "mongoose";

const whatsAppMessagesSchema = mongoose.Schema(
  {
    name: String,
    message: String,
    received: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("messagecontents", whatsAppMessagesSchema);
