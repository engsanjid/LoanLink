import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'

const AdminAllLoans = () => {
  const { user } = useAuth()
  const [token, setToken] = useState(null)
  const [loans, setLoans] = useState([])

  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  useEffect(() => {
    if (!token) return

    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/all-loans`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(res => setLoans(res.data))
  }, [token])

  const toggleHome = (id, value) => {
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/admin/loans/home/${id}`,
        { showOnHome: value },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setLoans(prev =>
          prev.map(l =>
            l._id === id ? { ...l, showOnHome: value } : l
          )
        )
      })
  }

  const deleteLoan = id => {
    if (!confirm('Are you sure you want to delete this loan?')) return

    axios
      .delete(`${import.meta.env.VITE_API_URL}/admin/loans/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(() => {
        setLoans(prev => prev.filter(l => l._id !== id))
      })
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">All Loans</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Image</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Interest</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Created By</th>
            <th className="border p-2">Show on Home</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loans.map(loan => (
            <tr key={loan._id} className="text-center">
              <td className="border p-2">
                <img src={loan.image} className="w-14 h-10 object-cover mx-auto" />
              </td>
              <td className="border p-2">{loan.title}</td>
              <td className="border p-2">{loan.interest}%</td>
              <td className="border p-2">{loan.category}</td>
              <td className="border p-2">{loan.createdBy?.email}</td>

              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={loan.showOnHome || false}
                  onChange={e => toggleHome(loan._id, e.target.checked)}
                />
              </td>

              <td className="border p-2 space-x-2">
                <button className="px-3 py-1 bg-indigo-500 text-white rounded text-sm">
                  Update
                </button>

                <button
                  onClick={() => deleteLoan(loan._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminAllLoans
