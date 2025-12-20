import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'

const ApplyLoan = () => {
  const { id } = useParams()
  const { user } = useAuth()

  const { data: loan } = useQuery({
    queryKey: ['loan', id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/loan/${id}`
      )
      return res.data
    },
    enabled: !!id,
  })

  const handleSubmit = async e => {
    e.preventDefault()
    const form = e.target

    const token = await user.getIdToken() // 🔥 FIX

    const applicationData = {
      userEmail: user.email,
      loanId: loan._id,
      loanTitle: loan.title,
      interestRate: loan.interestRate,

      firstName: form.firstName.value,
      lastName: form.lastName.value,
      contactNumber: form.contact.value,
      nid: form.nid.value,
      incomeSource: form.incomeSource.value,
      monthlyIncome: form.monthlyIncome.value,
      loanAmount: form.loanAmount.value,
      reason: form.reason.value,
      address: form.address.value,
      notes: form.notes.value,
    }

    await axios.post(
      `${import.meta.env.VITE_API_URL}/loan-applications`,
      applicationData,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )

    alert('Loan Application Submitted Successfully')
    form.reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">
          Loan Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={user?.email || ''} readOnly className="w-full input" />
          <input value={loan?.title || ''} readOnly className="w-full input" />
          <input
            value={loan?.interestRate || ''}
            readOnly
            className="w-full input"
          />

          <div className="grid grid-cols-2 gap-2">
            <input name="firstName" placeholder="First Name" required />
            <input name="lastName" placeholder="Last Name" required />
          </div>

          <input name="contact" placeholder="Contact Number" required />
          <input name="nid" placeholder="NID / Passport" required />
          <input name="incomeSource" placeholder="Income Source" required />
          <input name="monthlyIncome" placeholder="Monthly Income" required />
          <input name="loanAmount" placeholder="Loan Amount" required />
          <textarea name="reason" placeholder="Reason for Loan" required />
          <textarea name="address" placeholder="Address" required />
          <textarea name="notes" placeholder="Extra Notes" />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplyLoan
