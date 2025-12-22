import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router'
import { FaEye, FaCalendarAlt, FaMoneyBillWave, FaUser } from 'react-icons/fa'
import { useTheme } from '../../../context/ThemeContext'

const ApprovedLoans = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['approved-loans'],
    queryFn: async () => {
      const token = await user.getIdToken()
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/approved-loans`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-purple-600"></span>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-8 min-h-screen transition-colors duration-300`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-extrabold tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Approved <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-600">Loans</span>
        </h2>
        <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>Track all successfully approved loan applications.</p>
      </div>

      <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className={`transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50 border-b border-gray-100' : 'bg-gray-700/50 border-b border-gray-700'}`}>
              <tr>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Loan Identity</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Borrower Details</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Amount</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Approval Date</th>
                <th className={`p-5 text-xs font-bold uppercase tracking-widest text-right ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Action</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-50' : 'divide-gray-700'}`}>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">No approved loans found.</td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan._id} className={`transition-colors group ${theme === 'light' ? 'hover:bg-purple-50/30' : 'hover:bg-gray-700/30'}`}>
                    <td className="p-5">
                      <span className={`font-mono font-bold px-3 py-1 rounded-md text-sm border ${theme === 'light' ? 'text-purple-600 bg-purple-50 border-purple-100' : 'text-purple-400 bg-purple-900/30 border-purple-800'}`}>
                        #{loan.loanId}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-pink-50 text-pink-500' : 'bg-pink-900/30 text-pink-400'}`}>
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
                      <div className="flex flex-col items-center">
                        <span className={`font-black text-lg ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                          ৳{loan.loanAmount.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400">
                           <FaMoneyBillWave /> Disbursed
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <div className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full border transition-colors duration-300 ${theme === 'light' ? 'text-gray-600 bg-gray-50 border-gray-100' : 'text-gray-300 bg-gray-700 border-gray-600'}`}>
                        <FaCalendarAlt className="text-purple-400" />
                        {loan.approvedAt ? new Date(loan.approvedAt).toLocaleDateString() : '—'}
                      </div>
                    </td>

                    <td className="p-5 text-right">
                      <button
                        onClick={() => navigate(`/loan/${loan.loanId}`)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95"
                      >
                        <FaEye /> View Details
                      </button>
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

export default ApprovedLoans