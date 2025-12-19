import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import LoanCard from './LoanCard'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'

const AllLoans = () => {
  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['all-loans'],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-loans`
      )
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-800">
            All Available Loans
          </h2>
          <p className="mt-3 text-gray-600">
            Explore all loan options created by our loan managers
          </p>
        </div>

        {/* Grid */}
        {loans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loans.map(loan => (
              <LoanCard key={loan._id} loan={loan} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No loans available right now.
          </p>
        )}
      </div>
    </section>
  )
}

export default AllLoans
