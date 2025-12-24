import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Container from '../../components/Shared/Container'
import Button from '../../components/Shared/Button/Button'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import useAuth from '../../hooks/useAuth'
import { FaPercentage, FaWallet, FaRegCalendarAlt, FaUserTie, FaCheckCircle } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const LoanDetails = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const axiosSecure = useAxiosSecure()

  const { data: loan, isLoading, error } = useQuery({
    queryKey: ['loan-details', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/loan/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingSpinner />
  if (!loan || error) return <p className="text-center py-20 font-bold text-gray-500 text-xl">Loan details not found</p>

  const { title, image, description, category, interestRate, maxAmount, emiPlan, createdBy } = loan
  const canApply = user && role === "borrower"

  return (
    <div className={`min-h-screen py-10 transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <Container>
        <div className={`max-w-6xl mx-auto rounded-3xl shadow-2xl overflow-hidden border grid grid-cols-1 lg:grid-cols-2 items-stretch transition-colors duration-300 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
          
          <div className="relative group overflow-hidden">
            <img src={image} alt={title} className="w-full h-full min-h-[350px] lg:min-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-6 left-6">
              <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                {category}
              </span>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className={`text-3xl md:text-4xl font-black leading-tight mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                {title}
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
            </div>

            <p className={`mb-8 leading-relaxed text-lg italic ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              "{description}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: FaPercentage, label: 'Interest', val: `${interestRate}%`, color: 'purple' },
                { icon: FaWallet, label: 'Max Limit', val: `৳${maxAmount.toLocaleString()}`, color: 'pink' },
                { icon: FaRegCalendarAlt, label: 'EMI Plan', val: `${emiPlan} Mo`, color: 'blue' },
                { icon: FaUserTie, label: 'Manager', val: createdBy?.name || 'Admin', color: 'emerald' },
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                  theme === 'light' 
                  ? `bg-${item.color}-50 border-${item.color}-100` 
                  : `bg-${item.color}-900/10 border-${item.color}-900/30`
                }`}>
                  <div className={`p-3 rounded-xl shadow-sm bg-white ${theme === 'light' ? `text-${item.color}-600` : `text-${item.color}-400 bg-gray-700`}`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-bold ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                    <p className={`text-lg font-black truncate w-24 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-4 pt-6 border-t ${theme === 'light' ? 'border-gray-100' : 'border-gray-700'}`}>
              {canApply ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                    <FaCheckCircle /> You are eligible to apply
                  </div>
                  <Button label="Apply for this Loan" onClick={() => navigate(`/apply-loan/${id}`)} className="w-full py-4 text-lg" />
                </div>
              ) : (
                <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${theme === 'light' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-red-900/10 border-red-900/30 text-red-400'}`}>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-bold uppercase tracking-wide">Application Restricted for Staff/Admins</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default LoanDetails