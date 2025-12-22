import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const About = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>

      {/* HERO */}
      <section className={`py-24 text-white transition-all duration-500 ${
        theme === 'light' 
        ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600' 
        : 'bg-gray-800 border-b border-gray-700'
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold"
          >
            About LoanLink
          </motion.h1>

          <p className="mt-5 max-w-2xl mx-auto text-white/90 text-lg">
            A modern microloan request & approval system built to simplify
            lending for borrowers, managers, and financial organizations.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Our Mission
            </h2>
            <p className={`leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              LoanLink aims to bridge the gap between borrowers and lenders by
              offering a transparent, fast, and secure loan management platform.
              We help microfinance institutions manage applications, approvals,
              EMI schedules, and repayments efficiently.
            </p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Why LoanLink?
            </h2>
            <ul className={`space-y-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <li>✔ Role-based dashboards (Admin, Manager, Borrower)</li>
              <li>✔ Secure Firebase Authentication & JWT protection</li>
              <li>✔ Real-time loan application tracking</li>
              <li>✔ Clean UI with smooth animations</li>
              <li>✔ Scalable MongoDB backend</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About