import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import { Link } from 'react-router-dom' // check if it's 'react-router' or 'react-router-dom'
import { FaSearch, FaEdit, FaTrashAlt, FaLayerGroup, FaPercentage } from 'react-icons/fa'
import { useTheme } from '../../../context/ThemeContext'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const ManageLoans = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const axiosSecure = useAxiosSecure()

  const { data: loans = [], refetch, isLoading } = useQuery({
    queryKey: ['manager-loans', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/manage-loans?search=${search}`)
      return res.data
    },
    enabled: !!user,
  })

  const handleDelete = async id => {
    const confirm = window.confirm('Are you sure you want to delete this loan?')
    if (!confirm) return

    try {
      await axiosSecure.delete(`/loans/${id}`)
      refetch()
    } catch (error) {
      console.error("Error deleting loan:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-purple-600"></span>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-8 transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-600">Loans</span>
          </h2>
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Search, update, or remove existing loan programs.</p>
        </div>

        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            className={`w-full pl-11 pr-4 py-3 border rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all ${theme === 'light' ? 'bg-white border-gray-200 text-gray-800' : 'bg-gray-800 border-gray-700 text-white'}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={`rounded-3xl shadow-xl border overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className={`transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50 border-b border-gray-100' : 'bg-gray-700/50 border-b border-gray-700'}`}>
              <tr>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Preview</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Loan Title</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Interest</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Category</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-right ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-50' : 'divide-gray-700'}`}>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 font-medium">
                    No loans found matching your criteria.
                  </td>
                </tr>
              ) : (
                loans.map(loan => (
                  <tr key={loan._id} className={`transition-colors group ${theme === 'light' ? 'hover:bg-purple-50/30' : 'hover:bg-gray-700/30'}`}>
                    <td className="p-5">
                      <div className={`relative w-20 h-14 overflow-hidden rounded-xl border shadow-sm ${theme === 'light' ? 'border-gray-100' : 'border-gray-600'}`}>
                        <img
                          src={loan.image}
                          alt={loan.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </td>

                    <td className="p-5">
                      <p className={`font-bold tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{loan.title}</p>
                    </td>

                    <td className="p-5 text-center">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-blue-900/30 text-blue-400 border-blue-800'}`}>
                        <FaPercentage size={12} /> {loan.interestRate}%
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-700 text-gray-300'}`}>
                        <FaLayerGroup size={12} /> {loan.category}
                      </div>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/dashboard/update-loan/${loan._id}`}
                          className={`p-3 rounded-xl transition-all shadow-sm ${theme === 'light' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white' : 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'}`}
                          title="Update Loan"
                        >
                          <FaEdit size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(loan._id)}
                          className={`p-3 rounded-xl transition-all shadow-sm ${theme === 'light' ? 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white' : 'bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white'}`}
                          title="Delete Loan"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageLoans