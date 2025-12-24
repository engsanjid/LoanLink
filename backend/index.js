require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const admin = require('firebase-admin')

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

    // --- USER RELATED ROUTES ---
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) return res.send({ message: 'user already exists' });
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get('/users/role', async (req, res) => {
      const email = req.query.email;
      if(!email) return res.send({role: 'borrower'});
      const user = await usersCollection.findOne({ email })
      res.send({ role: user?.role || 'borrower' })
    })

    // --- ADMIN: MANAGE USERS ROUTE (404 সমাধান করবে) ---
    app.get('/admin/users', verifyJWT, verifyAdmin, async (req, res) => {
      const search = req.query.search || '';
      const role = req.query.role || '';
      
      let query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
      
      if (role) {
        query.role = role;
      }

      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // --- ADMIN: MANAGE ALL LOANS ROUTE ---
    app.get('/admin/all-loans', verifyJWT, verifyAdmin, async (req, res) => {
      const result = await loansCollection.find().toArray();
      res.send(result);
    });

    // --- MANAGER ROUTES ---
    app.get('/manager/manage-loans', verifyJWT, verifyManager, async (req, res) => {
      const search = req.query.search || '';
      const query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
      const result = await loansCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/pending-loans', verifyJWT, verifyManager, async (req, res) => {
      const result = await loanApplications.find({ status: 'Pending' }).toArray();
      res.send(result);
    });

    // --- LOAN APPLICATIONS (BORROWER) ---
    app.post('/loan-applications', verifyJWT, async (req, res) => {
      const application = req.body;
      application.status = 'Pending';
      application.createdAt = new Date();
      const result = await loanApplications.insertOne(application);
      res.send(result);
    });

    app.get('/my-loans', verifyJWT, async (req, res) => {
      const result = await loanApplications.find({ userEmail: req.tokenEmail }).sort({ createdAt: -1 }).toArray()
      res.send(result)
    })

    // --- LOAN CRUD (ADMIN) ---
    app.post('/loans', verifyJWT, verifyAdmin, async (req, res) => {
      const loanData = req.body;
      const result = await loansCollection.insertOne(loanData);
      res.send(result);
    });

    app.patch('/loans/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $set: req.body };
      const result = await loansCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete('/loans/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await loansCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

app.patch('/admin/users/:id', verifyJWT, verifyAdmin, async (req, res) => {
  const id = req.params.id
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  )
  res.send(result)
})


    // --- PUBLIC ROUTES ---
    app.get('/loans', async (req, res) => {
      const result = await loansCollection.find({ showOnHome: true }).limit(6).toArray()
      res.send(result)
    })

    app.get('/loan/:id', async (req, res) => {
      const id = req.params.id;
      const result = await loansCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    // --- PUBLIC: ALL LOANS (used by PublicAllLoans.jsx) ---
    app.get('/all-loans', async (req, res) => {
      const result = await loansCollection.find().toArray();
      res.send(result);
    })

    // --- MANAGER: APPROVED LOAN APPLICATIONS ---
    app.get('/approved-loans', verifyJWT, verifyManager, async (req, res) => {
      const result = await loanApplications.find({ status: 'Approved' }).toArray();
      res.send(result);
    })

    // --- ADMIN: LIST LOAN APPLICATIONS (with optional status filter) ---
    app.get('/admin/loan-applications', verifyJWT, verifyAdmin, async (req, res) => {
      const status = req.query.status;
      const filter = {}
      if (status) filter.status = status;
      const result = await loanApplications.find(filter).toArray();
      res.send(result);
    })

  } finally {
    // Keep connection open
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('LoanLink Server is running...')
})

app.listen(port, () => console.log(`Server running on port ${port}`))