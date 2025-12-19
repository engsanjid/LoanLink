import { motion } from "framer-motion"
import { Link } from "react-router"
import Loans from '../../components/Home/Loans'
import bannerimg from "../../assets/images/unnamed.jpg"

const Home = () => {
  return (
    <div className="overflow-hidden">

      {/*HERO SECTION */}
      <section className="min-h-[90vh] bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 flex items-center">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Smart Loans <br /> Made Simple with{' '}
              <span className="text-yellow-300">LoanLink</span>
            </h1>

            <p className="mt-5 text-lg text-white/90 max-w-xl">
              Apply for personal, business, education, or emergency loans with
              fast approval, transparent terms, and flexible EMI plans.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/dashboard/add-loan"
                className="px-6 py-3 rounded-md bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
              >
                Apply for Loan
              </Link>

              <Link
                to="/all-loans"
                className="px-6 py-3 rounded-md border border-white text-white hover:bg-white hover:text-purple-600 transition"
              >
                Explore Loans
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <img
              src={bannerimg}
              alt="Loan Banner"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>
{/* AVAIABLE LOAN  */}
    <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50">
  <div className="max-w-[1200px] mx-auto px-6">
    
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center mb-14"
    >
      <h2 className="text-4xl font-extrabold text-gray-800">
        Available Loan Plans
      </h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Choose from flexible loan options designed for your personal, business, or emergency needs.
      </p>
    </motion.div>

    <Loans />
  </div>
</section>


    
    

    
      

      
   

     
     
    </div>
  )
}

export default Home
