import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext' 

const CustomerReviews = () => {
  const { theme } = useTheme(); 

  return (
    <section className={`py-24 transition-all duration-500 ${
        theme === 'light' 
        ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50' 
        : 'bg-black text-white'
      }`}>
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className={`text-4xl font-extrabold mb-14 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          What Our Customers Say
        </h2>

        <motion.div
          className={`max-w-2xl mx-auto p-10 rounded-2xl shadow-lg ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-gray-700'
          }`}
        >
          <p className={`italic text-lg leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            “LoanLink made the loan process super easy and fast. The approval was smooth and transparent.”
          </p>
          <h4 className={`mt-6 font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-yellow-400'}`}>
            — Md. Rahim
          </h4>
        </motion.div>
      </div>
    </section>
  )
}

export default CustomerReviews