import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'

const MyLoans = () => {
  const { user } = useAuth()

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['my-loans', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-loans`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      )
      return res.data
    },
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">My Loans</h2>

      <table className="w-full border">
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
            <tr key={loan._id}>
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
                  <button className="px-3 py-1 bg-blue-500 text-white rounded">
                    Pay
                  </button>
                ) : (
                  <span className="text-green-600">Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MyLoans
