require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const admin = require('firebase-admin')
const Stripe = require('stripe')

const app = express()
const port = process.env.PORT || 3000
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/* =======================
   Firebase Admin
======================= */
if (!admin.apps.length) {
  const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8')
  const serviceAccount = JSON.parse(decoded)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

/* =======================
   Middleware
======================= */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://gregarious-duckanoo-8af8b4.netlify.app/',
    ],
    credentials: true,
  })
)
app.use(express.json())

/* =======================
   MongoDB (GLOBAL)
======================= */
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

const db = client.db('loansDB')
const loansCollection = db.collection('loans')
const loanApplications = db.collection('loanApplications')
const usersCollection = db.collection('users')

/* =======================
   Auth Middlewares
======================= */
const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).send({ message: 'Unauthorized' })

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    next()
  } catch {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

const verifyAdmin = async (req, res, next) => {
  const user = await usersCollection.findOne({ email: req.tokenEmail })
  if (user?.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden' })
  }
  next()
}

/* =======================
   Public Routes
======================= */
app.get('/', (req, res) => {
  res.send('LoanLink Server is running...')
})

app.get('/all-loans', async (req, res) => {
  const result = await loansCollection.find({}).toArray()
  res.send(result)
})

app.get('/loans', async (req, res) => {
  const result = await loansCollection.find({ showOnHome: true }).limit(6).toArray()
  res.send(result)
})

app.get('/loan/:id', async (req, res) => {
  const loan = await loansCollection.findOne({ _id: new ObjectId(req.params.id) })
  res.send(loan)
})

/* =======================
   Borrower Routes
======================= */
app.get('/my-loans', verifyJWT, async (req, res) => {
  const result = await loanApplications
    .find({ userEmail: req.tokenEmail })
    .sort({ createdAt: -1 })
    .toArray()
  res.send(result)
})

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

/* =======================
   Admin Routes
======================= */
app.get('/admin/all-loans', verifyJWT, verifyAdmin, async (req, res) => {
  const result = await loansCollection.find({}).toArray()
  res.send(result)
})

app.patch('/admin/loans/home/:id', verifyJWT, verifyAdmin, async (req, res) => {
  const { showOnHome } = req.body
  const result = await loansCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { showOnHome } }
  )
  res.send({ success: true, result })
})

app.delete('/admin/loans/:id', verifyJWT, verifyAdmin, async (req, res) => {
  const result = await loansCollection.deleteOne({ _id: new ObjectId(req.params.id) })
  res.send(result)
})

app.get('/admin/users', verifyJWT, verifyAdmin, async (req, res) => {
  const search = req.query.search || ''
  const roleFilter = req.query.role || ''
  const page = parseInt(req.query.page) || 1
  const size = parseInt(req.query.size) || 5

  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ],
  }

  if (roleFilter) query.role = roleFilter

  const totalUsers = await usersCollection.countDocuments(query)
  const users = await usersCollection
    .find(query)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()

  res.send({ users, totalUsers })
})

/* =======================
   Stripe
======================= */
app.post('/create-checkout-session', verifyJWT, async (req, res) => {
  const { loanId } = req.body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Loan Application Fee' },
          unit_amount: 1000,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/payment-success/${loanId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard/my-loans`,
  })

  res.send({ url: session.url })
})

/* =======================
   Local Only
======================= */
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server running on port ${port}`))
}

/* =======================
   Vercel Export
======================= */
module.exports = app
