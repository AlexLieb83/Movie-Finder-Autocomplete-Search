//Requires
const express = require("express");
const app = express();
const cors = require("cors");
//destructering, basically grab both of these from mongodb
const { MongoClient, ObjectId } = require("mongodb");
const { response } = require("express");
require("dotenv").config();
const PORT = 8001;

//DB Variables
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "sample_mflix",
  collection;

//Connect to Mongo
MongoClient.connect(dbConnectionStr).then((client) => {
  console.log("Connected to database");
  db = client.db(dbName);
  collection = db.collection("movies");
});

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//This get req will bring back the autocomplete options
app.get("/search", async (req, res) => {
  try {
    let result = await collection
      .aggregate([
        {
          $Search: {
            autocomplete: {
              query: `${request.query.query}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 3,
              },
            },
          },
        },
      ])
      .toArray();
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

//This get req will bring back the info associated with chosen
app.get("/get/:id", async (req, res) => {
  try {
    let result = await collection.findOne({
      _id: ObjectId(request.params.id),
    });
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

//PORT
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running");
});
