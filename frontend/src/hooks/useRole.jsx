import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from './useAuth'

const useRole = () => {
  const { user } = useAuth()

  const { data: role = 'borrower', isLoading } = useQuery({
    queryKey: ['role', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/role?email=${user.email}`
      )
      return res.data.role
    },
  })

  return { role, isLoading }
}

export default useRole
