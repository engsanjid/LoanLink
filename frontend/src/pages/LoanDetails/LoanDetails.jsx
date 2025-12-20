import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Container from '../../components/Shared/Container'
import Heading from '../../components/Shared/Heading'
import Button from '../../components/Shared/Button/Button'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import useAuth from '../../hooks/useAuth'

const LoanDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
const { user, role } = useAuth()
console.log('USER:', user)
console.log('ROLE:', role)


  const { data: loan, isLoading, error } = useQuery({
    queryKey: ['loan-details', id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/loan/${id}`
      )
      return res.data
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingSpinner />
  if (!loan || error)
    return <p className="text-center py-10">Loan not found</p>

  const {
    title,
    image,
    description,
    category,
    interestRate,
    maxAmount,
    emiPlan,
    createdBy,
  } = loan

  const canApply = role === 'borrower'

  return (
    <Container>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
        
        {/* Image */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={image}
            alt={title}
            className="w-full h-[240px] sm:h-[320px] lg:h-[380px] object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Category: {category}
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>

          <div className="space-y-2 text-gray-700">
            <p><strong>Interest Rate:</strong> {interestRate}%</p>
            <p><strong>Max Loan Limit:</strong> ৳ {maxAmount}</p>
            <p><strong>EMI Plans:</strong> {emiPlan}</p>
            <p>
              <strong>Loan Manager:</strong>{' '}
              {createdBy?.name || 'Manager'}
            </p>
          </div>

          {/* Action */}
          <div className="mt-8">
            {canApply ? (
              <Button
                label="Apply Now"
                onClick={() => navigate(`/apply-loan/${id}`)}
              />
            ) : (
              <p className="text-red-500 font-medium">
                Managers/Admins cannot apply for loans
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}


export default LoanDetails
