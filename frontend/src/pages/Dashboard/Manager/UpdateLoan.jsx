import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'

const UpdateLoan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

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

  if (isLoading) return <p className="p-6">Loading...</p>

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Update Loan</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          defaultValue={loan?.title}
          placeholder="Loan Title"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="category"
          defaultValue={loan?.category}
          placeholder="Category"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="interestRate"
          type="number"
          defaultValue={loan?.interestRate}
          placeholder="Interest Rate"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="maxAmount"
          type="number"
          defaultValue={loan?.maxAmount}
          placeholder="Max Loan Amount"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="emiPlan"
          defaultValue={loan?.emiPlan}
          placeholder="EMI Plan"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          defaultValue={loan?.description}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Update Loan
        </button>
      </form>
    </div>
  )
}

export default UpdateLoan
