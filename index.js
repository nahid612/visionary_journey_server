const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// midleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aazotrb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    // await client.connect();

    const spotCollection = client.db('spotDB').collection('place')

    app.post('/addTouristSpot', async(req, res) =>{
      const info = req.body
      console.log(info)
      const result = await spotCollection.insertOne(info)
      res.send(result)
    })

    app.get('/allTouristspot', async(req, res)=>{
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/myAddList/:email', async(req, res) =>{
      console.log(req.params.email)
      const cursor = spotCollection.find({email: req.params.email})
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/singlePlace/:id', async(req, res) =>{
      console.log(req.params.id)
      const result = await spotCollection.findOne({_id: new ObjectId (req.params.id)})
      console.log(result)
      res.send(result)
    })

    // view data with get
    app.get('/viewDetails/:id', async(req, res) =>{
      console.log(req.params.id)
      const result = await spotCollection.findOne({_id: new ObjectId (req.params.id)})
      console.log(result)
      res.send(result)
    })

    // update
    app.put('/updatePlace/:id', async(req, res) =>{
      console.log(req.params.id)
      const query = {_id: new ObjectId(req.params.id)}
      const updatePlace = req.body
      const data = {
        $set:{
          image: updatePlace.image,
          touristSpot: updatePlace.touristSpot,
          countryName: updatePlace.countryName,
          location: updatePlace.location,
          description: updatePlace.description,
          cost: updatePlace.cost,
          season: updatePlace.season,
          travelTime: updatePlace.travelTime,
          visitor: updatePlace.visitor,
        }
      }
      const result = await spotCollection.updateOne(query,data)
      console.log(result)
      res.send(result)
    })


     // delate
     app.delete("/delatePlace/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      console.log(result)
      res.send(result);
    });


    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Visionary server is running on port 5000')
})

app.listen(port, () =>{
    console.log(`Visionary server is running on port: ${port}`)
})