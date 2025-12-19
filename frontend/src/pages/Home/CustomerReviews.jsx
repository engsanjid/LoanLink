import { motion } from 'framer-motion'
const CustomerReviews = () => {
  return (
    <section className="py-24 bg-white">
  <div className="max-w-[1200px] mx-auto px-6 text-center">

    <h2 className="text-4xl font-extrabold mb-14 text-gray-800">
      What Our Customers Say
    </h2>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="
        max-w-2xl mx-auto 
        bg-gradient-to-br from-purple-50 to-pink-50 
        p-10 
        rounded-2xl 
        shadow-lg
      "
    >
      <p className="text-gray-700 italic text-lg leading-relaxed">
        “LoanLink made the loan process super easy and fast.  
        The approval was smooth and transparent. Highly recommended!”
      </p>
      <h4 className="mt-6 font-semibold text-gray-900">
        — Md. Rahim
      </h4>
    </motion.div>

  </div>
</section>

  )
}

export default CustomerReviews
