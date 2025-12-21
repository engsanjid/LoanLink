import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'

const ManageUsers = () => {
  const { user } = useAuth()
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ['admin-users'],
    enabled: !!token,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      return res.data
    },
  })

  const updateUser = async (id, data) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
      data,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    )
    refetch()
  }

  if (isLoading) return <p className="p-6">Loading...</p>

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u._id} className="text-center">
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 capitalize">{u.role}</td>
              <td className="border p-2 capitalize">{u.status}</td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => updateUser(u._id, { role: 'manager' })}
                  className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
                >
                  Make Manager
                </button>

                <button
                  onClick={() =>
                    updateUser(u._id, {
                      status: u.status === 'active' ? 'suspended' : 'active',
                    })
                  }
                  className={`px-3 py-1 rounded text-sm ${
                    u.status === 'active'
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {u.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageUsers
