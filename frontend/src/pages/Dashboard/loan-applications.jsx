import { useQuery } from '@tanstack/react-query'
import useAuth from '../../hooks/useAuth'
import { FaEye, FaFilter, FaInfoCircle } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useState } from 'react'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'

const LoanApplications = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const axiosSecure = useAxiosSecure()
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['loan-applications', status],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/loan-applications?status=${status}`)
      return res.data
    }
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 min-h-screen transition-colors duration-500 ${theme === 'light' ? 'bg-transparent' : 'bg-gray-900'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className={`text-3xl font-extrabold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Loan Applications</h2>
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Review and manage all incoming loan requests</p>
        </div>

        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm border transition-colors ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
          <FaFilter className="text-indigo-500 text-sm" />
          <select
            className={`bg-transparent focus:outline-none text-sm font-semibold cursor-pointer ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="" className={theme === 'light' ? 'text-gray-700' : 'bg-gray-800'}>All Status</option>
            <option value="Pending" className={theme === 'light' ? 'text-gray-700' : 'bg-gray-800'}>Pending</option>
            <option value="Approved" className={theme === 'light' ? 'text-gray-700' : 'bg-gray-800'}>Approved</option>
            <option value="Rejected" className={theme === 'light' ? 'text-gray-700' : 'bg-gray-800'}>Rejected</option>
          </select>
        </div>
      </div>

      <div className={`shadow-xl rounded-2xl overflow-hidden border transition-colors ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={`transition-colors ${theme === 'light' ? 'bg-gray-50 border-b border-gray-100' : 'bg-gray-700/50 border-b border-gray-600'}`}>
              <tr>
                <th className={`px-6 py-4 font-bold uppercase text-xs tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Applicant</th>
                <th className={`px-6 py-4 font-bold uppercase text-xs tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Loan Category</th>
                <th className={`px-6 py-4 font-bold uppercase text-xs tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Amount</th>
                <th className={`px-6 py-4 font-bold uppercase text-xs tracking-wider text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Status</th>
                <th className={`px-6 py-4 font-bold uppercase text-xs tracking-wider text-right ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-50' : 'divide-gray-700'}`}>
              {applications.length > 0 ? (
                applications.map(app => (
                  <tr key={app._id} className={`transition-colors group ${theme === 'light' ? 'hover:bg-indigo-50/30' : 'hover:bg-gray-700/30'}`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{app.firstName} {app.lastName}</p>
                        <p className="text-xs text-gray-400">{app.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{app.loanTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-indigo-600">${app.loanAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelected(app)}
                        className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold shadow-sm transition-all ${
                          theme === 'light' 
                            ? 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white' 
                            : 'bg-gray-700 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        <FaEye /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No applications found...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className={`rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all scale-100 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="px-8 py-6 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Application Details</h3>
                <p className="text-indigo-100 text-xs mt-1 uppercase tracking-widest">Reference ID: {selected._id}</p>
              </div>
              <FaInfoCircle className="text-2xl text-indigo-200" />
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h4 className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-3">Personal Information</h4>
                  <div className={`space-y-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <p><span className="text-gray-400">Full Name:</span> <span className="font-semibold">{selected.firstName} {selected.lastName}</span></p>
                    <p><span className="text-gray-400">Email:</span> <span className="font-semibold">{selected.userEmail}</span></p>
                    <p><span className="text-gray-400">Phone:</span> <span className="font-semibold">{selected.contactNumber}</span></p>
                    <p><span className="text-gray-400">NID No:</span> <span className="font-semibold">{selected.nid}</span></p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-3">Loan Summary</h4>
                  <div className={`space-y-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <p><span className="text-gray-400">Category:</span> <span className="font-semibold">{selected.loanTitle}</span></p>
                    <p><span className="text-gray-400">Interest:</span> <span className="font-semibold">{selected.interestRate}%</span></p>
                    <p><span className="text-gray-400">Requested:</span> <span className="text-lg font-black text-indigo-600">${selected.loanAmount}</span></p>
                  </div>
                </section>
              </div>

              <div className={`rounded-2xl p-6 border transition-colors ${theme === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-gray-900/50 border-gray-700'}`}>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Financial Background</h4>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  <p><span className="text-gray-400">Source:</span> <span className="font-semibold">{selected.incomeSource}</span></p>
                  <p><span className="text-gray-400">Monthly Income:</span> <span className="font-semibold">${selected.monthlyIncome}</span></p>
                </div>
                <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                  <p className="text-xs text-gray-400 mb-1 font-bold uppercase">Reason for Loan:</p>
                  <p className={`text-sm italic leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>"{selected.reason}"</p>
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${theme === 'light' ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-900/20 border-indigo-500/20'}`}>
                  <div className="text-center flex-1">
                    <p className="text-[10px] text-indigo-400 font-bold uppercase">Application Status</p>
                    <p className={`font-black uppercase ${selected.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{selected.status}</p>
                  </div>
                  <div className="w-[1px] h-8 bg-indigo-200/30 mx-4"></div>
                  <div className="text-center flex-1">
                    <p className="text-[10px] text-indigo-400 font-bold uppercase">Fee Status</p>
                    <p className={`font-black uppercase ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>{selected.feeStatus}</p>
                  </div>
              </div>
            </div>

            <div className={`p-6 border-t transition-colors ${theme === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-gray-900/80 border-gray-700'}`}>
              <button
                onClick={() => setSelected(null)}
                className={`w-full md:w-auto float-right px-8 py-3 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                  theme === 'light' ? 'bg-gray-800 text-white hover:bg-black' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Close Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanApplications