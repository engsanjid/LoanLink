import { Outlet } from 'react-router'
import Navbar from '../components/Shared/Navbar/Navbar'
import Footer from '../components/Shared/Footer/Footer'
import { useTheme } from '../context/ThemeContext'

const MainLayout = () => {
  const { theme } = useTheme()
  
  return (
    <div className={`transition-colors duration-500 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-950 text-white'}`}>
      <Navbar />
      <div className="pt-[68px] min-h-[calc(100vh-68px)] overflow-x-hidden">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout