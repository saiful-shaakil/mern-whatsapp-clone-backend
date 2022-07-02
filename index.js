import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import Messages from "./MessagesDb.js";
import Contacts from "./ContactDB.js";
import Pusher from "pusher";
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
//app config
const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});

// app.use((req, res, next) => {
//   res.setHeader("Acess-Control-Allow-Origin", "*");
//   res.setHeader("Acess-Control-Allow-Headers", "*");
//   next();
// });
//db config

const uri = `mongodb+srv://whatsapp:${process.env.DB_PASS}@cluster0.98qmy.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Db is connected");
  const msgCollection = db.collection("messagecontents");
  const contactCollection = db.collection("contacts");
  const changeStream = msgCollection.watch();
  const changeStremTwo = contactCollection.watch();
  //for message
  changeStream.on("change", (change) => {
    console.log("A change happended in messages", change);
    if (change.operationType === "insert") {
      const messageData = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageData.name,
        message: messageData.message,
      });
    } else {
      console.log("Error is happend");
    }
  });
  //for contact
  changeStremTwo.on("change", (change) => {
    console.log("A change happended in contacts", change);
    if (change.operationType === "insert") {
      const contactData = change.fullDocument;
      pusher.trigger("contacts", "inserted", {
        name: contactData.name,
        img: contactData.img,
      });
    }
  });
});

// const getNanoSec = () => {
//   var hrTime = process.hrtime();
//   return hrTime[0] * 1000000000 + hrTime[1];
// };
// console.log(getNanoSec());

app.get("/", (req, res) => {
  res.send("Whatsapp-mern backend running");
});
//messagesDB.js
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
app.get("/get-messages/:contactId", (req, res) => {
  const contactId = req.params.contactId;
  Messages.find({ messengerId: contactId }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
//contactDB.js
//to post contacts
app.post("/insert-contact", (req, res) => {
  const contact = req.body;
  Contacts.create(contact, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
//to get contacts by email
app.get("/get-contacts/:email", (req, res) => {
  const email = req.params.email;
  Contacts.find({ by: email }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
//to get a single contact for chat container
app.get("/contacts/:id", (req, res) => {
  const contactId = req.params.id;
  Contacts.find({ _id: contactId }, (err, data) => {
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
