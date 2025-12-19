import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 py-24 text-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Contact Us
          </motion.h1>

          <p className="mt-5 text-white/90 max-w-xl mx-auto">
            Have questions or need support? We’re here to help.
          </p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-20">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Email */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow text-center"
          >
            <FaEnvelope className="text-3xl text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Email</h3>
            <a
              href="mailto:mdsanjidi36@gmail.com"
              className="text-gray-600 hover:text-purple-600 transition"
            >
              mdsanjidi36@gmail.com
            </a>
          </motion.div>

          {/* Phone */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow text-center"
          >
            <FaPhoneAlt className="text-3xl text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Phone</h3>
            <a
              href="tel:+8801745532902"
              className="text-gray-600 hover:text-purple-600 transition"
            >
              +880 17455-32902
            </a>
          </motion.div>

          {/* Location */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow text-center"
          >
            <FaMapMarkerAlt className="text-3xl text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Location</h3>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Badda,Dhaka,Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition"
            >
              Badda, Dhaka, Bangladesh
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
