import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
const LoanApplications = () => {
const { user } = useAuth()
  const [token, setToken] = useState(null)
  const [applications, setApplications] = useState([])
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t))
    }
  }, [user])

  useEffect(() => {
    if (!token) return

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/admin/loan-applications?status=${status}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then(res => setApplications(res.data))
  }, [token, status])

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-4">Loan Applications</h2>

      {/* Filter */}
      <select
        className="border p-2 mb-4"
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Loan ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map(app => (
  <tr key={app._id} className="text-center">
    <td className="border p-2 text-xs">{app._id}</td>
    <td className="border p-2">
      <p className="font-semibold">{app.firstName} {app.lastName}</p>
      <p className="text-xs text-gray-500">{app.userEmail}</p>
    </td>
    <td className="border p-2">{app.loanTitle}</td>
    <td className="border p-2">${app.loanAmount}</td>
    <td className="border p-2">
      <span className={`px-2 py-1 rounded-full text-xs ${
        app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
        {app.status}
      </span>
    </td>
    <td className="border p-2">
      <button
        onClick={() => setSelected(app)}
        className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
      >
        View
      </button>
    </td>
  </tr>
))}
        </tbody>
      </table>

      
      {/* Modal */}
{selected && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
        <span className="text-xs text-gray-400">ID: {selected._id}</span>
      </div>

      <div className="space-y-3 text-gray-700">
        <div className="grid grid-cols-2 gap-4">
            <p><b>First Name:</b> {selected.firstName}</p>
            <p><b>Last Name:</b> {selected.lastName}</p>
        </div>
        <p><b>Email:</b> {selected.userEmail}</p>
        <p><b>Phone:</b> {selected.contactNumber}</p>
        <p><b>NID:</b> {selected.nid}</p>
        
        <hr className="my-2" />
        
        <p><b>Loan Type:</b> {selected.loanTitle}</p>
        <p><b>Interest Rate:</b> {selected.interestRate}%</p>
        <p><b>Requested Amount:</b> <span className="text-green-600 font-bold">${selected.loanAmount}</span></p>
        
        <hr className="my-2" />

        <p><b>Income Source:</b> {selected.incomeSource}</p>
        <p><b>Monthly Income:</b> ${selected.monthlyIncome}</p>
        <p><b>Reason:</b> {selected.reason}</p>
        <p><b>Address:</b> {selected.address}</p>
        <p><b>Admin Notes:</b> {selected.notes || 'N/A'}</p>
        
        <div className="mt-4 p-3 bg-gray-50 rounded">
            <p><b>Status:</b> <span className="font-bold uppercase">{selected.status}</span></p>
            <p><b>Fee Status:</b> {selected.feeStatus}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelected(null)}
          className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default LoanApplications
