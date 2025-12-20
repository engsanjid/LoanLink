import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router'


const ApprovedLoans = () => {
  const { user } = useAuth()
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

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">Approved Loan Applications</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Loan ID</th>
            <th className="border p-2">Borrower</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Approved Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loans.map(loan => (
            <tr key={loan._id}>
              <td className="border p-2">{loan.loanId}</td>

              <td className="border p-2">
                <p className="font-medium">
                  {loan.firstName} {loan.lastName}
                </p>
                <p className="text-sm text-gray-500">{loan.userEmail}</p>
              </td>

              <td className="border p-2">৳ {loan.loanAmount}</td>

              <td className="border p-2">
                {loan.approvedAt
                  ? new Date(loan.approvedAt).toLocaleDateString()
                  : '—'}
              </td>

              <td className="border p-2">
             <button
           onClick={() => navigate(`/loan/${loan.loanId}`)}
          className="px-3 py-1 bg-indigo-500 text-white rounded"
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

export default ApprovedLoans
