const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crgl3kb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();


    const carCollection = client.db('carDB').collection('honda')
    const userCollection = client.db('carDB').collection('user')

    app.get('/car/brand', async(req, res)=>{
      const cursor = carCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/car/:brand/:id', async(req, res)=> {
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
      const result = await carCollection.findOne(query)
      res.send(result)
    })


    app.post('/car/brand', async(req, res)=>{
        const newCar = req.body
        console.log(newCar)
        const result =  await carCollection.insertOne(newCar)
        res.send(result)
    })

    app.put('/car/:brand/:id',async(req, res)=>{
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const options = {upsert: true}
      const updatedCar = req.body
      const car = {
        $set: {
          name: updatedCar.name, 
          brand: updatedCar.brand, 
          image: updatedCar.image, 
          description: updatedCar.description, 
          price: updatedCar.price, 
          rating: updatedCar.rating, 
          type: updatedCar.type, 
          photo: updatedCar.photo
        }
      }
      const result = await carCollection.updateOne(filter, car, options)
      res.send(result)
    })

    app.get('/user',async(req, res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/user', async(req, res)=>{
      const user = req.body
      console.log(user)
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('SIYANA CARVILA server is running')
})

app.listen(port, ()=>{
    console.log(`SIYANA CARVILA server is running on port: ${port}`)
})