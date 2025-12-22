import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'

const ApplyLoan = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { theme } = useTheme()

  const { data: loan } = useQuery({
    queryKey: ['loan', id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/loan/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  const handleSubmit = async e => {
    e.preventDefault()
    const form = e.target
    const token = await user.getIdToken() 

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
      await axios.post(`${import.meta.env.VITE_API_URL}/loan-applications`, applicationData, {
        headers: { authorization: `Bearer ${token}` },
      })
      alert('Loan Application Submitted Successfully')
      form.reset()
    } catch (err) {
      console.error(err)
    }
  }

  // Common Input Class for Dark/Light Mode
  const inputBase = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all ${
    theme === 'light' 
    ? 'bg-gray-50 border-gray-200 text-gray-800' 
    : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
  }`

  const readOnlyInput = `w-full px-3 py-2 border rounded-lg mb-2 text-sm font-semibold ${
    theme === 'light' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-indigo-900/30 border-indigo-800 text-indigo-300'
  }`

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-500 ${
      theme === 'light' 
      ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' 
      : 'bg-gray-950'
    }`}>
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-8 border transition-all ${
        theme === 'light' ? 'bg-white border-transparent' : 'bg-gray-800 border-gray-700'
      }`}>
        <h2 className={`text-2xl font-bold text-center mb-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
          Loan Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-opacity-50">
             <p className={`text-xs mb-1 font-bold uppercase tracking-wider ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Loan Overview</p>
             <input value={user?.email || ''} readOnly className={readOnlyInput} />
             <input value={loan?.title || ''} readOnly className={readOnlyInput} />
             <input value={`${loan?.interestRate || ''}% Interest Rate`} readOnly className={readOnlyInput} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" placeholder="First Name" required className={inputBase} />
            <input name="lastName" placeholder="Last Name" required className={inputBase} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="contact" placeholder="Contact Number" required className={inputBase} />
            <input name="nid" placeholder="NID / Passport" required className={inputBase} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="incomeSource" placeholder="Income Source" required className={inputBase} />
            <input name="monthlyIncome" type="number" placeholder="Monthly Income" required className={inputBase} />
          </div>

          <input name="loanAmount" type="number" placeholder="Desired Loan Amount" required className={inputBase} />
          
          <textarea name="reason" placeholder="Reason for Loan" required className={`${inputBase} h-24`} />
          <textarea name="address" placeholder="Residential Address" required className={`${inputBase} h-20`} />
          <textarea name="notes" placeholder="Extra Notes (Optional)" className={`${inputBase} h-20`} />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplyLoan