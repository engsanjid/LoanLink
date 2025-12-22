import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import { useTheme } from '../../../context/ThemeContext'

const UpdateLoan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme } = useTheme()

  const { data: loan, isLoading } = useQuery({
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

    const updatedLoan = {
      title: form.title.value,
      category: form.category.value,
      interestRate: form.interestRate.value,
      maxAmount: form.maxAmount.value,
      emiPlan: form.emiPlan.value,
      description: form.description.value,
    }

    const token = await user.getIdToken()

    await axios.patch(
      `${import.meta.env.VITE_API_URL}/loans/${id}`,
      updatedLoan,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )

    alert('Loan Updated Successfully')
    navigate('/dashboard/manage-loans')
  }

  const inputClass = `w-full border p-2 rounded outline-none transition-all ${
    theme === 'light' 
    ? 'bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-indigo-100' 
    : 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-900'
  }`

  if (isLoading) return <p className={`p-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Loading...</p>

  return (
    <div className={`max-w-xl mx-auto rounded-xl shadow-2xl p-8 border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Update Loan</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`text-xs font-bold uppercase mb-1 block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Loan Title</label>
          <input name="title" defaultValue={loan?.title} className={inputClass} required />
        </div>

        <div>
          <label className={`text-xs font-bold uppercase mb-1 block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Category</label>
          <input name="category" defaultValue={loan?.category} className={inputClass} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`text-xs font-bold uppercase mb-1 block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Interest (%)</label>
            <input name="interestRate" type="number" step="0.01" defaultValue={loan?.interestRate} className={inputClass} required />
          </div>
          <div>
            <label className={`text-xs font-bold uppercase mb-1 block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Max Amount</label>
            <input name="maxAmount" type="number" defaultValue={loan?.maxAmount} className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={`text-xs font-bold uppercase mb-1 block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>EMI Plan</label>
          <input name="emiPlan" defaultValue={loan?.emiPlan} className={inputClass} />
        </div>

        <div>
          <label className={`text-xs font-bold uppercase mb-1 block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Description</label>
          <textarea name="description" rows="4" defaultValue={loan?.description} className={inputClass} />
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
          Update Loan Program
        </button>
      </form>
    </div>
  )
}

export default UpdateLoan