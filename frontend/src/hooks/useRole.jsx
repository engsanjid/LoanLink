import { useQuery } from '@tanstack/react-query'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure' // ইমপোর্ট করা হয়েছে

const useRole = () => {
  const { user, loading } = useAuth()
  const axiosSecure = useAxiosSecure() // হুকটি কল করা হয়েছে

  const { data: role = 'borrower', isLoading } = useQuery({
    queryKey: ['role', user?.email],
    enabled: !loading && !!user?.email, // লোডিং শেষ হলে এবং ইমেইল থাকলে রান হবে
    queryFn: async () => {
      // baseURL দেওয়া আছে তাই শুধু পাথ লিখলেই হবে
      const res = await axiosSecure.get(`/users/role?email=${user.email}`)
      return res.data.role
    },
  })

  return { role, isLoading }
}

export default useRole