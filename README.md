# LoanLink – Microloan Request & Approval Tracker System

LoanLink is a full-stack microloan management platform designed for NGOs and small financial providers. It streamlines the process of loan application, manager review, and administrative oversight.

## 🚀 Live Links
- **Live Site:** [https://jade-frangipane-e8ac0f.netlify.app](https://jade-frangipane-e8ac0f.netlify.app/)
- **Server API:** [https://backend-delta-sepia-46.vercel.app]

## 🛠️ Key Features
- **Role-Based Access Control:** Distinct views and permissions for Admins, Managers, and Borrowers.
- **Dynamic Dashboard:** Real-time stats and management tables for loan tracking.
- **Stripe Payment Integration:** Secure $10 application fee payment with transaction ID tracking.
- **Loan Workflow:** Smooth transition of loans from Pending ➔ Approved/Rejected.
- **User Management:** Admin can promote users to Manager or Suspend accounts with reasons.
- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for smooth animations.

## 📦 Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, TanStack Query, Axios.
- **Backend:** Node.js, Express.js, MongoDB.
- **Auth:** Firebase Authentication with JWT for route protection.
- **Payment:** Stripe API.

## 📝 NPM Packages Used
**Client:** `firebase`, `framer-motion`, `axios`, `react-router-dom`, `sweetalert2`, `react-hook-form`, `lucide-react`.
**Server:** `dotenv`, `cors`, `mongodb`, `jsonwebtoken`, `firebase-admin`, `stripe`.

## ⚙️ Environment Variables
To run this project locally, create a `.env` file in the root of your server and add:
```env
MONGODB_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_secret
FB_SERVICE_KEY=your_base64_encoded_service_account_key
CLIENT_URL=http://localhost:5173
PORT=3000