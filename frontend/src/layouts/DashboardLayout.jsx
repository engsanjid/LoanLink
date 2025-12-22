import { Outlet } from 'react-router'
import Sidebar from '../components/Dashboard/Sidebar/Sidebar'
import { useTheme } from '../context/ThemeContext'

const DashboardLayout = () => {
  const { theme } = useTheme()
  
  return (
    <div className={`relative min-h-screen md:flex transition-colors duration-500 ${
      theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-950 text-white'
    }`}>
      {/* Left Side: Sidebar Component */}
      <Sidebar />
      
      {/* Right Side: Dashboard Dynamic Content */}
      <div className='flex-1 md:ml-64'>
        <div className='p-5'>
          {/* Outlet for dynamic contents */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout