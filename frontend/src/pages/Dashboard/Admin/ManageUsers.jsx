import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'

const ManageUsers = () => {
  const { user } = useAuth()
  const [token, setToken] = useState(null)

  // modal state
  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')

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
        { headers: { authorization: `Bearer ${token}` } }
      )
      return res.data
    },
  })

  const updateUser = async (id, data) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
      data,
      { headers: { authorization: `Bearer ${token}` } }
    )
    refetch()
  }

  const handleSuspendConfirm = async () => {
    await updateUser(selectedUser._id, {
      status: 'suspended',
      suspendReason: reason,
      suspendFeedback: feedback,
    })

    setOpenModal(false)
    setReason('')
    setFeedback('')
    setSelectedUser(null)
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
                {/* ✅ Make Manager → only Borrower, not Admin */}
                {u.role === 'borrower' && (
                  <button
                    onClick={() => updateUser(u._id, { role: 'manager' })}
                    className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
                  >
                    Make Manager
                  </button>
                )}

                {/* ✅ Suspend / Activate → not Admin */}
                {u.role !== 'admin' && (
                  <button
                    onClick={() => {
                      if (u.status === 'active') {
                        setSelectedUser(u)
                        setOpenModal(true)
                      } else {
                        updateUser(u._id, { status: 'active' })
                      }
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      u.status === 'active'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {u.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*  SUSPEND MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Suspend User</h3>

            <input
              type="text"
              placeholder="Suspend reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border p-2 mb-3"
            />

            <textarea
              placeholder="Admin feedback"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendConfirm}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
