import { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import useRole from '../../../hooks/useRole' 
import coverImg from '../../../assets/images/cover img (1).png'
import { FaUserShield, FaEnvelope, FaIdBadge, FaEdit, FaLock, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useTheme } from '../../../context/ThemeContext'

const Profile = () => {
  const { user, updateUserProfile } = useAuth()
  const { theme } = useTheme()
  
  const data = useRole()
  const role = data?.role || 'User' 
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const photo = form.photo.value
    
    setLoading(true)
    try {
      await updateUserProfile(name, photo)
      toast.success('Profile updated successfully!')
      setIsUpdateModalOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex justify-center items-center min-h-screen p-4 transition-colors duration-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <div className={`shadow-2xl rounded-3xl w-full max-w-3xl overflow-hidden border transition-colors duration-500 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
        
        <div className='relative h-60 w-full'>
          <img
            alt='cover photo'
            src={coverImg}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-fuchsia-600/40'></div>
        </div>

        <div className='relative flex flex-col items-center p-8 -mt-24'>
          <div className='relative'>
            <img
              alt='profile'
              src={user?.photoURL}
              className={`mx-auto object-cover rounded-full h-40 w-40 border-8 shadow-2xl transition-colors duration-500 ${theme === 'light' ? 'border-white bg-gray-100' : 'border-gray-800 bg-gray-700'}`}
            />
            <div className='absolute bottom-3 right-3 h-7 w-7 bg-emerald-500 border-4 border-white rounded-full shadow-sm'></div>
          </div>

          <div className='mt-6 text-center'>
            <div className='inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md mb-4'>
              <FaUserShield className='text-yellow-300' />
              {role}
            </div>
            
            <h2 className={`text-4xl font-black tracking-tight capitalize transition-colors duration-500 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              {user?.displayName}
            </h2>
            
            <div className={`mt-3 flex items-center justify-center gap-2 font-medium transition-colors duration-500 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              <FaEnvelope className='text-purple-500' />
              {user?.email}
            </div>
          </div>

          <div className={`w-full space-y-5 mt-10 pt-8 border-t transition-colors duration-500 ${theme === 'light' ? 'border-gray-100' : 'border-gray-700'}`}>
            
            <div className={`flex items-center justify-between p-6 rounded-2xl border transition-colors duration-500 ${
              theme === 'light' 
              ? 'bg-gradient-to-r from-pink-50 via-purple-50 to-fuchsia-50 border-purple-100' 
              : 'bg-gray-700/50 border-gray-600'
            }`}>
              <div className='flex items-center gap-5'>
                <div className={`p-4 rounded-2xl shadow-sm text-purple-600 border transition-colors duration-500 ${theme === 'light' ? 'bg-white border-purple-100' : 'bg-gray-800 border-gray-600'}`}>
                  <FaIdBadge size={24} />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-purple-400' : 'text-purple-300'}`}>Official ID</p>
                  <p className={`text-lg font-mono font-bold break-all ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{user?.uid}</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button 
                onClick={() => setIsUpdateModalOpen(true)}
                className='flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-600 text-white font-bold rounded-2xl text-md hover:opacity-90 transition-all active:scale-95'
              >
                <FaEdit /> Edit Profile
              </button>
              <button className={`flex items-center justify-center gap-3 py-4 font-bold rounded-2xl text-md transition-all active:scale-95 border-2 ${
                theme === 'light' 
                ? 'bg-white border-purple-500 text-purple-600 hover:bg-purple-50' 
                : 'bg-transparent border-purple-500 text-purple-400 hover:bg-purple-900/20'
              }`}>
                <FaLock /> Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition-all duration-500 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="p-6 bg-gradient-to-r from-pink-500 to-fuchsia-600 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">Update Profile</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className='hover:rotate-90 transition-transform'><FaTimes /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-4">
              <div>
                <label className={`text-xs font-bold uppercase ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  defaultValue={user?.displayName} 
                  required 
                  className={`w-full mt-1 p-3 border rounded-xl focus:outline-purple-500 transition-colors duration-500 ${
                    theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'
                  }`} 
                />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Photo URL</label>
                <input 
                  name="photo" 
                  type="text" 
                  defaultValue={user?.photoURL} 
                  required 
                  className={`w-full mt-1 p-3 border rounded-xl focus:outline-purple-500 transition-colors duration-500 ${
                    theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'
                  }`} 
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-lg hover:bg-purple-700 transition-all disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile