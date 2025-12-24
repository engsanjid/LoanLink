import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FaUserShield, FaUserCheck, FaUserSlash, FaEnvelope } from 'react-icons/fa'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const ManageUsers = () => {
  const { theme } = useTheme()
  const axiosSecure = useAxiosSecure()

  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // ✅ FIX: data is ARRAY, not object
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users', search, role],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/users?search=${search}&role=${role}`
      )
      return Array.isArray(res.data) ? res.data : []
    },
  })

  // pagination (client side)
  const totalPages = Math.ceil(users.length / itemsPerPage)
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const updateUser = async (id, data) => {
    try {
      await axiosSecure.patch(`/admin/users/${id}`, data)
      toast.success('User updated successfully!')
      refetch()
    } catch (err) {
      toast.error('Failed to update user')
    }
  }

  const handleSuspendConfirm = async () => {
    if (!reason || !feedback) {
      return toast.error('Please provide reason and feedback')
    }

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen px-4 py-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <h2 className={`text-3xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Manage Users
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border"
        />

        <select
          value={role}
          onChange={e => {
            setRole(e.target.value)
            setCurrentPage(1)
          }}
          className="px-6 py-3 rounded-xl border"
        >
          <option value="">All Roles</option>
          <option value="borrower">Borrower</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map(u => (
              <tr key={u._id} className="border-t">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold">
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs flex items-center gap-1 text-gray-500">
                      <FaEnvelope /> {u.email}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">{u.role}</td>

                <td className="px-6 py-4 text-center">
                  <span className={u.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                    {u.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  {u.role === 'borrower' && (
                    <button
                      onClick={() => updateUser(u._id, { role: 'manager' })}
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      <FaUserShield />
                    </button>
                  )}

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
                      className="px-3 py-1 bg-rose-600 text-white rounded"
                    >
                      {u.status === 'active' ? <FaUserSlash /> : <FaUserCheck />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Suspend Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Suspend User</h3>

            <input
              className="w-full border px-3 py-2 mb-3"
              placeholder="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />

            <textarea
              className="w-full border px-3 py-2 mb-3"
              placeholder="Feedback"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendConfirm}
                className="flex-1 bg-rose-600 text-white py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
