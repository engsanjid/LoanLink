import { Link, useLocation, useNavigate } from "react-router"
import { FcGoogle } from "react-icons/fc"
import { TbFidgetSpinner } from "react-icons/tb"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import useAuth from "../../hooks/useAuth"
import { imageUpload } from "../../utils"

const SignUp = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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
      const userCredential = await createUser(email, password)
      await updateUserProfile(name, imageURL)

      console.log("User UID:", userCredential.user.uid)
      console.log("User Role:", role)

      toast.success("Account created successfully 🎉")
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success("Signup successful 🎉")
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 text-white bg-gradient-to-br from-purple-600 via-pink-500 to-fuchsia-600">
        <h1 className="text-4xl font-bold mb-4">Welcome Page</h1>
        <p className="text-lg opacity-90 max-w-sm">
          Sign up to continue access and manage your loans with LoanLink
        </p>
        <span className="mt-10 text-sm opacity-70">www.loanlink.com</span>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">

            {/* Name */}
            <div>
              <input
                className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
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
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Profile Image */}
            <div>
              <label className="text-sm text-gray-500">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full mt-1 text-sm"
                {...register("image")}
              />
            </div>

            {/* Role */}
            <div>
              <select
                className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                {...register("role", { required: "Role is required" })}
              >
                <option value="">Select Role</option>
                <option value="borrower">Borrower</option>
                <option value="manager">Manager</option>
              </select>
              {errors.role && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                className="w-full border-b-2 border-gray-300 focus:border-pink-500 outline-none py-2 text-gray-700"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                    message:
                      "Must include uppercase & lowercase letter",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-3 text-white font-semibold rounded-md bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin mx-auto" />
              ) : (
                "CONTINUE"
              )}
            </button>
          </form>

          {/* Social */}
          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-3 border rounded-md hover:bg-gray-50"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-600 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
