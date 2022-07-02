import mongoose from "mongoose";

const newContact = new mongoose.Schema({
  name: String,
  by: String,
  img: String,
});

export default mongoose.model("contacts", newContact);
