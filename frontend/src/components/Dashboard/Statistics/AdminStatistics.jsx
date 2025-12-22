import { FaUserAlt, FaDollarSign, FaFileInvoiceDollar } from 'react-icons/fa'
import { BsFillCartPlusFill, BsBriefcaseFill } from 'react-icons/bs'
import { useTheme } from '../../../context/ThemeContext'

const AdminStatistics = () => {
  const { theme } = useTheme()

  return (
    <div className={`p-6 min-h-screen transition-colors duration-500 ${theme === 'light' ? 'bg-gray-50/50' : 'bg-gray-900'}`}>
      <div className="mt-6">
        <div className="mb-10">
          <h2 className={`text-3xl font-bold tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>System Overview</h2>
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Real-time statistics and platform performance metrics.</p>
        </div>

        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Total Revenue Card */}
          <div className={`relative flex flex-col rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
            <div className="absolute -top-4 left-6 h-14 w-14 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl shadow-lg flex items-center justify-center text-white">
              <FaDollarSign className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Revenue</p>
              <h4 className={`text-2xl font-black mt-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>$1,240</h4>
            </div>
            <div className={`mt-4 border-t pt-4 ${theme === 'light' ? 'border-gray-50' : 'border-gray-700'}`}>
               <p className="text-xs text-green-500 font-bold">+5% <span className="text-gray-400 font-normal ml-1">than last month</span></p>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className={`relative flex flex-col rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
            <div className="absolute -top-4 left-6 h-14 w-14 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl shadow-lg flex items-center justify-center text-white">
              <BsFillCartPlusFill className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Orders</p>
              <h4 className={`text-2xl font-black mt-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>120</h4>
            </div>
            <div className={`mt-4 border-t pt-4 ${theme === 'light' ? 'border-gray-50' : 'border-gray-700'}`}>
               <p className="text-xs text-blue-500 font-bold">+12 <span className="text-gray-400 font-normal ml-1">new today</span></p>
            </div>
          </div>

          {/* Total Loans Card */}
          <div className={`relative flex flex-col rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
            <div className="absolute -top-4 left-6 h-14 w-14 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-xl shadow-lg flex items-center justify-center text-white">
              <BsBriefcaseFill className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Loans</p>
              <h4 className={`text-2xl font-black mt-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>45</h4>
            </div>
            <div className={`mt-4 border-t pt-4 ${theme === 'light' ? 'border-gray-50' : 'border-gray-700'}`}>
               <p className="text-xs text-rose-500 font-bold">Active <span className="text-gray-400 font-normal ml-1">programs</span></p>
            </div>
          </div>

          {/* Total Users Card */}
          <div className={`relative flex flex-col rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
            <div className="absolute -top-4 left-6 h-14 w-14 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-xl shadow-lg flex items-center justify-center text-white">
              <FaUserAlt className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Users</p>
              <h4 className={`text-2xl font-black mt-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>1,024</h4>
            </div>
            <div className={`mt-4 border-t pt-4 ${theme === 'light' ? 'border-gray-50' : 'border-gray-700'}`}>
               <p className="text-xs text-emerald-500 font-bold">+18% <span className="text-gray-400 font-normal ml-1">growth rate</span></p>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className={`relative flex flex-col min-h-[300px] rounded-2xl shadow-sm border overflow-hidden xl:col-span-2 p-6 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Revenue Analytics</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Monthly</span>
            </div>
            <div className={`flex-grow flex items-center justify-center rounded-xl border border-dashed ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-600'}`}>
               <p className="text-gray-400 text-sm">Chart visualization goes here...</p>
            </div>
          </div>

          <div className={`relative flex flex-col min-h-[300px] rounded-2xl shadow-sm border overflow-hidden p-6 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
            <h3 className={`font-bold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Activity Schedule</h3>
            <div className={`flex-grow flex items-center justify-center rounded-xl border border-dashed ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-600'}`}>
               <p className="text-gray-400 text-sm">Calendar component goes here...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStatistics