import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'

const PendingLoans = () => {
  const { user } = useAuth()
  const [token, setToken] = useState(null)

  // get firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  const { data: loans = [], refetch, isLoading } = useQuery({
    queryKey: ['pending-loans'],
    enabled: !!token,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/pending-loans`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      return res.data
    },
  })

  const handleStatus = async (id, status) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/loan-applications/${id}`,
      { status },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    refetch()
  }

  if (isLoading) return <p className="p-6">Loading...</p>

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">Pending Loan Applications</h2>

      <table className="w-full border">
       <thead className="bg-gray-100">
  <tr>
    <th className="border p-2">Loan ID</th>
    <th className="border p-2">Borrower</th>
    <th className="border p-2">Amount</th>
    <th className="border p-2">Applied Date</th>
    <th className="border p-2">Actions</th>
  </tr>
</thead>


        <tbody>
  {loans.map(loan => (
    <tr key={loan._id} className="text-center">
      {/* Loan ID */}
      <td className="border p-2 text-xs">
        {loan._id}
      </td>

      {/* Borrower Info */}
      <td className="border p-2">
        <p className="font-medium">
          {loan.firstName} {loan.lastName}
        </p>
        <p className="text-sm text-gray-500">
          {loan.userEmail}
        </p>
      </td>

      {/* Amount */}
      <td className="border p-2">
        ৳ {loan.loanAmount}
      </td>

      {/* Applied Date */}
      <td className="border p-2">
        {loan.createdAt
          ? new Date(loan.createdAt).toLocaleDateString()
          : '—'}
      </td>

      {/* Actions */}
      <td className="border p-2 space-x-2">
        <button
          onClick={() => handleStatus(loan._id, 'Approved')}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Approve
        </button>

        <button
          onClick={() => handleStatus(loan._id, 'Rejected')}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Reject
        </button>

        <button
          onClick={() =>
            window.open(`/loan/${loan.loanId}`, '_blank')
          }
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          View
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  )
}

export default PendingLoans
