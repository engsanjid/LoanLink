import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { AiOutlineMenu } from 'react-icons/ai'
import { FiSun, FiMoon } from 'react-icons/fi'
import useAuth from '../../../hooks/useAuth'
import avatarImg from '../../../assets/images/placeholder.jpg'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => setDarkMode(!darkMode)

  const navClass = ({ isActive }) =>
    isActive
      ? 'text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1'
      : 'text-white/90 hover:text-yellow-300 transition'

  return (
    <nav className="fixed w-full z-30 bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-600 shadow-lg">
      <div className="max-w-[1200px] mx-auto px-5 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-yellow-300 hover:text-yellow-200 transition"
        >
          LoanLink
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium">

          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/all-loans" className={navClass}>All Loans</NavLink>
          <NavLink to="/about" className={navClass}>About Us</NavLink>
          <NavLink to="/contact" className={navClass}>Contact</NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>

              <button
                onClick={logOut}
                className="px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>

              <img
                src={user.photoURL || avatarImg}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-yellow-300"
              />
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full transition ${
                    isActive
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full transition ${
                    isActive
                      ? 'bg-yellow-400 text-purple-700'
                      : 'bg-gradient-to-r from-purple-700 to-pink-600 text-white hover:opacity-90'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}

          {/* Theme Toggle (visual only) */}
          <button
            onClick={toggleTheme}
            className="text-xl text-white hover:text-yellow-300 transition"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded bg-white/20 text-white"
        >
          <AiOutlineMenu size={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-5 space-y-4 bg-gradient-to-b from-pink-500 to-fuchsia-600 text-white">

          <NavLink to="/" className="block">Home</NavLink>
          <NavLink to="/all-loans" className="block">All Loans</NavLink>
          <NavLink to="/about" className="block">About Us</NavLink>
          <NavLink to="/contact" className="block">Contact</NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className="block">
                Dashboard
              </NavLink>

              <button
                onClick={logOut}
                className="w-full py-2 rounded bg-red-500 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block text-center py-2 rounded bg-white/20"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block text-center py-2 rounded bg-yellow-400 text-purple-700"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
