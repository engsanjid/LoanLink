import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'
import { FaUserShield, FaUserCheck, FaUserSlash, FaEnvelope } from 'react-icons/fa'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast' 

const ManageUsers = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [token, setToken] = useState(null)
  
  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')

  // Fixed: Separate 'searchTerm' (for typing) from 'search' (for API fetching)
  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  // Fixed: Debounce logic to prevent frequent API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchTerm)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const { data: userData = { users: [], totalUsers: 0 }, refetch, isLoading } = useQuery({
    queryKey: ['admin-users', search, role, currentPage, token],
    enabled: !!token,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users?search=${search}&role=${role}&page=${currentPage}&size=${itemsPerPage}`, 
        { headers: { authorization: `Bearer ${token}` } }
      )
      return res.data
    },
  })

  const totalPages = Math.ceil(userData.totalUsers / itemsPerPage)

  const updateUser = async (id, data) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, data, {
        headers: { authorization: `Bearer ${token}` }
      })
      toast.success('User updated successfully!')
      refetch()
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const handleSuspendConfirm = async () => {
    if (!reason || !feedback) return toast.error('Please provide reason and feedback')
    
    await updateUser(selectedUser._id, { 
      status: 'suspended', 
      suspendReason: reason, 
      suspendFeedback: feedback 
    })
    setOpenModal(false)
    setReason('')
    setFeedback('')
    setSelectedUser(null)
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )

  return (
    <div className={`min-h-screen transition-colors duration-500 px-4 py-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-extrabold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Manage Users</h2>
        <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Search, filter, and monitor user accounts.</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-800 border-gray-700 text-white'
            }`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={role}
          className={`px-6 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
            theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-800 border-gray-700 text-white'
          }`}
          onChange={(e) => { setRole(e.target.value); setCurrentPage(1); }}
        >
          <option value="">All Roles</option>
          <option value="borrower">Borrower</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className={`shadow-xl rounded-2xl overflow-hidden border ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${theme === 'light' ? 'bg-gray-50 border-b border-gray-100' : 'bg-gray-700 border-b border-gray-600'}`}>
              <tr>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500">User Details</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Role</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-50' : 'divide-gray-700'}`}>
              {userData.users.map(u => (
                <tr key={u._id} className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700/30'}`}>
                  <td className="px-6 py-4 flex items-center">
                    <div className="h-10 w-10 rounded-full mr-3 overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                      {u.image ? <img src={u.image} className="h-full w-full object-cover" /> : u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{u.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><FaEnvelope /> {u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {u.role === 'borrower' && <button onClick={() => updateUser(u._id, { role: 'manager' })} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-1"><FaUserShield /> Make Manager</button>}
                      {u.role !== 'admin' && (
                        <button onClick={() => { if (u.status === 'active') { setSelectedUser(u); setOpenModal(true); } else { updateUser(u._id, { status: 'active' }); } }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${u.status === 'active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}>{u.status === 'active' ? <FaUserSlash /> : <FaUserCheck />}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          Showing Page {currentPage} of {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-5 py-2 border rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
          >
            Previous
          </button>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-5 py-2 border rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 transition-colors duration-500 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <h3 className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Suspend Account</h3>
            <p className="text-sm text-gray-500 mb-6 text-center">Provide a clear reason and feedback for suspending <b>{selectedUser?.name}</b></p>
            <input type="text" placeholder="Reason (e.g. Policy Violation)" value={reason} onChange={e => setReason(e.target.value)} className={`w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`} />
            <textarea rows="3" placeholder="Detailed feedback for the user..." value={feedback} onChange={e => setFeedback(e.target.value)} className={`w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`} />
            <div className="flex gap-3 mt-2">
              <button onClick={() => { setOpenModal(false); setReason(''); setFeedback(''); }} className={`flex-1 py-3 rounded-xl font-bold border transition-all ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700 text-gray-300 border-gray-600'}`}>Cancel</button>
              <button onClick={handleSuspendConfirm} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg">Confirm Suspend</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers;