import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'
import { TbFidgetSpinner } from 'react-icons/tb'

const Login = () => {
  const { signIn, signInWithGoogle, loading, user, setLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state || '/'

  if (user) return <Navigate to={from} replace />

  const handleSubmit = async e => {
    e.preventDefault()
    const form = e.target
    const email = form.email.value
    const password = form.password.value

    try {
      await signIn(email, password)
      toast.success('Login Successful 🎉')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err?.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success('Login Successful 🎉')
      navigate(from, { replace: true })
    } catch (err) {
      setLoading(false)
      toast.error(err?.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 px-4">

      {/* CARD */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center px-14 text-white bg-gradient-to-br from-purple-700 via-pink-600 to-fuchsia-600">
          <Link
            to="/"
            className="mb-10 text-2xl font-bold tracking-wide text-yellow-300 hover:text-yellow-200 transition"
          >
            LoanLink
          </Link>

          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg opacity-90 max-w-sm">
            Log in to manage your loans with{' '}
            <Link
              to="/"
              className="font-semibold text-yellow-300 underline underline-offset-4"
            >
              LoanLink
            </Link>
          </p>

          <div className="mt-12 text-sm opacity-70">
            www.loanlink.com
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-10 py-12">
          <div className="w-full max-w-md">

            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Log In
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Sign in to access your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                />
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3 text-white font-semibold rounded-md bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition"
              >
                {loading ? (
                  <TbFidgetSpinner className="animate-spin mx-auto" />
                ) : (
                  'CONTINUE'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-md bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 transition"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow">
                <FcGoogle size={18} />
              </span>
              <span className="text-white font-medium">
                Continue with Google
              </span>
            </button>

            {/* Signup */}
            <p className="text-sm text-center mt-6 text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                state={from}
                className="text-pink-600 font-medium"
              >
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
