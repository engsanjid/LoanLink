import { useForm } from 'react-hook-form'
import { imageUpload } from '../../utils'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'

const AddLoanForm = () => {
  const { user } = useAuth()

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async payload =>
      await axios.post(`${import.meta.env.VITE_API_URL}/loans`, payload),
    onSuccess: () => {
      toast.success('Loan added successfully 🎉')
      reset()
    },
    onError: err => toast.error(err.message),
  })

  const onSubmit = async data => {
    try {
      const imageFile = data.image[0]
      const imageUrl = await imageUpload(imageFile)

      const loanData = {
        title: data.title,
        description: data.description,
        category: data.category,
        interestRate: Number(data.interestRate),
        maxAmount: Number(data.maxAmount),
        documents: data.documents,
        emiPlan: data.emiPlan,
        image: imageUrl,
        showOnHome: data.showOnHome || false,
        createdAt: new Date().toISOString(),
        createdBy: {
          name: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
        },
      }

      await mutateAsync(loanData)
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
      >

        {/* LEFT */}
        <div className="space-y-5">

          {/* Loan Title */}
          <div>
            <label className="text-sm font-medium">Loan Title</label>
            <input
              className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2"
              {...register('title', { required: 'Title is required' })}
              placeholder="Personal Loan"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full border-b-2 border-gray-300 focus:border-pink-500 py-2"
              {...register('category', { required: true })}
            >
              <option value="">Select category</option>
              <option value="Personal">Personal</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Home">Home</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 focus:border-pink-500"
              rows="4"
              {...register('description', { required: true })}
            />
          </div>

          {/* Required Documents */}
          <div>
            <label className="text-sm font-medium">Required Documents</label>
            <input
              className="w-full border-b-2 border-gray-300 py-2"
              {...register('documents', { required: true })}
              placeholder="NID, Bank Statement"
            />
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          {/* Interest Rate */}
          <div>
            <label className="text-sm font-medium">Interest Rate (%)</label>
            <input
              type="number"
              className="w-full border-b-2 border-gray-300 py-2"
              {...register('interestRate', { required: true })}
            />
          </div>

          {/* Max Loan Limit */}
          <div>
            <label className="text-sm font-medium">Max Loan Amount</label>
            <input
              type="number"
              className="w-full border-b-2 border-gray-300 py-2"
              {...register('maxAmount', { required: true })}
            />
          </div>

          {/* EMI Plan */}
          <div>
            <label className="text-sm font-medium">EMI Plan</label>
            <input
              className="w-full border-b-2 border-gray-300 py-2"
              {...register('emiPlan', { required: true })}
              placeholder="6 / 12 / 24 months"
            />
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <label className="cursor-pointer">
              <input
                type="file"
             
                accept="image/*"
                {...register('image', { required: true })}
              />
              <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md">
                Upload Image
              </span>
            </label>
          </div>

          {/* Show on Home */}
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register('showOnHome')} />
            <label className="text-sm">Show this loan on Home page</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold"
          >
            {isPending ? <TbFidgetSpinner className="animate-spin mx-auto" /> : 'Save Loan'}
          </button>

        </div>
      </form>
    </div>
  )
}

export default AddLoanForm
