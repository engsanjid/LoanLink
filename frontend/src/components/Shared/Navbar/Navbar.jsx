import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { FiMoon, FiSun } from 'react-icons/fi' 
import useAuth from '../../../hooks/useAuth'
import avatarImg from '../../../assets/images/placeholder.jpg'
import { useTheme } from '../../../context/ThemeContext'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme() 

  const closeMenu = () => setIsOpen(false)

  const navClass = ({ isActive }) =>
    isActive
      ? 'text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1 scale-105 transition-all'
      : 'text-white/90 hover:text-yellow-300 transition-all duration-300 hover:scale-105'

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 shadow-xl ${
  theme === 'light' 
    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-600' 
    : 'bg-gray-900 border-b border-gray-800'
}`}>
  <div className="max-w-[1280px] mx-auto px-5 py-4 flex justify-between items-center">

    {/* Logo */}
    <Link
      to="/"
      onClick={closeMenu}
      className="text-2xl font-black tracking-tighter text-yellow-300 hover:brightness-110 transition-all"
    >
      LOAN<span className="text-white">LINK</span>
    </Link>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-8 font-semibold">
      <ul className="flex items-center gap-6">
        <NavLink to="/" className={navClass}>Home</NavLink>
        <NavLink to="/all-loans" className={navClass}>All Loans</NavLink>
        <NavLink to="/about" className={navClass}>About Us</NavLink>
        <NavLink to="/contact" className={navClass}>Contact</NavLink>
        {user && <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>}
      </ul>

      <div className="flex items-center gap-4 border-l border-white/20 pl-6">
        
        {/* Theme Toggle Button (Padding fixed with flex) */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:text-yellow-300 hover:bg-white/10 transition-all active:scale-90"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <FiMoon size={22} /> : <FiSun size={22} />}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={logOut}
              className="px-4 py-1.5 rounded-lg bg-white/10 text-white hover:bg-red-500 transition-all text-sm font-bold"
            >
              Logout
            </button>
            <img
              src={user.photoURL || avatarImg}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-yellow-300 object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-white font-bold hover:text-yellow-300 transition text-sm">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 rounded-xl bg-yellow-400 text-purple-900 hover:bg-white transition-all text-sm font-black uppercase"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
    
    {/* Mobile Toggle Button */}
    <div className="md:hidden flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 text-white"
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
    </div>
  </div>
</nav>
  )
}

export default Navbar