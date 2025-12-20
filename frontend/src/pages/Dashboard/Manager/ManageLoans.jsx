import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { Link } from 'react-router'

const ManageLoans = () => {
  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const { data: loans = [], refetch, isLoading } = useQuery({
    queryKey: ['manager-loans', search],
    queryFn: async () => {
      const token = await user.getIdToken()
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/manager/manage-loans?search=${search}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      return res.data
    },
    enabled: !!user,
  })

  const handleDelete = async id => {
    const confirm = window.confirm('Are you sure you want to delete this loan?')
    if (!confirm) return

    const token = await user.getIdToken()
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/loans/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )

    refetch()
  }

  if (isLoading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Loans</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or category..."
        className="border px-3 py-2 rounded mb-4 w-full max-w-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Interest</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No loans found
                </td>
              </tr>
            )}

            {loans.map(loan => (
              <tr key={loan._id}>
                <td className="border p-2">
                  <img
                    src={loan.image}
                    alt={loan.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                </td>

                <td className="border p-2">{loan.title}</td>
                <td className="border p-2">{loan.interestRate}%</td>
                <td className="border p-2">{loan.category}</td>

                <td className="border p-2 space-x-2">
                  <Link
                    to={`/dashboard/update-loan/${loan._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Update
                  </Link>

                  <button
                    onClick={() => handleDelete(loan._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageLoans
