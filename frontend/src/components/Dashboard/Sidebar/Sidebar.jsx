import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useRole from '../../../hooks/useRole'

// Icons
import { GrLogout } from 'react-icons/gr'
import { FcSettings } from 'react-icons/fc'
import { AiOutlineBars } from 'react-icons/ai'
import { BsGraphUp } from 'react-icons/bs'

// Menus
import MenuItem from './Menu/MenuItem'
import AdminMenu from './Menu/AdminMenu'
import ManagerMenu from './Menu/ManagerMenu'
import BorrowerMenu from './Menu/BorrowerMenu'

const Sidebar = () => {
  const { logOut } = useAuth()
  const { role, isLoading } = useRole()
  const [isActive, setActive] = useState(false)

  if (isLoading) return null

  const handleToggle = () => {
    setActive(!isActive)
  }

  return (
    <>
      {/* Mobile Navbar */}
      <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden">
        <Link to="/" className="p-4 font-bold text-2xl text-yellow-300">
          LoanLink
        </Link>

        <button
          onClick={handleToggle}
          className="p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between bg-gray-100 w-64 px-2 py-4 absolute inset-y-0 left-0 transform ${
          isActive && '-translate-x-full'
        } md:translate-x-0 transition duration-200`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden md:flex justify-center bg-lime-100 py-2 rounded">
            <Link to="/" className="text-2xl font-bold text-yellow-300">
              LoanLink
            </Link>
          </div>

          {/* Menu */}
          <nav className="mt-6 flex-1">
            <MenuItem
              icon={BsGraphUp}
              label="Statistics"
              address="/dashboard"
            />

            {/* ROLE BASED MENU */}
            {role === 'borrower' && <BorrowerMenu />}
            {role === 'manager' && <ManagerMenu />}
            {role === 'admin' && <AdminMenu />}
          </nav>

          {/* Bottom */}
          <div>
            <hr />
            <MenuItem
              icon={FcSettings}
              label="Profile"
              address="/dashboard/profile"
            />
            <button
              onClick={logOut}
              className="flex w-full items-center px-4 py-2 mt-4 text-gray-600 hover:bg-gray-300"
            >
              <GrLogout className="w-5 h-5" />
              <span className="mx-4">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
