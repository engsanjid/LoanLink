import { useForm } from 'react-hook-form'
import { imageUpload } from '../../utils'
import useAuth from '../../hooks/useAuth'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'
import { FaCloudUploadAlt, FaPercentage, FaWallet, FaRegCalendarAlt, FaFileAlt } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const AddLoanForm = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure() 
  const { theme } = useTheme()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async payload =>

      await axiosSecure.post(`/loans`, payload), 
    onSuccess: () => {
      toast.success('Loan added successfully 🎉')
      reset()
    },
    onError: err => toast.error(err.response?.data?.message || err.message),
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
      toast.error('Something went wrong ')
    }
  }

  return (
    <div className={`min-h-screen flex justify-center items-center px-4 py-12 transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50/50' : 'bg-gray-900'}`}>
      <div className={`w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-600 p-8 text-white">
          <h2 className="text-3xl font-black tracking-tight">Add New Loan Program</h2>
          <p className="opacity-80 text-sm mt-1">Provide necessary information to create a new financial plan.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaFileAlt className="text-purple-500" /> Loan Title
              </label>
              <input
                className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`}
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. Professional Business Loan"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1 font-medium">{errors.title.message}</p>}
            </div>

            <div>
              <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
              <select
                className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`}
                {...register('category', { required: true })}
              >
                <option value="">Select category</option>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Medical">Medical</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Home">Home</option>
              </select>
            </div>

            <div>
              <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Description</label>
              <textarea
                className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`}
                rows="5"
                placeholder="Briefly explain the loan benefits..."
                {...register('description', { required: true })}
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Required Documents</label>
              <input
                className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`}
                {...register('documents', { required: true })}
                placeholder="NID, Bank Statement, Trade License"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaPercentage className="text-pink-500" /> Interest (%)
                </label>
                <input
                  type="number" step="0.01"
                  className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`}
                  {...register('interestRate', { required: true })}
                />
              </div>
              <div>
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaWallet className="text-emerald-500" /> Max Amount
                </label>
                <input
                  type="number"
                  className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`}
                  {...register('maxAmount', { required: true })}
                />
              </div>
            </div>

            <div>
              <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaRegCalendarAlt className="text-blue-500" /> EMI Plan (Months)
              </label>
              <input
                className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'}`}
                {...register('emiPlan', { required: true })}
                placeholder="e.g. 6, 12, 24, 36"
              />
            </div>

            <div className={`group relative border-2 border-dashed rounded-2xl p-6 transition-all hover:border-purple-400 ${theme === 'light' ? 'border-gray-300 bg-gray-50/50' : 'border-gray-600 bg-gray-700/30'}`}>
              <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <FaCloudUploadAlt size={40} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                <span className={`text-sm font-bold group-hover:text-purple-600 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Click to upload loan cover</span>
                <input
                  type="file"
                  className="hidden" 
                  accept="image/*"
                  {...register('image', { required: true })}
                />
              </label>
            </div>

            <div className={`flex items-center p-4 rounded-2xl border ${theme === 'light' ? 'bg-purple-50 border-purple-100' : 'bg-purple-900/20 border-purple-800'}`}>
              <input 
                type="checkbox" 
                id="showHome"
                className="w-5 h-5 accent-purple-600 rounded"
                {...register('showOnHome')} 
              />
              <label htmlFor="showHome" className={`ml-3 text-sm font-bold cursor-pointer ${theme === 'light' ? 'text-purple-700' : 'text-purple-300'}`}>
                Promote this loan on the home page
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-600 text-white font-black uppercase tracking-widest shadow-xl hover:opacity-90 hover:scale-[1.01] transition-all active:scale-95 disabled:grayscale"
            >
              {isPending ? <TbFidgetSpinner className="animate-spin mx-auto text-2xl" /> : 'Create Loan Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLoanForm