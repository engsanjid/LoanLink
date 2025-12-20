import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import { useEffect } from 'react'

const PaymentSuccess = () => {
  const { loanId } = useParams()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const confirmPayment = async () => {
      const token = await user.getIdToken()

      await axios.post(
        `${import.meta.env.VITE_API_URL}/payment-success`,
        { loanId, sessionId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )

      navigate('/dashboard/my-loans')
    }

    confirmPayment()
  }, [])

  return <p className="p-10 text-center">Payment successful 🎉</p>
}

export default PaymentSuccess
