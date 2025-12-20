import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MyLoans = () => {
  const { user, loading } = useAuth()
  const [token, setToken] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const navigate = useNavigate()

  // get firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  const { data: loans = [], isLoading, refetch } = useQuery({
    queryKey: ['my-loans', user?.email],
    enabled: !!token,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-loans`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      return res.data
    },
  })

  // CANCEL
  const handleCancel = async id => {
    if (!window.confirm('Cancel this loan?')) return

    await axios.patch(
      `${import.meta.env.VITE_API_URL}/my-loans/cancel/${id}`,
      {},
      {
        headers: { authorization: `Bearer ${token}` },
      }
    )
    refetch()
  }

 
  const handlePay = async loanId => {
  const firebaseToken = await user.getIdToken(true)

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/create-checkout-session`,
    { loanId },
    {
      headers: {
        authorization: `Bearer ${firebaseToken}`,
      },
    }
  )

  window.location.href = res.data.url
}


  if (loading || isLoading) return <p className="p-6">Loading...</p>

  return (
    <>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">My Loans</h2>

        {loans.length === 0 ? (
          <p>No loan applications found.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Loan ID</th>
                <th className="border p-2">Loan Info</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loans.map(loan => (
                <tr key={loan._id} className="text-center">
                  <td className="border p-2 text-xs">{loan.loanId}</td>

                  <td className="border p-2">
                    <p className="font-medium">{loan.loanTitle}</p>
                    <p className="text-sm text-gray-500">
                      Interest: {loan.interestRate}%
                    </p>
                  </td>

                  <td className="border p-2">৳ {loan.loanAmount}</td>

                  <td className="border p-2">{loan.status}</td>

                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => navigate(`/loan/${loan.loanId}`)}
                      className="px-3 py-1 bg-indigo-500 text-white rounded"
                    >
                      View
                    </button>

                    {loan.status === 'Pending' && (
                      <button
                        onClick={() => handleCancel(loan._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    )}

                    {loan.feeStatus === 'Unpaid' ? (
                      <button
                        onClick={() => handlePay(loan._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Pay $10
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedPayment(loan.paymentInfo)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded"
                      >
                        Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/*  PAYMENT MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-3">Payment Details</h3>
            <p>Email: {selectedPayment.email}</p>
            <p>Transaction ID: {selectedPayment.transactionId}</p>
            <p>Amount: ${selectedPayment.amount}</p>
            <p>Date: {new Date(selectedPayment.paidAt).toLocaleString()}</p>

            <button
              onClick={() => setSelectedPayment(null)}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default MyLoans
