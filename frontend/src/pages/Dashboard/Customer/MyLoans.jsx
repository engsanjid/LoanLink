import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'

const MyLoans = () => {
  const { user, loading } = useAuth()
  const [token, setToken] = useState(null)

  // get firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  const { data: loans = [], isLoading } = useQuery({
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

  if (loading || isLoading) return <p className="p-6">Loading...</p>

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">My Loans</h2>

      {loans.length === 0 ? (
        <p>No loan applications found.</p>
      ) : (
        <table className="w-full border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Loan Title</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Interest</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Payment</th>
            </tr>
          </thead>

          <tbody>
            {loans.map(loan => (
              <tr key={loan._id} className="text-center">
                <td className="border p-2">{loan.loanTitle}</td>
                <td className="border p-2">৳ {loan.loanAmount}</td>
                <td className="border p-2">{loan.interestRate}%</td>
                <td className="border p-2">
                  <span className="px-2 py-1 rounded bg-yellow-100">
                    {loan.status}
                  </span>
                </td>
                <td className="border p-2">
                  {loan.feeStatus === 'Unpaid' ? (
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">
                      Pay
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Paid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default MyLoans
