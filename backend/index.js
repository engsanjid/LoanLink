require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const admin = require('firebase-admin')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const app = express()
const port = process.env.PORT || 3000

// Firebase Admin
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8')
const serviceAccount = JSON.parse(decoded)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
)
app.use(express.json())

// JWT Verify
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


// PUBLIC → ALL LOANS (For All Loans Page)

app.get('/all-loans', async (req, res) => {
  try {
    const result = await loansCollection.find({}).toArray()
    res.send(result)
  } catch (error) {
    res.status(500).send({ message: 'Failed to load loans' })
  }
})


// BORROWER → MY LOANS
app.get('/my-loans', verifyJWT, async (req, res) => {
  const email = req.tokenEmail

  const result = await loanApplications
    .find({ userEmail: email })
    .sort({ createdAt: -1 })
    .toArray()

  res.send(result)
})


// BORROWER → CANCEL LOAN (only Pending)
app.patch('/my-loans/cancel/:id', verifyJWT, async (req, res) => {
  const id = req.params.id

  const result = await loanApplications.updateOne(
    { _id: new ObjectId(id), status: 'Pending' },
    { $set: { status: 'Cancelled' } }
  )

  res.send(result)
})

// PUBLIC → HOME / FEATURED LOANS
app.get('/loans', async (req, res) => {
  const result = await loansCollection.find({}).limit(6).toArray()
  res.send(result)
})

    // MANAGER → MANAGE LOANS
    
    app.get('/manager/manage-loans', verifyJWT, async (req, res) => {
      const email = req.tokenEmail
      const search = req.query.search || ''

      const query = {
        'createdBy.email': email,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      }

      const result = await loansCollection.find(query).toArray()
      res.send(result)
    })

    /**
     * DELETE loan
     */
    app.delete('/loans/:id', verifyJWT, async (req, res) => {
      const id = req.params.id

      const result = await loansCollection.deleteOne({
        _id: new ObjectId(id),
      })

      res.send(result)
    })

    /**
     * UPDATE loan
     */
    app.patch('/loans/:id', verifyJWT, async (req, res) => {
      const id = req.params.id
      const updateData = req.body

      const result = await loansCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )

      res.send(result)
    })


    app.get('/loan/:id', async (req, res) => {
      const loan = await loansCollection.findOne({
        _id: new ObjectId(req.params.id),
      })
      res.send(loan)
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

    app.get('/pending-loans', verifyJWT, async (req, res) => {
      const result = await loanApplications
        .find({ status: 'Pending' })
        .toArray()
      res.send(result)
    })

    app.patch('/loan-applications/:id', verifyJWT, async (req, res) => {
      const { status } = req.body
      const result = await loanApplications.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status, approvedAt: status === 'Approved' ? new Date() : null } }
      )
      res.send(result)
    })

// Manager → Approved Loan Applications
app.get('/approved-loans', verifyJWT, async (req, res) => {
  const result = await loanApplications
    .find({ status: 'Approved' })
    .sort({ approvedAt: -1 })
    .toArray()

  res.send(result)
})

// CREATE STRIPE CHECKOUT SESSION
app.post('/create-checkout-session', verifyJWT, async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Stripe error:', err.message)
    res.status(500).send({ message: 'Payment session failed' })
  }
})



// PAYMENT SUCCESS
app.post('/payment-success', verifyJWT, async (req, res) => {
  const { loanId, sessionId } = req.body

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  await loanApplications.updateOne(
    { _id: new ObjectId(loanId) },
    {
      $set: {
        feeStatus: 'Paid',
        paymentInfo: {
          transactionId: session.payment_intent,
          email: session.customer_details.email,
          amount: session.amount_total / 100,
          paidAt: new Date(),
        },
      },
    }
  )

  res.send({ success: true })
})



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
