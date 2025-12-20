require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
const admin = require('firebase-admin')
const port = process.env.PORT || 3000
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString(
  'utf-8'
)
const serviceAccount = JSON.parse(decoded)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
const { ObjectId } = require('mongodb')

const app = express()
// middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
)
app.use(express.json())

// jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1]
  console.log(token)
  if (!token) return res.status(401).send({ message: 'Unauthorized Access!' })
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    console.log(decoded)
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).send({ message: 'Unauthorized Access!', err })
  }
}



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    const db = client.db('loansDB')
    const loansCollection = db.collection('loans')

    // Save a plant data in db
    app.post('/loans', async (req, res) => {
      const plantData = req.body
      console.log(plantData)
      const result = await loansCollection.insertOne(plantData)
      res.send(result)
    })

    // get all loans from db
    app.get('/loans', async (req, res) => {
      const result = await loansCollection.find().limit(6).toArray()
      res.send(result)
    })

   
   

    app.get('/all-loans', async (req, res) => {
  const result = await loansCollection.find().toArray()
  res.send(result)
})

app.get('/loan/:id', async (req, res) => {
  const { id } = req.params
  const loan = await loansCollection.findOne({
    _id: new ObjectId(id),
  })
  res.send(loan)
})


const loanApplications = db.collection('loanApplications')

app.post('/loan-applications', verifyJWT, async (req, res) => {
  const application = req.body

  application.status = 'Pending'
  application.feeStatus = 'Unpaid'
  application.createdAt = new Date()

  const result = await loanApplications.insertOne(application)
  res.send(result)
})

app.get('/my-loans', verifyJWT, async (req, res) => {
  const email = req.tokenEmail
  const result = await loanApplications.find({ userEmail: email }).toArray()
  res.send(result)
})



app.get('/my-loans', verifyJWT, async (req, res) => {
  const email = req.tokenEmail

  const result = await loanApplications
    .find({ userEmail: email })
    .toArray()

  res.send(result)
})



const usersCollection = db.collection('users')

app.get('/users/role', async (req, res) => {
  const email = req.query.email
  const user = await usersCollection.findOne({ email })

  if (!user) {
    return res.send({ role: 'borrower' }) 
  }

  res.send({ role: user.role })
})

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from Server..')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
