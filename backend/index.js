require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const admin = require('firebase-admin')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const app = express()
const port = process.env.PORT || 3000

// Firebase Admin initialization
if (!admin.apps.length) {
  try {
    const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8')
    const serviceAccount = JSON.parse(decoded)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } catch (error) {
    console.error('Firebase Admin Error:', error)
  }
}

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://gregarious-duckanoo-8af8b4.netlify.app' 
    ],
    credentials: true,
  })
)
app.use(express.json())

// JWT Verify Middleware
const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).send({ message: 'Unauthorized access' })
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    next()
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized access' })
  }
}

// MongoDB Client
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

    // --- ACCESS CONTROL MIDDLEWARES ---
    
    const verifyManager = async (req, res, next) => {
      const email = req.tokenEmail
      const user = await usersCollection.findOne({ email })
      if (user?.role !== 'manager' && user?.role !== 'admin') {
        return res.status(403).send({ message: 'Forbidden access' })
      }
      next()
    }

    const verifyAdmin = async (req, res, next) => {
      const email = req.tokenEmail
      const user = await usersCollection.findOne({ email })
      if (user?.role !== 'admin') return res.status(403).send({ message: 'Forbidden access' })
      next()
    }

    // --- MANAGER & APPROVAL ROUTES ---

    // সকল পেন্ডিং অ্যাপ্লিকেশন দেখুন
    app.get('/pending-loans', verifyJWT, verifyManager, async (req, res) => {
      const result = await loanApplications.find({ status: 'Pending' }).toArray();
      res.send(result);
    });

    // লোন অ্যাপ্লিকেশন স্ট্যাটাস পরিবর্তন (Approve/Reject)
    app.patch('/loan-applications/:id', verifyJWT, verifyManager, async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { 
          status: status,
          actionDate: new Date()
        }
      };
      const result = await loanApplications.updateOne(filter, updateDoc);
      res.send(result);
    });

    // --- ADMIN LOAN MANAGEMENT ROUTES ---

    // অ্যাডমিন প্যানেলের জন্য সকল লোন (এটি AdminAllLoans.jsx এর জন্য)
    app.get('/admin/all-loans', verifyJWT, verifyAdmin, async (req, res) => {
      const result = await loansCollection.find({}).toArray();
      res.send(result);
    });

    // হোমপেজে লোন দেখানো বা লুকানো (Featured Toggle)
    app.patch('/admin/loans/home/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const { showOnHome } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { showOnHome: showOnHome } };
      const result = await loansCollection.updateOne(filter, updateDoc);
      res.send({ success: true, result });
    });

    // লোন ডিলিট করা
    app.delete('/admin/loans/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await loansCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // --- PUBLIC & GENERAL ROUTES ---

    app.get('/loans', async (req, res) => {
      const result = await loansCollection.find({ showOnHome: true }).limit(6).toArray()
      res.send(result)
    })

    app.get('/my-loans', verifyJWT, async (req, res) => {
      const result = await loanApplications.find({ userEmail: req.tokenEmail }).sort({ createdAt: -1 }).toArray()
      res.send(result)
    })

    app.get('/users/role', async (req, res) => {
      const email = req.query.email;
      if(!email) return res.send({role: 'borrower'});
      const user = await usersCollection.findOne({ email })
      res.send({ role: user?.role || 'borrower' })
    })

  } catch (err) {
    console.error(err)
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('LoanLink Server is running...')
})

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server running on port ${port}`))
}