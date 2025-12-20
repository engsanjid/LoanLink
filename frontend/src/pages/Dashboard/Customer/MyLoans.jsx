import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'

const MyLoans = () => {
  const { user } = useAuth()

  const { data: loans = [] } = useQuery({
    queryKey: ['my-loans', user?.email],
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
    enabled: !!user?.email,
  })

  return (
    <div className="container mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">My Loans</h2>

      <table className="min-w-full border">
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Loan Info</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loans.map(loan => (
            <tr key={loan._id}>
              <td>{loan._id}</td>
              <td>{loan.
title}</td>
              <td>৳ {loan.maxAmount}</td>
              <td>{loan.status}</td>
              <td>
                <button>View</button>
                {loan.status === 'Pending' && <button>Cancel</button>}
                {loan.feeStatus === 'Unpaid' ? (
                  <button>Pay</button>
                ) : (
                  <span>Paid</span>
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
