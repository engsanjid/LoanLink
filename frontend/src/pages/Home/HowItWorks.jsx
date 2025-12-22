import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const steps = [
  { title: 'Apply Online', desc: 'Submit your loan request in minutes.' },
  { title: 'Get Approved', desc: 'Our managers review and approve fast.' },
  { title: 'Receive Funds', desc: 'Money sent directly to your account.' },
]

const HowItWorks = () => {
  const { theme } = useTheme(); 
  return (
    <section className={`py-24 transition-all duration-500 ${
        theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'
      }`}>
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className={`text-4xl font-extrabold text-center mb-14 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={`p-8 rounded-2xl shadow-lg text-center transition-all ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-gray-700'
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                {i + 1}
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                {step.title}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks