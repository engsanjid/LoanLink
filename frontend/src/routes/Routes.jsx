import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Statistics from '../pages/Dashboard/Common/Statistics'
import Profile from '../pages/Dashboard/Common/Profile'
import MainLayout from '../layouts/MainLayout'

import PublicAllLoans from '../pages/AllLoans/PublicAllLoans.jsx'
import About from '../pages/About/About.jsx'
import Contact from '../pages/Contact/Contact.jsx'
import { createBrowserRouter } from 'react-router'

import AddLoanForm from '../components/Form/AddLoanForm.jsx'
import UpdateLoanForm from '../components/Form/UpdateLoanForm.jsx'
import LoanDetails from '../pages/LoanDetails/LoanDetails.jsx'
import MyLoans from '../pages/Dashboard/Borrower/MyLoans.jsx'
import ApplyLoan from '../pages/LoanApplication/ApplyLoan.jsx'
import PendingLoans from '../pages/Dashboard/Manager/PendingLoans.jsx'

import ManageLoans from '../pages/Dashboard/Manager/ManageLoans.jsx'
import UpdateLoan from '../pages/Dashboard/Manager/UpdateLoan.jsx'
import ApprovedLoans from '../pages/Dashboard/Manager/ApprovedLoans.jsx'
import PaymentSuccess from '../pages/PaymentSuccess.jsx'
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers.jsx'
import LoanApplications from '../pages/Dashboard/loan-applications.jsx'

import AdminAllLoans from '../pages/Dashboard/Admin/AdminAllLoans.jsx'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/all-loans', element: <PublicAllLoans /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },

      {
        path: '/apply-loan/:id',
        element: (
          <PrivateRoute>
            <ApplyLoan />
          </PrivateRoute>
        ),
      },
{
  path: '/payment-success/:loanId',
  element: (
    <PrivateRoute>
      <PaymentSuccess />
    </PrivateRoute>
  ),
},

      {
        path: '/loan/:id',
        element: (
          <PrivateRoute>
            <LoanDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },

  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Statistics /> },
      { path: 'profile', element: <Profile /> },
{
  path: 'manage-users',
  element: <ManageUsers />,
},
{
  path: 'loan-applications',
  element: <LoanApplications />,
},
{
  path: 'all-loan',
  element: <AdminAllLoans />,
},

      // Borrower
      { path: 'my-loans', element: <MyLoans /> },

      // Manager
      { path: 'add-loan', element: <AddLoanForm /> },
      { path: 'update-loan', element: <UpdateLoanForm /> },
      { path: 'pending-loans', element: <PendingLoans /> },
      
      { path: 'manage-loans', element: <ManageLoans /> },
      {
  path: 'update-loan/:id',
  element: <UpdateLoan />,
},
{
  path: 'approved-loans',
  element: <ApprovedLoans />,
}

    ],
  },
])
