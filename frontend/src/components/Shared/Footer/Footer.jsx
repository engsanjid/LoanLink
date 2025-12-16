import { Link } from 'react-router'
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa6'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 text-white mt-20">

      <div className="max-w-[1200px] mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Logo + Description */}
        <div>
          <Link
            to="/"
            className="text-3xl font-bold tracking-wide text-yellow-300 hover:text-yellow-200 transition"
          >
            LoanLink
          </Link>

          <p className="mt-4 text-white/90 leading-relaxed">
            LoanLink is a modern microloan request & approval system designed to
            simplify loan processing for borrowers, managers, and admins with a
            seamless workflow.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-yellow-300">
            Useful Links
          </h3>
          <ul className="space-y-3 text-white/90">
            <li><Link to="/" className="hover:text-yellow-300 transition">Home</Link></li>
            <li><Link to="/all-loans" className="hover:text-yellow-300 transition">All Loans</Link></li>
            <li><Link to="/about" className="hover:text-yellow-300 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link></li>
            <li><Link to="/dashboard" className="hover:text-yellow-300 transition">Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-yellow-300">
            Contact
          </h3>

          <p className="text-white/90">
            Email:{' '}
            <a
              href="mailto:mdsanjidi36@gmail.com"
              className="hover:text-yellow-300 transition"
            >
              mdsanjidi36@gmail.com
            </a>
          </p>

          <p className="text-white/90 mt-1">
            Phone:{' '}
            <a
              href="tel:+8801745532902"
              className="hover:text-yellow-300 transition"
            >
              +880 17455 32902
            </a>
          </p>

          <p className="text-white/90 mt-1">
            Location:{' '}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Badda,Dhaka,Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition"
            >
              Badda, Dhaka, Bangladesh
            </a>
          </p>

          {/* Social Icons */}
          <div className="flex gap-5 mt-5 text-xl">
            <a
  href="https://github.com/engsanjid"
  target="_blank"
  rel="noopener noreferrer"
  className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-yellow-300 transition"
>
  <FaGithub />
</a>


            <a
              href="https://www.facebook.com/sanjid.sanjid.311"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-yellow-300 transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.linkedin.com/in/md-sanjid-islam146"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-yellow-300 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>

    
      <div className="border-t border-white/20 text-center py-5 text-sm text-white/80">
        © 2025–2026 <span className="text-yellow-300 font-semibold">LoanLink</span>. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
