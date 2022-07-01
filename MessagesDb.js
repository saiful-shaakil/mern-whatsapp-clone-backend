import mongoose from "mongoose";

const whatsAppMessagesSchema = mongoose.Schema({
  name: String,
  message: String,
  timestamp: String,
  received: Boolean,
});

export default mongoose.model("messagecontents", whatsAppMessagesSchema);
