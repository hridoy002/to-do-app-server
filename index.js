const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();



app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xsli9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try{
    await client.connect();
    
    
    const notesCollection = client.db("note").collection("list");
    console.log('connected to db');

    // get 
    // url: localhost:5000/notes 

    app.get('/notes', async(req,res) =>{
      const query = req.query;
      const cursor = notesCollection.find({});

      const result = await cursor.toArray();

      res.send(result);
    })

    // post 
    // url: localhost:5000/note

    app.post('/note', async(req,res) =>{
        const data = req.body;
        console.log(data);

        const result = await notesCollection.insertOne(data);
        res.send(result);
    })
    
    // update 
    // url: localhost:5000/note/62bf4a6eddeb1bedbcb214ad

    app.put('/note/:id', async(req,res) =>{
      const id = req.params.id;
      const data = req.body;
      
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          task: data.task
        },
      };

      const result = await notesCollection.updateOne(filter, updateDoc, options);

      res.send(result);

    })

    // delete 
    // url: localhost:5000/note/62bf4a6eddeb1bedbcb214ad 
    app.delete("/note/:id", async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const result = await notesCollection.deleteOne(filter);

      res.send(result);
    })

  }

  finally{

  };
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('To Do Server,')
  })
  
  app.listen(port, () => {
    console.log(`To Do App Server Condition Good ${port}`)
  })
