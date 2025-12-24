import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const ApplyLoan = () => {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const axiosSecure = useAxiosSecure()

  const { data: loan = {}, isLoading } = useQuery({
    queryKey: ['loan', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/loan/${id}`)
      return res.data || {}
    },
  })

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!loan?._id || !user?.email) return alert('Invalid data')

    const form = e.target

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

    try {
      await axiosSecure.post('/loan-applications', applicationData)
      alert('Loan Application Submitted Successfully')
      form.reset()
    } catch (err) {
      console.error(err)
      alert('Failed to submit application')
    }
  }

  const inputBase = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all ${
    theme === 'light'
      ? 'bg-gray-50 border-gray-200 text-gray-800'
      : 'bg-gray-700 border-gray-600 text-white'
  }`

  const readOnlyInput = `w-full px-3 py-2 border rounded-lg mb-2 text-sm font-semibold ${
    theme === 'light'
      ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
      : 'bg-indigo-900/30 border-indigo-800 text-indigo-300'
  }`

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-10 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
        : 'bg-gray-950'
    }`}>
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-8 ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}>
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Loan Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input readOnly value={user?.email || ''} className={readOnlyInput} />
          <input readOnly value={loan?.title || ''} className={readOnlyInput} />
          <input
            readOnly
            value={`${loan?.interestRate || 0}% Interest Rate`}
            className={readOnlyInput}
          />

          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" placeholder="First Name" required className={inputBase} />
            <input name="lastName" placeholder="Last Name" required className={inputBase} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="contact" placeholder="Contact Number" required className={inputBase} />
            <input name="nid" placeholder="NID / Passport" required className={inputBase} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="incomeSource" placeholder="Income Source" required className={inputBase} />
            <input name="monthlyIncome" type="number" placeholder="Monthly Income" required className={inputBase} />
          </div>

          <input name="loanAmount" type="number" placeholder="Loan Amount" required className={inputBase} />
          <textarea name="reason" placeholder="Reason for Loan" required className={`${inputBase} h-20`} />
          <textarea name="address" placeholder="Address" required className={`${inputBase} h-16`} />
          <textarea name="notes" placeholder="Extra Notes (Optional)" className={`${inputBase} h-16`} />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplyLoan
