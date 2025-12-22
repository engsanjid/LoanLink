import { useTheme } from '../../context/ThemeContext'

const WhyChooseUs = () => {
  const { theme } = useTheme();

  return (
    <section className={`py-20 transition-all duration-500 ${
        theme === 'light' 
        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
        : 'bg-gray-900 text-white border-t border-gray-800'
      }`}>
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose LoanLink?</h2>
        <p className={`max-w-2xl mx-auto ${theme === 'light' ? 'text-white/90' : 'text-gray-400'}`}>
          Trusted by thousands of borrowers with transparent policies, fast processing, and secure transactions.
        </p>
      </div>
    </section>
  )
}

export default WhyChooseUs