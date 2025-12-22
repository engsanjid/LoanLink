import Button from '../components/Shared/Button/Button'
import { useNavigate } from 'react-router'
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <section className='bg-gray-50 min-h-screen flex items-center justify-center overflow-hidden relative'>
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

      <div className='container flex items-center px-6 py-12 mx-auto relative z-10'>
        <div className='flex flex-col items-center max-w-lg mx-auto text-center'>
          
          {/* Animated Icon Container */}
          <div className='p-6 mb-4 text-white rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 shadow-2xl animate-bounce'>
            <FaExclamationTriangle size={48} />
          </div>

          <h1 className='text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-fuchsia-600 mb-2'>
            404
          </h1>
          
          <h2 className='text-2xl font-bold text-gray-800 md:text-3xl tracking-tight'>
            Oops! Page Not Found
          </h2>
          
          <p className='mt-4 text-gray-500 text-lg leading-relaxed'>
            The page you are looking for doesn't exist or has been moved. 
            Don't worry, let's get you back on track!
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center w-full mt-8 gap-4 shrink-0'>
            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className='flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-100 rounded-xl gap-x-2 hover:bg-gray-50 hover:border-purple-300 shadow-sm'
            >
              <FaArrowLeft className="text-pink-500" />
              <span>Go Back</span>
            </button>

            {/* Home Button (Using your Custom Button) */}
            <div className="w-full sm:w-auto shadow-lg rounded-xl overflow-hidden">
              <Button 
                label={'Take Me Home'} 
                onClick={() => navigate('/')} 
              />
            </div>
          </div>
          
          {/* Helpful Link Text */}
          <p className="mt-8 text-sm text-gray-400 font-medium italic">
            Need help? <span className="text-purple-500 cursor-pointer underline">Contact Support</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default ErrorPage