import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useRole from '../../../hooks/useRole'
import { useTheme } from '../../../context/ThemeContext'

import { GrLogout } from 'react-icons/gr'
import { FcSettings } from 'react-icons/fc'
import { AiOutlineBars } from 'react-icons/ai'
import { BsGraphUp } from 'react-icons/bs'

import MenuItem from './Menu/MenuItem'
import AdminMenu from './Menu/AdminMenu'
import ManagerMenu from './Menu/ManagerMenu'
import BorrowerMenu from './Menu/BorrowerMenu'

const Sidebar = () => {
  const { logOut } = useAuth()
  const { role, isLoading } = useRole()
  const [isActive, setActive] = useState(false)
  const { theme } = useTheme()

  if (isLoading) return null

  const handleToggle = () => {
    setActive(!isActive)
  }

  return (
    <>
      <div className={`flex justify-between md:hidden transition-colors duration-500 ${
        theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-950 text-white'
      }`}>
        <Link to="/" className="p-4 font-bold text-2xl text-yellow-400">
          LoanLink
        </Link>

        <button
          onClick={handleToggle}
          className={`p-4 focus:outline-none ${theme === 'light' ? 'focus:bg-gray-200' : 'focus:bg-gray-800'}`}
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      <div
        className={`z-10 md:fixed flex flex-col justify-between w-64 px-2 py-4 absolute inset-y-0 left-0 transform ${
          isActive && '-translate-x-full'
        } md:translate-x-0 transition duration-500 ${
          theme === 'light' ? 'bg-gray-100 border-r' : 'bg-gray-900 border-r border-gray-800'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className={`hidden md:flex justify-center py-2 rounded transition-colors duration-500 ${
            theme === 'light' ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600' : 'bg-gray-800'
          }`}>
            <Link to="/" className={`text-2xl font-bold ${theme === 'light' ? 'text-white' : 'text-yellow-400'}`}>
              LoanLink
            </Link>
          </div>

          <nav className="mt-6 flex-1">
            <MenuItem
              icon={BsGraphUp}
              label="Statistics"
              address="/dashboard"
            />
            {role === 'borrower' && <BorrowerMenu />}
            {role === 'manager' && <ManagerMenu />}
            {role === 'admin' && <AdminMenu />}
          </nav>

          <div>
            <hr className={theme === 'light' ? 'border-gray-300' : 'border-gray-700'} />
            <MenuItem
              icon={FcSettings}
              label="Profile"
              address="/dashboard/profile"
            />
            <button
              onClick={logOut}
              className={`flex w-full items-center px-4 py-2 mt-4 transition-all duration-300 ${
                theme === 'light' 
                ? 'text-gray-600 hover:bg-gray-300' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <GrLogout className={`w-5 h-5 ${theme === 'dark' ? 'invert' : ''}`} />
              <span className="mx-4">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar