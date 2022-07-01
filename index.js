import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import Messages from "./MessagesDb.js";
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//db config

const uri = `mongodb+srv://whatsapp:${process.env.DB_PASS}@cluster0.98qmy.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Whatsapp-mern backend running");
});

app.post("/insert-messages", (req, res) => {
  const message = req.body;

  Messages.create(message, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
app.get("/get-messages", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.listen(port, () => {
  console.log("Backend is running", port);
});
