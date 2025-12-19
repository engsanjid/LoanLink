import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Container from '../Shared/Container'
import LoadingSpinner from '../Shared/LoadingSpinner'
import LoanCard from './Card'

const Loans = () => {
  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['home-loans'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/loans`)
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <Container>
      <h2 className="text-3xl font-bold text-center mb-10">
        Available Loans
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loans.map(loan => (
          <LoanCard key={loan._id} loan={loan} />
        ))}
      </div>
    </Container>
  )
}

export default Loans
