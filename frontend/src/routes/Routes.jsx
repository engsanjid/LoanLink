import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Statistics from '../pages/Dashboard/Common/Statistics'
import Profile from '../pages/Dashboard/Common/Profile'
import MainLayout from '../layouts/MainLayout'


import AllLoans from '../pages/AllLoans/AllLoans.jsx'
import About from '../pages/About/About.jsx'
import Contact from '../pages/Contact/Contact.jsx'
import { createBrowserRouter } from 'react-router'
import AddLoanForm from '../components/Form/AddLoanForm.jsx'
import UpdateLoanForm from '../components/Form/UpdateLoanForm.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/all-loans', element: <AllLoans /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
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
      { path: 'add-loan', element: <AddLoanForm /> },
      { path: 'updateLoan', element: <UpdateLoanForm /> },
    ],
  },
])
