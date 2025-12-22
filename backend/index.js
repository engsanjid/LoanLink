require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const admin = require('firebase-admin')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const app = express()
const port = process.env.PORT || 3000

// Firebase Admin initialization (Base64 decode for Vercel security)
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
      'https://jade-frangipane-e8ac0f.netlify.app' // আপনার লাইভ লিঙ্ক
    ],
    credentials: true,
  })
)
app.use(express.json())

// JWT Verify
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

    // --- MIDDLEWARES ---
    const verifyAdmin = async (req, res, next) => {
      const email = req.tokenEmail
      const user = await usersCollection.findOne({ email })
      if (user?.role !== 'admin') return res.status(403).send({ message: 'Forbidden access' })
      next()
    }

    // --- ROUTES ---

    // Public Routes
    app.get('/all-loans', async (req, res) => {
      const result = await loansCollection.find({}).toArray()
      res.send(result)
    })

    app.get('/loans', async (req, res) => {
      // Home page এ শুধুমাত্র ৬টি featured লোন দেখাবে
      const result = await loansCollection.find({ showOnHome: true }).limit(6).toArray()
      res.send(result)
    })

    // Admin: Toggle Featured Status (এটি আপনার কাজ করছিল না)
    app.patch('/admin/loans/home/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const { showOnHome } = req.body; // ফ্রন্টেন্ড থেকে পাঠানো boolean
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { showOnHome: showOnHome }
      };
      const result = await loansCollection.updateOne(filter, updateDoc);
      res.send({ success: true, result });
    });

    // Admin: Delete Loan
    app.delete('/admin/loans/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await loansCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Admin: Get Users with Pagination & Search
    app.get('/admin/users', verifyJWT, verifyAdmin, async (req, res) => {
      const search = req.query.search || '';
      const roleFilter = req.query.role || '';
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 5;
      
      const query = { 
        $or: [
          { name: { $regex: search, $options: 'i' } }, 
          { email: { $regex: search, $options: 'i' } }
        ] 
      };
      if (roleFilter) query.role = roleFilter;

      const totalUsers = await usersCollection.countDocuments(query);
      const users = await usersCollection.find(query)
        .skip((page - 1) * size)
        .limit(size)
        .toArray();
      res.send({ users, totalUsers });
    });

    // Other routes (Applications, Stripe, etc.)
    app.get('/my-loans', verifyJWT, async (req, res) => {
      const result = await loanApplications.find({ userEmail: req.tokenEmail }).sort({ createdAt: -1 }).toArray()
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      const exists = await usersCollection.findOne({ email: user.email })
      if (exists) return res.send({ message: 'User already exists' })
      const result = await usersCollection.insertOne({ 
        ...user, 
        role: user.role || 'borrower', 
        status: 'active', 
        createdAt: new Date() 
      })
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

// Essential for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server running on port ${port}`))
}