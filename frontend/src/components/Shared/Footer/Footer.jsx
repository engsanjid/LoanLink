import { Link } from 'react-router'
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa6'
import { FaGithub } from 'react-icons/fa'
import { useTheme } from '../../../context/ThemeContext' 

const Footer = () => {
  const { theme } = useTheme(); 

  return (
    <footer className={`mt-20 transition-all duration-500 ${
      theme === 'light' 
      ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-600 text-white' 
      : 'bg-gray-950 text-gray-300 border-t border-gray-800'
    }`}>

      <div className="max-w-[1200px] mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Logo + Description */}
        <div>
          <Link
            to="/"
            className="text-3xl font-bold tracking-wide text-yellow-300 hover:text-yellow-200 transition"
          >
            LoanLink
          </Link>

          <p className={`mt-4 leading-relaxed ${theme === 'light' ? 'text-white/90' : 'text-gray-400'}`}>
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
          <ul className={`space-y-3 ${theme === 'light' ? 'text-white/90' : 'text-gray-400'}`}>
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

          <div className={`space-y-2 ${theme === 'light' ? 'text-white/90' : 'text-gray-400'}`}>
            <p>
              Email:{' '}
              <a href="mailto:mdsanjidi36@gmail.com" className="hover:text-yellow-300 transition">
                mdsanjidi36@gmail.com
              </a>
            </p>
            <p>
              Phone:{' '}
              <a href="tel:+8801745532902" className="hover:text-yellow-300 transition">
                +880 17455 32902
              </a>
            </p>
            <p>
              Location:{' '}
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
                Badda, Dhaka, Bangladesh
              </a>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-5 mt-5 text-xl">
            {[
              { icon: <FaGithub />, link: "https://github.com/engsanjid" },
              { icon: <FaFacebookF />, link: "https://www.facebook.com/sanjid.sanjid.311" },
              { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/in/md-sanjid-islam146" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all ${
                  theme === 'light' 
                  ? 'bg-white/10 hover:bg-white/20 hover:text-yellow-300' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-yellow-300 border border-gray-700'
                }`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className={`border-t text-center py-5 text-sm transition-colors duration-500 ${
        theme === 'light' ? 'border-white/20 text-white/80' : 'border-gray-800 text-gray-500'
      }`}>
        © 2025–2026 <span className="text-yellow-300 font-semibold">LoanLink</span>. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer