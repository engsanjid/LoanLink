import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const MyLoans = () => {
  const { user, loading } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [selectedPayment, setSelectedPayment] = useState(null)
  const navigate = useNavigate()
  const { theme } = useTheme()

  const { data: loans = [], isLoading, refetch } = useQuery({
    queryKey: ['my-loans', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/my-loans')
      return res.data
    },
  })

  const handleCancel = async id => {
    if (!window.confirm('Cancel this loan?')) return
    await axiosSecure.patch(`/my-loans/cancel/${id}`)
    refetch()
  }

  const handlePay = async loanId => {
    const res = await axiosSecure.post('/create-checkout-session', { loanId })
    window.location.href = res.data.url
  }
  if (loading || isLoading) return <div className={`min-h-screen p-6 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'}`}>Loading...</div>

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className={`max-w-6xl mx-auto px-6 py-10 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        <h2 className="text-2xl font-bold mb-6">My Loans</h2>

        {loans.length === 0 ? (
          <p>No loan applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full border transition-colors duration-500 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}>
                <tr>
                  <th className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>Loan ID</th>
                  <th className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>Loan Info</th>
                  <th className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>Amount</th>
                  <th className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>Status</th>
                  <th className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loans.map(loan => (
                  <tr key={loan._id} className={`text-center transition-colors duration-500 ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800/50'}`}>
                    <td className={`border p-2 text-xs ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>{loan.loanId}</td>
                    <td className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                      <p className="font-medium">{loan.loanTitle}</p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Interest: {loan.interestRate}%
                      </p>
                    </td>
                    <td className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>৳ {loan.loanAmount}</td>
                    <td className={`border p-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>{loan.status}</td>
                    <td className={`border p-2 space-x-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                      <button onClick={() => navigate(`/loan/${loan.loanId}`)} className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition">View</button>
                      {loan.status === 'Pending' && (
                        <button onClick={() => handleCancel(loan._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Cancel</button>
                      )}
                      {loan.feeStatus === 'Unpaid' ? (
                        <button onClick={() => handlePay(loan._id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Pay $10</button>
                      ) : (
                        <button onClick={() => setSelectedPayment(loan.paymentInfo)} className={`px-3 py-1 rounded transition ${theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400 border border-green-800'}`}>Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className={`p-6 rounded-xl w-96 shadow-2xl transition-all duration-500 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white border border-gray-700'}`}>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Email:</span> {selectedPayment.email}</p>
              <p><span className="font-semibold">Transaction ID:</span> <span className="text-indigo-400">{selectedPayment.transactionId}</span></p>
              <p><span className="font-semibold">Amount:</span> ${selectedPayment.amount}</p>
              <p><span className="font-semibold">Date:</span> {new Date(selectedPayment.paidAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setSelectedPayment(null)} className="mt-6 w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyLoans