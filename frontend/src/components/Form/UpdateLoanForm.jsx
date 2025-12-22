import { useTheme } from '../../context/ThemeContext' // 

const UpdateLoanForm = () => {
  const { theme } = useTheme()

  const inputClass = `w-full px-4 py-3 border rounded-md focus:outline-none transition-all duration-300 ${
    theme === 'light'
      ? 'bg-white border-lime-300 text-gray-800 focus:outline-lime-500'
      : 'bg-gray-700 border-gray-600 text-white focus:outline-lime-400 focus:border-lime-400'
  }`

  const labelClass = `block font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`

  return (
    <div className={`w-full flex flex-col justify-center items-center rounded-xl p-6 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gray-800 border border-gray-700'
    }`}>
      <form className="w-full">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className='space-y-6'>
            {/* Name */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='name' className={labelClass}>Name</label>
              <input className={inputClass} name='name' id='name' type='text' placeholder='Plant Name' required />
            </div>
            {/* Category */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='category' className={labelClass}>Category</label>
              <select required className={inputClass} name='category'>
                <option value='Indoor'>Indoor</option>
                <option value='Outdoor'>Outdoor</option>
                <option value='Succulent'>Succulent</option>
                <option value='Flowering'>Flowering</option>
              </select>
            </div>
            {/* Description */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='description' className={labelClass}>Description</label>
              <textarea id='description' placeholder='Write plant description here...' className={`${inputClass} h-32`} name='description'></textarea>
            </div>
          </div>

          <div className='space-y-6 flex flex-col'>
            {/* Price & Quantity */}
            <div className='flex justify-between gap-2'>
              <div className='space-y-1 text-sm grow'>
                <label htmlFor='price' className={labelClass}>Price</label>
                <input className={inputClass} name='price' id='price' type='number' placeholder='Price' required />
              </div>
              <div className='space-y-1 text-sm grow'>
                <label htmlFor='quantity' className={labelClass}>Quantity</label>
                <input className={inputClass} name='quantity' id='quantity' type='number' placeholder='Quantity' required />
              </div>
            </div>

            {/* Image Upload Area */}
            <div className={`p-4 w-full m-auto rounded-lg grow border-4 border-dotted transition-colors ${
              theme === 'light' ? 'border-gray-300' : 'border-gray-600 bg-gray-700/50'
            }`}>
              <div className='file_upload px-5 py-3 relative rounded-lg'>
                <div className='flex flex-col w-max mx-auto text-center'>
                  <label>
                    <input type='file' name='image' id='image' accept='image/*' hidden />
                    <div className='bg-lime-500 text-white border border-transparent rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-600 transition-colors'>
                      Upload Image
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <button type='submit' className='w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 hover:bg-lime-600'>
              Update Plant
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdateLoanForm