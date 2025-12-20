const Container = ({ children }) => {
  return (
    <div className='p-10 max-w-screen-2xl mx-auto xl:px-20 md:px-20 sm:px-4 px-6 overflow-x-hidden'>
      {children}
    </div>
  )
}

export default Container
