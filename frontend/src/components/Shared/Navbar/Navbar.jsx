import { useState } from 'react'
import { Link } from 'react-router'
import { AiOutlineMenu } from 'react-icons/ai'
import { FiSun, FiMoon } from 'react-icons/fi'
import useAuth from '../../../hooks/useAuth'
import avatarImg from '../../../assets/images/placeholder.jpg'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <nav className="fixed w-full z-20 shadow-md backdrop-blur bg-white/80 dark:bg-gray-900/80">
      <div className="max-w-[1200px] mx-auto px-5 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl font-bold tracking-wide text-blue-700 dark:text-blue-400 group-hover:text-blue-600 transition">
            LoanLink
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-[16px] font-medium">
          <li><Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">Home</Link></li>
          <li><Link to="/all-loans" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">All-Loans</Link></li>
          <li><Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">About Us</Link></li>
          <li><Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">Contact</Link></li>

          {user ? (
            <>
              <li>
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
                  Dashboard
                </Link>
              </li>

              <li>
                <button
                  onClick={logOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </li>

              <li>
                <img
                  src={user.photoURL || avatarImg}
                  alt="profile"
                  className="w-10 h-10 rounded-full border"
                />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Login
                </Link>
              </li>

              <li>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Register
                </Link>
              </li>
            </>
          )}

          {/* Theme Toggle */}
          <li>
            <button onClick={toggleTheme} className="text-xl hover:text-blue-500 transition">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-3 rounded-full border hover:shadow transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AiOutlineMenu size={22} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg py-5 px-6 space-y-4 text-[17px] font-medium">

          <Link className="mobile-link" to="/">Home</Link>
          <Link className="mobile-link" to="/all-loans">All-Loans</Link>
          <Link className="mobile-link" to="/about">About Us</Link>
          <Link className="mobile-link" to="/contact">Contact</Link>

          {user ? (
            <>
              <Link className="mobile-link" to="/dashboard">Dashboard</Link>

              <button
                onClick={logOut}
                className="w-full text-center py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>

              <div className="flex items-center gap-3 pt-4">
                <img src={user.photoURL || avatarImg} className="w-12 h-12 rounded-full border" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {user.displayName || "User"}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link className="mobile-btn" to="/login">Login</Link>
              <Link className="mobile-btn" to="/signup">Register</Link>
            </>
          )}

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="flex items-center gap-2 pt-3 text-lg text-gray-700 dark:text-gray-200">
            {darkMode ? <FiSun /> : <FiMoon />} Theme
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
