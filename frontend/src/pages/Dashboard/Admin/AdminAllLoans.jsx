import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router'
import { FaEdit, FaTrashAlt } from 'react-icons/fa' 
import { useTheme } from '../../../context/ThemeContext'

const AdminAllLoans = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [token, setToken] = useState(null)
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  useEffect(() => {
    if (!token) return
    axios.get(`${import.meta.env.VITE_API_URL}/admin/all-loans`, {
      headers: { authorization: `Bearer ${token}` },
    }).then(res => {
      setLoans(res.data)
      setLoading(false)
    })
  }, [token])

  const toggleHome = (id, value) => {
    axios.patch(`${import.meta.env.VITE_API_URL}/admin/loans/home/${id}`, { showOnHome: value }, { headers: { authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.success) {
          setLoans(prev => prev.map(l => (l._id === id ? { ...l, showOnHome: value } : l)))
        }
      })
  }

  const deleteLoan = id => {
    if (!confirm('Are you sure?')) return
    axios.delete(`${import.meta.env.VITE_API_URL}/admin/loans/${id}`, { headers: { authorization: `Bearer ${token}` } })
      .then(() => setLoans(prev => prev.filter(l => l._id !== id)))
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 px-4 py-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-3xl font-extrabold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>All Loans</h2>
          <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Manage and monitor all loan programs.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg text-indigo-700 font-semibold border border-indigo-100">
          Total Loans: {loans.length}
        </div>
      </div>

      <div className={`shadow-md rounded-xl border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className={`${theme === 'light' ? 'bg-gray-50 border-b border-gray-100' : 'bg-gray-700/50 border-b border-gray-600'}`}>
              <tr>
                <th className={`p-4 font-semibold uppercase text-xs tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Loan Info</th>
                <th className="p-4 font-semibold text-center text-xs uppercase tracking-wider">Interest</th>
                <th className="p-4 font-semibold text-center text-xs uppercase tracking-wider">Category</th>
                <th className="p-4 font-semibold hidden lg:table-cell text-xs uppercase tracking-wider">Creator</th>
                <th className="p-4 font-semibold text-center text-xs uppercase tracking-wider">Featured</th>
                <th className="p-4 font-semibold text-right text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-50' : 'divide-gray-700'}`}>
              {loading ? (
                 <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : loans.map(loan => (
                <tr key={loan._id} className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={loan.image} className="w-16 h-12 object-cover rounded-lg" alt={loan.title} />
                      <div className="flex flex-col">
                         <span className={`font-bold text-sm ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>{loan.title}</span>
                         <span className="text-[10px] text-gray-400 lg:hidden">{loan.createdBy?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{loan.interestRate}%</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-semibold uppercase ${theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-900 text-gray-400'}`}>
                      {loan.category}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-gray-500">{loan.createdBy?.email}</td>
                  <td className="p-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={loan.showOnHome || false} onChange={e => toggleHome(loan._id, e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/dashboard/update-loan/${loan._id}`)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><FaEdit size={16} /></button>
                      <button onClick={() => deleteLoan(loan._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FaTrashAlt size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminAllLoans