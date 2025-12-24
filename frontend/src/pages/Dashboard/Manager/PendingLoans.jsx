import { useQuery } from '@tanstack/react-query'


import { FaUser, FaClock, FaCheck, FaTimes, FaEye } from 'react-icons/fa'
import { useTheme } from '../../../context/ThemeContext'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const PendingLoans = () => {
  const { theme } = useTheme()
  const axiosSecure = useAxiosSecure()

  const { data: loans = [], refetch, isLoading } = useQuery({
    queryKey: ['pending-loans'],
    queryFn: async () => {
      const res = await axiosSecure.get('/pending-loans')
      return res.data
    },
  })

  const handleStatus = async (id, status) => {
    await axiosSecure.patch(`/loan-applications/${id}`, { status })
    refetch()
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-fuchsia-600"></span>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-8 transition-colors duration-300`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-extrabold tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Pending <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-600">Applications</span>
        </h2>
        <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>Review and manage incoming loan requests.</p>
      </div>

      <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className={`${theme === 'light' ? 'bg-gray-50 border-b border-gray-100' : 'bg-gray-700/50 border-b border-gray-700'}`}>
              <tr>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Loan Identity</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Borrower Info</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Amount</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Applied Date</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-right ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-50' : 'divide-gray-700'}`}>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">No pending applications found.</td>
                </tr>
              ) : (
                loans.map(loan => (
                  <tr key={loan._id} className={`transition-colors group ${theme === 'light' ? 'hover:bg-pink-50/20' : 'hover:bg-gray-700/30'}`}>
                    <td className="p-5">
                      <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${theme === 'light' ? 'text-gray-400 bg-gray-100' : 'text-gray-400 bg-gray-900'}`}>
                        #{loan._id.slice(-8)}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-indigo-50 text-indigo-500' : 'bg-indigo-900/30 text-indigo-400'}`}>
                          <FaUser size={14} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                            {loan.firstName} {loan.lastName}
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{loan.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span className={`font-black text-base ${theme === 'light' ? 'text-fuchsia-600' : 'text-fuchsia-400'}`}>
                        ৳{loan.loanAmount.toLocaleString()}
                      </span>
                    </td>

                    <td className="p-5 text-center">
                      <div className={`inline-flex items-center gap-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <FaClock className="text-orange-400" />
                        {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : '—'}
                      </div>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatus(loan._id, 'Approved')}
                          className={`p-2 rounded-lg transition-all shadow-sm ${theme === 'light' ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-green-900/30 text-green-400 hover:bg-green-600 hover:text-white'}`}
                          title="Approve"
                        >
                          <FaCheck size={14} />
                        </button>

                        <button
                          onClick={() => handleStatus(loan._id, 'Rejected')}
                          className={`p-2 rounded-lg transition-all shadow-sm ${theme === 'light' ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white'}`}
                          title="Reject"
                        >
                          <FaTimes size={14} />
                        </button>

                        <button
                          onClick={() => window.open(`/loan/${loan.loanId}`, '_blank')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all shadow-sm text-xs font-bold ${theme === 'light' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white' : 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'}`}
                        >
                          <FaEye size={14} /> View
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

export default PendingLoans