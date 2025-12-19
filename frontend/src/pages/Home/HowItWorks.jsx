import { motion } from 'framer-motion'

const steps = [
  { title: 'Apply Online', desc: 'Submit your loan request in minutes.' },
  { title: 'Get Approved', desc: 'Our managers review and approve fast.' },
  { title: 'Receive Funds', desc: 'Money sent directly to your account.' },
]

const HowItWorks = () => {
  return (
   <section className="py-24 bg-white">
  <div className="max-w-[1200px] mx-auto px-6">

    <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-800">
      How It Works
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          viewport={{ once: true }}
          className="
            p-8 rounded-2xl 
            bg-white 
            shadow-lg 
            hover:shadow-2xl 
            transition 
            text-center
          "
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
            {i + 1}
          </div>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            {step.title}
          </h3>
          <p className="text-gray-600">
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
