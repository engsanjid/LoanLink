import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useEffect } from 'react'
import useAxiosSecure from '../hooks/useAxiosSecure' 

const PaymentSuccess = () => {
  const { loanId } = useParams()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure() 

  useEffect(() => {
    const confirmPayment = async () => {
      try {
       
        await axiosSecure.post(`/payment-success`, { loanId, sessionId })
        navigate('/dashboard/my-loans')
      } catch (error) {
        console.error('Payment confirmation failed:', error)
      }
    }

    if (user) {
      confirmPayment()
    }
  }, [user, loanId, sessionId, navigate, axiosSecure])

  return <p className="p-10 text-center">Payment successful 🎉</p>
}

export default PaymentSuccess