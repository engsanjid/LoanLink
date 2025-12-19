import { Link } from 'react-router'

const LoanCard = ({ loan }) => {
  const {
    _id,
    title,
    image,
    category,
    interestRate,
    maxAmount,
    description,
  } = loan

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover"
      />

      {/* Content */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-gray-800">
          {title}
        </h3>

        <p className="text-sm text-gray-500">
          {description?.slice(0, 80)}...
        </p>

        <div className="text-sm text-gray-600">
          <p>
            <span className="font-medium">Category:</span> {category}
          </p>
          <p>
            <span className="font-medium">Interest:</span>{' '}
            {interestRate}%
          </p>
          <p className="text-pink-600 font-semibold">
            Max Loan: ৳ {maxAmount}
          </p>
        </div>

        {/* Button */}
        <Link to={`/loan/${_id}`}>
          <button className="mt-4 w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition">
            View Details
          </button>
        </Link>
      </div>
    </div>
  )
}

export default LoanCard
