# 🚀 LoanLink – Frontend

LoanLink is a modern loan management web application frontend built with **React**, **Tailwind CSS v4**, and **Firebase Authentication**.  
It supports role-based dashboards for **Borrowers**, **Managers**, and **Admins**, along with secure authentication, payments, and theme toggling.

---

## 🌐 Live Site
👉 [Live Demo](https://your-live-site-link-here)

---

## 🧰 Technologies Used

- **React 18**
- **React Router**
- **Tailwind CSS v4**
- **DaisyUI**
- **Firebase Authentication**
- **JWT (via Firebase ID Token)**
- **TanStack React Query**
- **Axios**
- **Stripe (Payment Integration)**
- **React Hot Toast**
- **Context API (Auth & Theme)**

---

## ✨ Key Features

### 🔐 Authentication & Security
- Firebase Email/Password & Google Login
- JWT token stored securely and sent with protected API requests
- Protected private routes (Admin / Manager / Borrower)
- Logged-in users stay authenticated on page reload

---

### 👥 Role-Based Dashboard
- **Borrower**
  - Apply for loans
  - View loan applications
  - Cancel pending loans
  - Pay application fee via Stripe

- **Manager**
  - Create & manage loans
  - Approve / reject loan applications
  - View approved loans

- **Admin**
  - Manage users & roles
  - Suspend users with reason (modal)
  - View all loan applications
  - Manage all loans
  - Select loans to show on Home page

---

### 💳 Payment System
- Fixed **$10 loan application fee**
- Redirects to Stripe Checkout
- Payment success updates status from **Unpaid → Paid**
- Paid badge opens a modal showing:
  - Transaction ID
  - User Email
  - Loan ID
  - Amount
  - Payment Time

---

### 🎨 UI / UX
- Fully responsive (Mobile, Tablet, Desktop)
- Light / Dark theme toggle (applies to all pages)
- Loading spinners during API calls
- Toast notifications for all CRUD actions
- Dynamic page titles for each route
- Custom 404 Not Found page

---

## 📄 Pages & Routes

### 🌍 Public Routes
- `/` – Home
- `/all-loans` – All Available Loans
- `/about` – About Us
- `/contact` – Contact
- `/login` – Login
- `/signup` – Register

### 🔒 Private Routes
- `/dashboard` – Dashboard Overview
- `/dashboard/profile` – Profile
- `/dashboard/my-loans` – Borrower Loans
- `/dashboard/manage-loans` – Manager Loans
- `/dashboard/pending-loans` – Pending Applications
- `/dashboard/approved-loans` – Approved Loans
- `/dashboard/manage-users` – Admin User Management
- `/dashboard/loan-applications` – Admin Loan Applications
- `/dashboard/all-loan` – Admin All Loans

---

## 🌓 Theme Support
- Light & Dark mode
- Theme preference stored in `localStorage`
- Applied globally using Context API

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the frontend project and add:

```env
VITE_API_URL=your_backend_api_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
