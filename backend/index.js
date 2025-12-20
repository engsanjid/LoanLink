require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const admin = require('firebase-admin')

const app = express()
const port = process.env.PORT || 3000

// firebase admin
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8')
const serviceAccount = JSON.parse(decoded)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
)
app.use(express.json())

// JWT verify
const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).send({ message: 'Unauthorized' })

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    next()
  } catch {
    return res.status(401).send({ message: 'Unauthorized' })
  }
}

// MongoDB
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
    const loanApplications = db.collection('loanApplications')
    const usersCollection = db.collection('users')

    // get single loan
    app.get('/loan/:id', async (req, res) => {
      const loan = await loansCollection.findOne({
        _id: new ObjectId(req.params.id),
      })
      res.send(loan)
    })

    // apply loan
    app.post('/loan-applications', verifyJWT, async (req, res) => {
      const application = {
        ...req.body,
        status: 'Pending',
        feeStatus: 'Unpaid',
        createdAt: new Date(),
      }

      const result = await loanApplications.insertOne(application)
      res.send(result)
    })

    // borrower → my loans
    app.get('/my-loans', verifyJWT, async (req, res) => {
      const result = await loanApplications
        .find({ userEmail: req.tokenEmail })
        .toArray()
      res.send(result)
    })

// Manager → Pending Loans
app.get('/pending-loans', verifyJWT, async (req, res) => {
  const result = await loanApplications
    .find({ status: 'Pending' })
    .toArray()

  res.send(result)
})


// Manager → Update Loan Status
app.patch('/loan-applications/:id', verifyJWT, async (req, res) => {
  const { status } = req.body
  const id = req.params.id

  const result = await loanApplications.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { status },
    }
  )

  res.send(result)
})


    // user role
    app.get('/users/role', async (req, res) => {
      const user = await usersCollection.findOne({ email: req.query.email })
      res.send({ role: user?.role || 'borrower' })
    })

    console.log('MongoDB Connected')
  } finally {}
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Server Running')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
