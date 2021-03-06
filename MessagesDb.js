import mongoose from "mongoose";

const whatsAppMessagesSchema = mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: String,
  received: Boolean,
  messengerId: String,
});

export default mongoose.model("messagecontents", whatsAppMessagesSchema);
