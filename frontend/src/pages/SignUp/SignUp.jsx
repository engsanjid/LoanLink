import { useNavigate, useLocation, Link } from "react-router"
import { FcGoogle } from "react-icons/fc"
import { TbFidgetSpinner } from "react-icons/tb"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import useAuth from "../../hooks/useAuth"
import { imageUpload } from "../../utils"
import useAxiosSecure from "../../hooks/useAxiosSecure"

const SignUp = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const axiosSecure = useAxiosSecure()
  const from = location.state || "/"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async data => {
    const { name, email, password, role, image } = data
    const imageFile = image?.[0]

    try {
      const imageURL = imageFile ? await imageUpload(imageFile) : ""
      
      // 1. Create User in Firebase
      await createUser(email, password)
      
      // 2. Update Firebase Profile
      await updateUserProfile(name, imageURL)

      // 3. Save user info in Database using axiosSecure
      await axiosSecure.post(`/users`, {
        name,
        email,
        role,
        image: imageURL,
      })

      toast.success("Account created successfully 🎉")
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle()
      
      // গুগল দিয়ে লগইন করলে ডিফল্টভাবে 'borrower' রোল দিয়ে ডেটাবেজে সেভ করা ভালো
      const user = result.user
      await axiosSecure.post(`/users`, {
        name: user?.displayName,
        email: user?.email,
        role: 'borrower',
        image: user?.photoURL,
      })

      toast.success("Signup successful 🎉")
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center px-14 text-white bg-gradient-to-br from-purple-700 via-pink-600 to-fuchsia-600">
          <Link to="/" className="mb-10 text-2xl font-bold tracking-wide text-yellow-300 hover:text-yellow-200 transition">
            LoanLink
          </Link>
          <h1 className="text-4xl font-bold mb-4">Welcome Page</h1>
          <p className="text-lg opacity-90 max-w-sm">
            Sign up to continue access and manage your loans with{" "}
            <Link to="/" className="font-semibold text-yellow-300 hover:text-yellow-200 underline underline-offset-4 transition">
              LoanLink
            </Link>
          </p>
          <div className="mt-12 text-sm opacity-70">www.loanlink.com</div>
        </div>

        <div className="flex items-center justify-center px-10 py-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <div>
                <input
                  className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                  placeholder="Full Name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <input
                  type="email"
                  className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-500">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full mt-1 border-b-2 border-pink-300 bg-pink-50 text-sm text-gray-600 focus:outline-none focus:border-pink-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-purple-600 file:to-pink-500 file:text-white hover:file:opacity-90"
                  {...register("image")}
                />
              </div>

              <div>
                <select
                  className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                  {...register("role", { required: "Role is required" })}
                >
                  <option value="">Select Role</option>
                  <option value="borrower">Borrower</option>
                  <option value="manager">Manager</option>
                </select>
                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
              </div>

              <div>
                <input
                  type="password"
                  className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z]).+$/, message: "Must include uppercase & lowercase letter" },
                  })}
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <button className="w-full py-3 text-white font-semibold rounded-md bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition">
                {loading ? <TbFidgetSpinner className="animate-spin mx-auto" /> : "CONTINUE"}
              </button>
            </form>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-md bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 transition"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow">
                  <FcGoogle size={18} />
                </span>
                <span className="text-white font-medium">Continue with Google</span>
              </button>
            </div>

            <p className="text-sm text-center mt-6 text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-600 font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp