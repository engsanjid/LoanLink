import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'
const Stats = () => {
  const { theme } = useTheme()
  return (
    <section className={`py-24 transition-all ${
      theme === 'light' 
      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
      : 'bg-black text-white border-y border-gray-800'
    }`}>
  <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

    {[
      { value: '10K+', label: 'Happy Clients' },
      { value: '5K+', label: 'Loans Approved' },
      { value: '98%', label: 'Approval Rate' },
      { value: '24/7', label: 'Support' },
    ].map((stat, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}
        viewport={{ once: true }}
      >
        <h3 className="text-4xl font-extrabold">{stat.value}</h3>
        <p className="mt-2 text-white/90">{stat.label}</p>
      </motion.div>
    ))}

  </div>
</section>

  )
}

export default Stats
