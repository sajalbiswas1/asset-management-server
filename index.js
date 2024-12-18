const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Boss Is Siting");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2fbewnn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("assetManagement").collection("users");
    const aboutCollection = client.db("assetManagement").collection("about");
    const packageCollection = client
      .db("assetManagement")
      .collection("packages");
    const assetCollection = client.db("assetManagement").collection("assets");
    const customCollection = client.db("assetManagement").collection("custom");
    const requestCollection = client
      .db("assetManagement")
      .collection("requests");
    const teamCollection = client.db("assetManagement").collection("teams");

    //user section
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // user post
    app.post("/users", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      // console.log(result);
      res.send(result);
    });

    app.get("/users/v1", async (req, res) => {
      let query = {};
      // console.log(req.query)
      if (req?.query?.email) {
        query = { email: req.query.email };
      }
      console.log(query);
      const cursor = await userCollection.findOne(query);
      res.send(cursor);
      console.log(cursor);
    });

    app.get("/users/v2", async (req, res) => {
      let query = {};
      if (req?.query.team) {
        query = { email: req.query.team };
      }
      const { team } = await userCollection.findOne(query);
      const query1 = { team: team };
      const cursor = userCollection.find(query1);
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result);
    });

    //asset section
    app.get("/assets", async (req, res) => {
      let query = {};
      // console.log(req.query)
      if (req?.query?.adminEmail) {
        query = { adminEmail: req.query.adminEmail };
      }
      console.log(query);
      const cursor = assetCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    // asset
    app.get("/requests/v4", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req?.query?.requesterEmail) {
        query = {
          requesterEmail: req.query.requesterEmail,
        };
      }

      app.post("/assets", async (req, res) => {
        const asset = req.body;
        console.log(asset);
        const result = await assetCollection.insertOne(asset);
        console.log(result);
        res.send(result);
      });

      // console.log("Check", query);
      const cursor = requestCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/requests", async (req, res) => {
      const cursor = requestCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //custom request list section
    app.get("/custom", async (req, res) => {
      const cursor = customCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Asset management is siting on port ${port}`);
});
