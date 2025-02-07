const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



// const uri = "mongodb+srv://<username>:<password>@cluster0.wo01dvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wo01dvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const craftCollection = client.db("craftDB").collection("craft");
    const categoryCollection = client.db("craftDB").collection("subcategory");

    app.get('/craft', async(req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/craft/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.findOne(query);
      res.send(result);
     })

     app.post('/craft', async(req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })

     app.put('/craft/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCraft = req.body;

      const craft = {
          $set: {
              item: updatedCraft.item, 
              subcategory: updatedCraft.subcategory, 
              description: updatedCraft.description, 
              photo: updatedCraft.photo, 
              price: updatedCraft.price, 
              rating: updatedCraft.rating, 
              status: updatedCraft.status,
              time: updatedCraft.time,
              customization: updatedCraft.customization,
              name: updatedCraft.name,
              email: updatedCraft.email
          }
      }

      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result);
  })

     app.delete('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })


    // subcategory collection 

    app.get('/subcategory', async(req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Art finder server is running');
  })
  
  app.listen(port, () => {
    console.log(`Art finder server is running on port ${port}`);
  })