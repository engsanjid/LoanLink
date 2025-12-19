import { Link } from 'react-router'

const LoanCard = ({ loan }) => {
  const { _id, title, image, description, maxAmount } = loan

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">

      {/* Image */}
      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover"
      />

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-semibold">{title}</h3>

        <p className="text-gray-600 text-sm line-clamp-2">
          {description}
        </p>

        <p className="font-semibold text-pink-600">
          Max Loan: ৳ {maxAmount}
        </p>

        <Link
          to={`/loan/${_id}`}
          className="inline-block w-full text-center py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:opacity-90"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default LoanCard
