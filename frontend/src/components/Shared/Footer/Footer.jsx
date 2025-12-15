const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo + Description */}
        <div>
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">LoanLink</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            LoanLink is a modern microloan request & approval system designed to simplify 
            loan processing for borrowers, managers, and admins with a seamless workflow.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">Useful Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-blue-500 transition">Home</a></li>
            <li><a href="/all-loans" className="hover:text-blue-500 transition">All Loans</a></li>
            <li><a href="/about" className="hover:text-blue-500 transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-blue-500 transition">Contact</a></li>
            <li><a href="/dashboard" className="hover:text-blue-500 transition">Dashboard</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">Contact</h3>
          <p>Email: mdsanjidi36@gmail.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Location: Badda, Dhaka, Bangladesh</p>

          <div className="flex gap-4 mt-4 text-2xl">
            {/* Use X instead of Twitter bird */}
            <a href="#" className="hover:text-blue-500 transition">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://www.facebook.com/sanjid.sanjid.311" className="hover:text-blue-500 transition">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="https://www.linkedin.com/in/md-sanjid-islam146" className="hover:text-blue-500 transition">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="py-5 border-t border-gray-300 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025–2026 LoanLink Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
