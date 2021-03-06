const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pv2sf.mongodb.net/${process.env.DB_DATA}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
client.connect((err) => {
  const users = client.db("event_data").collection("users");
  const events = client.db("event_data").collection("events");
  const eventsBook = client.db("event_data").collection("book");

  app.post("/users", (req, res) => {
    users.insertOne(req.body).then((result) => {
      res.send(result.acknowledged);
    });
  });
  app.get("/users", (req, res) => {
    users.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });

  /////////////////////////////////////////////////////////
  app.post("/events", (req, res) => {
    events.insertOne(req.body).then((result) => {
      res.send(result.acknowledged);
    });
  });

  app.get("/events", (req, res) => {
    events.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });
  app.get("/events/:id", (req, res) => {
    events.findOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result);
    });
  });
  /////////////////////////////////////////////////////////
  app.post("/eventsBook", (req, res) => {
    eventsBook.insertOne(req.body).then((result) => {
      res.send(result.acknowledged);
    });
  });
  app.get("/eventsBook", (req, res) => {
    eventsBook.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });
});

app.listen(process.env.PORT || port);
